document.addEventListener("DOMContentLoaded", () => {
  const pages = document.querySelectorAll(".page");
  const navLinks = document.querySelectorAll(".nav-link");
  const breadcrumbCurrent = document.querySelector(".breadcrumb-current");
  const backBtn = document.getElementById("backBtn");
  const logo = document.querySelector(".logo");

  // 특정 페이지 보여주기
  function showPage(pageId, push = true) {
    pages.forEach((page) => {
      page.classList.toggle("active", page.id === pageId);
    });

    navLinks.forEach((btn) => {
      const target = btn.dataset.page;
      btn.classList.toggle("active", target === pageId);
    });

    const currentPage = document.getElementById(pageId);
    if (currentPage) {
      const label = currentPage.dataset.breadcrumb || "홈";
      breadcrumbCurrent.textContent = label;
    }

    if (push) {
      history.pushState({ pageId }, "", "#" + pageId);
    }
  }

  // 사이드바 버튼 클릭
  navLinks.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.page;
      if (target) showPage(target);
    });
  });

  // 로고 클릭 → 홈으로
  if (logo) {
    logo.addEventListener("click", () => showPage("home"));
  }

  // 상단 뒤로가기 버튼
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      history.back();
    });
  }

  // 브라우저 뒤로/앞으로 이동
  window.addEventListener("popstate", (e) => {
    const pageId = e.state?.pageId || "home";
    showPage(pageId, false);
  });

  // 첫 로딩 시 해시 확인
  const initialPage = location.hash.replace("#", "") || "home";
  showPage(initialPage, false);
    // ==========================
  // 홈 카드 클릭 → 해당 검색 박스 열기
  // ==========================
  const homeCards = document.querySelectorAll(".home-card");
  const searchSections = document.querySelectorAll(".home-search-section");

  function openSearchSection(type) {
    searchSections.forEach((sec) => {
      sec.classList.toggle("active", sec.dataset.type === type);
    });
  }

  homeCards.forEach((card) => {
    card.addEventListener("click", () => {
      const type = card.dataset.search; // drama / movie / show
      showPage("home"); // 홈에 머무르면서
      openSearchSection(type);
    });
  });

  // 처음에는 드라마 검색 보이게
  openSearchSection("drama");

  // ==========================
  // 검색 입력값으로 필터링
  // ==========================
  const searchInputs = document.querySelectorAll(".home-search-input");

  searchInputs.forEach((input) => {
    input.addEventListener("input", () => {
      const keyword = input.value.trim();
      const section = input.closest(".home-search-section");
      const items = section.querySelectorAll("li");

      items.forEach((li) => {
        const name = li.dataset.name || "";
        li.style.display = name.includes(keyword) ? "" : "none";
      });
    });
  });

  // 검색 결과 버튼 클릭 → 해당 페이지로 이동
  const searchLinks = document.querySelectorAll(".search-link");
  searchLinks.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetPage = btn.dataset.page; // drama1, movie1, show1 ...
      if (targetPage) {
        showPage(targetPage);
      }
    });
  });

});

