document.addEventListener("DOMContentLoaded", () => {
  /* ================================
     사이드바 → 기본 nav 이동
  ================================= */
  document.querySelectorAll(".nav-link").forEach((btn) => {
    // 드라마 드롭다운 버튼은 제외
    if (btn.classList.contains("dropdown-btn")) return;

    btn.addEventListener("click", () => {
      const target = btn.dataset.page;
      if (!target) return;
      showPage(target);
    });
  });

  /* ================================
     페이지 이동 함수
  ================================= */
  const pages = document.querySelectorAll(".page");
  const breadcrumb = document.querySelector(".breadcrumb-current");

  function showPage(pageId, push = true) {
    pages.forEach((p) => p.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");

    // breadcrumb 변경
    const page = document.getElementById(pageId);
    breadcrumb.textContent = page.dataset.breadcrumb || "홈";

    // 주소창 해시 적용
    if (push) history.pushState({ pageId }, "", "#" + pageId);
  }

  /* ================================
     사이드바 → 드라마 펼침
  ================================= */
  const dropdownBtn = document.querySelector(".dropdown-btn");
  const dropdownContent = document.querySelector(".dropdown-content");

  dropdownBtn.addEventListener("click", () => {
    dropdownContent.classList.toggle("show");
  });

  /* ================================
     사이드바 → 드라마 1,2,3 이동
  ================================= */
  document.querySelectorAll(".sub-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.page;
      showPage(target);
    });
  });

  /* ================================
     상단 뒤로가기
  ================================= */
  document.getElementById("backBtn").addEventListener("click", () => {
    history.back();
  });

  window.addEventListener("popstate", (e) => {
    const pageId = e.state?.pageId || "home";
    showPage(pageId, false);
  });

  /* ================================
     홈 카드 → 검색창 펼쳐짐
  ================================= */
  const homeCards = document.querySelectorAll(".home-card");
  const searchBox = document.getElementById("searchBox");

  homeCards.forEach((card) => {
    // 영화/예능 disabled 클릭금지
    if (card.classList.contains("disabled")) return;

    card.addEventListener("click", () => {
      searchBox.classList.remove("hidden");
      searchBox.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ================================
     드라마 검색 기능
  ================================= */
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  const dramaData = [
    { title: "상속자들", pageId: "drama1" },
    { title: "태양의 후예", pageId: "drama2" },
    { title: "청춘기록", pageId: "drama3" }
  ];

  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.trim();
    searchResults.innerHTML = "";

    if (keyword.length === 0) return;

    const matched = dramaData.filter((d) =>
      d.title.includes(keyword)
    );

    matched.forEach((d) => {
      const li = document.createElement("li");
      li.textContent = d.title;
      li.className = "search-item";
      li.addEventListener("click", () => showPage(d.pageId));
      searchResults.appendChild(li);
    });
  });
  /* ================================
     리뷰 저장 + 출력 기능
  ================================= */

  // 리뷰 로딩 함수
  function loadReviews(dramaKey) {
    const list = document.getElementById(`review-list-${dramaKey}`);
    list.innerHTML = "";

    const stored = JSON.parse(localStorage.getItem(dramaKey) || "[]");

    stored.forEach((r) => {
      const li = document.createElement("li");
      li.textContent = `⭐ ${r.star}점 - ${r.text}`;
      list.appendChild(li);
    });
  }

  // 리뷰 등록 버튼 이벤트
  document.querySelectorAll(".review-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.review; // d1, d2, d3

      const star = document.getElementById(`rate-${key}`).value;
      const text = document.getElementById(`review-${key}`).value;

      if (!text.trim()) {
        alert("리뷰를 입력하세요!");
        return;
      }

      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.push({ star, text });

      localStorage.setItem(key, JSON.stringify(existing));

      document.getElementById(`review-${key}`).value = "";

      loadReviews(key);
    });
  });

  /* ================================
     첫 로딩 시
  ================================= */

  // 기본 페이지 설정
  const initial = location.hash.replace("#", "") || "home";
  showPage(initial, false);

  // 리뷰 3개 자동 로딩
  loadReviews("d1");
  loadReviews("d2");
  loadReviews("d3");
});
