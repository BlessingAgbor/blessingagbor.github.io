// main.js for Blessing Agbor's API Security Journal
// Handles: Search Filtering, Dynamic Sliders, and Optional Carousel Controls

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const slides = document.querySelectorAll(".slide");
  const slider = document.getElementById("reportSlider");

  // 1. Live Search Filtering
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();
    slides.forEach((slide) => {
      const content = slide.textContent.toLowerCase();
      slide.style.display = content.includes(keyword) ? "block" : "none";
    });
  });

  // 2. Optional Horizontal Slide Navigation
  let currentSlide = 0;
  const totalSlides = slides.length;

  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    slider.scrollTo({
      left: slides[index].offsetLeft,
      behavior: "smooth",
    });
    currentSlide = index;
  }

  // Optional: Keyboard navigation for accessibility
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") goToSlide(currentSlide + 1);
    if (e.key === "ArrowLeft") goToSlide(currentSlide - 1);
  });

  // Optional: Navigation from sidebar anchors
  document.querySelectorAll("nav a[href^='#']").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});

