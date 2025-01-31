const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passworddisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector('[data-CopyMsg]');
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numberscaseCheck=document.querySelector("#numbers");
const symbolscaseCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generatePassword");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols="!@#$%^&*()_+";


let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
//set Strength circle color to grey
setIndicator("#ccc")


//set passwordlength

function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;

    const min=inputSlider.min;
    const max=inputSlider.max;

    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min)) + "% 100%"


}


function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow
    indicator.style.boxShadow=`1px 0px 18px 1px ${color}`;


}


function getRandInteger(min,max){
   return Math.floor(Math.random()*(max-min))+min;
}


function generateRandomNumber(){

    return getRandInteger(0,9);

}

function generateLowerCase(){
    return String.fromCharCode(getRandInteger(97,123));

}

function generateUpperCase(){
    return String.fromCharCode(getRandInteger(65,91));
}

function generateSymbol(){
    const randNum=getRandInteger(0,symbols.length);
    return symbols.charAt(randNum);
    
}


function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;


    if(uppercaseCheck.checked)  hasUpper=true;
    if(lowercaseCheck.checked)  hasLower=true;
    if(numberscaseCheck.checked) hasNum=true;
    if(symbolscaseCheck.checked) hasSym=true;


    if(hasUpper&&hasLower&&(hasNum||hasSym)&&passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasLower||hasUpper)&&(hasNum||hasSym)&&passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator('#f00');
    }
    
}

 async function copyContent(){

    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){

        copyMsg.innerText="failed";

    }

    //to make copy wala span visible

    copyMsg.classList.add('active');

    setTimeout(()=>{
        copyMsg.classList.remove('active');
    },2000);   

}

function shufflePassword(array){

    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";

    array.forEach((el)=>{
        str+=el;
    });

    return str;

}

function handleCheckBoxChange(){
    checkCount=0;

    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    })

    if(passwordLength.length<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}


allCheckBox.forEach((checkbox)=> {
    checkbox.addEventListener('change',handleCheckBoxChange);
    
});



inputSlider.addEventListener('input',(event)=>{
    passwordLength=event.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }

})


generateBtn.addEventListener('click',()=>{

    if(checkCount<=0) return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    //remove the old password

    password="";

    //need to find which check box is checked

    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generatelowerCase();
    // }
    // if(numberscaseCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolscaseCheck.checked){
    //     password+=generateSymbol();
    // }

    let funArr=[];

    if(uppercaseCheck.checked){
        funArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funArr.push(generateLowerCase);
    }
    if(numberscaseCheck.checked){
        funArr.push(generateRandomNumber);
    }
    if(symbolscaseCheck.checked){
        funArr.push(generateSymbol);
    }

    //mandatory letters/digits in password

    for(let i=0;i<funArr.length;i++){
        password+=funArr[i]();
    }

    //remaining addition

    for(let i=0;i<passwordLength-funArr.length;i++){
        let randIndex=getRandInteger(0,funArr.length);
        password+=funArr[randIndex]();
    }

    //shuffle the password

    let array=password.split("");

    password=shufflePassword(array);

    //show in ui

    passwordDisplay.value=password;

    //calculate the strength
    calcStrength();

    
})