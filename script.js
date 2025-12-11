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
     검색 관련 공통 변수
  ================================= */
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  const dramaData = [
    { title: "드라마 1", pageId: "drama1" },
    { title: "드라마 2", pageId: "drama2" },
    { title: "드라마 3", pageId: "drama3" }
  ];

  const varietyData = [
    { title: "예능 1", pageId: "variety1" },  // 예능 1 추가
    { title: "예능 2", pageId: "variety2" },
    { title: "예능 3", pageId: "variety3" }
  ];

  let currentSearchType = "drama"; // 기본적으로 드라마 검색

  /* ================================
     홈 카드 → 검색 박스 열기
     홈 카드 → 검색창 펼쳐짐
  ================================= */
  const homeCards = document.querySelectorAll(".home-card");
  const searchBox = document.getElementById("searchBox");

  homeCards.forEach((card) => {
    // 영화/예능 disabled 클릭금지
    if (card.classList.contains("disabled")) return;

    card.addEventListener("click", () => {
      const type = card.dataset.search || "drama";  // 기본: 드라마
      currentSearchType = type;

      if (searchInput) {
        if (type === "variety") {
          searchInput.placeholder = "예능 제목을 입력하세요 (예: 예능 1)"; // 예능 제목 입력
        } else {
          searchInput.placeholder = "드라마 제목을 입력하세요 (예: 드라마 1)";
        }
      }

      searchBox.classList.remove("hidden");
      searchBox.scrollIntoView({ behavior: "smooth" });
      searchInput?.focus();
    });
  });

  /* ================================
     검색 기능 (드라마/예능 공용)
  ================================= */
  searchInput?.addEventListener("input", () => {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  const dramaData = [
    { title: "상속자들", pageId: "drama1" },
    { title: "태양의 후예", pageId: "drama2" },
    { title: "청춘기록", pageId: "drama3" }
  ];

  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.trim();
    searchResults.innerHTML = ""; // 검색 결과 초기화

    if (keyword.length === 0) return;

    // 기본은 드라마 데이터
    let source = dramaData;

    // 예능 검색 모드면 예능 데이터 사용
    if (currentSearchType === "variety") {
      source = varietyData;
    }

    const matched = source.filter(item => item.title.includes(keyword));

    matched.forEach(item => {
    const matched = dramaData.filter((d) =>
      d.title.includes(keyword)
    );

    matched.forEach((d) => {
      const li = document.createElement("li");
      li.textContent = item.title;
      li.className = "search-item";
      li.addEventListener("click", () => showPage(item.pageId));
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
      const key = btn.dataset.review; // d1,d2,d3,v1,v2,v3

      const starSelect = document.getElementById(`rate-${key}`);
      const textInput = document.getElementById(`review-${key}`);
      if (!starSelect || !textInput) return;
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
