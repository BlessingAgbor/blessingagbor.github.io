// main.js - Enhancing slider, search suggestions, and responsive nav

document.addEventListener('DOMContentLoaded', function () {
  const burger = document.getElementById('burgerMenu');
  const sidebar = document.querySelector('.sidebar');
  const searchInput = document.getElementById('searchInput');
  const slides = document.querySelectorAll('.slide');
  const slider = document.getElementById('reportSlider');

  // Toggle sidebar visibility (Burger Menu)
  burger.addEventListener('click', () => {
    sidebar.classList.toggle('visible');
  });

  // Search filter with suggestion
  searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    slides.forEach(slide => {
      const text = slide.textContent.toLowerCase();
      if (text.includes(query)) {
        slide.style.display = 'block';
      } else {
        slide.style.display = 'none';
      }
    });
  });

  // Slider navigation buttons (optional)
  let currentIndex = 0;

  function showSlide(index) {
    slider.scrollTo({
      left: slider.offsetWidth * index,
      behavior: 'smooth'
    });
  }

  // Optional: Auto-scroll or button controls can be added later
});
