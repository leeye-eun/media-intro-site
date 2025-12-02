document.addEventListener("DOMContentLoaded", () => {
  const pages = document.querySelectorAll(".page");
  const navLinks = document.querySelectorAll(".nav-link");
  const breadcrumbCurrent = document.querySelector(".breadcrumb-current");
  const backBtn = document.getElementById("backBtn");
  const logo = document.querySelector(".logo");

  /* ============================
     1) 페이지 전환 함수
  ============================ */
  function showPage(pageId, push = true) {
    pages.forEach((page) => {
      page.classList.toggle("active", page.id === pageId);
    });

    // 사이드바 active 표시
    navLinks.forEach((btn) => {
      const target = btn.dataset.page;
      if (!btn.classList.contains("nav-sublink")) {
        btn.classList.toggle("active", target === pageId);
      }
    });

    // breadcrumb 변경
    const currentPage = document.getElementById(pageId);
    if (currentPage) {
      const label = currentPage.dataset.breadcrumb || "홈";
      breadcrumbCurrent.textContent = label;
    }

    if (push) {
      history.pushState({ pageId }, "", "#" + pageId);
    }
  }

  /* ============================
     2) 사이드바: 드라마 토글
  ============================ */
  const dramaBtn = document.querySelector(".nav-link[data-page='drama']");
  const dramaSubmenu = document.querySelector("#drama-submenu");

  dramaBtn.addEventListener("click", () => {
    dramaSubmenu.classList.toggle("show");
  });

  // 드라마1~3 클릭 시 상세페이지 이동
  document.querySelectorAll(".nav-sublink").forEach((item) => {
    item.addEventListener("click", () => {
      const target = item.dataset.page;
      showPage(target);
    });
  });

  /* ============================
     3) 홈: 카드 클릭 → 검색창 펼침
  ============================ */
  const homeCards = document.querySelectorAll(".home-card");
  const searchBoxes = document.querySelectorAll(".home-search");

  homeCards.forEach((card) => {
    const type = card.dataset.search;

    card.addEventListener("click", () => {
      searchBoxes.forEach((box) => box.classList.remove("active"));
      document.querySelector(`#search-${type}`).classList.add("active");
    });
  });

  /* ============================
     4) 검색 기능 (드라마만)
  ============================ */
  const dramaSearchInput = document.getElementById("dramaSearch");
  const dramaSearchResults = document.getElementById("dramaSearchResults");

  const dramaList = [
    { id: "drama1", name: "드라마 1" },
    { id: "drama2", name: "드라마 2" },
    { id: "drama3", name: "드라마 3" },
  ];

  dramaSearchInput.addEventListener("input", () => {
    const keyword = dramaSearchInput.value.trim();
    dramaSearchResults.innerHTML = "";

    if (keyword.length === 0) return;

    const filtered = dramaList.filter((d) => d.name.includes(keyword));

    filtered.forEach((d) => {
      const btn = document.createElement("button");
      btn.className = "search-result";
      btn.textContent = d.name;
      btn.onclick = () => showPage(d.id);
      dramaSearchResults.appendChild(btn);
    });
  });

  /* ============================
     5) 리뷰 저장 + 출력
  ============================ */
  function loadReviews(dramaId) {
    const ul = document.querySelector(`#${dramaId} .review-list`);
    ul.innerHTML = "";

    const stored = JSON.parse(localStorage.getItem(dramaId) || "[]");

    stored.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.star}점 - ${item.text}`;
      ul.appendChild(li);
    });
  }

  document.querySelectorAll(".review-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dramaId = btn.dataset.target;

      const star = document.querySelector(`#${dramaId} .review-star`).value;
      const text = document.querySelector(`#${dramaId} .review-input`).value;

      if (!text.trim()) return alert("리뷰를 입력하세요!");

      const stored = JSON.parse(localStorage.getItem(dramaId) || "[]");
      stored.push({ star, text });

      localStorage.setItem(dramaId, JSON.stringify(stored));
      loadReviews(dramaId);

      document.querySelector(`#${dramaId} .review-input`).value = "";
    });
  });

  /* ============================
     6) 뒤로가기 지원
  ============================ */
  if (backBtn) {
    backBtn.addEventListener("click", () => history.back());
  }

  window.addEventListener("popstate", (e) => {
    const pageId = e.state?.pageId || "home";
    showPage(pageId, false);
  });

  /* ============================
     7) 첫 로딩
  ============================ */
  const initialPage = location.hash.replace("#", "") || "home";
  showPage(initialPage, false);

  // 리뷰 자동 로딩
  ["drama1", "drama2", "drama3"].forEach((id) => loadReviews(id));
});
