// main.js — Enhanced API Security Journal with Advanced Features
// Wait until the DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {
  
  // ===============================
  // 1. SWIPER INITIALIZATION
  // ===============================
  const swiper = new Swiper(".swiper-container", {
    slidesPerView: 1,
    spaceBetween: 32,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    grabCursor: true,
    effect: "slide",
    speed: 600,
    breakpoints: {
      768: {
        slidesPerView: 1,
        spaceBetween: 40,
      },
      1024: {
        slidesPerView: 1,
        spaceBetween: 50,
      },
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    mousewheel: {
      invert: false,
    },
  });

  // ===============================
  // 2. NAVIGATION DROPDOWN
  // ===============================
  const navToggle = document.getElementById("navToggle");
  const navDropdown = document.getElementById("navDropdown");
  let navTimeout;

  if (navToggle && navDropdown) {
    // Click toggle
    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      navDropdown.classList.toggle("visible");
    });

    // Hover functionality for desktop
    navToggle.addEventListener("mouseenter", () => {
      clearTimeout(navTimeout);
      navDropdown.classList.add("visible");
    });

    // Keep dropdown open when hovering over it
    navDropdown.addEventListener("mouseenter", () => {
      clearTimeout(navTimeout);
      navDropdown.classList.add("visible");
    });

    // Close dropdown when mouse leaves both elements
    navToggle.addEventListener("mouseleave", () => {
      navTimeout = setTimeout(() => {
        navDropdown.classList.remove("visible");
      }, 300);
    });

    navDropdown.addEventListener("mouseleave", () => {
      navTimeout = setTimeout(() => {
        navDropdown.classList.remove("visible");
      }, 300);
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!navToggle.contains(e.target) && !navDropdown.contains(e.target)) {
        navDropdown.classList.remove("visible");
      }
    });

    // Smooth scroll to sections when nav links are clicked
    navDropdown.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.getAttribute("href").substring(1);
        const element = document.getElementById(target);
        
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
        
        navDropdown.classList.remove("visible");
      });
    });
  }

  // ===============================
  // 3. ENHANCED SEARCH FUNCTIONALITY
  // ===============================
  const searchInput = document.getElementById("searchInput");
  const searchSuggestions = document.getElementById("searchSuggestions");
  const slides = document.querySelectorAll(".swiper-slide");
  let searchTimeout;

  // Create searchable data structure
  const searchData = Array.from(slides).map((slide, index) => {
    const title = slide.querySelector("h3")?.textContent || "";
    const content = slide.querySelector(".post-content")?.textContent || "";
    const tags = Array.from(slide.querySelectorAll(".tag")).map(tag => tag.textContent);
    const date = slide.dataset.date || "";
    
    return {
      index,
      title,
      content,
      tags,
      date,
      slide,
      searchableText: `${title} ${content} ${tags.join(" ")} ${date}`.toLowerCase()
    };
  });

  if (searchInput && searchSuggestions) {
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      
      searchTimeout = setTimeout(() => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length === 0) {
          searchSuggestions.classList.remove("visible");
          searchSuggestions.innerHTML = "";
          // Show all slides
          searchData.forEach(item => {
            item.slide.style.display = "block";
          });
          swiper.updateSlides();
          return;
        }

        if (query.length < 2) return;

        // Search through data
        const matches = searchData.filter(item => 
          item.searchableText.includes(query)
        );

        // Update suggestions
        updateSearchSuggestions(matches, query);
        
        // Filter slides
        filterSlides(matches);
        
      }, 300);
    });

    // Handle clicks outside search
    document.addEventListener("click", (e) => {
      if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
        searchSuggestions.classList.remove("visible");
      }
    });

    // Handle search input focus
    searchInput.addEventListener("focus", () => {
      if (searchSuggestions.innerHTML.trim() !== "") {
        searchSuggestions.classList.add("visible");
      }
    });
  }

  function updateSearchSuggestions(matches, query) {
    searchSuggestions.innerHTML = "";
    
    if (matches.length === 0) {
      const noResults = document.createElement("div");
      noResults.className = "no-results";
      noResults.textContent = "No results found";
      searchSuggestions.appendChild(noResults);
    } else {
      matches.slice(0, 5).forEach(match => {
        const suggestionItem = document.createElement("div");
        suggestionItem.className = "suggestion-item";
        
        // Highlight matching text
        const highlightedTitle = highlightText(match.title, query);
        suggestionItem.innerHTML = `<strong>${highlightedTitle}</strong><br><small>${match.date}</small>`;
        
        suggestionItem.addEventListener("click", () => {
          swiper.slideTo(match.index);
          searchInput.value = match.title;
          searchSuggestions.classList.remove("visible");
        });
        
        searchSuggestions.appendChild(suggestionItem);
      });
    }
    
    searchSuggestions.classList.add("visible");
  }

  function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  }

  function filterSlides(matches) {
    searchData.forEach(item => {
      if (matches.includes(item)) {
        item.slide.style.display = "block";
      } else {
        item.slide.style.display = "none";
      }
    });
    
    swiper.updateSlides();
    if (matches.length > 0) {
      swiper.slideTo(matches[0].index);
    }
  }

  // ===============================
  // 4. FILTER FUNCTIONALITY
  // ===============================
  const filterButtons = document.querySelectorAll(".filter-btn");
  const allSlides = document.querySelectorAll(".swiper-slide");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      
      const filterValue = button.dataset.filter;
      
      // Show loading
      showLoading();
      
      setTimeout(() => {
        // Filter slides
        if (filterValue === "all") {
          allSlides.forEach(slide => slide.style.display = "block");
        } else {
          allSlides.forEach(slide => {
            const slideTags = slide.dataset.tags || "";
            if (slideTags.includes(filterValue)) {
              slide.style.display = "block";
            } else {
              slide.style.display = "none";
            }
          });
        }
        
        // Update swiper
        swiper.updateSlides();
        swiper.slideTo(0);
        
        // Hide loading
        hideLoading();
      }, 500);
    });
  });

  // ===============================
  // 5. LOADING FUNCTIONS
  // ===============================
  function showLoading() {
    const loading = document.getElementById("loading");
    const slider = document.getElementById("reportSlider");
    
    if (loading && slider) {
      loading.style.display = "block";
      slider.style.opacity = "0.3";
    }
  }

  function hideLoading() {
    const loading = document.getElementById("loading");
    const slider = document.getElementById("reportSlider");
    
    if (loading && slider) {
      loading.style.display = "none";
      slider.style.opacity = "1";
    }
  }

  // ===============================
  // 6. KEYBOARD SHORTCUTS
  // ===============================
  document.addEventListener("keydown", (e) => {
    // Ctrl + K or Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      searchInput.focus();
    }
    
    // Escape to clear search and close dropdowns
    if (e.key === "Escape") {
      if (searchInput.value) {
        searchInput.value = "";
        searchInput.dispatchEvent(new Event("input"));
      }
      searchSuggestions.classList.remove("visible");
      navDropdown.classList.remove("visible");
    }
    
    // Arrow keys for navigation when search suggestions are visible
    if (searchSuggestions.classList.contains("visible")) {
      const suggestionItems = searchSuggestions.querySelectorAll(".suggestion-item");
      let currentIndex = Array.from(suggestionItems).findIndex(item => 
        item.classList.contains("highlighted")
      );
      
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (suggestionItems.length > 0) {
          if (currentIndex < suggestionItems.length - 1) {
            if (currentIndex >= 0) suggestionItems[currentIndex].classList.remove("highlighted");
            currentIndex++;
            suggestionItems[currentIndex].classList.add("highlighted");
          }
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (suggestionItems.length > 0) {
          if (currentIndex > 0) {
            suggestionItems[currentIndex].classList.remove("highlighted");
            currentIndex--;
            suggestionItems[currentIndex].classList.add("highlighted");
          } else if (currentIndex === 0) {
            suggestionItems[currentIndex].classList.remove("highlighted");
            currentIndex = -1;
          }
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (currentIndex >= 0 && suggestionItems[currentIndex]) {
          suggestionItems[currentIndex].click();
        }
      }
    }
  });

  // ===============================
  // 7. SMOOTH ANIMATIONS & INTERACTIONS
  // ===============================
  
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document.querySelectorAll(".swiper-slide, .intro, .search-wrapper").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
    observer.observe(el);
  });

  // ===============================
  // 8. TAG FUNCTIONALITY
  // ===============================
  
  // Make tags clickable for filtering
  document.querySelectorAll(".tag").forEach(tag => {
    tag.style.cursor = "pointer";
    tag.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const tagText = tag.textContent.toLowerCase();
      
      // Find and activate corresponding filter button
      const matchingFilter = Array.from(filterButtons).find(btn => 
        btn.dataset.filter === tagText || 
        btn.dataset.filter === tagText.replace(/\s+/g, "")
      );
      
      if (matchingFilter) {
        matchingFilter.click();
      } else {
        // If no matching filter, search for the tag
        searchInput.value = tagText;
        searchInput.dispatchEvent(new Event("input"));
        searchInput.focus();
      }
    });
    
    // Add hover effects
    tag.addEventListener("mouseenter", () => {
      tag.style.transform = "translateY(-2px) scale(1.05)";
    });
    
    tag.addEventListener("mouseleave", () => {
      tag.style.transform = "translateY(0) scale(1)";
    });
  });

  // ===============================
  // 9. PROGRESSIVE ENHANCEMENT
  // ===============================
  
  // Add touch gestures for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  document.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
  });

  function handleGesture() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - next slide
        swiper.slideNext();
      } else {
        // Swiped right - previous slide
        swiper.slidePrev();
      }
    }
  }

  // ===============================
  // 10. ACCESSIBILITY ENHANCEMENTS
  // ===============================
  
  // Add ARIA labels and keyboard navigation
  searchInput.setAttribute("aria-label", "Search blog posts");
  searchInput.setAttribute("aria-describedby", "search-help");
  
  // Create hidden help text
  const searchHelp = document.createElement("div");
  searchHelp.id = "search-help";
  searchHelp.className = "sr-only";
  searchHelp.textContent = "Use Ctrl+K to focus search, arrow keys to navigate suggestions, Enter to select";
  document.body.appendChild(searchHelp);

  // Add focus indicators
  document.querySelectorAll("button, input, a, .suggestion-item").forEach(el => {
    el.addEventListener("focus", () => {
      el.style.outline = "2px solid var(--primary)";
      el.style.outlineOffset = "2px";
    });
    
    el.addEventListener("blur", () => {
      el.style.outline = "none";
    });
  });

  // ===============================
  // 11. PERFORMANCE OPTIMIZATIONS
  // ===============================
  
  // Debounced resize handler
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      swiper.updateSize();
      swiper.updateSlides();
    }, 250);
  });

  // Preload next slide images
  swiper.on("slideChange", () => {
    const activeIndex = swiper.activeIndex;
    const nextSlide = document.querySelector(`[data-swiper-slide-index="${activeIndex + 1}"]`);
    
    if (nextSlide) {
      const images = nextSlide.querySelectorAll("img[data-src]");
      images.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        }
      });
    }
  });

  // ===============================
  // 12. ANALYTICS & TRACKING (OPTIONAL)
  // ===============================
  
  // Track user interactions (replace with your analytics service)
  function trackEvent(category, action, label) {
    // Example: Google Analytics 4
    // gtag('event', action, {
    //   event_category: category,
    //   event_label: label
    // });
    
    // Example: Custom analytics
    console.log(`Analytics: ${category} - ${action} - ${label}`);
  }

  // Track search usage
  searchInput.addEventListener("input", (e) => {
    if (e.target.value.length >= 3) {
      trackEvent("Search", "Query", e.target.value);
    }
  });

  // Track filter usage
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      trackEvent("Filter", "Click", button.dataset.filter);
    });
  });

  // Track slide views
  swiper.on("slideChange", () => {
    const activeSlide = swiper.slides[swiper.activeIndex];
    const title = activeSlide.querySelector("h3")?.textContent || "Unknown";
    trackEvent("Slide", "View", title);
  });

  // ===============================
  // 13. INITIALIZATION COMPLETE
  // ===============================
  
  console.log("🚀 API Security Journal initialized successfully!");
  
  // Remove loading class if present
  document.body.classList.remove("loading");
  
  // Trigger initial animations
  setTimeout(() => {
    document.querySelector(".intro").style.opacity = "1";
    document.querySelector(".intro").style.transform = "translateY(0)";
  }, 100);
  
  // Auto-focus search on desktop (not mobile to avoid keyboard popup)
  if (window.innerWidth > 768) {
    setTimeout(() => {
      searchInput.focus();
    }, 1000);
  }
});
