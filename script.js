// ハンバーガーメニューの制御
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  navMenu.querySelector('ul').classList.toggle('active');
});

// 閉じるボタンのイベントリスナー
const closeBtn = document.getElementById('closeBtn');
closeBtn.addEventListener('click', () => {
  navMenu.querySelector('ul').classList.remove('active');
});

// ページ内リンククリック時（SP）にメニューを閉じる + スクロール対応
const navLinks = navMenu.querySelectorAll('a');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    navMenu.querySelector('ul').classList.remove('active');
    
    // スクロールナビゲーション
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetSection = document.querySelector(href);
      if (targetSection) {
        if (window.innerWidth <= 768) {
          // モバイル: 縦スクロール
          targetSection.scrollIntoView({
            behavior: 'smooth'
          });
        } else {
          // デスクトップ: 横スクロール
          const container = document.querySelector('.horizontal-scroll-container');
          const targetPosition = targetSection.offsetLeft;
          container.scrollTo({
            left: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    }
  });
});

// 文字以外がクリックされた時にメニューを閉じる
document.addEventListener('click', (e) => {
  const header = document.getElementById('header');
  const navMenuUl = navMenu.querySelector('ul');
  
  // クリックされた要素がテキストやリンクでなく、メニューが開いている場合は閉じる
  const isTextElement = e.target.tagName === 'A' || e.target.tagName === 'SPAN' || 
                       e.target.tagName === 'P' || e.target.tagName === 'H1' || 
                       e.target.tagName === 'H2' || e.target.tagName === 'H3' ||
                       e.target.closest('a') || e.target.closest('p') || 
                       e.target.closest('h1') || e.target.closest('h2') || e.target.closest('h3');
  
  if (!header.contains(e.target) && !isTextElement && navMenuUl.classList.contains('active')) {
    navMenuUl.classList.remove('active');
  }
});

// ヘッダー内のクリックでメニューが閉じないようにする
document.getElementById('header').addEventListener('click', (e) => {
  // ハンバーガーメニューのクリック以外は何もしない
  if (!e.target.closest('.hamburger')) {
    e.stopPropagation();
  }
});

document.addEventListener('DOMContentLoaded', () => {
    // マップを表示 (拡大縮小無効化)
    const map = L.map('map', {
      center: [43.0552, 141.3453], // 緯度・経度（札幌市）
      zoom: 15,                   // 初期ズームレベル
      zoomControl: false,         // 拡大縮小コントロールを非表示
      scrollWheelZoom: false,     // スクロールホイールによるズームを無効化
      doubleClickZoom: false,     // ダブルクリックによるズームを無効化
      dragging: true              // 地図のドラッグは有効
    });
  
    // OpenStreetMap タイルを追加
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ''
    }).addTo(map);
  
    // マーカーを追加
    L.marker([43.0552, 141.3453])
      .addTo(map)
      .bindPopup('<b>パブ アパッチ</b><br>〒064-0805 北海道札幌市中央区南５条西５丁目２０')
      .openPopup();
  });

// GSAP を使用したセクションベースのスクロール
let isScrolling = false;
let currentSection = 0;
const totalSections = 4;

// デスクトップ用のマウスホイールイベント
window.addEventListener('wheel', (e) => {
  // モバイルデバイスでは無効化
  if (window.innerWidth <= 768) return;
  
  e.preventDefault();
  
  if (isScrolling) return;
  isScrolling = true;
  
  const container = document.querySelector('.horizontal-scroll-container');
  const sectionWidth = window.innerWidth;
  
  // スクロール方向を判定
  if (e.deltaY > 0) {
    // 右へスクロール（次のセクション）
    if (currentSection < totalSections - 1) {
      currentSection++;
    }
  } else {
    // 左へスクロール（前のセクション）
    if (currentSection > 0) {
      currentSection--;
    }
  }
  
  // GSAPでスムーズにスクロール
  const targetPosition = currentSection * sectionWidth;
  gsap.to(container, {
    scrollLeft: targetPosition,
    duration: 1,
    ease: "power2.out",
    onComplete: () => {
      isScrolling = false;
    }
  });
  
}, { passive: false });

// キーボードの矢印キーでスクロール
let lastKeyTime = 0;
document.addEventListener('keydown', (e) => {
  // モバイルデバイスでは無効化
  if (window.innerWidth <= 768) return;
  
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    e.preventDefault();
    
    // キーの連続押しを制限（500ms間隔）
    const currentTime = Date.now();
    if (currentTime - lastKeyTime < 500) return;
    lastKeyTime = currentTime;
    
    if (isScrolling) return;
    isScrolling = true;
    
    const container = document.querySelector('.horizontal-scroll-container');
    const sectionWidth = window.innerWidth;
    
    if (e.key === 'ArrowRight') {
      // 右矢印キー（次のセクション）
      if (currentSection < totalSections - 1) {
        currentSection++;
      }
    } else if (e.key === 'ArrowLeft') {
      // 左矢印キー（前のセクション）
      if (currentSection > 0) {
        currentSection--;
      }
    }
    
    // GSAPでスムーズにスクロール
    const targetPosition = currentSection * sectionWidth;
    gsap.to(container, {
      scrollLeft: targetPosition,
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => {
        isScrolling = false;
      }
    });
  }
});

// モバイルでは通常の縦スクロールを使用

// プログレスバーの更新（3分割、HOMEは0%）
const container = document.querySelector('.horizontal-scroll-container');
const progressFill = document.querySelector('.progress-fill');

container.addEventListener('scroll', () => {
  const scrollLeft = container.scrollLeft;
  const sectionWidth = window.innerWidth;
  const detectedSection = Math.round(scrollLeft / sectionWidth);
  
  // currentSectionを更新（スクロール位置と同期）
  currentSection = detectedSection;
  
  // プログレスバーを3分割で更新（HOMEは0%）
  let progressPercentage = 0;
  if (detectedSection === 0) {
    progressPercentage = 0; // HOME: 0%
  } else {
    progressPercentage = (detectedSection / 3) * 100; // PLACE: 33%, MENU: 67%, CONTACT: 100%
  }
  
  progressFill.style.width = `${progressPercentage}%`;
});

