// main.js — Swiper Slider + Search + Burger Menu (Polished by a Senior Engineer)

// Wait until the DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {
  // 1. Swiper Initialization
  const swiper = new Swiper(".swiper-container", {
    slidesPerView: 1,
    spaceBetween: 32,
    loop: false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    grabCursor: true,
  });

  // 2. Burger Menu Toggle
  const burger = document.getElementById("burgerMenu");
  const sidebar = document.querySelector(".sidebar");

  if (burger && sidebar) {
    burger.addEventListener("click", () => {
      sidebar.classList.toggle("visible");
    });

    burger.addEventListener("mouseover", () => {
      sidebar.classList.add("visible");
    });

    sidebar.addEventListener("mouseleave", () => {
      sidebar.classList.remove("visible");
    });
  }

  // 3. Search with Suggestions
  const searchInput = document.getElementById("searchInput");
  const suggestionBox = document.getElementById("searchSuggestions");
  const slides = document.querySelectorAll(".swiper-slide");

  if (searchInput && suggestionBox && slides.length) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      suggestionBox.innerHTML = "";

      let matchCount = 0;

      slides.forEach((slide, index) => {
        const title = slide.querySelector("h3").textContent.toLowerCase();
        const tags = slide.querySelector(".tags")?.textContent.toLowerCase() || "";

        const matches = title.includes(query) || tags.includes(query);
        slide.style.display = matches ? "block" : "none";

        if (matches) {
          matchCount++;
          const li = document.createElement("li");
          li.textContent = slide.querySelector("h3").textContent;
          li.className = "suggestion-item";
          li.onclick = () => {
            swiper.slideTo(index);
            searchInput.value = li.textContent;
            suggestionBox.innerHTML = "";
          };
          suggestionBox.appendChild(li);
        }
      });

      if (!matchCount) {
        const li = document.createElement("li");
        li.textContent = "No results found";
        li.className = "no-suggestion";
        suggestionBox.appendChild(li);
      }
    });
  }
});
