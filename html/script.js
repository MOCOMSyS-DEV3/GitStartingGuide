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
  const tocNav = document.getElementById("tocNav");

  let currentIndex = 0;

  // Slide titles mapping (data-id to display title)
  const slideTitles = {
    "intro": "Git & GitHub 가이드",
    "git-vs-svn": "Git vs SVN 핵심 비교",
    "local-vs-remote": "Git ≠ GitHub",
    "local-workflow": "로컬 브랜치 워크플로",
    "install": "설치 가이드",
    "config": "최초 설정 & 초기화",
    "git-3state": "Git의 3가지 상태",
    "basic-commands": "기본 흐름: 저장하기",
    "branch": "브랜치 다루기",
    "branch-lifecycle": "브랜치 작업 이유",
    "merge-strategies": "머지 전략",
    "merge-visualization": "머지 전략 시각화",
    "conflict-resolution": "충돌 해결하기",
    "git-log": "git log 활용",
    "undo-changes": "되돌리기",
    "clone-fork": "Clone & Fork",
    "fetch-vs-pull": "fetch vs pull",
    "workflow": "협업의 시작",
    "workflow-detail": "GitHub Flow",
    "github-web": "GitHub 웹 사용법",
    "github-web-2": "Star/Watch/Fork & PAT",
    "cli": "GitHub CLI (gh)",
    "pr-advanced": "Pull Request 심화",
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
  totalSlidesSpan.textContent = slides.length;
  updateButtons();
  generateTOC();

  // Generate TOC items
  function generateTOC() {
    tocNav.innerHTML = "";
    slides.forEach((slide, index) => {
      const dataId = slide.getAttribute("data-id");
      const title = slideTitles[dataId] || dataId;

      const tocItem = document.createElement("div");
      tocItem.className = "toc-item";
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

  // Update TOC highlight to match current slide
  function updateTOCHighlight() {
    const tocItems = tocNav.querySelectorAll(".toc-item");
    tocItems.forEach((item, index) => {
      item.classList.toggle("active", index === currentIndex);
    });

    // Scroll active item into view
    const activeItem = tocNav.querySelector(".toc-item.active");
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
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
    currentSlideSpan.textContent = currentIndex + 1;
    updateButtons();
    updateTOCHighlight();
  }

  function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === slides.length - 1;
  }

  function nextSlide() {
    if (currentIndex < slides.length - 1) {
      showSlide(currentIndex + 1);
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      showSlide(currentIndex - 1);
    }
  }

  // Event Listeners
  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);
  tocToggleBtn.addEventListener("click", toggleTOC);
  tocCloseBtn.addEventListener("click", closeTOC);

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === " ") {
      nextSlide();
    } else if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "Escape") {
      closeTOC();
    }
  });

  console.log("Git Guide Loaded. Total Slides:", slides.length);
});
