const fs = require('fs');
const path = require('path');

// 讀取已經萃取好的純淨經文資料
const cleanData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'clean_practices.json'), 'utf8'));

// 確保 xinjing / dabeizhou 包含開經偈與大悲發願偈
const kaijingSection = {
  id: 'kaijing',
  title: '【開經偈】',
  desc: '開經發心・解真實義',
  lines: [
    '無上甚深微妙法　百千萬劫難遭遇',
    '我今見聞得受持　願解如來真實義'
  ]
};

const fayuanSection = {
  id: 'dabei_fayuan',
  title: '【大悲發願祈願文】',
  desc: '依《大悲心陀羅尼經》發十大宏願與六向無畏心',
  lines: [
    '經云：若有比丘、比丘尼、優婆塞、優婆夷、童男、童女欲誦持者，於諸眾生起慈悲心，先當從我發如是願：',
    '南無大悲觀世音　願我速知一切法',
    '南無大悲觀世音　願我早得智慧眼',
    '南無大悲觀世音　願我速度一切眾',
    '南無大悲觀世音　願我早得善方便',
    '南無大悲觀世音　願我速乘般若船',
    '南無大悲觀世音　願我早得越苦海',
    '南無大悲觀世音　願我速得戒定道',
    '南無大悲觀世音　願我早登涅槃山',
    '南無大悲觀世音　願我速會無為舍',
    '南無大悲觀世音　願我早同法性身',
    '我若向刀山　刀山自摧折',
    '我若向火湯　火湯自消滅',
    '我若向地獄　地獄自枯竭',
    '我若向餓鬼　餓鬼自飽滿',
    '我若向修羅　惡心自調伏',
    '我若向畜生　自得大智慧'
  ]
};

if (!cleanData.xinjing.sections.find(s => s.id === 'kaijing')) {
  cleanData.xinjing.sections.splice(1, 0, kaijingSection);
}
if (!cleanData.xinjing.sections.find(s => s.id === 'dabei_fayuan')) {
  const idx = cleanData.xinjing.sections.findIndex(s => s.id === 'guanyinji');
  cleanData.xinjing.sections.splice(idx + 1, 0, fayuanSection);
}
if (!cleanData.dabeizhou.sections.find(s => s.id === 'kaijing')) {
  cleanData.dabeizhou.sections.splice(1, 0, kaijingSection);
}

// 產生深度重構後的 index.html
const html = `<!DOCTYPE html>
<html lang="zh-TW" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover">
  <title>觀音法門定課 v1.2 — 普門品・大悲咒・心經（法鼓山修持定課系統）</title>
  <meta name="description" content="法鼓山觀音法門修持定課系統：普門品、大悲咒、心經三種日課，弘一禪風單句居中經本翻頁、自訂字體字級排版、Nano Banana禪意美學Logo。">

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Google Fonts: 楷體、思源宋體、思源黑體 -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500;600;700;900&family=Noto+Sans+TC:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <style>
    /* ==========================================================================
       1. 嚴謹動態語意色彩系統 (徹底解決換主題文字顏色未同步更新之問題)
       ========================================================================== */
    :root, [data-theme="dark"] {
      /* 【曜石夜修】沉穩深灰黑底，暖羊皮紙白字，香檳古金，杜絕死黑 */
      --bg-base: #14171A;
      --bg-surface: #1C2024;
      --bg-surface-elevated: #252B31;
      --card-overlay: rgba(28, 32, 36, 0.94);
      --card-border: rgba(212, 175, 55, 0.22);
      --card-border-hover: rgba(212, 175, 55, 0.55);

      --text-main: #E8DFD5;       /* 羊皮紙微光白 (主字) */
      --text-sub: #B5ACA0;        /* 沉穩古茶灰 (次要字) */
      --text-muted: #7E766B;      /* 幽微灰 (輔助說明) */

      --accent-gold: #D4AF37;     /* 香檳金 */
      --accent-gold-bg: rgba(212, 175, 55, 0.12);
      --accent-gold-border: rgba(212, 175, 55, 0.35);
      --accent-cinnabar: #E05A47; /* 硃砂紅 */
      --accent-cinnabar-bg: rgba(224, 90, 71, 0.12);
      --accent-emerald: #34D399;  /* 翡翠綠 */
      --accent-emerald-bg: rgba(52, 211, 153, 0.12);

      --hero-pattern: radial-gradient(circle at 50% 15%, rgba(212, 175, 55, 0.08) 0%, rgba(20, 23, 26, 0.98) 75%);
      --shadow-elevation: 0 16px 36px rgba(0, 0, 0, 0.45);
    }

    [data-theme="stone"] {
      /* 【暖沙微陽】宋代宣紙/羊皮紙古色，焦墨黑字，沉金硃砂，柔和不眩光 */
      --bg-base: #E8E2D5;
      --bg-surface: #F4EDE2;
      --bg-surface-elevated: #DFD7C7;
      --card-overlay: rgba(244, 237, 226, 0.96);
      --card-border: rgba(150, 103, 24, 0.22);
      --card-border-hover: rgba(150, 103, 24, 0.55);

      --text-main: #24201B;       /* 宣紙焦墨黑 (主字，高對比且柔和) */
      --text-sub: #544A3D;        /* 濃墨褐灰 (次要字) */
      --text-muted: #867866;      /* 澄墨灰 (輔助說明) */

      --accent-gold: #966718;     /* 古銅金 */
      --accent-gold-bg: rgba(150, 103, 24, 0.1);
      --accent-gold-border: rgba(150, 103, 24, 0.35);
      --accent-cinnabar: #A8321B; /* 印泥硃砂紅 */
      --accent-cinnabar-bg: rgba(168, 50, 27, 0.1);
      --accent-emerald: #1B7340;  /* 靜山青竹 */
      --accent-emerald-bg: rgba(27, 115, 64, 0.1);

      --hero-pattern: radial-gradient(circle at 50% 15%, rgba(150, 103, 24, 0.09) 0%, rgba(232, 226, 213, 0.98) 75%);
      --shadow-elevation: 0 12px 28px rgba(70, 58, 45, 0.12);
    }

    [data-theme="celadon"] {
      /* 【青瓷冷茶】深潭碧玉與苔蘚古木色調，天青白字，幽微典雅 */
      --bg-base: #101916;
      --bg-surface: #172420;
      --bg-surface-elevated: #20312C;
      --card-overlay: rgba(23, 36, 32, 0.95);
      --card-border: rgba(94, 168, 134, 0.22);
      --card-border-hover: rgba(94, 168, 134, 0.6);

      --text-main: #E2ECE7;       /* 天青淡玉白 (主字) */
      --text-sub: #A3B8AD;        /* 青灰茶墨 (次要字) */
      --text-muted: #6B8277;      /* 苔青灰 (輔助說明) */

      --accent-gold: #D4AF37;     /* 金曜光 */
      --accent-gold-bg: rgba(94, 168, 134, 0.12);
      --accent-gold-border: rgba(94, 168, 134, 0.35);
      --accent-cinnabar: #C8543E; /* 寶石緋紅 */
      --accent-cinnabar-bg: rgba(200, 84, 62, 0.12);
      --accent-emerald: #4ADE80;  /* 晨光碧翠 */
      --accent-emerald-bg: rgba(74, 222, 128, 0.12);

      --hero-pattern: radial-gradient(circle at 50% 15%, rgba(94, 168, 134, 0.1) 0%, rgba(16, 25, 22, 0.98) 75%);
      --shadow-elevation: 0 16px 36px rgba(0, 0, 0, 0.45);
    }

    /* 基礎重置與色彩繼承 */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      background-color: var(--bg-base);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-image: var(--hero-pattern);
      background-attachment: fixed;
      transition: background-color 0.3s ease, color 0.3s ease;
      font-feature-settings: "palt" 1;
      padding-bottom: env(safe-area-inset-bottom, 1.5rem);
    }

    /* 語意文字與背景輔助類別 (保證與主題 100% 同步) */
    .c-main { color: var(--text-main) !important; }
    .c-sub { color: var(--text-sub) !important; }
    .c-muted { color: var(--text-muted) !important; }
    .c-gold { color: var(--accent-gold) !important; }
    .c-cinnabar { color: var(--accent-cinnabar) !important; }
    .c-emerald { color: var(--accent-emerald) !important; }

    .bg-canvas { background-color: var(--bg-base) !important; }
    .bg-panel { background-color: var(--bg-surface) !important; }
    .bg-panel-elevated { background-color: var(--bg-surface-elevated) !important; }
    .border-zen { border-color: var(--card-border) !important; }
    .border-zen-focus { border-color: var(--card-border-hover) !important; }

    /* 禪意卡片外觀 */
    .zen-card {
      background-color: var(--card-overlay);
      border: 1px solid var(--card-border);
      color: var(--text-main);
      backdrop-filter: blur(12px);
      transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .zen-card:hover {
      border-color: var(--card-border-hover);
      box-shadow: var(--shadow-elevation);
    }

    /* 頂部導覽列 */
    .app-header {
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(14px);
      background-color: var(--card-overlay);
      border-bottom: 1px solid var(--card-border);
      transition: all 0.3s ease;
    }

    /* 經本翻頁動效 (Book Turning Slide) */
    .page-turn-left {
      animation: pageTurnLeft 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .page-turn-right {
      animation: pageTurnRight 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes pageTurnLeft {
      0% { transform: translateX(20px) scale(0.985); opacity: 0; }
      100% { transform: translateX(0) scale(1); opacity: 1; }
    }
    @keyframes pageTurnRight {
      0% { transform: translateX(-20px) scale(0.985); opacity: 0; }
      100% { transform: translateX(0) scale(1); opacity: 1; }
    }

    /* 木魚敲擊微動效 */
    @keyframes fish-strike {
      0% { transform: scale(1); }
      35% { transform: scale(0.91) rotate(-3deg); }
      100% { transform: scale(1); }
    }
    .striking {
      animation: fish-strike 0.14s ease;
    }

    /* 自訂捲軸 */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: var(--bg-base);
    }
    ::-webkit-scrollbar-thumb {
      background: var(--card-border);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--card-border-hover);
    }

    /* 彈窗遮罩 */
    .modal-backdrop {
      background: rgba(10, 12, 14, 0.78);
      backdrop-filter: blur(8px);
      transition: opacity 0.25s ease;
    }
    [data-theme="stone"] .modal-backdrop {
      background: rgba(60, 52, 42, 0.55);
    }
  </style>
</head>
<body class="relative selection:bg-amber-900 selection:text-amber-100">

  <!-- ==================== 頂部全功能導覽列 ==================== -->
  <header class="app-header w-full px-3.5 sm:px-8 py-2.5 sm:py-3 relative z-40">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
      
      <!-- 左側 Logo 與標題 -->
      <div id="brandLogoHomeBtn" class="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group">
        <!-- 動態 Logo 容器 (Nano Banana 高清圓標) -->
        <div id="currentLogoContainer" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-zen p-0.5 overflow-hidden flex items-center justify-center bg-black/30 shadow group-hover:border-zen-focus group-hover:scale-105 transition-all" title="點選更換 Logo">
          <!-- 動態載入 Logo 圖片 -->
        </div>
        <div>
          <div class="flex items-center gap-1.5 sm:gap-2">
            <h1 class="text-sm sm:text-lg font-bold tracking-wider c-main group-hover:text-amber-500 transition-colors">
              觀音法門定課
            </h1>
            <span class="text-[10px] font-sans px-1.5 py-0.2 rounded border border-zen c-gold font-medium">v1.2</span>
          </div>
          <p class="text-[11px] c-muted hidden sm:block tracking-wide">法鼓山大事關懷・觀世音菩薩修持日課</p>
        </div>
      </div>

      <!-- 右側「排版微調」、「日課」、「設定」選單 -->
      <div class="flex items-center gap-1.5 sm:gap-2.5">
        
        <!-- 「排版與字體」快捷按鈕 (在誦念時快速自訂字級、字體、對齊) -->
        <button id="openTypographyBtn" class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zen hover:border-zen-focus bg-panel text-xs c-main transition-all" title="字體、字級、排版設定">
          <span class="text-sm">Aa</span>
          <span class="hidden md:inline text-xs c-sub">排版</span>
        </button>

        <!-- 「日課」選單按鈕（合掌與經卷圖標） -->
        <button id="openDailyRecordsBtn" class="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-zen hover:border-zen-focus bg-panel text-xs sm:text-sm font-medium c-main transition-all" title="修持日曆與打卡紀錄">
          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 c-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            <path d="M9 7h6"/>
            <path d="M9 11h6"/>
          </svg>
          <span class="text-xs sm:text-sm">日課</span>
          <span id="dailyCheckIndicator" class="w-1.5 h-1.5 rounded-full bg-emerald-500 hidden" title="今日已圓滿打卡"></span>
        </button>

        <!-- 「設定」選單按鈕（引磬與齒輪圖標） -->
        <button id="openSettingsBtn" class="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-zen hover:border-zen-focus bg-panel text-xs sm:text-sm font-medium c-main transition-all" title="系統設定與Logo更換">
          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 c-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span class="hidden sm:inline text-xs sm:text-sm">設定</span>
        </button>

      </div>
    </div>
  </header>

  <!-- ==================== 主要視圖區塊 ==================== -->
  <main class="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-8 py-4 sm:py-8 relative z-10 flex flex-col justify-start">
    
    <!-- ==================== 1. 首頁視圖 (HOME VIEW) ==================== -->
    <div id="homeView" class="w-full flex flex-col items-center">
      
      <!-- 禪意標題與法語橫幅 -->
      <div class="text-center max-w-3xl mb-6 sm:mb-10 mt-1 sm:mt-3 px-2">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zen bg-panel c-gold text-xs mb-3 font-medium">
          <span>🙏</span>
          <span class="tracking-widest">念觀音・求觀音・學觀音・做觀音</span>
        </div>
        <h2 class="text-2xl sm:text-4xl font-bold tracking-widest c-main mb-2 sm:mb-3">
          觀音法門日課修持
        </h2>
        <p class="text-xs sm:text-sm c-sub max-w-xl mx-auto leading-relaxed">
          遵照法鼓山聖嚴法師「觀音法門修持方法」與僧團大事關懷課誦標準。收錄三門核心日課，請選擇今日欲持誦之定課：
        </p>
      </div>

      <!-- 三種定課卡片網格 (手機單欄，平板電腦三欄，完美響應) -->
      <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
        
        <!-- 卡片 1：《普門品》定課 -->
        <div class="zen-card rounded-2xl p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden group cursor-pointer" onclick="openPracticeConfig('pumenpin')">
          <div class="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          
          <div>
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-900/25 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 sm:mb-5 group-hover:border-emerald-500/60 transition-colors">
              <svg class="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 44 C22 52 42 52 56 44"/>
                <path d="M14 42 Q32 20 50 14 Q38 32 32 44"/>
                <circle cx="32" cy="18" r="4" fill="currentColor"/>
              </svg>
            </div>

            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-900/35 text-emerald-400 border border-emerald-500/30">法華精髓</span>
              <span class="text-xs c-muted">全品20分 / 偈頌5分</span>
            </div>

            <h3 class="text-lg sm:text-xl font-bold tracking-wide c-main group-hover:text-amber-500 transition-colors mb-2">
              《普門品》定課
            </h3>
            
            <p class="text-xs c-gold font-medium mb-2.5">
              慈悲救護・三十二應普門示現
            </p>

            <p class="text-xs c-sub leading-relaxed mb-5">
              聞名免七難、離三毒、滿二願。支援「全品長行＋偈頌」或切換「32偈頌專修短課」，單句居中沈浸翻閱。
            </p>
          </div>

          <div class="pt-3.5 border-t border-zen flex items-center justify-between text-xs font-medium">
            <span class="c-muted">全品 或 偈頌專修</span>
            <button class="px-3 py-1.5 rounded-lg bg-panel border border-zen c-gold group-hover:bg-amber-500 group-hover:text-stone-950 transition-all font-semibold flex items-center gap-1">
              <span>發心持誦</span>
              <span>→</span>
            </button>
          </div>
        </div>

        <!-- 卡片 2：〈大悲咒〉定課 -->
        <div class="zen-card rounded-2xl p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden group cursor-pointer" onclick="openPracticeConfig('dabeizhou')">
          <div class="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          
          <div>
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-900/25 border border-amber-500/30 flex items-center justify-center c-gold mb-4 sm:mb-5 group-hover:border-amber-500/60 transition-colors">
              <svg class="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="32" cy="32" r="22"/>
                <circle cx="32" cy="32" r="12"/>
                <path d="M32 10 L32 54"/>
                <path d="M10 32 L54 32"/>
                <path d="M16 16 L48 48"/>
                <path d="M16 48 L48 16"/>
              </svg>
            </div>

            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-semibold px-2 py-0.5 rounded bg-amber-900/35 c-gold border border-amber-500/30">神咒除障</span>
              <span class="text-xs c-muted">遍數隨喜</span>
            </div>

            <h3 class="text-lg sm:text-xl font-bold tracking-wide c-main group-hover:text-amber-500 transition-colors mb-2">
              〈大悲咒〉定課
            </h3>
            
            <p class="text-xs c-gold font-medium mb-2.5">
              千手千眼・廣大圓滿無礙大悲心
            </p>

            <p class="text-xs c-sub leading-relaxed mb-5">
              八十四句神咒。發十大宏願、六向無畏心，藉陀羅尼清淨自心，消除累劫宿業與煩惱障礙。
            </p>
          </div>

          <div class="pt-3.5 border-t border-zen flex items-center justify-between text-xs font-medium">
            <span class="c-muted">可選 3、7、21 遍</span>
            <button class="px-3 py-1.5 rounded-lg bg-panel border border-zen c-gold group-hover:bg-amber-500 group-hover:text-stone-950 transition-all font-semibold flex items-center gap-1">
              <span>發心持誦</span>
              <span>→</span>
            </button>
          </div>
        </div>

        <!-- 卡片 3：《心經》定課 -->
        <div class="zen-card rounded-2xl p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden group cursor-pointer" onclick="openPracticeConfig('xinjing')">
          <div class="absolute top-0 right-0 w-28 h-28 bg-sky-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          
          <div>
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-900/25 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4 sm:mb-5 group-hover:border-sky-500/60 transition-colors">
              <svg class="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M32 10 C46 10 54 22 54 34 C54 48 42 54 30 54 C18 54 10 44 10 32 C10 18 24 12 34 12"/>
              </svg>
            </div>

            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-semibold px-2 py-0.5 rounded bg-sky-900/35 text-sky-400 border border-sky-500/30">般若空慧</span>
              <span class="text-xs c-muted">約 5 分鐘</span>
            </div>

            <h3 class="text-lg sm:text-xl font-bold tracking-wide c-main group-hover:text-amber-500 transition-colors mb-2">
              《心經》定課
            </h3>
            
            <p class="text-xs c-gold font-medium mb-2.5">
              般若波羅蜜多・照見五蘊皆空
            </p>

            <p class="text-xs c-sub leading-relaxed mb-5">
              二百六十字經文精華。體悟無所得、心無罣礙無有恐怖，向內觀照，契合無上菩提正道。
            </p>
          </div>

          <div class="pt-3.5 border-t border-zen flex items-center justify-between text-xs font-medium">
            <span class="c-muted">經心 260 字</span>
            <button class="px-3 py-1.5 rounded-lg bg-panel border border-zen c-gold group-hover:bg-amber-500 group-hover:text-stone-950 transition-all font-semibold flex items-center gap-1">
              <span>發心持誦</span>
              <span>→</span>
            </button>
          </div>
        </div>

      </div>

      <!-- 額外推薦：三門合修完整定課橫幅 -->
      <div class="w-full zen-card rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border border-zen bg-panel">
        <div class="flex items-center gap-3 text-center sm:text-left">
          <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-panel-elevated border border-zen flex items-center justify-center c-gold flex-shrink-0 text-sm">
            <span>✨</span>
          </div>
          <div>
            <h4 class="text-sm sm:text-base font-bold c-main">三門合修・完整貫通定課</h4>
            <p class="text-xs c-sub">前導淨水讚開經唯一次，連貫持誦「普門品 ➔ 大悲咒 ➔ 心經」，圓滿讚偈、發願、皈依與迴向。</p>
          </div>
        </div>
        <button onclick="openPracticeConfig('merged')" class="w-full sm:w-auto px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm transition-colors flex-shrink-0">
          啟動三門合修
        </button>
      </div>

    </div>

    <!-- ==================== 2. 專注持誦視圖 (PRACTICE VIEW) ==================== -->
    <div id="practiceView" class="w-full flex-col hidden pb-24">
      
      <!-- 頂部控制列 (返回、範圍切換、翻書/卷軸切換、計數) -->
      <div class="zen-card rounded-xl p-3 sm:p-4 mb-3.5 flex flex-wrap items-center justify-between gap-2.5 border border-zen">
        
        <div class="flex items-center gap-2">
          <button onclick="returnToHome()" class="px-2.5 py-1 rounded-md border border-zen hover:border-zen-focus bg-panel text-xs flex items-center gap-1 transition-all c-main">
            <span>←</span>
            <span>首頁</span>
          </button>
          <div class="h-3.5 w-[1px] bg-subtle"></div>
          <h2 id="practiceTitleDisplay" class="text-sm sm:text-base font-bold c-main">
            《普門品》定課
          </h2>
          <!-- 普門品專屬範圍切換晶片 -->
          <button id="scopeToggleChipBtn" onclick="togglePracticeScopeInView()" class="hidden px-2 py-0.5 rounded-full border border-sky-500/40 bg-sky-500/15 text-sky-400 text-[11px] font-semibold hover:bg-sky-500/30 transition-all flex items-center gap-1">
            <span>⇄</span>
            <span>範圍切換</span>
          </button>
        </div>

        <div class="flex items-center gap-1.5 sm:gap-2">
          <!-- 【經本翻頁 ⇄ 卷軸連貫】切換開關 -->
          <button id="btnToggleReadingMode" onclick="toggleReadingMode()" class="px-2.5 py-1 rounded-lg border border-zen bg-panel text-xs font-semibold c-gold hover:border-zen-focus transition-all flex items-center gap-1" title="切換經本翻書或卷軸模式">
            <span id="readingModeIcon">📖</span>
            <span id="readingModeText" class="text-xs">翻頁</span>
          </button>

          <!-- 當前修持計數徽章 -->
          <div id="badgeMantraRep" class="px-2 py-0.5 rounded bg-panel border border-zen c-gold font-semibold text-xs">
            遍數：<span id="currentMantraRepText">1</span>/<span id="targetMantraRepText">1</span>
          </div>
          <div id="badgeBuddhaRep" class="px-2 py-0.5 rounded bg-panel border border-zen c-emerald font-semibold text-xs">
            聖號：<span id="currentBuddhaCountText">0</span>/<span id="targetBuddhaCountText">10</span>
          </div>
        </div>

      </div>

      <!-- A. 經本翻頁視圖 (BOOK MODE - 單句/段落完美居中禪意摺頁) -->
      <div id="bookModeContainer" class="w-full flex flex-col items-center">
        
        <!-- 經本摺頁主卡片 (自適應高寬度，完美上下左右居中) -->
        <div id="bookPageCard" class="w-full zen-card rounded-2xl p-4 sm:p-8 border border-zen relative min-h-[62vh] sm:min-h-[68vh] flex flex-col justify-between shadow-2xl transition-all">
          
          <!-- 翻頁卡片頂部：頁碼與科判標題 -->
          <div class="flex items-center justify-between pb-3 border-b border-zen text-xs">
            <div class="flex items-center gap-1.5 sm:gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              <span id="bookPageTitle" class="font-bold c-gold tracking-wider text-xs sm:text-sm">【開經偈】</span>
              <span id="bookPageSubtitle" class="c-muted text-[11px] hidden sm:inline"></span>
            </div>
            <div class="c-muted font-sans tracking-widest text-[11px]">
              第 <span id="bookCurrentPageNum" class="c-gold font-bold">1</span> / <span id="bookTotalPageNum">10</span> 頁
            </div>
          </div>

          <!-- 翻頁卡片正文區塊 (真正垂直與水平完美居中，沉浸安詳) -->
          <div id="bookPageContentWrap" class="flex-1 flex flex-col items-center justify-center py-6 sm:py-10 px-2 sm:px-6 w-full cursor-pointer select-none">
            <div id="bookPageContent" class="w-full max-w-2xl mx-auto space-y-4 tracking-widest transition-all">
              <!-- 動態載入當前頁經文 -->
            </div>
          </div>

          <!-- 翻頁卡片底部：左右翻頁控制與手勢引導 -->
          <div class="pt-3.5 border-t border-zen flex items-center justify-between">
            <button id="bookPrevPageBtn" onclick="prevBookPage()" class="px-3.5 sm:px-4 py-2 rounded-xl border border-zen hover:border-zen-focus bg-panel text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all c-sub disabled:opacity-25 disabled:pointer-events-none">
              <span>❮</span>
              <span>上一頁</span>
            </button>

            <!-- 頁碼跳轉快速選單 -->
            <div class="flex items-center gap-1 text-[11px] c-muted">
              <span class="hidden sm:inline">← 滑動或點擊翻頁 →</span>
              <span class="sm:hidden">點擊兩側翻頁</span>
            </div>

            <button id="bookNextPageBtn" onclick="nextBookPage()" class="px-4 sm:px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold active:scale-95 text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md">
              <span id="bookNextBtnText">下一頁</span>
              <span>❯</span>
            </button>
          </div>

        </div>

      </div>

      <!-- B. 卷軸連續視圖 (SCROLL MODE) -->
      <div id="scrollModeContainer" class="w-full flex-col hidden">
        <!-- 科判快速跳轉膠囊列 -->
        <div id="sectionNavPills" class="flex items-center gap-2 overflow-x-auto pb-3 mb-3 no-scrollbar text-xs"></div>
        <!-- 經文主內容容器 -->
        <div id="scriptureContentContainer" class="zen-card rounded-2xl p-5 sm:p-10 space-y-10 leading-loose text-base sm:text-lg"></div>
      </div>

      <!-- 底部固定禪意工具列 (敲木魚、+1遍數、打卡) -->
      <div class="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-xl zen-card rounded-full px-3.5 sm:px-6 py-2 flex items-center justify-between border border-zen shadow-2xl bg-panel">
        
        <!-- 木魚按鈕 -->
        <button id="strikeWoodfishBtn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-panel-elevated border border-zen hover:border-zen-focus c-gold text-xs font-medium transition-all group" title="敲擊木魚 (或按空白鍵)">
          <span class="text-base group-active:scale-90 transition-transform">🪘</span>
          <span class="text-xs">敲木魚</span>
        </button>

        <!-- 當前遍數/聲數累加快捷鍵 -->
        <button id="incrementRepBtn" class="flex items-center gap-1 px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm active:scale-95 transition-all shadow-md">
          <span>+1 遍 / 聲</span>
        </button>

        <!-- 圓滿完成打卡按鈕 -->
        <button onclick="finishPracticeAndCheckIn()" class="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm transition-all shadow flex items-center gap-1">
          <span>🙏</span>
          <span>圓滿打卡</span>
        </button>

      </div>

    </div>

  </main>

  <!-- ==================== 彈窗 1：排版與字體微調浮層 (TYPOGRAPHY MODAL) ==================== -->
  <div id="typographyModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop hidden">
    <div class="zen-card w-full max-w-md rounded-2xl p-6 border border-zen shadow-2xl relative">
      
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-zen">
        <div class="flex items-center gap-2">
          <span class="text-lg">Aa</span>
          <h3 class="text-base font-bold c-main">自訂字體與段落排版</h3>
        </div>
        <button onclick="closeTypographyModal()" class="c-muted hover:c-main text-xl font-bold p-1">✕</button>
      </div>

      <!-- 1. 字體選擇 (楷體 / 宋體 / 黑體) -->
      <div class="mb-5">
        <label class="block text-xs font-semibold c-gold mb-2">經文字體選擇：</label>
        <div class="grid grid-cols-3 gap-2 text-xs">
          <button onclick="setFontFamily('kaiti')" id="fontFamilyBtn_kaiti" class="py-2 px-1 rounded-lg border border-zen bg-panel c-main text-center font-serif">
            經典楷體
          </button>
          <button onclick="setFontFamily('songti')" id="fontFamilyBtn_songti" class="py-2 px-1 rounded-lg border border-zen bg-panel c-main text-center font-serif">
            禪宗宋體
          </button>
          <button onclick="setFontFamily('heiti')" id="fontFamilyBtn_heiti" class="py-2 px-1 rounded-lg border border-zen bg-panel c-main text-center font-sans">
            現代黑體
          </button>
        </div>
      </div>

      <!-- 2. 字級大小 (5 檔自訂) -->
      <div class="mb-5">
        <label class="block text-xs font-semibold c-gold mb-2">字級大小設定：</label>
        <div class="grid grid-cols-5 gap-1.5 text-xs text-center">
          <button onclick="setFontSizeStep(1)" id="fontSizeBtn_1" class="py-1.5 rounded-lg border border-zen bg-panel c-sub">小</button>
          <button onclick="setFontSizeStep(2)" id="fontSizeBtn_2" class="py-1.5 rounded-lg border border-zen bg-panel c-sub">中</button>
          <button onclick="setFontSizeStep(3)" id="fontSizeBtn_3" class="py-1.5 rounded-lg border border-zen bg-panel c-sub">大</button>
          <button onclick="setFontSizeStep(4)" id="fontSizeBtn_4" class="py-1.5 rounded-lg border border-zen bg-panel c-sub">特大</button>
          <button onclick="setFontSizeStep(5)" id="fontSizeBtn_5" class="py-1.5 rounded-lg border border-zen bg-panel c-sub">巨幅</button>
        </div>
      </div>

      <!-- 3. 文字對齊方式 (置中 vs 靠左) -->
      <div class="mb-5">
        <label class="block text-xs font-semibold c-gold mb-2">段落對齊方式：</label>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <button onclick="setTextAlign('center')" id="textAlignBtn_center" class="py-2 rounded-lg border border-zen bg-panel c-main flex items-center justify-center gap-1.5">
            <span>禪意置中 (推薦)</span>
          </button>
          <button onclick="setTextAlign('left')" id="textAlignBtn_left" class="py-2 rounded-lg border border-zen bg-panel c-main flex items-center justify-center gap-1.5">
            <span>傳統靠左</span>
          </button>
        </div>
      </div>

      <!-- 4. 行距選擇 -->
      <div class="mb-6">
        <label class="block text-xs font-semibold c-gold mb-2">行距舒緩度：</label>
        <div class="grid grid-cols-3 gap-2 text-xs">
          <button onclick="setLineHeight('tight')" id="lineHeightBtn_tight" class="py-1.5 rounded-lg border border-zen bg-panel c-sub">緊湊 (1.8)</button>
          <button onclick="setLineHeight('normal')" id="lineHeightBtn_normal" class="py-1.5 rounded-lg border border-zen bg-panel c-sub">舒適 (2.3)</button>
          <button onclick="setLineHeight('loose')" id="lineHeightBtn_loose" class="py-1.5 rounded-lg border border-zen bg-panel c-sub">空靈 (2.8)</button>
        </div>
      </div>

      <div class="flex justify-end pt-2 border-t border-zen">
        <button onclick="closeTypographyModal()" class="px-5 py-2 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs">
          套用設定
        </button>
      </div>

    </div>
  </div>

  <!-- ==================== 彈窗 2：遍數設定彈窗 (CONFIG MODAL) ==================== -->
  <div id="practiceConfigModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop hidden">
    <div class="zen-card w-full max-w-lg rounded-2xl p-5 sm:p-7 border border-zen shadow-2xl relative">
      
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-zen">
        <div class="flex items-center gap-2">
          <span class="text-xl">🪷</span>
          <h3 id="configModalTitle" class="text-base sm:text-lg font-bold c-main">設定定課遍數</h3>
        </div>
        <button onclick="closePracticeConfig()" class="c-muted hover:c-main text-xl font-bold p-1">✕</button>
      </div>

      <!-- 普門品專屬：修持範圍選擇 -->
      <div id="pumenpinScopeWrapper" class="mb-4 sm:mb-5 hidden">
        <label class="block text-xs font-semibold c-gold mb-2">普門品修持範圍：</label>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <button type="button" onclick="setPumenpinScope('all')" id="pumenpinScope_all" class="py-2 px-3 rounded-lg border text-center transition-all border-amber-500 bg-amber-500 text-stone-950 font-bold flex flex-col items-center">
            <span class="font-bold">全品圓滿持誦</span>
            <span class="text-[10px] opacity-80 font-normal">長行＋32偈頌 (約20分)</span>
          </button>
          <button type="button" onclick="setPumenpinScope('jisong')" id="pumenpinScope_jisong" class="py-2 px-3 rounded-lg border text-center transition-all border-zen bg-panel c-sub hover:border-zen-focus flex flex-col items-center">
            <span class="font-bold">偈頌專修短課</span>
            <span class="text-[10px] c-muted font-normal">精選32偈頌 (約5~7分)</span>
          </button>
        </div>
      </div>

      <!-- 咒語/經文遍數配置 -->
      <div class="mb-4 sm:mb-5">
        <label class="block text-xs font-semibold c-gold mb-2">經文／咒語修持遍數：</label>
        <div id="mantraOptionsGrid" class="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs"></div>
      </div>

      <!-- 佛號聲數配置 (加入 10 遍推薦選項) -->
      <div class="mb-6">
        <label class="block text-xs font-semibold c-emerald mb-2">南無觀世音菩薩聖號聲數 (新增10遍選項)：</label>
        <div id="buddhaOptionsGrid" class="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs"></div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-3 border-t border-zen">
        <button onclick="closePracticeConfig()" class="px-4 py-2 rounded-lg border border-zen hover:bg-white/5 text-xs font-medium c-sub">
          取消
        </button>
        <button onclick="startConfiguredPractice()" class="px-5 sm:px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-1.5">
          <span>開始定課</span>
          <span>→</span>
        </button>
      </div>

    </div>
  </div>

  <!-- ==================== 彈窗 3：日課歷程與打卡日曆 (DAILY RECORDS MODAL) ==================== -->
  <div id="dailyRecordsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop hidden">
    <div class="zen-card w-full max-w-2xl rounded-2xl p-5 sm:p-8 border border-zen shadow-2xl max-h-[90vh] overflow-y-auto">
      
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-zen">
        <div class="flex items-center gap-2">
          <span class="text-xl">📿</span>
          <h3 class="text-base sm:text-lg font-bold c-main">日課修持與打卡日曆</h3>
        </div>
        <button onclick="closeDailyRecords()" class="c-muted hover:c-main text-xl font-bold p-1">✕</button>
      </div>

      <!-- 今日打卡狀態摘要 -->
      <div class="p-4 rounded-xl bg-panel border border-zen mb-5 flex items-center justify-between">
        <div>
          <div class="text-xs c-gold font-semibold mb-1">今日定課狀態</div>
          <div id="todayStatusText" class="text-sm font-bold c-main">尚未完成今日定課</div>
        </div>
        <button onclick="manualCheckInToday()" id="btnCheckInNow" class="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5">
          <span>🙏</span>
          <span>手動打卡</span>
        </button>
      </div>

      <!-- 打卡月曆視圖 -->
      <div class="mb-5">
        <div class="flex items-center justify-between mb-2 text-xs font-bold c-sub">
          <span id="calendarMonthTitle">2026年 10月</span>
          <span class="c-muted">🙏 代表已圓滿打卡</span>
        </div>
        <div class="grid grid-cols-7 gap-1 text-center text-xs c-muted mb-1 font-sans">
          <div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div>
        </div>
        <div id="calendarDaysGrid" class="grid grid-cols-7 gap-1 text-center text-xs"></div>
      </div>

      <!-- 禪意迴向卡製作區塊 -->
      <div class="pt-4 border-t border-zen">
        <h4 class="text-xs font-bold c-gold mb-2">生成禪意迴向小卡</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
          <input type="text" id="dedicateNameInput" placeholder="迴向者姓名 (例：佛弟子)" class="px-3 py-2 rounded-lg bg-panel-elevated border border-zen text-xs c-main focus:border-zen-focus outline-none">
          <input type="text" id="dedicateTargetInput" placeholder="祈福對象 (例：歷代先祖、闔家親友)" class="px-3 py-2 rounded-lg bg-panel-elevated border border-zen text-xs c-main focus:border-zen-focus outline-none">
        </div>
        <div class="flex items-center justify-end gap-2">
          <button onclick="copyDedicationText()" class="px-3 py-1.5 rounded-md border border-zen bg-panel text-xs c-sub">
            複製迴向文
          </button>
          <button onclick="generateDedicationCardImage()" class="px-4 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs">
            下載迴向卡 PNG
          </button>
        </div>
        <canvas id="dedicationCanvas" class="hidden" width="800" height="500"></canvas>
      </div>

    </div>
  </div>

  <!-- ==================== 彈窗 4：設定選單 (SETTINGS & NANO BANANA LOGO) ==================== -->
  <div id="settingsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop hidden">
    <div class="zen-card w-full max-w-lg rounded-2xl p-5 sm:p-7 border border-zen shadow-2xl max-h-[90vh] overflow-y-auto">
      
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-zen">
        <div class="flex items-center gap-2">
          <span class="text-xl">⚙️</span>
          <h3 class="text-base sm:text-lg font-bold c-main">修持系統設定</h3>
        </div>
        <button onclick="closeSettings()" class="c-muted hover:c-main text-xl font-bold p-1">✕</button>
      </div>

      <!-- 1. 5 款 Nano Banana 高清禪意 Logo -->
      <div class="mb-5">
        <label class="block text-xs font-semibold c-gold mb-1">
          自訂標誌 (Nano Banana 頂級禪意美學標誌)：
        </label>
        <p class="text-[11px] c-muted mb-3">AI 依據觀音象徵精繪之極簡曜石黑金標誌：</p>
        
        <div id="logoSelectionGrid" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5"></div>
      </div>

      <!-- 2. 外觀護眼色彩主題 (切換即時連動所有文字顏色) -->
      <div class="mb-5">
        <label class="block text-xs font-semibold c-main mb-2">護眼色彩調性 (切換即時連動字色)：</label>
        <div class="grid grid-cols-3 gap-2 text-xs">
          <button onclick="setTheme('dark')" id="themeBtn_dark" class="p-2.5 rounded-xl border border-zen bg-zinc-900 text-amber-400 font-bold flex flex-col items-center gap-1">
            <span class="w-4 h-4 rounded-full bg-zinc-800 border border-amber-500/50"></span>
            <span>曜石夜修</span>
          </button>
          <button onclick="setTheme('stone')" id="themeBtn_stone" class="p-2.5 rounded-xl border border-zen bg-[#E8E2D5] text-[#24201B] font-bold flex flex-col items-center gap-1">
            <span class="w-4 h-4 rounded-full bg-[#DFD7C7] border border-[#966718]/50"></span>
            <span>暖沙微陽</span>
          </button>
          <button onclick="setTheme('celadon')" id="themeBtn_celadon" class="p-2.5 rounded-xl border border-zen bg-[#101916] text-[#E2ECE7] font-bold flex flex-col items-center gap-1">
            <span class="w-4 h-4 rounded-full bg-[#182420] border border-[#5EA886]/50"></span>
            <span>青瓷冷茶</span>
          </button>
        </div>
      </div>

      <!-- 3. 木魚伴讀音訊設定 -->
      <div class="mb-4">
        <label class="block text-xs font-semibold c-main mb-2">虛擬木魚伴讀音訊：</label>
        <div class="flex items-center justify-between p-3 rounded-xl bg-panel border border-zen text-xs">
          <span class="c-main">空白鍵快速敲擊木魚</span>
          <input type="checkbox" id="settingSpacebarWoodfish" checked onchange="toggleSetting('spacebarWoodfish', this.checked)" class="accent-amber-500 w-4 h-4">
        </div>
      </div>

      <div class="flex justify-end pt-3 border-t border-zen">
        <button onclick="closeSettings()" class="px-5 py-2 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs">
          完成設定
        </button>
      </div>

    </div>
  </div>

  <!-- ==================== 自訂 TOAST 通知組件 ==================== -->
  <div id="toastNotification" class="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-panel border border-zen c-gold text-xs sm:text-sm font-medium shadow-2xl pointer-events-none transition-all duration-300 opacity-0 -translate-y-2 flex items-center gap-2 backdrop-blur-md">
    <span id="toastIcon">🙏</span>
    <span id="toastMessage">操作完成</span>
  </div>

  <!-- ==================== 核心邏輯與經文資料腳本 ==================== -->
  <script>
    /**
     * 觀音法門定課系統 (v1.2 - 弘一禪風單句居中經本翻頁與排版自訂版)
     * 1. 深度修復主題切換字色同步更新 (曜石、暖沙、青瓷三主題完美高對比)
     * 2. 弘一法師墨寶風格「單句一頁・完美居中留白」翻頁體驗
     * 3. 佛號次數提供 10 聲 (推薦短課)
     * 4. 開放自訂字體 (楷體/宋體/黑體)、5級字級、行距、對齊方式
     * 5. 5款 Nano Banana 頂級禪意美學 Logo
     */

    // 1. 內嵌經文資料庫
    window.PRACTICES_DB = ${JSON.stringify(cleanData)};

    // 2. 5 款 Nano Banana 高清禪意美學 Logo
    window.ZEN_LOGOS = [
      {
        id: 'logo_01_vase',
        name: '淨瓶甘露',
        tag: 'Nano Banana',
        desc: '大悲淨瓶・懸凝甘露水滴',
        imgSrc: 'assets/logos/logo_01_kundika_vase.jpg'
      },
      {
        id: 'logo_02_willow',
        name: '楊枝甘露',
        tag: 'Nano Banana',
        desc: '禪宗圓相柳枝・灑落微光',
        imgSrc: 'assets/logos/logo_02_willow_dew.jpg'
      },
      {
        id: 'logo_03_lotus',
        name: '大悲心蓮',
        tag: 'Nano Banana',
        desc: '合十心蓮・守護慈悲光明',
        imgSrc: 'assets/logos/logo_03_zen_lotus.jpg'
      },
      {
        id: 'logo_04_ear',
        name: '耳根圓通',
        tag: 'Nano Banana',
        desc: '反聞自性・一筆圓相聲波',
        imgSrc: 'assets/logos/logo_04_sound_enstasis.jpg'
      },
      {
        id: 'logo_05_boat',
        name: '一葉慈航',
        tag: 'Nano Banana',
        desc: '苦海度人舟・智月相伴',
        imgSrc: 'assets/logos/logo_05_compassion_boat.jpg'
      }
    ];

    // 3. SafeStorage 安全快取代理
    const SafeStorage = (function () {
      let isLocalStorageAvailable = false;
      const memoryStorage = {};
      try {
        const testKey = '__storage_test__';
        window.localStorage.setItem(testKey, testKey);
        window.localStorage.removeItem(testKey);
        isLocalStorageAvailable = true;
      } catch (e) {
        console.warn('LocalStorage unavailable, fallback to in-memory SafeStorage.');
      }
      return {
        getItem: function (key) {
          if (isLocalStorageAvailable) {
            try { return window.localStorage.getItem(key); } catch (e) {}
          }
          return memoryStorage[key] || null;
        },
        setItem: function (key, value) {
          if (isLocalStorageAvailable) {
            try { window.localStorage.setItem(key, value); return; } catch (e) {}
          }
          memoryStorage[key] = String(value);
        }
      };
    })();

    // 4. Web Audio 原生木魚與引磬合成器
    const ZenAudio = (function () {
      let audioCtx = null;
      function getContext() {
        if (!audioCtx) {
          try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) audioCtx = new AudioContextClass();
          } catch (e) {
            console.warn('AudioContext failed:', e);
          }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume().catch(() => {});
        }
        return audioCtx;
      }

      return {
        playWoodfish: function () {
          try {
            const ctx = getContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(460, now);
            osc1.frequency.exponentialRampToValueAtTime(140, now + 0.12);
            gain1.gain.setValueAtTime(0.7, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.15);

            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(800, now);
            osc2.frequency.exponentialRampToValueAtTime(220, now + 0.06);
            gain2.gain.setValueAtTime(0.35, now);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now);
            osc2.stop(now + 0.09);
          } catch (e) {
            console.warn('Woodfish audio error handled:', e);
          }
        },

        playChime: function () {
          try {
            const ctx = getContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1860, now);
            gain.gain.setValueAtTime(0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 1.9);
          } catch (e) {
            console.warn('Chime audio error handled:', e);
          }
        }
      };
    })();

    // 5. 系統狀態
    const AppState = {
      currentView: 'home',
      currentPracticeKey: 'pumenpin',
      pumenpinScope: 'all', // 'all' (全品) | 'jisong' (偈頌專修)
      readingMode: 'book', // 'book' (單句居中經本翻頁) | 'scroll' (卷軸連貫)
      currentBookPageIdx: 0,
      bookPagesList: [],
      targetMantraRep: 1,
      currentMantraRep: 0,
      targetBuddhaCount: 10, // 預設 10 聲
      currentBuddhaCount: 0,
      selectedLogoIndex: 0,
      theme: 'dark',
      // 排版自訂
      fontFamily: 'kaiti', // 'kaiti' | 'songti' | 'heiti'
      fontSizeStep: 3,     // 1(小)~5(巨幅)，預設 3(大)
      textAlign: 'center', // 'center' (居中) | 'left' (靠左)
      lineHeight: 'normal',// 'tight'(1.8) | 'normal'(2.3) | 'loose'(2.8)
      spacebarWoodfish: true
    };

    // 初始化載入
    document.addEventListener('DOMContentLoaded', () => {
      loadSavedState();
      applyTypographyStyles();
      renderCurrentLogo();
      renderLogoSelectionSettings();
      setupKeyAndTouchListeners();
      updateDailyCheckStatus();
    });

    function loadSavedState() {
      const savedLogo = SafeStorage.getItem('zen_logo_idx');
      if (savedLogo !== null) AppState.selectedLogoIndex = parseInt(savedLogo, 10) || 0;

      const savedTheme = SafeStorage.getItem('zen_theme');
      if (savedTheme) {
        setTheme(savedTheme, false);
      } else {
        setTheme('dark', false);
      }

      const savedMode = SafeStorage.getItem('zen_reading_mode');
      if (savedMode) AppState.readingMode = savedMode;

      const savedFontFamily = SafeStorage.getItem('zen_font_family');
      if (savedFontFamily) AppState.fontFamily = savedFontFamily;

      const savedFontSizeStep = SafeStorage.getItem('zen_font_size_step');
      if (savedFontSizeStep) AppState.fontSizeStep = parseInt(savedFontSizeStep, 10) || 3;

      const savedTextAlign = SafeStorage.getItem('zen_text_align');
      if (savedTextAlign) AppState.textAlign = savedTextAlign;

      const savedLineHeight = SafeStorage.getItem('zen_line_height');
      if (savedLineHeight) AppState.lineHeight = savedLineHeight;
    }

    // 6. 排版與字體即時自訂引擎
    function setFontFamily(font) {
      AppState.fontFamily = font;
      SafeStorage.setItem('zen_font_family', font);
      applyTypographyStyles();
      showToast('已更換字體為：' + (font === 'kaiti' ? '經典楷體' : font === 'songti' ? '禪宗宋體' : '現代黑體'));
    }

    function setFontSizeStep(step) {
      AppState.fontSizeStep = step;
      SafeStorage.setItem('zen_font_size_step', step);
      applyTypographyStyles();
      const labels = ['', '小字', '中字', '大字', '特大', '巨幅居中'];
      showToast('已調整字級為：' + labels[step]);
    }

    function setTextAlign(align) {
      AppState.textAlign = align;
      SafeStorage.setItem('zen_text_align', align);
      applyTypographyStyles();
      showToast('已調整對齊方式：' + (align === 'center' ? '禪意置中' : '傳統靠左'));
    }

    function setLineHeight(lh) {
      AppState.lineHeight = lh;
      SafeStorage.setItem('zen_line_height', lh);
      applyTypographyStyles();
      showToast('已調整行距為：' + (lh === 'tight' ? '緊湊' : lh === 'loose' ? '空靈留白' : '舒適'));
    }

    function applyTypographyStyles() {
      const bookEl = document.getElementById('bookPageContent');
      const scrollEl = document.getElementById('scriptureContentContainer');

      // 1. 字體映射
      let fontStack = '"Noto Serif TC", "BiauKai", "DFKai-SB", serif';
      if (AppState.fontFamily === 'songti') {
        fontStack = '"Noto Serif TC", "Songti TC", "MingLiU", serif';
      } else if (AppState.fontFamily === 'heiti') {
        fontStack = '"Noto Sans TC", sans-serif';
      }

      // 2. 字級大小映射 (手機端精準調校)
      const sizeClasses = {
        1: { book: 'text-base sm:text-lg', scroll: 'text-sm sm:text-base' },
        2: { book: 'text-lg sm:text-xl', scroll: 'text-base sm:text-lg' },
        3: { book: 'text-xl sm:text-2xl', scroll: 'text-lg sm:text-xl' },
        4: { book: 'text-2xl sm:text-3xl', scroll: 'text-xl sm:text-2xl' },
        5: { book: 'text-3xl sm:text-4xl', scroll: 'text-2xl sm:text-3xl' }
      };
      const curSize = sizeClasses[AppState.fontSizeStep] || sizeClasses[3];

      // 3. 行距映射
      const lineHeights = {
        tight: '1.8',
        normal: '2.3',
        loose: '2.8'
      };
      const curLH = lineHeights[AppState.lineHeight] || '2.3';

      // 4. 對齊方式
      const curAlign = AppState.textAlign === 'center' ? 'center' : 'left';

      // 套用至經本翻頁容器
      if (bookEl) {
        bookEl.style.fontFamily = fontStack;
        bookEl.style.lineHeight = curLH;
        bookEl.style.textAlign = curAlign;
        bookEl.className = 'w-full max-w-2xl mx-auto space-y-4 tracking-widest transition-all ' + curSize.book;
      }

      // 套用至卷軸容器
      if (scrollEl) {
        scrollEl.style.fontFamily = fontStack;
        scrollEl.style.lineHeight = curLH;
        scrollEl.style.textAlign = curAlign;
        scrollEl.className = 'zen-card rounded-2xl p-5 sm:p-10 space-y-10 tracking-wide ' + curSize.scroll;
      }

      // 更新彈窗內的按鈕選中樣式
      ['kaiti', 'songti', 'heiti'].forEach(f => {
        const b = document.getElementById('fontFamilyBtn_' + f);
        if (b) {
          if (f === AppState.fontFamily) b.className = 'py-2 px-1 rounded-lg border border-amber-500 bg-amber-500 text-stone-950 font-bold text-center';
          else b.className = 'py-2 px-1 rounded-lg border border-zen bg-panel c-main text-center';
        }
      });

      for (let s = 1; s <= 5; s++) {
        const b = document.getElementById('fontSizeBtn_' + s);
        if (b) {
          if (s === AppState.fontSizeStep) b.className = 'py-1.5 rounded-lg border border-amber-500 bg-amber-500 text-stone-950 font-bold';
          else b.className = 'py-1.5 rounded-lg border border-zen bg-panel c-sub';
        }
      }

      ['center', 'left'].forEach(a => {
        const b = document.getElementById('textAlignBtn_' + a);
        if (b) {
          if (a === AppState.textAlign) b.className = 'py-2 rounded-lg border border-amber-500 bg-amber-500 text-stone-950 font-bold flex items-center justify-center gap-1.5';
          else b.className = 'py-2 rounded-lg border border-zen bg-panel c-main flex items-center justify-center gap-1.5';
        }
      });

      ['tight', 'normal', 'loose'].forEach(lh => {
        const b = document.getElementById('lineHeightBtn_' + lh);
        if (b) {
          if (lh === AppState.lineHeight) b.className = 'py-1.5 rounded-lg border border-amber-500 bg-amber-500 text-stone-950 font-bold';
          else b.className = 'py-1.5 rounded-lg border border-zen bg-panel c-sub';
        }
      });
    }

    function openTypographyModal() {
      document.getElementById('typographyModal').classList.remove('hidden');
    }

    function closeTypographyModal() {
      document.getElementById('typographyModal').classList.add('hidden');
    }

    // 7. Logo 管理
    function renderCurrentLogo() {
      const logo = window.ZEN_LOGOS[AppState.selectedLogoIndex] || window.ZEN_LOGOS[0];
      const container = document.getElementById('currentLogoContainer');
      if (container) {
        container.innerHTML = \`<img src="\${logo.imgSrc}" alt="\${logo.name}" class="w-full h-full object-cover rounded-full">\`;
        container.setAttribute('title', '目前標誌：' + logo.name + ' - 點選設定切換');
      }
    }

    function selectLogo(index) {
      AppState.selectedLogoIndex = index;
      SafeStorage.setItem('zen_logo_idx', index);
      renderCurrentLogo();
      renderLogoSelectionSettings();
      showToast('已切換為 Nano Banana【' + window.ZEN_LOGOS[index].name + '】標誌');
    }

    function renderLogoSelectionSettings() {
      const grid = document.getElementById('logoSelectionGrid');
      if (!grid) return;
      grid.innerHTML = window.ZEN_LOGOS.map((logo, idx) => {
        const isSelected = idx === AppState.selectedLogoIndex;
        return \`
          <div onclick="selectLogo(\${idx})" class="p-2.5 sm:p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 \${
            isSelected ? 'border-amber-500 bg-amber-500/15' : 'border-zen bg-panel hover:border-zen-focus'
          }">
            <div class="w-11 h-11 rounded-full border border-zen overflow-hidden flex-shrink-0 bg-black shadow-md">
              <img src="\${logo.imgSrc}" alt="\${logo.name}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold c-main">\${logo.name}</span>
                <span class="text-[10px] c-gold px-1 py-0.2 rounded bg-amber-500/10 font-sans">\${logo.tag}</span>
              </div>
              <p class="text-[11px] c-muted truncate">\${logo.desc}</p>
            </div>
            \${isSelected ? '<span class="c-gold text-sm font-bold">✓</span>' : ''}
          </div>
        \`;
      }).join('');
    }

    // 8. 定課設定 Modal 與佛號「10遍」短課選項
    let pendingPracticeKey = 'pumenpin';
    let tempMantraRep = 1;
    let tempBuddhaCount = 10; // 預設 10 聲

    function openPracticeConfig(practiceKey) {
      pendingPracticeKey = practiceKey;
      const modal = document.getElementById('practiceConfigModal');
      const title = document.getElementById('configModalTitle');
      const mantraGrid = document.getElementById('mantraOptionsGrid');
      const buddhaGrid = document.getElementById('buddhaOptionsGrid');

      const practiceNames = {
        pumenpin: '《觀世音菩薩普門品》定課',
        dabeizhou: '〈大悲咒〉定課',
        xinjing: '《般若波羅蜜多心經》定課',
        merged: '三門合修完整定課'
      };
      title.textContent = '設定 ' + (practiceNames[practiceKey] || '定課') + ' 遍數';

      // 普門品範圍選擇
      const scopeWrapper = document.getElementById('pumenpinScopeWrapper');
      if (scopeWrapper) {
        if (practiceKey === 'pumenpin') {
          scopeWrapper.classList.remove('hidden');
          setPumenpinScope(AppState.pumenpinScope || 'all');
        } else {
          scopeWrapper.classList.add('hidden');
        }
      }

      // 經咒遍數選項
      let mantraOptions = [1, 3, 7];
      if (practiceKey === 'dabeizhou') {
        mantraOptions = [3, 7, 21, 49, 108];
        tempMantraRep = 7;
      } else if (practiceKey === 'xinjing') {
        mantraOptions = [1, 3, 7, 21];
        tempMantraRep = 3;
      } else {
        mantraOptions = [1, 3];
        tempMantraRep = 1;
      }

      mantraGrid.innerHTML = mantraOptions.map(num => \`
        <button type="button" onclick="setTempMantraRep(\${num})" id="mantraOptBtn_\${num}" class="py-2 rounded-lg border text-center transition-all \${
          num === tempMantraRep ? 'border-amber-500 bg-amber-500 text-stone-950 font-bold' : 'border-zen bg-panel c-sub hover:border-zen-focus'
        }">
          \${num} 遍
        </button>
      \`).join('');

      // 聖號選項 (包含 10 遍推薦選項)
      const buddhaOptions = [
        { label: '10 聲 (推薦)', val: 10 },
        { label: '21 聲', val: 21 },
        { label: '49 聲', val: 49 },
        { label: '108 聲', val: 108 },
        { label: '自由計數', val: 0 }
      ];
      tempBuddhaCount = 10; // 預設 10 聲

      buddhaGrid.innerHTML = buddhaOptions.map(opt => \`
        <button type="button" onclick="setTempBuddhaCount(\${opt.val})" id="buddhaOptBtn_\${opt.val}" class="py-2 rounded-lg border text-center transition-all \${
          opt.val === tempBuddhaCount ? 'border-emerald-500 bg-emerald-600 text-white font-bold' : 'border-zen bg-panel c-sub hover:border-zen-focus'
        }">
          \${opt.label}
        </button>
      \`).join('');

      modal.classList.remove('hidden');
    }

    function setPumenpinScope(scope) {
      AppState.pumenpinScope = scope;
      const btnAll = document.getElementById('pumenpinScope_all');
      const btnJi = document.getElementById('pumenpinScope_jisong');
      if (!btnAll || !btnJi) return;
      if (scope === 'all') {
        btnAll.className = 'py-2 px-3 rounded-lg border text-center transition-all border-amber-500 bg-amber-500 text-stone-950 font-bold flex flex-col items-center';
        btnJi.className = 'py-2 px-3 rounded-lg border text-center transition-all border-zen bg-panel c-sub hover:border-zen-focus flex flex-col items-center';
      } else {
        btnJi.className = 'py-2 px-3 rounded-lg border text-center transition-all border-emerald-500 bg-emerald-600 text-white font-bold flex flex-col items-center';
        btnAll.className = 'py-2 px-3 rounded-lg border text-center transition-all border-zen bg-panel c-sub hover:border-zen-focus flex flex-col items-center';
      }
    }

    function togglePracticeScopeInView() {
      AppState.pumenpinScope = AppState.pumenpinScope === 'all' ? 'jisong' : 'all';
      updateScopeChipDisplay();
      initPracticePages();
      const scopeText = AppState.pumenpinScope === 'all' ? '全品（長行＋偈頌）' : '偈頌專修短課（三十二偈）';
      showToast('已切換為：' + scopeText);
    }

    function updateScopeChipDisplay() {
      const scopeChip = document.getElementById('scopeToggleChipBtn');
      if (scopeChip) {
        if (AppState.currentPracticeKey === 'pumenpin') {
          scopeChip.classList.remove('hidden');
          scopeChip.innerHTML = AppState.pumenpinScope === 'all' 
            ? '<span>⇄</span><span>全品模式</span>' 
            : '<span>⇄</span><span class="text-emerald-400 font-bold">偈頌專修</span>';
        } else {
          scopeChip.classList.add('hidden');
        }
      }
    }

    function setTempMantraRep(num) {
      tempMantraRep = num;
      document.querySelectorAll('[id^="mantraOptBtn_"]').forEach(b => {
        b.className = 'py-2 rounded-lg border text-center transition-all border-zen bg-panel c-sub hover:border-zen-focus';
      });
      const activeBtn = document.getElementById('mantraOptBtn_' + num);
      if (activeBtn) activeBtn.className = 'py-2 rounded-lg border text-center transition-all border-amber-500 bg-amber-500 text-stone-950 font-bold';
    }

    function setTempBuddhaCount(val) {
      tempBuddhaCount = val;
      document.querySelectorAll('[id^="buddhaOptBtn_"]').forEach(b => {
        b.className = 'py-2 rounded-lg border text-center transition-all border-zen bg-panel c-sub hover:border-zen-focus';
      });
      const activeBtn = document.getElementById('buddhaOptBtn_' + val);
      if (activeBtn) activeBtn.className = 'py-2 rounded-lg border text-center transition-all border-emerald-500 bg-emerald-600 text-white font-bold';
    }

    function closePracticeConfig() {
      document.getElementById('practiceConfigModal').classList.add('hidden');
    }

    function startConfiguredPractice() {
      AppState.currentPracticeKey = pendingPracticeKey;
      AppState.targetMantraRep = tempMantraRep;
      AppState.currentMantraRep = 0;
      AppState.targetBuddhaCount = tempBuddhaCount;
      AppState.currentBuddhaCount = 0;
      AppState.currentBookPageIdx = 0;

      closePracticeConfig();
      enterPracticeView();
    }

    // 9. 專注持誦視圖與弘一禪風單句居中翻頁引擎
    function enterPracticeView() {
      AppState.currentView = 'practice';
      document.getElementById('homeView').classList.add('hidden');
      document.getElementById('practiceView').classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const practiceNames = {
        pumenpin: '《普門品》定課',
        dabeizhou: '〈大悲咒〉定課',
        xinjing: '《心經》定課',
        merged: '三門合修定課'
      };
      document.getElementById('practiceTitleDisplay').textContent = practiceNames[AppState.currentPracticeKey] || '定課持誦';
      document.getElementById('targetMantraRepText').textContent = AppState.targetMantraRep;
      document.getElementById('currentMantraRepText').textContent = AppState.currentMantraRep;
      document.getElementById('targetBuddhaCountText').textContent = AppState.targetBuddhaCount > 0 ? AppState.targetBuddhaCount : '自由';
      document.getElementById('currentBuddhaCountText').textContent = AppState.currentBuddhaCount;

      updateScopeChipDisplay();
      updateReadingModeDisplay();
      initPracticePages();
    }

    function returnToHome() {
      AppState.currentView = 'home';
      document.getElementById('practiceView').classList.add('hidden');
      document.getElementById('homeView').classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function toggleReadingMode() {
      AppState.readingMode = AppState.readingMode === 'book' ? 'scroll' : 'book';
      SafeStorage.setItem('zen_reading_mode', AppState.readingMode);
      updateReadingModeDisplay();
      showToast('已切換為：' + (AppState.readingMode === 'book' ? '📖 單句居中翻頁' : '📜 卷軸連貫模式'));
    }

    function updateReadingModeDisplay() {
      const isBook = AppState.readingMode === 'book';
      const icon = document.getElementById('readingModeIcon');
      const text = document.getElementById('readingModeText');
      const bookContainer = document.getElementById('bookModeContainer');
      const scrollContainer = document.getElementById('scrollModeContainer');

      if (icon) icon.textContent = isBook ? '📖' : '📜';
      if (text) text.textContent = isBook ? '翻頁' : '卷軸';

      if (isBook) {
        bookContainer.classList.remove('hidden');
        scrollContainer.classList.add('hidden');
      } else {
        bookContainer.classList.add('hidden');
        scrollContainer.classList.remove('hidden');
      }
    }

    // 核心：弘一禪風「單句/精練段落居中」經本折頁拆解演算法
    function initPracticePages() {
      let sections = [];
      if (AppState.currentPracticeKey === 'merged') {
        const p1 = window.PRACTICES_DB.pumenpin.sections;
        const p2 = window.PRACTICES_DB.dabeizhou.sections;
        const p3 = window.PRACTICES_DB.xinjing.sections;
        sections = [
          p1.find(s => s.id === 'yangzhi_guanyin'),
          p1.find(s => s.id === 'kaijing'),
          p1.find(s => s.id === 'pumenpin_changhang'),
          p1.find(s => s.id === 'pumenpin_jisong'),
          p2.find(s => s.id === 'dabeizhou_84'),
          p3.find(s => s.id === 'xinjing_260'),
          p1.find(s => s.id === 'guanyinji'),
          p1.find(s => s.id === 'dabei_fayuan'),
          p1.find(s => s.id === 'shenghao_dabei'),
          p1.find(s => s.id === 'sanguiyi'),
          p1.find(s => s.id === 'huixiang')
        ].filter(Boolean);
      } else {
        const item = window.PRACTICES_DB[AppState.currentPracticeKey];
        sections = item ? [...item.sections] : [];
        if (AppState.currentPracticeKey === 'pumenpin' && AppState.pumenpinScope === 'jisong') {
          sections = sections.filter(s => s.id !== 'pumenpin_changhang');
        }
      }

      AppState.bookPagesList = [];

      sections.forEach(sec => {
        // 1. 楊枝淨水讚：2 頁 (3句一頁，弘一居中大字)
        if (sec.id.includes('yangzhi')) {
          AppState.bookPagesList.push(
            { id: sec.id + '_1', title: '【楊枝淨水讚】', desc: '淨水滌塵・性空八德', lines: sec.lines.slice(0, 3) },
            { id: sec.id + '_2', title: '【楊枝淨水讚】', desc: '火燄化紅蓮・歸命觀音', lines: sec.lines.slice(3) }
          );
          return;
        }

        // 2. 開經偈：純粹 1 頁居中
        if (sec.id.includes('kaijing')) {
          AppState.bookPagesList.push({
            id: sec.id,
            title: '【開經偈】',
            desc: '百千萬劫難遭遇・願解真實義',
            lines: sec.lines
          });
          return;
        }

        // 3. 大悲發願祈願文：啟白 1 頁，十大宏願每 2 句一頁 (5頁)，六向無畏願每 2 句一頁 (3頁)
        if (sec.id === 'dabei_fayuan') {
          const vows = sec.lines.filter(l => l.startsWith('南無大悲觀世音'));
          const six = sec.lines.filter(l => l.startsWith('我若向'));
          
          AppState.bookPagesList.push({
            id: sec.id + '_intro',
            title: '【大悲發願祈願文】',
            desc: '慈悲啟白・同發大願',
            lines: ['經云：若有善男子、善女人欲誦持者，於諸眾生起慈悲心，先當從我發如是願：']
          });

          for (let i = 0; i < vows.length; i += 2) {
            AppState.bookPagesList.push({
              id: sec.id + '_vow_' + (i/2 + 1),
              title: '【大悲發願祈願文】',
              desc: '十大宏願（' + (i+1) + '~' + (i+2) + '）',
              lines: vows.slice(i, i + 2)
            });
          }

          for (let i = 0; i < six.length; i += 2) {
            AppState.bookPagesList.push({
              id: sec.id + '_six_' + (i/2 + 1),
              title: '【大悲發願祈願文】',
              desc: '六向無畏願（' + (i+1) + '~' + (i+2) + '）',
              lines: six.slice(i, i + 2)
            });
          }
          return;
        }

        // 4. 觀音讚偈：每 2 句一頁
        if (sec.id === 'guanyinji') {
          AppState.bookPagesList.push(
            { id: sec.id + '_1', title: '【觀音讚偈】', desc: '三十二應・百千萬劫', lines: sec.lines.slice(0, 2) },
            { id: sec.id + '_2', title: '【觀音讚偈】', desc: '手內楊枝・度人舟', lines: sec.lines.slice(2, 4) }
          );
          if (sec.lines.length > 4) {
            AppState.bookPagesList.push({
              id: sec.id + '_3',
              title: '【觀音讚偈】',
              desc: '琉璃世界・大慈大悲',
              lines: sec.lines.slice(4)
            });
          }
          return;
        }

        // 5. 普門品・偈頌：每 2 首四句偈一頁 (2 句/4行一頁，居中氣勢磅礴)
        if (sec.id === 'pumenpin_jisong') {
          for (let i = 0; i < sec.lines.length; i += 2) {
            AppState.bookPagesList.push({
              id: sec.id + '_ji_' + (i/2 + 1),
              title: '【普門品・偈頌】',
              desc: '念彼觀音力（' + (i+1) + '~' + Math.min(i+2, sec.lines.length) + '）',
              lines: sec.lines.slice(i, i + 2)
            });
          }
          return;
        }

        // 6. 心經：每 2~3 段一頁，字字放光居中
        if (sec.id === 'xinjing_260') {
          for (let i = 0; i < sec.lines.length; i += 2) {
            AppState.bookPagesList.push({
              id: sec.id + '_x_' + (i/2 + 1),
              title: '【心經】',
              desc: '照見五蘊皆空・心無罣礙',
              lines: sec.lines.slice(i, i + 2)
            });
          }
          return;
        }

        // 7. 大悲咒：每 7~10 句一頁
        if (sec.id === 'dabeizhou_84') {
          const chunkSize = 14;
          for (let i = 0; i < sec.lines.length; i += chunkSize) {
            AppState.bookPagesList.push({
              id: sec.id + '_db_' + (i/chunkSize + 1),
              title: '【大悲咒】',
              desc: '陀羅尼神咒 (' + (i+1) + '~' + Math.min(i+chunkSize, sec.lines.length) + '句)',
              lines: sec.lines.slice(i, i + chunkSize)
            });
          }
          return;
        }

        // 8. 聖號 / 三皈依 / 迴向偈
        if (sec.id.includes('shenghao') || sec.id.includes('sanguiyi') || sec.id.includes('huixiang')) {
          for (let i = 0; i < sec.lines.length; i += 2) {
            AppState.bookPagesList.push({
              id: sec.id + '_sh_' + (i/2 + 1),
              title: sec.title,
              desc: sec.desc || '',
              lines: sec.lines.slice(i, i + 2)
            });
          }
          return;
        }

        // 9. 普門品長行：每 2~3 段一頁
        for (let i = 0; i < sec.lines.length; i += 3) {
          AppState.bookPagesList.push({
            id: sec.id + '_ch_' + (i/3 + 1),
            title: sec.title,
            desc: sec.desc || '',
            lines: sec.lines.slice(i, i + 3)
          });
        }
      });

      if (AppState.currentBookPageIdx >= AppState.bookPagesList.length) {
        AppState.currentBookPageIdx = 0;
      }

      renderBookPage('none');
      renderScrollContent(sections);
    }

    // 渲染經本翻頁 (居中、典雅、硃砂點綴)
    function renderBookPage(animDirection = 'left') {
      const list = AppState.bookPagesList;
      if (!list || list.length === 0) return;

      const idx = AppState.currentBookPageIdx;
      const page = list[idx];
      const total = list.length;

      document.getElementById('bookCurrentPageNum').textContent = idx + 1;
      document.getElementById('bookTotalPageNum').textContent = total;
      document.getElementById('bookPageTitle').textContent = page.title;
      document.getElementById('bookPageSubtitle').textContent = page.desc ? page.desc : '';

      const contentEl = document.getElementById('bookPageContent');
      let html = '';

      page.lines.forEach(line => {
        const isFayuan = line.startsWith('南無大悲觀世音');
        const isSix = line.startsWith('我若向');
        const isJingyun = line.startsWith('經云：');

        if (isFayuan) {
          html += \`<div class="c-gold font-medium py-1 text-center"><span class="inline-block px-3 py-0.5 rounded-full bg-panel border border-zen">\${line}</span></div>\`;
        } else if (isSix) {
          html += \`<div class="c-emerald font-medium py-1 text-center"><span class="inline-block px-3 py-0.5 rounded-full bg-panel border border-zen">\${line}</span></div>\`;
        } else if (isJingyun) {
          html += \`<p class="text-xs sm:text-sm c-muted italic text-center mb-3">\${line}</p>\`;
        } else {
          html += \`<p class="py-1 leading-relaxed c-main">\${line}</p>\`;
        }
      });

      contentEl.innerHTML = html;

      // 翻頁微動效
      const card = document.getElementById('bookPageCard');
      card.classList.remove('page-turn-left', 'page-turn-right');
      void card.offsetWidth;
      if (animDirection === 'left') card.classList.add('page-turn-left');
      else if (animDirection === 'right') card.classList.add('page-turn-right');

      // 按鈕狀態
      const prevBtn = document.getElementById('bookPrevPageBtn');
      const nextBtn = document.getElementById('bookNextPageBtn');
      const nextText = document.getElementById('bookNextBtnText');

      prevBtn.disabled = idx === 0;
      if (idx === total - 1) {
        nextText.textContent = '圓滿迴向';
        nextBtn.onclick = finishPracticeAndCheckIn;
      } else {
        nextText.textContent = '下一頁';
        nextBtn.onclick = nextBookPage;
      }
    }

    function prevBookPage() {
      if (AppState.currentBookPageIdx > 0) {
        AppState.currentBookPageIdx--;
        renderBookPage('right');
      }
    }

    function nextBookPage() {
      if (AppState.currentBookPageIdx < AppState.bookPagesList.length - 1) {
        AppState.currentBookPageIdx++;
        renderBookPage('left');
      }
    }

    // 觸控手勢滑動與點擊翻頁
    function setupKeyAndTouchListeners() {
      const strikeBtn = document.getElementById('strikeWoodfishBtn');
      if (strikeBtn) strikeBtn.addEventListener('click', strikeWoodfish);

      const incBtn = document.getElementById('incrementRepBtn');
      if (incBtn) incBtn.addEventListener('click', incrementPracticeCount);

      // 空白鍵與左右方向鍵
      window.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        if (e.code === 'Space' && AppState.spacebarWoodfish) {
          e.preventDefault();
          strikeWoodfish();
        } else if (e.code === 'ArrowRight' && AppState.currentView === 'practice' && AppState.readingMode === 'book') {
          nextBookPage();
        } else if (e.code === 'ArrowLeft' && AppState.currentView === 'practice' && AppState.readingMode === 'book') {
          prevBookPage();
        }
      });

      // 手機滑動手勢與兩側點擊翻頁
      const cardWrap = document.getElementById('bookPageContentWrap');
      let touchStartX = 0;
      let touchStartY = 0;

      cardWrap.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      cardWrap.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        // 滑動翻頁
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
          if (diffX < 0) nextBookPage();
          else prevBookPage();
          return;
        }

        // 若無明顯滑動，則判定為點擊翻頁 (點左側35%翻上頁，點右側35%翻下頁，點中央敲木魚)
        if (Math.abs(diffX) < 15 && Math.abs(diffY) < 15) {
          const rect = cardWrap.getBoundingClientRect();
          const clickX = e.changedTouches[0].clientX - rect.left;
          const ratio = clickX / rect.width;
          if (ratio < 0.35) {
            prevBookPage();
          } else if (ratio > 0.65) {
            nextBookPage();
          } else {
            strikeWoodfish();
          }
        }
      }, { passive: true });
    }

    // 渲染卷軸模式
    function renderScrollContent(sections) {
      const container = document.getElementById('scriptureContentContainer');
      const navContainer = document.getElementById('sectionNavPills');
      if (!container || !navContainer) return;
      container.innerHTML = '';
      navContainer.innerHTML = '';

      sections.forEach((sec, idx) => {
        const secAnchorId = 'sec_' + sec.id + '_' + idx;

        const pillBtn = document.createElement('button');
        pillBtn.className = 'px-3 py-1 rounded-full border border-zen bg-panel c-sub hover:border-zen-focus hover:c-gold whitespace-nowrap flex-shrink-0 transition-all text-xs';
        pillBtn.textContent = sec.title.replace(/[【】]/g, '');
        pillBtn.onclick = () => {
          const target = document.getElementById(secAnchorId);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };
        navContainer.appendChild(pillBtn);

        const secDiv = document.createElement('section');
        secDiv.id = secAnchorId;
        secDiv.className = 'pt-3 border-b border-zen/50 pb-6';

        let innerHtml = \`
          <div class="flex items-center gap-2 mb-3">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            <h3 class="text-base sm:text-lg font-bold c-gold tracking-wider">\${sec.title}</h3>
            \${sec.desc ? \`<span class="text-xs c-muted hidden sm:inline">(\${sec.desc})</span>\` : ''}
          </div>
          <div class="space-y-3 leading-loose c-main tracking-wide">
        \`;

        sec.lines.forEach(line => {
          const isFayuan = line.startsWith('南無大悲觀世音');
          const isSix = line.startsWith('我若向');
          const isJingyun = line.startsWith('經云：');

          if (isFayuan) {
            innerHtml += \`<p class="c-gold font-medium pl-3 border-l-2 border-amber-500/40 my-1">\${line}</p>\`;
          } else if (isSix) {
            innerHtml += \`<p class="c-emerald font-medium pl-3 border-l-2 border-emerald-500/40 my-1">\${line}</p>\`;
          } else if (isJingyun) {
            innerHtml += \`<p class="text-xs sm:text-sm c-muted italic mb-2">\${line}</p>\`;
          } else {
            innerHtml += \`<p class="my-1.5">\${line}</p>\`;
          }
        });

        innerHtml += '</div>';
        secDiv.innerHTML = innerHtml;
        container.appendChild(secDiv);
      });
    }

    // 10. 木魚與計數
    function strikeWoodfish() {
      ZenAudio.playWoodfish();
      const btn = document.getElementById('strikeWoodfishBtn');
      if (btn) {
        btn.classList.add('striking');
        setTimeout(() => btn.classList.remove('striking'), 150);
      }
    }

    function incrementPracticeCount() {
      if (AppState.currentMantraRep < AppState.targetMantraRep) {
        AppState.currentMantraRep++;
        document.getElementById('currentMantraRepText').textContent = AppState.currentMantraRep;
        ZenAudio.playWoodfish();

        if (AppState.currentMantraRep >= AppState.targetMantraRep) {
          ZenAudio.playChime();
          showToast('🎉 經咒持誦圓滿達標（' + AppState.targetMantraRep + ' 遍）！');
        }
      } else {
        AppState.currentBuddhaCount++;
        document.getElementById('currentBuddhaCountText').textContent = AppState.currentBuddhaCount;
        ZenAudio.playWoodfish();

        if (AppState.targetBuddhaCount > 0 && AppState.currentBuddhaCount === AppState.targetBuddhaCount) {
          ZenAudio.playChime();
          showToast('🙏 觀音聖號已滿 ' + AppState.targetBuddhaCount + ' 聲，發願圓滿！');
        }
      }
    }

    // 11. 外觀主題與文字色彩即時連動
    function setTheme(theme, notify = true) {
      AppState.theme = theme;
      SafeStorage.setItem('zen_theme', theme);
      document.documentElement.setAttribute('data-theme', theme);

      ['themeBtn_dark', 'themeBtn_stone', 'themeBtn_celadon'].forEach(id => {
        const b = document.getElementById(id);
        if (b) b.classList.remove('border-amber-500', 'font-bold');
      });
      const activeBtn = document.getElementById('themeBtn_' + theme);
      if (activeBtn) activeBtn.classList.add('border-amber-500', 'font-bold');

      if (notify) {
        showToast('已切換主題：' + (theme === 'dark' ? '曜石夜修' : theme === 'stone' ? '暖沙微陽 (宣紙焦墨)' : '青瓷冷茶'));
      }
    }

    // 12. 日課打卡
    function getTodayString() {
      const d = new Date();
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    function getPracticeLogs() {
      try {
        const raw = SafeStorage.getItem('zen_practice_logs');
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    }

    function savePracticeLogForToday(details) {
      const logs = getPracticeLogs();
      const today = getTodayString();
      logs[today] = {
        date: today,
        timestamp: Date.now(),
        practice: AppState.currentPracticeKey,
        mantraRep: AppState.currentMantraRep || 1,
        buddhaCount: AppState.currentBuddhaCount || 10,
        ...details
      };
      SafeStorage.setItem('zen_practice_logs', JSON.stringify(logs));
      updateDailyCheckStatus();
    }

    function finishPracticeAndCheckIn() {
      ZenAudio.playChime();
      savePracticeLogForToday({ completed: true });
      showToast('🙏 今日定課已圓滿打卡！功德迴向法界');
      setTimeout(() => openDailyRecords(), 500);
    }

    function manualCheckInToday() {
      savePracticeLogForToday({ manual: true, completed: true });
      ZenAudio.playChime();
      renderCalendar();
      showToast('🙏 今日定課打卡成功！');
    }

    function updateDailyCheckStatus() {
      const logs = getPracticeLogs();
      const today = getTodayString();
      const isChecked = !!logs[today];
      const indicator = document.getElementById('dailyCheckIndicator');
      if (indicator) {
        if (isChecked) indicator.classList.remove('hidden');
        else indicator.classList.add('hidden');
      }

      const statusText = document.getElementById('todayStatusText');
      const checkInBtn = document.getElementById('btnCheckInNow');
      if (statusText) {
        if (isChecked) {
          statusText.textContent = '今日已圓滿打卡（合掌祈福 🙏）';
          statusText.className = 'text-sm font-bold c-emerald';
          if (checkInBtn) checkInBtn.classList.add('hidden');
        } else {
          statusText.textContent = '今日尚未打卡';
          statusText.className = 'text-sm font-bold c-gold';
          if (checkInBtn) checkInBtn.classList.remove('hidden');
        }
      }
    }

    function openDailyRecords() {
      updateDailyCheckStatus();
      renderCalendar();
      document.getElementById('dailyRecordsModal').classList.remove('hidden');
    }

    function closeDailyRecords() {
      document.getElementById('dailyRecordsModal').classList.add('hidden');
    }

    function renderCalendar() {
      const grid = document.getElementById('calendarDaysGrid');
      if (!grid) return;
      grid.innerHTML = '';

      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      document.getElementById('calendarMonthTitle').textContent = year + '年 ' + (month + 1) + '月';

      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const logs = getPracticeLogs();
      const todayDate = now.getDate();

      for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'h-9 rounded-lg bg-panel/30 opacity-20';
        grid.appendChild(emptyCell);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
        const hasLog = !!logs[dateStr];
        const isToday = day === todayDate;

        const cell = document.createElement('div');
        cell.className = \`h-9 rounded-lg p-1 flex flex-col items-center justify-between border transition-all text-[11px] \${
          isToday ? 'border-amber-500 bg-amber-500/10' : 'border-zen bg-panel'
        } \${hasLog ? 'border-emerald-500/60 bg-emerald-950/20' : ''}\`;

        cell.innerHTML = \`
          <span class="\${isToday ? 'font-bold c-gold' : 'c-muted'}">\${day}</span>
          <span>\${hasLog ? '🙏' : ''}</span>
        \`;
        grid.appendChild(cell);
      }
    }

    // 13. 迴向小卡 Canvas
    function generateDedicationCardImage() {
      const canvas = document.getElementById('dedicationCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const author = document.getElementById('dedicateNameInput').value.trim() || '佛弟子';
      const target = document.getElementById('dedicateTargetInput').value.trim() || '法界眾生、闔家眷屬';

      ctx.fillStyle = AppState.theme === 'stone' ? '#F4EDE2' : '#14171A';
      ctx.fillRect(0, 0, 800, 500);

      ctx.strokeStyle = AppState.theme === 'stone' ? '#966718' : '#D4AF37';
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 740, 440);

      ctx.strokeStyle = AppState.theme === 'stone' ? 'rgba(150, 103, 24, 0.35)' : 'rgba(212, 175, 55, 0.35)';
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, 720, 420);

      ctx.fillStyle = AppState.theme === 'stone' ? '#966718' : '#D4AF37';
      ctx.font = 'bold 26px "Noto Serif TC", serif';
      ctx.textAlign = 'center';
      ctx.fillText('觀音法門定課・修持迴向', 400, 95);

      ctx.fillStyle = AppState.theme === 'stone' ? '#24201B' : '#E8DFD5';
      ctx.font = '18px "Noto Serif TC", serif';
      ctx.fillText('迴向功德主：' + author + '    ｜    祈福對象：' + target, 400, 145);

      ctx.fillStyle = AppState.theme === 'stone' ? '#966718' : '#D4AF37';
      ctx.font = '22px "Noto Serif TC", serif';
      ctx.fillText('願消三障諸煩惱　願得智慧真明了', 400, 220);
      ctx.fillText('普願罪障悉消除　世世常行菩薩道', 400, 265);

      ctx.fillStyle = AppState.theme === 'stone' ? '#544A3D' : '#9DB4A9';
      ctx.font = '16px "Noto Serif TC", serif';
      ctx.fillText('千處祈求千處現　苦海常作度人舟', 400, 335);
      ctx.fillText('南無大悲觀世音菩薩摩訶薩', 400, 370);

      ctx.fillStyle = AppState.theme === 'stone' ? '#867866' : '#7E766B';
      ctx.font = '13px sans-serif';
      ctx.fillText('法鼓山觀音法門定課系統敬製 ・ ' + getTodayString(), 400, 430);

      try {
        const link = document.createElement('a');
        link.download = '觀音法門定課迴向卡_' + getTodayString() + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('迴向卡圖檔已順利下載！');
      } catch (e) {
        showToast('圖片生成完畢');
      }
    }

    function copyDedicationText() {
      const author = document.getElementById('dedicateNameInput').value.trim() || '佛弟子';
      const target = document.getElementById('dedicateTargetInput').value.trim() || '法界眾生、闔家眷屬';
      const text = \`【觀音法門定課・修持迴向】\\n功德主：\${author}\\n祈福迴向：\${target}\\n\\n願消三障諸煩惱，願得智慧真明了；\\n普願罪障悉消除，世世常行菩薩道。\\n\\n千處祈求千處現，苦海常作度人舟。\\n南無大悲觀世音菩薩！\\n（法鼓山觀音法門定課系統 \${getTodayString()}）\`;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          showToast('已複製迴向文至剪貼簿！');
        }).catch(() => {});
      }
    }

    // 14. 設定選單控制
    function openSettings() {
      document.getElementById('settingsModal').classList.remove('hidden');
    }

    function closeSettings() {
      document.getElementById('settingsModal').classList.add('hidden');
    }

    function toggleSetting(key, val) {
      if (key === 'spacebarWoodfish') AppState.spacebarWoodfish = val;
    }

    // 15. 自訂 Toast
    let toastTimer = null;
    function showToast(msg, icon = '🙏') {
      const toast = document.getElementById('toastNotification');
      const msgEl = document.getElementById('toastMessage');
      const iconEl = document.getElementById('toastIcon');
      if (!toast || !msgEl) return;

      msgEl.textContent = msg;
      if (iconEl) iconEl.textContent = icon;

      toast.classList.remove('opacity-0', '-translate-y-2');
      toast.classList.add('opacity-100', 'translate-y-0');

      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', '-translate-y-2');
      }, 2300);
    }

    // 頂部事件綁定
    document.getElementById('brandLogoHomeBtn').addEventListener('click', returnToHome);
    document.getElementById('openTypographyBtn').addEventListener('click', openTypographyModal);
    document.getElementById('openDailyRecordsBtn').addEventListener('click', openDailyRecords);
    document.getElementById('openSettingsBtn').addEventListener('click', openSettings);
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
console.log('Successfully built v1.2 index.html with Zen Centered Pages, Dynamic Theme Text Colors, and Typography Controls!');
