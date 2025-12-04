document.addEventListener("DOMContentLoaded", () => {
  
  /* ================================
     1. 사이드바 → 메뉴 이동 기능
  ================================= */
  document.querySelectorAll(".nav-link").forEach((btn) => {
    // 드롭다운 버튼(드라마/영화 펼치기용)이면 페이지 이동 금지
    if (btn.classList.contains("dropdown-btn")) return;

    btn.addEventListener("click", () => {
      const target = btn.dataset.page;
      if (!target) return;
      showPage(target);
    });
  });

  /* ================================
     2. 페이지 전환 함수 (공통)
  ================================= */
  const pages = document.querySelectorAll(".page");
  const breadcrumb = document.querySelector(".breadcrumb-current");

  function showPage(pageId, push = true) {
    // 모든 페이지 숨기고 해당 페이지만 보이기
    pages.forEach((p) => p.classList.remove("active"));
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add("active");
        
        // breadcrumb(상단 현재위치) 변경
        breadcrumb.textContent = targetPage.dataset.breadcrumb || "홈";

        // 주소창 해시(#) 적용
        if (push) history.pushState({ pageId }, "", "#" + pageId);
    }
  }

  /* ================================
     [수정됨] 3. 사이드바 → 드롭다운 펼치기/접기
     (querySelector 대신 querySelectorAll 사용)
  ================================= */
  const dropdownBtns = document.querySelectorAll(".dropdown-btn");

  dropdownBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
          // 버튼 클릭 시 내 바로 아래에 있는 목록(ul)을 찾음
          const content = btn.nextElementSibling;
          
          // 목록이 있으면 'show' 클래스를 붙였다 뗐다 함
          if(content) {
              content.classList.toggle("show");
          }
      });
  });

  /* ================================
     4. 사이드바 → 소메뉴(드라마1, 영화1 등) 이동
  ================================= */
  document.querySelectorAll(".sub-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.page;
      showPage(target);
    });
  });

  /* ================================
     5. 상단 뒤로가기
  ================================= */
  const backBtn = document.getElementById("backBtn");
  if(backBtn) {
    backBtn.addEventListener("click", () => {
        history.back();
    });
  }

  window.addEventListener("popstate", (e) => {
    const pageId = e.state?.pageId || "home";
    showPage(pageId, false);
  });

  /* ================================
     [수정됨] 6. 홈 카드 클릭 이벤트
     (검색 버튼과 이동 버튼 구분)
  ================================= */
  const homeCards = document.querySelectorAll(".home-card");
  const searchBox = document.getElementById("searchBox");

  homeCards.forEach((card) => {
    // disabled 클래스는 클릭 금지
    if (card.classList.contains("disabled")) return;

    card.addEventListener("click", () => {
        // 1. 페이지 이동 버튼인 경우 (예: 영화 찾기)
        if (card.dataset.page) {
            showPage(card.dataset.page);
        } 
        // 2. 검색 버튼인 경우 (예: 드라마 찾기)
        else if (card.dataset.search) {
            searchBox.classList.remove("hidden");
            searchBox.scrollIntoView({ behavior: "smooth" });
        }
    });
  });

  /* ================================
     7. 드라마 검색 기능
  ================================= */
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  const dramaData = [
    { title: "드라마 1", pageId: "drama1" },
    { title: "드라마 2", pageId: "drama2" },
    { title: "드라마 3", pageId: "drama3" }
  ];

  if(searchInput) {
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
  }

  /* ================================
     8. 리뷰 저장 + 출력 기능
  ================================= */

  // 리뷰 로딩 함수
  function loadReviews(itemKey) {
    const list = document.getElementById(`review-list-${itemKey}`);
    if (!list) return; // 리스트가 없는 경우(예: 영화 3) 에러 방지

    list.innerHTML = "";
    const stored = JSON.parse(localStorage.getItem(itemKey) || "[]");

    stored.forEach((r) => {
      const li = document.createElement("li");
      li.textContent = `⭐ ${r.star}점 - ${r.text}`;
      list.appendChild(li);
    });
  }

  // 리뷰 등록 버튼 이벤트
  document.querySelectorAll(".review-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.review; // d1, d2, m1, m2 ...

      const starElem = document.getElementById(`rate-${key}`);
      const textElem = document.getElementById(`review-${key}`);

      if (!starElem || !textElem) return; // 요소가 없으면 중단

      const star = starElem.value;
      const text = textElem.value;

      if (!text.trim()) {
        alert("리뷰를 입력하세요!");
        return;
      }

      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.push({ star, text });

      localStorage.setItem(key, JSON.stringify(existing));

      textElem.value = ""; // 입력창 비우기
      loadReviews(key); // 즉시 새로고침
    });
  });

  /* ================================
     9. 첫 로딩 시 초기화
  ================================= */

  // URL 해시 확인해서 해당 페이지 열기
  const initial = location.hash.replace("#", "") || "home";
  showPage(initial, false);

  // 드라마 리뷰 로딩
  loadReviews("d1");
  loadReviews("d2");
  loadReviews("d3");

  // [추가] 영화 리뷰 로딩 (m1, m2...)
  loadReviews("m1");
  loadReviews("m2");
  // 영화 3은 리뷰 섹션이 없으면 무시됨
  loadReviews("m3"); 
});