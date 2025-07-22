// main.js — Swiper Slider + Search + Burger Menu

document.addEventListener('DOMContentLoaded', function () {
  // 1. Initialize Swiper
  const swiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 40,
    loop: false,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    grabCursor: true,
  });

  // 2. Burger Menu Toggle
  const burger = document.getElementById('burgerMenu');
  const sidebar = document.querySelector('.sidebar');

  burger.addEventListener('click', () => {
    sidebar.classList.toggle('visible');
  });

  // 3. Live Search Filter
  const searchInput = document.getElementById('searchInput');
  const slides = document.querySelectorAll('.swiper-slide');

  searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase();

    slides.forEach(slide => {
      const title = slide.querySelector('h3').textContent.toLowerCase();
      const tags = slide.querySelector('.tags')?.textContent.toLowerCase() || '';

      if (title.includes(query) || tags.includes(query)) {
        slide.style.display = 'block';
      } else {
        slide.style.display = 'none';
      }
    });
  });
});
