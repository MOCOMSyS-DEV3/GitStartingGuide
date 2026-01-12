document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const currentSlideSpan = document.getElementById("currentSlide");
  const totalSlidesSpan = document.getElementById("totalSlides");

  // TOC Elements
  const tocSidebar = document.getElementById("tocSidebar");
  const tocToggleBtn = document.getElementById("tocToggleBtn");
  const tocCloseBtn = document.getElementById("tocCloseBtn");
  const tocFilterBtn = document.getElementById("tocFilterBtn");
  const tocNav = document.getElementById("tocNav");

  let currentIndex = 0;
  let filterActive = false;
  let filteredIndices = []; // 필터된 슬라이드의 실제 인덱스 배열

  // Slide titles mapping (data-id to display title)
  const slideTitles = {
    "intro": "Git & GitHub 가이드",
    "git-vs-svn": "Git vs SVN 핵심 비교",
    "local-vs-remote": "Git ≠ GitHub",
    "local-workflow": "로컬 브랜치 워크플로",
    "install": "🔑 설치 가이드",
    "config": "🔑 최초 설정 & 초기화",
    "git-3state": "🔑 Git의 3가지 상태",
    "basic-commands": "🔑 기본 흐름: 저장하기",
    "branch": "🔑 브랜치 다루기",
    "branch-lifecycle": "브랜치 작업 이유",
    "merge-strategies": "🔑 머지 전략",
    "merge-visualization": "머지 전략 시각화",
    "conflict-resolution": "🔑 충돌 해결하기",
    "git-log": "git log 활용",
    "undo-changes": "🔑 되돌리기",
    "clone-fork": "🔑 Clone & Fork",
    "fetch-vs-pull": "🔑 fetch vs pull",
    "workflow": "🔑 GitHub Flow",
    "github-web": "GitHub 웹 사용법",
    "github-web-2": "Star/Watch/Fork & PAT",
    "cli": "GitHub CLI (gh)",
    "pr-advanced": "🔑 Pull Request 심화",
    "issue-project": "Issue & Project",
    "best-practice": "언제 무엇을?",
    "actions": "GitHub Actions",
    "actions-advanced": "Actions 심화",
    "release-management": "Release 관리",
    "team-features": "팀 플랜 기능",
    "org-management": "Organization & Teams",
    "branch-protection-detail": "Branch Protection",
    "security-features": "보안 기능",
    "security-checklist": "보안 체크리스트",
    "end": "Ready to Deploy?"
  };

  // Initialize UI
  updateSlideCounter();
  updateButtons();
  generateTOC();
  buildFilteredIndices();

  // Build filtered indices array
  function buildFilteredIndices() {
    filteredIndices = [];
    slides.forEach((slide, index) => {
      const dataId = slide.getAttribute("data-id");
      const title = slideTitles[dataId] || "";
      if (title.includes("🔑")) {
        filteredIndices.push(index);
      }
    });
  }

  // Generate TOC items
  function generateTOC() {
    tocNav.innerHTML = "";
    slides.forEach((slide, index) => {
      const dataId = slide.getAttribute("data-id");
      const title = slideTitles[dataId] || dataId;
      const isEssential = title.includes("🔑");

      const tocItem = document.createElement("div");
      tocItem.className = "toc-item" + (isEssential ? " essential" : "");
      tocItem.dataset.index = index;
      tocItem.innerHTML = `<span class="toc-number">${index + 1}.</span>${title}`;
      tocItem.addEventListener("click", () => {
        showSlide(index);
        // Auto-close sidebar on mobile
        if (window.innerWidth < 768) {
          closeTOC();
        }
      });

      tocNav.appendChild(tocItem);
    });
    updateTOCHighlight();
  }

  // Update slide counter display
  function updateSlideCounter() {
    if (filterActive) {
      const filteredPosition = filteredIndices.indexOf(currentIndex);
      if (filteredPosition !== -1) {
        currentSlideSpan.textContent = filteredPosition + 1;
        totalSlidesSpan.textContent = filteredIndices.length;
      } else {
        // 현재 슬라이드가 필터에 없으면 가장 가까운 필터 슬라이드로 이동
        const nearestFiltered = findNearestFilteredIndex(currentIndex);
        if (nearestFiltered !== -1) {
          showSlide(nearestFiltered);
        }
      }
    } else {
      currentSlideSpan.textContent = currentIndex + 1;
      totalSlidesSpan.textContent = slides.length;
    }
  }

  // Find nearest filtered index
  function findNearestFilteredIndex(index) {
    if (filteredIndices.length === 0) return -1;

    let nearest = filteredIndices[0];
    let minDiff = Math.abs(index - nearest);

    for (const fi of filteredIndices) {
      const diff = Math.abs(index - fi);
      if (diff < minDiff) {
        minDiff = diff;
        nearest = fi;
      }
    }
    return nearest;
  }

  // Update TOC highlight to match current slide
  function updateTOCHighlight() {
    const tocItems = tocNav.querySelectorAll(".toc-item");
    tocItems.forEach((item) => {
      const itemIndex = parseInt(item.dataset.index);
      item.classList.toggle("active", itemIndex === currentIndex);
    });

    // Scroll active item into view
    const activeItem = tocNav.querySelector(".toc-item.active");
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  // Filter toggle
  function toggleFilter() {
    filterActive = !filterActive;
    tocFilterBtn.classList.toggle("active", filterActive);
    tocNav.classList.toggle("filter-active", filterActive);

    if (filterActive) {
      // 필터 활성화 시, 현재 슬라이드가 필터에 없으면 가장 가까운 필터 슬라이드로 이동
      if (!filteredIndices.includes(currentIndex)) {
        const nearest = findNearestFilteredIndex(currentIndex);
        if (nearest !== -1) {
          showSlide(nearest);
          return; // showSlide에서 updateSlideCounter 호출됨
        }
      }
    }

    updateSlideCounter();
    updateButtons();
  }

  // TOC Toggle Functions
  function openTOC() {
    tocSidebar.classList.add("open");
    tocToggleBtn.classList.add("hidden");
    document.body.classList.add("toc-open");
  }

  function closeTOC() {
    tocSidebar.classList.remove("open");
    tocToggleBtn.classList.remove("hidden");
    document.body.classList.remove("toc-open");
  }

  function toggleTOC() {
    if (tocSidebar.classList.contains("open")) {
      closeTOC();
    } else {
      openTOC();
    }
  }

  // Navigation Logic
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active", "prev", "next");
      if (i === index) {
        slide.classList.add("active");
      } else if (i < index) {
        slide.classList.add("prev");
      } else {
        slide.classList.add("next");
      }
    });

    currentIndex = index;
    updateSlideCounter();
    updateButtons();
    updateTOCHighlight();
  }

  function updateButtons() {
    if (filterActive) {
      const filteredPosition = filteredIndices.indexOf(currentIndex);
      prevBtn.disabled = filteredPosition <= 0;
      nextBtn.disabled = filteredPosition >= filteredIndices.length - 1;
    } else {
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === slides.length - 1;
    }
  }

  function nextSlide() {
    if (filterActive) {
      const currentFilteredPos = filteredIndices.indexOf(currentIndex);
      if (currentFilteredPos < filteredIndices.length - 1) {
        showSlide(filteredIndices[currentFilteredPos + 1]);
      }
    } else {
      if (currentIndex < slides.length - 1) {
        showSlide(currentIndex + 1);
      }
    }
  }

  function prevSlide() {
    if (filterActive) {
      const currentFilteredPos = filteredIndices.indexOf(currentIndex);
      if (currentFilteredPos > 0) {
        showSlide(filteredIndices[currentFilteredPos - 1]);
      }
    } else {
      if (currentIndex > 0) {
        showSlide(currentIndex - 1);
      }
    }
  }

  // Event Listeners
  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);
  tocToggleBtn.addEventListener("click", toggleTOC);
  tocCloseBtn.addEventListener("click", closeTOC);
  tocFilterBtn.addEventListener("click", toggleFilter);

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === " ") {
      nextSlide();
    } else if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "Escape") {
      closeTOC();
    }
  });

  console.log("Git Guide Loaded. Total Slides:", slides.length, "Essential:", filteredIndices.length);
});
