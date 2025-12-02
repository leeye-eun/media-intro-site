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
});

