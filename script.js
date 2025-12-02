document.addEventListener("DOMContentLoaded", () => {
  /* ================================
     공통: 페이지 전환 함수
  ================================= */
  const pages = document.querySelectorAll(".page");
  const breadcrumb = document.querySelector(".breadcrumb-current");

  function showPage(pageId, push = true) {
    pages.forEach(p => p.classList.remove("active"));

    const page = document.getElementById(pageId) || document.getElementById("home");
    page.classList.add("active");

    breadcrumb.textContent = page.dataset.breadcrumb || "홈";

    if (push) {
      history.pushState({ pageId }, "", "#" + pageId);
    }
  }

  /* ================================
     사이드바 nav (홈 등)
  ================================= */
  document.querySelectorAll(".nav-link").forEach(btn => {
    if (btn.classList.contains("dropdown-btn")) return; // 드롭다운 버튼은 여기서 제외
    if (btn.classList.contains("disabled")) return;     // 비활성 버튼 제외

    btn.addEventListener("click", () => {
      const target = btn.dataset.page;
      if (target) showPage(target);
    });
  });

  /* ================================
     드라마 / 예능 드롭다운 열고 닫기
  ================================= */
  document.querySelectorAll(".dropdown-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const menu = btn.nextElementSibling;      // ul.dropdown-content
      menu.classList.toggle("show");            // show 클래스 토글
    });
  });

  /* ================================
     드라마1,2,3 / 예능1,2,3 / 목록 링크
  ================================= */
  document.querySelectorAll(".sub-link, .list-link").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.page;
      if (target) showPage(target);
    });
  });

  /* ================================
     뒤로가기 버튼 & 브라우저 뒤로가기
  ================================= */
  document.getElementById("backBtn").addEventListener("click", () => {
    history.back();
  });

  window.addEventListener("popstate", e => {
    const pageId = e.state?.pageId || "home";
    showPage(pageId, false);
  });

  /* ================================
     홈 카드 → 검색 박스 열기
  ================================= */
  const homeCards = document.querySelectorAll(".home-card");
  const searchBox = document.getElementById("searchBox");

  homeCards.forEach(card => {
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
    { title: "드라마 1", pageId: "drama1" },
    { title: "드라마 2", pageId: "drama2" },
    { title: "드라마 3", pageId: "drama3" }
  ];

  searchInput?.addEventListener("input", () => {
    const keyword = searchInput.value.trim();
    searchResults.innerHTML = "";

    if (keyword.length === 0) return;

    const matched = dramaData.filter(d => d.title.includes(keyword));

    matched.forEach(d => {
      const li = document.createElement("li");
      li.textContent = d.title;
      li.className = "search-item";
      li.addEventListener("click", () => showPage(d.pageId));
      searchResults.appendChild(li);
    });
  });

  /* ================================
     리뷰 저장 + 출력
  ================================= */
  function loadReviews(key) {
    const list = document.getElementById(`review-list-${key}`);
    if (!list) return;
    list.innerHTML = "";

    const stored = JSON.parse(localStorage.getItem(key) || "[]");
    stored.forEach(r => {
      const li = document.createElement("li");
      li.textContent = `⭐ ${r.star}점 - ${r.text}`;
      list.appendChild(li);
    });
  }

  document.querySelectorAll(".review-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.review; // d1,d2,d3,v1,v2,v3

      const starSelect = document.getElementById(`rate-${key}`);
      const textInput  = document.getElementById(`review-${key}`);
      if (!starSelect || !textInput) return;

      const star = starSelect.value;
      const text = textInput.value;

      if (!text.trim()) {
        alert("리뷰를 입력하세요!");
        return;
      }

      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.push({ star, text });
      localStorage.setItem(key, JSON.stringify(existing));

      textInput.value = "";
      loadReviews(key);
    });
  });

  /* ================================
     첫 로딩
  ================================= */
  const initial = location.hash.replace("#", "") || "home";
  showPage(initial, false);

  ["d1", "d2", "d3", "v1", "v2", "v3"].forEach(loadReviews);
});
