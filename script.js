document.addEventListener("DOMContentLoaded", () => {
  /* ================================
     1. 사이드바 → 기본 메뉴 이동 (홈 등)
  ================================ */
  document.querySelectorAll(".nav-link").forEach((btn) => {
    // 드롭다운 버튼은 제외
    if (btn.classList.contains("dropdown-btn")) return;

    btn.addEventListener("click", () => {
      const target = btn.dataset.page;
      if (!target) return;
      showPage(target);
    });
  });

  /* ================================
     2. 페이지 이동 함수 (SPA 방식 - 드라마용)
  ================================ */
  const pages = document.querySelectorAll(".page");
  const breadcrumb = document.querySelector(".breadcrumb-current");

  function showPage(pageId, push = true) {
    const targetPage = document.getElementById(pageId);
    if (!targetPage) return; // 페이지가 없으면 종료

    pages.forEach((p) => p.classList.remove("active"));
    targetPage.classList.add("active");

    // breadcrumb 변경
    breadcrumb.textContent = targetPage.dataset.breadcrumb || "홈";

    // 주소창 해시 적용
    if (push) history.pushState({ pageId }, "", "#" + pageId);
  }

  /* ================================
     3. 사이드바 → 드롭다운 펼치기 (드라마, 예능 공통)
  ================================ */
  const dropdownBtns = document.querySelectorAll(".dropdown-btn");

  dropdownBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const content = btn.nextElementSibling;
      if (content && content.classList.contains("dropdown-content")) {
        content.classList.toggle("show");
      }
    });
  });

  /* ================================
     4. 사이드바 → 서브 메뉴 클릭 (드라마용)
     (예능은 HTML에 onclick="location.href..."가 있어서 여기서 처리 안 함)
  ================================ */
  document.querySelectorAll(".sub-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.page;
      // data-page 속성이 있는 경우에만 내부 이동 (드라마)
      if (target) {
        showPage(target);
      }
    });
  });

  /* ================================
     5. 상단 뒤로가기 버튼
  ================================ */
  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      history.back();
    });
  }

  window.addEventListener("popstate", (e) => {
    const pageId = e.state?.pageId || "home";
    showPage(pageId, false);
  });

  /* ================================
     6. 홈 카드 클릭 → 검색창 활성화 및 문구 변경
  ================================ */
  const homeCards = document.querySelectorAll(".home-card");
  const searchBox = document.getElementById("searchBox");
  const searchInput = document.getElementById("searchInput");

  homeCards.forEach((card) => {
    // disabled 클래스는 무시
    if (card.classList.contains("disabled")) return;

    card.addEventListener("click", () => {
      searchBox.classList.remove("hidden");
      searchBox.scrollIntoView({ behavior: "smooth" });

      // 카드 종류 확인 (드라마 vs 예능)
      const type = card.dataset.search;

      if (type === "ent") {
        searchInput.placeholder = "예능 제목을 입력하시오";
      } else {
        searchInput.placeholder = "드라마 제목을 입력하세요 (예: 상속자들)";
      }

      // 검색창 초기화
      searchInput.value = "";
      document.getElementById("searchResults").innerHTML = "";
      searchInput.focus();
    });
  });

  /* ================================
     7. [핵심 수정] 통합 검색 기능
     - 드라마 검색 시: 내부 페이지 이동 (showPage)
     - 예능 검색 시: 외부 HTML 파일 이동 (location.href)
  ================================ */
  const searchResults = document.getElementById("searchResults");

  const allData = [
    // [드라마] 내부 이동용 pageId
    { title: "상속자들", pageId: "drama1" },
    { title: "태양의 후예", pageId: "drama2" },
    { title: "청춘기록", pageId: "drama3" },

    // [예능] 외부 파일 이동용 url (요청하신 부분)
    { title: "신서유기", url: "ent1.html" },
    { title: "런닝맨", url: "ent2.html" },
    { title: "아는형님", url: "ent3.html" }
  ];

  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.trim();
    searchResults.innerHTML = "";

    if (keyword.length === 0) return;

    // 키워드 포함된 항목 필터링
    const matched = allData.filter((d) =>
      d.title.includes(keyword)
    );

    matched.forEach((d) => {
      const li = document.createElement("li");
      li.textContent = d.title;
      li.className = "search-item";

      // 검색 결과 클릭 이벤트
      li.addEventListener("click", () => {
        if (d.url) {
          // url이 있으면 (예능) -> 새 파일로 이동
          location.href = d.url;
        } else {
          // url이 없으면 (드라마) -> 내부 페이지 이동
          showPage(d.pageId);
        }
      });

      searchResults.appendChild(li);
    });
  });

  /* ================================
     8. 리뷰 기능 (드라마 전용)
     (예능 리뷰는 각 html 파일에서 처리하거나 별도 로직 필요)
  ================================ */
  function loadReviews(dramaKey) {
    const list = document.getElementById(`review-list-${dramaKey}`);
    if (!list) return; // 리스트가 없으면 패스

    list.innerHTML = "";
    const stored = JSON.parse(localStorage.getItem(dramaKey) || "[]");

    stored.forEach((r) => {
      const li = document.createElement("li");
      li.textContent = `⭐ ${r.star}점 - ${r.text}`;
      list.appendChild(li);
    });
  }

  document.querySelectorAll(".review-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.review; // d1, d2, d3

      const starSelect = document.getElementById(`rate-${key}`);
      const textInput = document.getElementById(`review-${key}`);

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
     9. 초기 로딩 실행
  ================================ */
  const initial = location.hash.replace("#", "") || "home";
  showPage(initial, false);

  // 드라마 리뷰 불러오기
  loadReviews("d1");
  loadReviews("d2");
  loadReviews("d3");
});
