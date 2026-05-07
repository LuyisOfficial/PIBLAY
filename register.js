// MULTI STEP FORM
const steps = document.querySelectorAll(".form-step");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitBtn = document.getElementById("submitBtn");

let currentStep = 0;

function showStep(index){

  steps.forEach((step)=>{
    step.classList.remove("active");
  });

  steps[index].classList.add("active");

  prevBtn.style.display = index === 0 ? "none" : "block";

  if(index === steps.length - 1){
    nextBtn.style.display = "none";
    submitBtn.style.display = "block";
  }else{
    nextBtn.style.display = "block";
    submitBtn.style.display = "none";
  }

}

showStep(currentStep);

nextBtn.addEventListener("click", ()=>{

  if(currentStep < steps.length - 1){
    currentStep++;
    showStep(currentStep);
  }

});

prevBtn.addEventListener("click", ()=>{

  if(currentStep > 0){
    currentStep--;
    showStep(currentStep);
  }

});


// PASSWORD STRENGTH
const password = document.getElementById("password");
const strengthBar = document.getElementById("strengthBar");

password.addEventListener("input", ()=>{

  let value = password.value;
  let strength = 0;

  if(value.length >= 8) strength += 25;
  if(value.match(/[A-Z]/)) strength += 25;
  if(value.match(/[0-9]/)) strength += 25;
  if(value.match(/[^A-Za-z0-9]/)) strength += 25;

  strengthBar.style.width = strength + "%";

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


// SHOW / HIDE PASSWORD
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", ()=>{

  if(password.type === "password"){
    password.type = "text";
  }else{
    password.type = "password";
  }

});


// URL VALIDATION
const websiteInput = document.getElementById("website");
const urlMessage = document.getElementById("urlMessage");

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


// FORM SUBMIT
const form = document.getElementById("registerForm");

form.addEventListener("submit",(e)=>{

  e.preventDefault();

  alert("Compte business créé avec succès.");

  form.reset();

  currentStep = 0;
  showStep(currentStep);

});
