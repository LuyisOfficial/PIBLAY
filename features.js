const menuToggle = document.getElementById("menuToggle");
const navbar = document.querySelector(".navbar");

menuToggle.addEventListener("click", () => {
  navbar.classList.toggle("active");
});


// Animation Scroll
const cards = document.querySelectorAll(
  ".feature-card, .publisher-box, .analytics-card, .security-card"
);

const observer = new IntersectionObserver((entries) => {

  entries.forEach((entry) => {

    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }

  });

}, {
  threshold:0.2
});

cards.forEach((card) => {
  card.classList.add("hidden");
  observer.observe(card);
});
