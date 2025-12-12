// script.js — 페이지 전환용 안전한 스크립트
document.addEventListener('DOMContentLoaded', function () {
  const pages = Array.from(document.querySelectorAll('section.page'));
  const breadcrumbCurrent = document.querySelector('.breadcrumb-current');
  const backBtn = document.getElementById('backBtn');

  function showPage(id) {
    // 모든 페이지 비활성화
    pages.forEach(p => p.classList.remove('active'));
    // 타겟 페이지 활성화
    const target = document.getElementById(id);
    if (target) {
      target.classList.add('active');
      // 브레드크럼 업데이트 (data-breadcrumb 값 사용)
      if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = target.dataset.breadcrumb || '';
      }
      // 스크롤을 맨 위로
      window.scrollTo(0, 0);
    } else {
      // id가 없으면 home으로 fallback
      const home = document.getElementById('home');
      if (home) {
        home.classList.add('active');
        if (breadcrumbCurrent) breadcrumbCurrent.textContent = home.dataset.breadcrumb || '홈';
      }
    }
    // 모든 드롭다운 닫기 (선택적)
    document.querySelectorAll('.dropdown-content.show').forEach(d => d.classList.remove('show'));
  }

  // 버튼(링크) 클릭 처리 — data-page 어트리뷰트 기반
  document.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const page = this.dataset.page;
      if (page) {
        e.preventDefault();
        showPage(page);
      }
    });
  });

  // 드롭다운 버튼 토글 (클래스가 .dropdown-btn 인 버튼)
  document.querySelectorAll('.dropdown-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      // 토글만 원하면 아래 줄만 사용. (단, data-page가 있으면 showPage도 동작하게 함)
      const menu = this.nextElementSibling;
      if (menu && menu.classList.contains('dropdown-content')) {
        menu.classList.toggle('show');
      }
      // 드롭다운 버튼에도 data-page가 있으면 해당 목록 페이지로 이동
      const page = this.dataset.page;
      if (page) {
        showPage(page);
      }
      e.stopPropagation();
    });
  });

  // 페이지 외부 클릭 시 드롭다운 닫기
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-content.show').forEach(d => d.classList.remove('show'));
    }
  });

  // 뒤로가기 버튼은 홈으로 이동 (원하면 히스토리 기능으로 바꿀 수도 있음)
  if (backBtn) {
    backBtn.addEventListener('click', function () {
      showPage('home');
    });
  }

  // 초기화: 현재 활성 페이지(있다면) 브레드크럼 적용
  const active = document.querySelector('section.page.active');
  if (active && breadcrumbCurrent) {
    breadcrumbCurrent.textContent = active.dataset.breadcrumb || '홈';
  }
});
