// main.js — Clean, focused landing page functionality
window.addEventListener("DOMContentLoaded", () => {
  
  // ===============================
  // 1. NAVIGATION
  // ===============================
  const navToggle = document.getElementById("navToggle");
  const navDropdown = document.getElementById("navDropdown");

  if (navToggle && navDropdown) {
    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      navDropdown.classList.toggle("visible");
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!navToggle.contains(e.target) && !navDropdown.contains(e.target)) {
        navDropdown.classList.remove("visible");
      }
    });

    // Smooth scroll for anchor links
    navDropdown.querySelectorAll("a[href^='#']").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
          navDropdown.classList.remove("visible");
        }
      });
    });
  }

  // ===============================
  // 2. SEARCH FUNCTIONALITY
  // ===============================
  const searchInput = document.getElementById("searchInput");
  const postCards = document.querySelectorAll(".post-card");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      postCards.forEach(card => {
        if (!card.classList.contains("hidden")) {
          const title = card.querySelector(".post-title").textContent.toLowerCase();
          const excerpt = card.querySelector(".post-excerpt").textContent.toLowerCase();
          const tags = card.dataset.tags || "";
          
          const isMatch = title.includes(query) || 
                         excerpt.includes(query) || 
                         tags.includes(query);
          
          card.style.display = isMatch ? "block" : "none";
        }
      });

      // Show "no results" message if needed
      const visibleCards = Array.from(postCards).filter(card => 
        !card.classList.contains("hidden") && card.style.display !== "none"
      );
      
      if (visibleCards.length === 0 && query.length > 0) {
        showNoResults();
      } else {
        hideNoResults();
      }
    });
  }

  // ===============================
  // 3. LOAD MORE FUNCTIONALITY
  // ===============================
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const hiddenPosts = document.querySelectorAll(".post-card.hidden");

  if (loadMoreBtn && hiddenPosts.length > 0) {
    loadMoreBtn.addEventListener("click", () => {
      // Show next batch of posts (e.g., 2 at a time)
      const postsToShow = 2;
      let shown = 0;
      
      hiddenPosts.forEach(post => {
        if (post.classList.contains("hidden") && shown < postsToShow) {
          post.classList.remove("hidden");
          post.style.animation = "fadeInUp 0.5s ease forwards";
          shown++;
        }
      });
      
      // Hide button if no more posts
      const remainingHidden = document.querySelectorAll(".post-card.hidden");
      if (remainingHidden.length === 0) {
        loadMoreBtn.style.display = "none";
      }
    });
  }

  // ===============================
  // 4. CARD INTERACTIONS
  // ===============================
  postCards.forEach(card => {
    // Click anywhere on card to navigate
    card.addEventListener("click", (e) => {
      if (!e.target.closest(".tag")) {
        const link = card.querySelector(".read-more");
        if (link && link.href !== "#") {
          window.location.href = link.href;
        }
      }
    });

    // Tag filtering
    const tags = card.querySelectorAll(".tag");
    tags.forEach(tag => {
      tag.style.cursor = "pointer";
      tag.addEventListener("click", (e) => {
        e.stopPropagation();
        const tagText = tag.textContent.toLowerCase();
        searchInput.value = tagText;
        searchInput.dispatchEvent(new Event("input"));
      });
    });
  });

  // ===============================
  // 5. SMOOTH SCROLLING FOR CTA
  // ===============================
  const ctaButton = document.querySelector(".cta-button");
  if (ctaButton) {
    ctaButton.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(ctaButton.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ 
          behavior: "smooth",
          block: "start"
        });
      }
    });
  }

  // ===============================
  // 6. UTILITY FUNCTIONS
  // ===============================
  function showNoResults() {
    let noResultsMsg = document.querySelector(".no-results-message");
    if (!noResultsMsg) {
      noResultsMsg = document.createElement("div");
      noResultsMsg.className = "no-results-message";
      noResultsMsg.style.textAlign = "center";
      noResultsMsg.style.padding = "2rem";
      noResultsMsg.style.color = "var(--text-light)";
      noResultsMsg.textContent = "No posts found. Try a different search term.";
      document.getElementById("postsGrid").appendChild(noResultsMsg);
    }
    noResultsMsg.style.display = "block";
  }

  function hideNoResults() {
    const noResultsMsg = document.querySelector(".no-results-message");
    if (noResultsMsg) {
      noResultsMsg.style.display = "none";
    }
  }

  // ===============================
  // 7. KEYBOARD SHORTCUTS
  // ===============================
  document.addEventListener("keydown", (e) => {
    // Cmd/Ctrl + K for search focus
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      searchInput.focus();
    }
    
    // Escape to clear search
    if (e.key === "Escape" && document.activeElement === searchInput) {
      searchInput.value = "";
      searchInput.dispatchEvent(new Event("input"));
      searchInput.blur();
    }
  });

  // ===============================
  // 8. CSS ANIMATIONS
  // ===============================
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .post-card {
      animation: fadeInUp 0.5s ease forwards;
    }
    
    .post-card:nth-child(1) { animation-delay: 0.1s; }
    .post-card:nth-child(2) { animation-delay: 0.2s; }
    .post-card:nth-child(3) { animation-delay: 0.3s; }
  `;
  document.head.appendChild(style);

  console.log("🚀 API Security Journal loaded successfully!");
});
