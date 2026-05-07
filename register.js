// ========================================
// PIBLAY REGISTER MULTI STEP FORM
// ========================================

// ELEMENTS
const form = document.getElementById("registerForm");

const steps = document.querySelectorAll(".form-step");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitBtn = document.getElementById("submitBtn");

const password = document.getElementById("password");
const strengthBar = document.getElementById("strengthBar");

const togglePassword = document.getElementById("togglePassword");

const websiteInput = document.getElementById("website");
const urlMessage = document.getElementById("urlMessage");

// CURRENT STEP
let currentStep = 0;

// ========================================
// SHOW STEP
// ========================================

function showStep(index){

  // HIDE ALL
  steps.forEach((step)=>{
    step.classList.remove("active");
  });

  // SHOW CURRENT
  steps[index].classList.add("active");

  // PREV BUTTON
  if(index === 0){
    prevBtn.style.display = "none";
  }else{
    prevBtn.style.display = "block";
  }

  // LAST STEP
  if(index === steps.length - 1){

    nextBtn.style.display = "none";
    submitBtn.style.display = "block";

  }else{

    nextBtn.style.display = "block";
    submitBtn.style.display = "none";

  }

  // SCROLL TOP
  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

}

// INIT
showStep(currentStep);

// ========================================
// NEXT STEP
// ========================================

nextBtn.addEventListener("click", ()=>{

  // VALIDATE CURRENT STEP
  const currentInputs = steps[currentStep].querySelectorAll("input[required], select[required]");

  let isValid = true;

  currentInputs.forEach((input)=>{

    if(input.value.trim() === ""){

      input.style.border = "1px solid #ff4d4d";

      isValid = false;

    }else{

      input.style.border = "1px solid transparent";

    }

  });

  // STOP IF INVALID
  if(!isValid){

    alert("Veuillez remplir tous les champs obligatoires.");

    return;
  }

  // NEXT
  if(currentStep < steps.length - 1){

    currentStep++;

    showStep(currentStep);

  }

});

// ========================================
// PREVIOUS STEP
// ========================================

prevBtn.addEventListener("click", ()=>{

  if(currentStep > 0){

    currentStep--;

    showStep(currentStep);

  }

});

// ========================================
// PASSWORD STRENGTH
// ========================================

password.addEventListener("input", ()=>{

  let value = password.value;

  let strength = 0;

  // LENGTH
  if(value.length >= 8){
    strength += 25;
  }

  // UPPERCASE
  if(/[A-Z]/.test(value)){
    strength += 25;
  }

  // NUMBER
  if(/[0-9]/.test(value)){
    strength += 25;
  }

  // SYMBOL
  if(/[^A-Za-z0-9]/.test(value)){
    strength += 25;
  }

  // WIDTH
  strengthBar.style.width = strength + "%";

  // COLOR
  if(strength <= 25){

    strengthBar.style.background = "#ff4d4d";

  }else if(strength <= 50){

    strengthBar.style.background = "#ffaa00";

  }else if(strength <= 75){

    strengthBar.style.background = "#4da6ff";

  }else{

    strengthBar.style.background = "#32d583";

  }

});

// ========================================
// SHOW / HIDE PASSWORD
// ========================================

togglePassword.addEventListener("click", ()=>{

  if(password.type === "password"){

    password.type = "text";

  }else{

    password.type = "password";

  }

});

// ========================================
// URL VALIDATION
// ========================================

websiteInput.addEventListener("input", ()=>{

  const pattern = /^(https?:\/\/)?([\w\-])+\.{1}[a-zA-Z]{2,}(\/.*)?$/;

  if(pattern.test(websiteInput.value)){

    urlMessage.textContent = "URL valide";
    urlMessage.className = "success";

  }else{

    urlMessage.textContent = "Format URL invalide";
    urlMessage.className = "error";

  }

});

// ========================================
// OTP BUTTON
// ========================================

const otpBtn = document.querySelector(".otp-btn");

otpBtn.addEventListener("click", ()=>{

  otpBtn.innerHTML = "Code envoyé ✓";

  otpBtn.style.background = "#32d583";

  setTimeout(()=>{

    otpBtn.innerHTML = "Envoyer OTP";

    otpBtn.style.background = "";

  },3000);

});

// ========================================
// FORM SUBMIT
// ========================================

form.addEventListener("submit",(e)=>{

  e.preventDefault();

  // BUTTON LOADING
  submitBtn.innerHTML = "Création du compte...";

  submitBtn.disabled = true;

  // SIMULATION
  setTimeout(()=>{

    // SUCCESS MESSAGE
    alert("Compte PIBLAY créé avec succès !");

    // REDIRECT TO DASHBOARD
    window.location.href = "./client-dashboard";

  },2500);

});
