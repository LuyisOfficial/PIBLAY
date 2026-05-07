// MENU MOBILE
const menuToggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");

menuToggle.addEventListener("click", () => {
  navbar.classList.toggle("active");
});


// FAQ ACCORDION
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {

  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {

    item.classList.toggle("active");

  });

});


// FORM SUBMIT
const form = document.getElementById("contactForm");

form.addEventListener("submit", (e) => {

  e.preventDefault();

  alert("Votre demande a été envoyée avec succès.");

  form.reset();

});


// ANIMATION SCROLL
const animatedCards = document.querySelectorAll(
  ".contact-box, .support-card, .faq-item, .location-card"
);

const observer = new IntersectionObserver((entries) => {

  entries.forEach((entry) => {

    if(entry.isIntersecting){

      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0px)";

    }

  });

}, {
  threshold:0.2
});

animatedCards.forEach((card) => {

  card.style.opacity = "0";
  card.style.transform = "translateY(40px)";
  card.style.transition = "0.6s";

  observer.observe(card);

});
