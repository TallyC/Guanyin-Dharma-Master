const fs = require('fs');
const path = require('path');

// 讀取已經萃取好的純淨經文資料

const audioSamples = require(path.join(__dirname, 'data', 'audio_samples.js'));

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
            <span class="text-[10px] font-sans px-1.5 py-0.2 rounded border border-zen c-gold font-medium">v1.3</span>
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

      <!-- 底部固定禪意法器工具列 (木魚、引磬、大磬、自動節拍、+1遍數、圓滿打卡) -->
      <div class="fixed bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-2xl zen-card rounded-full px-2.5 sm:px-5 py-2 flex items-center justify-between border border-zen shadow-2xl bg-panel backdrop-blur-md">
        
        <!-- 法器群組：木魚、引磬、大磬 -->
        <div class="flex items-center gap-1 sm:gap-1.5">
          <!-- 木魚 -->
          <button id="strikeWoodfishBtn" onclick="strikeWoodfish()" class="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-panel-elevated border border-zen hover:border-amber-500 c-gold text-xs font-medium transition-all active:scale-90" title="真品古木木魚 (快速鍵: 空白鍵)">
            <span class="text-sm sm:text-base">🪵</span>
            <span class="text-[11px] sm:text-xs">木魚</span>
          </button>

          <!-- 引磬 -->
          <button id="strikeYinqingBtn" onclick="strikeYinqing()" class="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-panel-elevated border border-zen hover:border-amber-500 c-gold text-xs font-medium transition-all active:scale-90" title="法鼓山引磬 (快速鍵: Q)">
            <span class="text-sm sm:text-base">🔔</span>
            <span class="text-[11px] sm:text-xs">引磬</span>
          </button>

          <!-- 大磬 -->
          <button id="strikeDaqingBtn" onclick="strikeDaqing()" class="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-panel-elevated border border-zen hover:border-amber-500 c-gold text-xs font-medium transition-all active:scale-90" title="法鼓山青銅大磬 (快速鍵: B)">
            <span class="text-sm sm:text-base">🥣</span>
            <span class="text-[11px] sm:text-xs">大磬</span>
          </button>

          <!-- 自動木魚節拍 -->
          <button id="autoMuyuBtn" onclick="toggleAutoMuyu()" class="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-panel-elevated border border-zen hover:border-amber-500 c-muted text-[11px] font-medium transition-all" title="自動木魚伴奏 (45 BPM)">
            <span>⏱️</span>
            <span>常速</span>
          </button>
        </div>

        <!-- 右側操作：+1 遍數與打卡 -->
        <div class="flex items-center gap-1.5 sm:gap-2">
          <button id="incrementRepBtn" class="flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm active:scale-95 transition-all shadow-md">
            <span>+1 遍/聲</span>
          </button>

          <button onclick="finishPracticeAndCheckIn()" class="px-3 sm:px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm transition-all shadow flex items-center gap-1">
            <span>🙏</span>
            <span class="hidden sm:inline">圓滿打卡</span>
            <span class="sm:hidden">圓滿</span>
          </button>
        </div>

      </div>

    </div>

  </main>

  <!-- ==================== 彈窗 0：法鼓山官方念誦影音伴誦窗 (DDM YOUTUBE PLAYER) ==================== -->
  <div id="ddmPlayerModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 modal-backdrop hidden">
    <div class="zen-card w-full max-w-2xl rounded-2xl p-4 sm:p-6 border border-zen shadow-2xl relative flex flex-col">
      
      <div class="flex items-center justify-between mb-3 pb-2.5 border-b border-zen">
        <div class="flex items-center gap-2">
          <span class="text-amber-500 text-lg">🎬</span>
          <div>
            <h3 id="ddmPlayerTitle" class="text-sm sm:text-base font-bold c-main">法鼓山僧團官方念誦影音</h3>
            <p class="text-[11px] c-muted">跟隨法鼓山僧團梵唄韻律・大磬木魚同步讀誦</p>
          </div>
        </div>
        <button onclick="closeDdmPlayer()" class="c-muted hover:c-main text-lg font-bold p-1">✕</button>
      </div>

      <!-- 響應式 16:9 YouTube 內嵌播放器 -->
      <div class="w-full aspect-video rounded-xl overflow-hidden bg-black/70 shadow-inner relative border border-zen/50">
        <iframe id="ddmIframe" class="w-full h-full" src="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>

      <div class="mt-3.5 flex items-center justify-between text-xs">
        <span class="c-muted text-[11px]">✨ 支援畫中畫與背景跟誦，點擊右上角或下方返回經本</span>
        <button onclick="closeDdmPlayer()" class="px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all">
          返回經文讀誦
        </button>
      </div>

    </div>
  </div>

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

    // 3.5. 真品法鼓山大磬、引磬與木魚音訊樣本 (Base64)
    const AUDIO_SAMPLES = {"muyu":"data:audio/mp3;base64,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q5v4j/Yo66SeakGmXDh4sNpOIXhpqSq9P//////////////////////////////////////////0HuIGhokkkkk5WRPzLNB6eMEFMemM7/zX2XLsq1i27wZlWqm+A7mlhwWhlboyjiv684uEgph8a3uWTmEniUlx3o6++erWk215d0Ca6xDjjPXYn1lfmm/M1u7rF6O5lpi+sz9u7cntzpzPmcowFEnlftUqac3VnvzP78KKbli5Wf/6skCzTI4ABONFVeHsWux/KGrfPexdT6DdUee962INm2o8971tDGACMiNJNxtYktf0FbqJTGoJK4vMYhaxjafTehe31fOoLKiILVd0/huEGx7RrubbZ7bLARWI0J4c0MuSncpU5EcvSaDDjWtA8CHCtqC+XClw4MCfYXtPHYZoveWxaS0j2m/H5kvItdKtWHCspSgzLNcx7clpAYig61zTvokLYAIyI0k3G1iS1/PvXOpTFYHC4vMYhaxjafTehGb6vmrayoiVsu4v4bJBse0a7m1wm2FtkIdiNI8P5TnUf7llORXL6iy5jPrU3Eft0KlYykXMioeIe9baedcuMXETdrSWkg63iOc8NqbQ/wXKWodgZ71DnW1z96/3f4xo4WbiyAu/9bykABEREkkkkwcJpFqcZ6nblDWNTBJCtdYd7s/h5aGgltu2miQPUJaY1vcTlJ6sBkoZKqxiXYQE2EtMtXnrQkDk8lZXqv5InW0igmzd2Xdumexelglt5HLbPAvmNxCf1RbVEl4tkf3x+/bE/31L7vu138yjN/mfv////////////////////////////////////////////////////////////////////////8y0ACIREkpJIwTE0jXMc3TdyhrGpg/DVdYd7s/irg0GbdbTiQdUJkxre5cdPXANKKlVYxLugV4zQmV5NgEgQlyGyZqnuODs9cdgxcv9l3fTFrH0OBtt7n6fkzH1L/MbV/m1e2YstladmU7ZuzT+fpENBdgvx91r1uSx1CL7UEDUzSSSSxhd7lswdKFNpp/qEdEg/dYY80ett9Il4fCqav/6skAUcaaABXAtUnnsYtp7yEpfPYxdEh0XS+w966pJJCl9h711g9mYkOP5ZcHPDxXo/S6VzggGVYc1bEO1WDlJuXhQXbnI9jSO9HqDZxKql7O4VbSPXmJT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","daqing":"data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYyLjE5LjEwMAAAAAAAAAAAAAAA//OAwAAAAAAAAAAAAEluZm8AAAAPAAAAiAAAb9UABQcLDQ4SFBYaHB0hIycpKi4wMjY4OT0/Q0VGSkxOUlRVWVtdYWNmaGpucHF1d3l9f4KEhoqMjpGTlZmbnKCipqiqra+xtbe4vL7CxMbJy83R09XY2tzg4uXn6e3v8fT2+Pz+AAAAAExhdmM2Mi4zNQAAAAAAAAAAAAAAACQCSQAAAAAAAG/VhkDqVwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/zgMQAAAADSAAAAAAtG1dDAwCLWPKj2gDe5TNdcnfRhipFSOpAaYjBJS1tr8XqRiWWSA8B4LB7AjB2YABgnh8AAAIIQewH4/18ve+9+xlSmfg3PwaHKeft79jK/4rl6b979nL3w+2MqTc/Buf2MqX3/ve+99wzebn4N3wxkpn4N3iAIg+XPkPB8P/PlHA//9n/EBwMZAosPiAIggXD6iDDBAEDAFBAEyhgsrBg6GJimLo6Z5uHMf+YpgmIRJOm1bNCi//zIkhzFMETiGezdEf/84LEwyRaSVABWFgA//8yFC0lC8xhC80CrA+A2o7mYT95mIoQtOcAyJP420hg3cPK3h/jQziIAwcDYGCM3yb43OlA5kUgy1Gn///lGb+VZ80ZQ8zTGsx1I0xxD0EgB////7vMxRzWfLWXveEF0YlBglgZhkKAhqMMAYMfRR//////sW72fYxSxeKGNoGgoEDBkHzCULzCsCzDQEE31xmBQDf////////zlS9T9u25f+HdF4HkMDAYMHAaMFACMHwDGAABQIGDYFo16CoApx/////zgsT1VmQWQb2d6AD///////4Yf3WHJfnnnT9zp+skWeqoXEMFwHWGBwCGC4GpxpgA4GxEABehPNHhXn/////////////+fdW//Cx/9///KxvmvdeH5EYEAYYEAMhQwgv4rht1VFqF83fn71Ss1h3KSokVYIIYSiY3ttdtmQku8qZJHDNCMkIVfYOQBojihYYmc6xeFdgmiEMhgp9TiJu0kEzqutHikQxk4p/ixUE+Jt8LIA0QdjFh3nts/gJU238jQKEi5iDJRg6J9Ja+8HRJ//OCxF9DxAK9n5nIApxk7GcZJQEwWXPM5VHLJTIoxR4ZVqJ/YlUtc4xZZjlvjjLcrd9ucNyrLm8/xiDfUvef/MIS1t/ou9U5Sy2q5Lg1JdB0zR/Zf6M7v4SmYpof5T5QbK6W1OYfM5V5yIt5flMMzOVimo/zod5U1q3zPP72vxx1hcpLNTmeOdPy5UzsX8NW5VA35ZUtm5RRHe47v/3byyz7j9S5+9Va3dz3f/WG87OV27jRZWL1um7vLV+VAAltulONiVGUFhgBdcBu1KXJHDT/84LEFC4KJpAf2tAAcSaJEXgEBVrNlsU9KUERsuwcpQseJ9am5HFFZWRQ6Fi4H0INSK05NJLU3k/3BZ6lkmDALlqa0suiVhecVTWc6NwByWvwplLnGgl2nKfp6odg7C9YptRm/Grf52fzud/+Z3sP//x5zDm735d7lrv//9y1+v5zX9z13mWXbiTxaHRedGXpYVVEgB0qJFRqTERRVzsAtWysUQSexiz7gYERsUvi0UZVAO/5pPxPtVQyWTAIA3be1937WkNAI7SBCIVJWGDQo//zgsQfL9IKeBTmDSz201mSuV9GGA4bHAoRbBYgqkW87sJgSABwAjQwRtAAIOYAswWCmhx58Xch9CcTfTzBwmcky3QLqgbbYmmP9bUqkTiQxepGCSOXM6fl7X4jSqqEGUFtmrQ/hGcqC1jjdPNcAq/b3n189a5+umcQ10Fbj6+t8fvesX0pJCqSrACoChs6ChXBOXkzq7FKIhZr3rOSqT8kcxSZslkDoRcJU01GFVWcAQiWRF/z4eVcL4LoQS01Vxin5vogxhwBKHAwMAd20NB4//OCxCMwGX5sBNdydAJgJIAxg2JJgpkZhOJIcJCQYUABqLJ1oJVIBAgDVNyU+DKgFRwCERpDWSnTLJFQfkwIwYUCZijrnMQhNVisxNxsLmt2S9hl/mpK0xiDmiNydVrbjQYHIw1G3UrWIGl0uiHfrVu9mrlfn/2pf3yDwSeG6CpOSFVkRUJKQTNCxh8VUt9xgJC4ecNF12kKG1kd2Fsjdnr23PJDSbCSouLKADttu67q7HvMTImzyhgryVp8RlwUf0VJG0uLyV1YfayFwY4C8Dn/84LEJiNZmowe2xUo6atRxmXZ5S9wKOHRQaGjxgUqz2hxg66lYNhUdH4Kn0sYSFQuiqXTSWLuZ/sBqWJ2XZ7WS55Eah6t75csL3uPCpxZwxHjZYe0dONyFWGBXQ7sjmsamNEDD9YW6Hgl6anCdZIpW/PJrbUCprycovywM410YAiIBDzB2trsMGlPbqYHDsSAoCBTLkvU9rLxmFAsdFqRpoKIHlvJLCIjK2YvQrGYAAwGBxo4CEIMfiPOhAkEDIFQwUJQJ10JhNw4RMinQqO2Fv/zgsRcKbF6dBTXHngj1TR4xiresyvKtYbe9sMxwQdKWlrlrr8ZpDfeJj/wiBMohInEJdBwBixyLABjpweVkV2Dd+T7mpOS1qhzZ1I7xjatuvmesT2Z1aFICAQn+/+D640BgINDsqeaxS0giBTdBZUMjlvJVNTMBEIGYNMqUs8iOWFrCphYhpJ0MZGjSbVflp9VPRh/JTDJAFCBbrk4eGqzwKkwS1UCIb6r8gqS//fRTskZrRkdbHOeZkd6MrVE7PrbUWNoyJB5dQHVi22qJhJA//OCxHkhmiaZftoLRA50ZoEbnGXO0Pahxz0KCAAuNtyC87UtMkRV9QdRQc15PccRDVc9WR0S1TcGOrE9S0sscIPEY2lAoNYhiWWnIiz/PeYYIDeChwq25uG3FgQmDIejd5rgNwFiI6vq6Vy2EVFQ0I2YTD1/nRcAyx/3mK3Y/PcwSjeXSNfh0jLLN8djJ9eHU0UVmsPj5A2MhO7FPhoZehEceFnTAtIeovMtZ6Wsf3dNqkxBTUUzLjEwMSAoYiAH/+MJpsvpDQ3oJgSWuI09Iwz/84LEtiXCKn1W2wdIaxONp4IE61E94mxBlLxM9BAeML3AKCJQdDV+YP5YzjkohsqFY2gAQqDF/0tSch8hAwgAK+0IY9fml+uNIf/r0U/dQjCkDYiNjKFADwckgnmwyBw5A5ZJoLahgwMiR7CR5ZkJPIICjxVhNJ0YUSRmFjPFcINZqVfMWHAA1sKadJ1lD52TTqJ0KZVMQU1FMy4xMDEgKGJldArNRN4nIskxCKcCAmuMvM11QUtkYUCOcqCsAh1QuBgPMOdALgEhqlcEBaaepf/zgsTXJtlCeLTXEnxiTCs+DAFgF/7byrtYuUAxUDQLWHyA5ADEQ08k82OKo6UzbKFPNTOgBQRy5BD1anjcUYhP2q+VSdfOzGc6V6lYI9FMpFhP4YyveNarTqRoVq8mS59+Eq3F0r6cPBkhSQoSsOOA5auUFanNJHBK49EI0CDRQPQ4VaCHWGnEWRflFVx6mAWUDFERqkygaBSJChZi+eSJjcWlFAFA0AhwEQaYRrm45guDAgAkwJBZSoQgEYBgEW/AgLGEIompHZmjYpmIADBg//OCxPEtSfpoDO7G9DahEZd9ojFlM0ExgwCZgqVRgYG5dgDBE+ak2lpViHgH+QmQlMhSCf8d6sCy+USmZa6uRsrfyGV44T7zUkpeRhimRNGjdStB1692igmP40s+CGEiiBxBgjnZiWI8zOpRNDkZSskhSNYSRlUps+81dyWYze6+flnotb9CUSanZNFvtRNRAihiPJHOaBEkQy5Aomw41KpVo8jmk0JAOYWGisO5jU1NGxiMADA0azUtMjBcE1eI+u8/ACAlGgEAmYQiMasa4ZH/84LE/zOzQlwA7gUsY4GCwKpMqgnZZOy9MFMtyTGsQeWZAwKUr8ajEi0BRDIQzc31Y9AoWCSiA39xqPZEnveeMy23SSWM2Lr/XXbUYlT8WYtUnseQxV1vRBLCMzOlXNkKrFhynd6OxsjHZbyIYyPkOVru0615iHmVVREbNsSuTZCtaHMRqr/Xkz87zXW9a/edFRt1ZRv+7AZxqqLNhokAgdAxAwwhQIdCciCwlAYs3dFQAHgpOnhzDCIFgKLAYNjS0FgiCwAhwTmMgXncY5BmKv/zgsT0L/vGZATuhPVgiAIyAkaWm1qCWnMZXgQAEYMm6KBQW4Ggkay1JXEssg4WwYAICEhL5C0W0CmKAvqacoCCZU60t6S7aT8uKCPYpFKqUCuDJwqHlojCiIN4WRAeCwDGUvqcKBvUgasuCyhQk2kxJlz+qprlrbzbtlSrOUtPp53K9L+n+Z2Y30ntblyhlnjUn0uKS7xWUxe5w/PTyyQBlCeEvkyCdMDCpAoCs0HgEQBJFJEmCIwGwpkmDYDMESdJgUh7bxgACjCMeTSDjzH0//OCxPgxu0ZcAOvHSFUwUBwDAGmo2SG3NbvBLM0ajAotzOYOjAcECIKXNcFKl0iqAY0CSFJd1p6pqAuK0JtXnlFJK7rQaPvRr7uydEkvDkMcPLNNV2SXFjVmE1z369O3+mX6RnalbBSFKZBJl05kRSE+hVVlqyKxd0vV2qmrnVq2ror07p+jt7F7X27H/+ia/qb5FMGZwIACoioT8mFgWgQDSEFTGeYDC0UQ4CAUJKexgaA5g+DAgSsx514wKEkAAoYigkLBiMAGFQeMFQuMAhD/84LE9S+T4mQU6wVpTFVADPqgwMocLYwmgFzAnAaHgB3XLMlwgUBaDAEwYAKYBQCJgUC9hjxAJB2BQRIcAkWnT7CwA5gDAmysIA+IgTjAbAhBwDykSUDRmZdlPNL5t1LWBvWu1h6PLrwLmiFI1VGDtiXmUACO0pi16WzzrRd0RwAeHaapLIpFJPDEbj8YjEoyf6pPbpZiRYPxY4hVPpSDpGoonGw4dHmA6NkP4FpEeWD4eSjNZyDXUk9RPAvvZBZ+YLDRkoo4tEGSzUOOhLiE5P/zgsT6SQv+RAjvkN35FEZUxOfSipZLKe5iNMKr5XQvA0pyKXgwmrVyyYE9whpPzBH1tSkRPSrVAlRi/whGwviYEgcYcNqYEAIksGB4TAcHAeYVg+YgEofcN6ZMAUYFhaYzCSYGgCAgDHQPDAsMFwFMjAaNIEXoxzgPBoAMOApTOCAKy4icwYCO0kuCKgcAUKMy9gRTAtBUWUrlApfAFAIMA0DMwGAGhEAoAQCRYBovKi2CQEWJwBGIrShcACFKLtrTudFWUwSnYqxwlzJKp3p4//OCxJlJpBZIFO+S3K0m7N9NPg29Zw0GJ6LSizF5O/8vpo8/8qppVMOjOSuWvMiJc5skfSKc1iUqYggPtnIspRCxzVUoHkEWtiIXb8T3nIopGC7NPWagas5NFNFsrM7eyjs37eMbLfikYQ2NOfBiM91lLF7WajSFdROLnTR5KPaV6yNrpIXqQ6cYxih6JuaNQgJ06/qSKSqU3SVrxhWBIOClAEYMp0lwxcwEAsRgQX6DAJMGwYOpS9DCeDAFMAwWFgGQStaQpIQqMERdNRORMPD/84LENjRCclQA7g0scSwDSHpIAEQqstaTEQcAA8FRhMBxrwIYyEiEbMHOa64xkGJxEDkXhSS9n6RolUHz9LGHlwfpbr+VrErbC/LmPg2sXZi0GOPNWs2aOpSvs9kurWjDAxBF9vvPPfHUdT/+5+M2ry9h483Ofd3X2i9z7G5nYrazLf+UAViFamMBdbjDFmYcDYYEo0NioRWZWCVzw/YMvFDiL+tT/U8QYuBAGIQAGBUlc5dZBhgKVCMpeYcRpyy9AQHruFRCNBZusw5QEA5ES//zgsQpMQvaWArjx000cTgWJgcLTBIBgibrxRt4hHAIEV5GdA2AAIqOOUL+Nu94sMU5g4gwJDClBtBGEGs1VkiTLeWjGwuK63hhSStR6dJKzoKTTZTzFS4bmiyvss0Sl9vpY9s+s9kKdNyEkqBC4UWUT5m9yEGQKNYtzmhTSGCvDW/2vmXSSFY5WTeN8O+f2I2ZfMr5/pXmacIjzdc6R/unKInEEA/CbaoV4bCAPToFAGHTYFgmQDKXylaQyBJgMRhqsnJg8ASsa/CsB2jqZr+I//OCxCguSe5cCu6S7UCxEEhl1PRhwLQgAkDAQ+bF70tbC+jkXTQ+RYWAiEAUrc14NWTsDjkXHiCXss2MA4Jhm9WjmWdOOlrC9OG1WjS7Q4N9RpSS6ISbh7StqbvTzqQvLpjyrY6rJvuu8+wlW2n0RfIk6e/nVY90az36eO527WB8E33fPppaxiU+eykAzOgluT69f7lnfY7unhT7W+FVECT8GBAEpPFwRGXaLzKl1xyRpYmCoFnCIMEQxpcgkAVvs7a0WxL5A4RTYMOzRQFyIK3/84LEMiqD3mAM6kVk7mTy2Yl8+3B31UACW5iICRZQoAWBmsUzDUODQXZak0W7LWNNCrWblt55iXmdWiuiXIFwgkC5Jqlq1uUD03PwPcIcpqsqKh1IhFutJERT9N1l6LNfdHTnYyJVNj9DUuz9mtK8/Wxb/3f61/1dvStqE/VLSoehotYaIBUjclj0PuPBAwNpuivvZGY0DAWaoLyfMaWplcvPiuQQhUxBVwMX2GOPHopT3t4TT8DJFDkI2Rjs/pMlDwdiBoNH2XnvXuSjFDTYFf/zgsRMIUnafL7iRyRBhWFKliHzQ/TIh3/KnmCTjsX9dTaGfcddRGofRRqV+964tHqjG0lmVxbdvqDKKX0oeC5kOm3hm4kqAgACnuu3zlM3iIxOXNfikxWj5VDjCkFuFWkqVbNM7JKBGpYwYRRGa7+P2bdHLyAZHlB9JNvf4gLCEjEFAbPykLOeZguoJ6VKTDifw9mxrbSkMqf/mfOmWhG5P3DjARnwkKpvm7Na1NsdQMYtN8eOOxrCj1Ne9CdK3AycYke5YOBGEWFFkQQNIhLa//OCxIoh8faN/tmHIP2F4LSMDikLABL3WGYBocAAwZFM5rKYw9AlAwDAEoI3NJpYlOYkAAdLlMUUYDgjUoQzd+YbDD0pSERDMBh5B0GmAYBKhjcXsQU/w0A7gEQUP09JqCgGjrrsLV13Yk95w3Y+BSZntz19Z+zMX0ncE8JnOETAjgK9NKdnM9/k+xAimf26n2/yb7rsDWIzZ/HvY9Q9al1McayyLnIcbGCo53W44LZBCZ/KKeHlVQKqaNuijYrswii2PvW4DZl6uUYQHp+JhAL/84LExisKXmAK6wdIJKLSqMyyqLJkjACMJkEzqwsw3EcwCBBj7kOZPy136WLtxGAbMeARLdSuceaWUDM04nGRIj+A8exBqjisFCc2hJ7n2QEupl9RcEHS3UiBzU/MLcyus6kJ1I9ou7WvtNz7mHqq/U1qOg/mwZ2ItwT0VHE//FF8+KZ89/7t++NMa/5P0OSOtJ/9lFKzqqISE5EGzANATV0YHAkBQAGHAPI4rWBoAQAATCwnhgUlKioIAwAWAgNQwBJOUgADDgAjAMANMC0Jg//zgsTdKSn2aBTnUM0exJ4xVwPjAgAdRqVBDK0YecF6nieUwAwWTAeAVQAQ1OTCz2ao6g4AJb48AGgl46crVx6f0LBfHvtNla1QtLSl1kqrj0Y7Atuyx+NzMuu17nvo0dvdO4So7QzIythud91hpKXlGeO/n5I3afzQhRpI5AQ1DGk9E4QfCB468lYNFQadJzjkuQdJqSgOv0vUH+cAFgO1I6KW78g4QjFlG2fqdNfSoZaYEBAYplefutAY0hiYFAcYGgqpMvqr4IAQwRA0w2AI//OCxPwy2p5UCvMHTOe0ENdgIMEwTSwZ/JYo9cJY+tt1xCTYYXTBELIIeSCHFTdTbWKPBG0Znj0dZ5BON/NredFHayplkwQ4RuQxxiLppFee//iq7xE0tO1oQPddE84ZVzIzYliMTmZlzPkjmjUmuX//1PkIeCI6Tvs1DwH6o3uX/k56Ek7SuRpnU9WWGTl/jCo6WwgPLWqWiIDCTEFNRaqqPULeQIlCWUMSjaQ6uSis46vTA8BDDYST0A6gETIGA5nFuGXeWFQKEIZmWEtmOAb/84LE9C+rjlQC6wdkI4BzC6Rzb7+0LqLfVnMAyfKgEMQKwCk0/Eajc1YEjE2nSi5LaYZk1TDY1sjEOokiRMFwHiC56cbPxglOEkjghbYT1+0yVWOFXMiUi4gv86M6DvGIsMbgjY6FRqoU7n75XkyYZLjOROQ67mDHaZicknaHxDPy58nb2mz3/79FEpMb5FWP+nkPAyVMQU1FMy4xMAZlaBiQBU63TMZTvTGGgOZGs5GYQgqKpIZyx+FgyEQAoT2ZULXba/DDQI0AZD64BDL/vv/zgsTzLgLmXAzqR0mQVNwUo7FXrLSiO9B1oXQJgR9qbdIo2hqjsUDE/IU1So4jekWtmCFFsUzERFNAq8QntayQ0kXjcMlupN9ZFba1RU1VjPqdwx6cbuGbk4y6+LVVTg4ilWZGS0dr0v6j3V0vrmPVf6xDVjzjbs5ow8Ax5ZsY7Ntv1v//CyKM/+RQ6qVIpLwK8OqA6m5jgABgGgJKCGFMLwJAAl2BoCdW4qgDmAcBAYPYcJpvk2GDuB+YCgAQ0BcwYVADRRdYKAHgEIAxUjZg//OCxPcu0mJYFO7SlQAnGAkA+IwAF2xZdMvYZTg4QZsZNogvER2Dg1l8QfN4nDLeKImFALMYzOvo1ut2rdZ/DSpuWaekrSSHZfTs3dWrTYOLFIhau52ZZbz5KbFHlW5nvtXtWxzW77mcoIOZOM4kUphlWnvrTlgxoyOloPt4UH9qVuDxyZwZ5RBG4mGx+fjmG+paZ7mRQiZYzX5nRSLbCc1NlwcoZSG09EalnfH/7vS1DLFQlq2vmQ5+iIB2Vs2dFB0BAcYkC+faGwYzAKVgSCj/84LE/zebnkwA9sb5JH9WHWk3EHAmYSAkbYm0GTiNA8latdw4hm8sFLFX0AA1AyMrGY7Sv7UtroXoqvHYw17QDhhFqjJ6wL3nWXk6rLjEhC0kZ844qmQI6pYmRlaZhmo0Z0s5zqqsWKerZjsR4ptlbuj0Yypd8kvbkO5qIj7/MqdVatX0t9/VtZKPJpqtjaIwxdRCWa/S8sDSGq9CtukScMJIPpD4WACXmJADIcgIBSYB4jxiakUmBOBAgzD6yXlgp9yyBgWg4mDgg6YXYMpgKP/zgsTkKyuuWALqRUoBxe9Dg0ySwxKo41xnQwAqAgTVTRuxEp2NxxpLuFAATkTMCxHcct54WrUHZS+h5S5WqaYp56ZrvVOZ4/O1fqfh3YxHLsrh5XCwUb0Eb1+XMFHciljm/TQkVopfqjkd8+ZsiIkOlGa07ahJka6ERL80I9472fSz/M118pDiZPxnMv9z9O3tsRh9U+8zOTMUFIQBFX0MBAIRIdszRUESByFBUAVeLzAAEGKaCn58aGN4Wl7JpJBGUuyCgOMAAhMASSMwRNYx//OCxPsyHAZYDPDNtSUEgwOgG0TnBhEdWs3O0y9nYyCKYHIBqm8YikNP64qbyYIWAIvRmkjbwSSAqP43Kq1LllnhdxlEgn4atQBaeqzyXfbqS6J4V97rEM2l+GRR8W716A60mEmbnmYwKBWMgeYdznwFfggBnPbUnJAZ6nDcxHaZqv8R0OLh1ptATTUs+lNoZeZeXC9dA5IV95SIx9Py9LZjG8CCFUxBTUUzLjEwMSAoF+XoZQyfqLmMxOM4gGJMcQkrWMKA5OShwIhhEgCdV07/84LE9jKj7lAA74bYCIea6s8eDA3rMgBOKTA2riH3flHZy3J33EYckw9MthNFfu1o1LGjKhpZYiDrETdgusvWjLQ1R3LgQI80R5Zr32TnWKP3ZM5dHTJ9OnviwkcA3CzWfgu2EnAUOFTKdnJbHy88rlL5lS8zU/fLXLfdv5/c0rlWVy1/Zv09vgN38tUKM4TpDepP/DhH+qcxSlH9NIynNNDVtmW10GhECJgSZRnq2pgGDSAVAczh+qJR8qAsYBjKaleaYoiGYEAQl+sRwJFCIf/zgsTkKjuSZBTph02qN/2AhUgTEcAIZU9dfiZpF5S2fRgsRerGG3iFFGJZEu1tQTxK9041SZs5ia1LJ0MG/05xPzUiRazOB9rGmVoxhc4QI9r41j5SnPIK8hh4xV947yUZ24WmhNFJTU4daHDYEczNzwaiR/R5kl5tcyJ5EcxcWg+nsrUm29hTGovYt/wsW8n4N1ADVsjgRaoCYQ+t4OAipDFAF0L9lpJKgZAYYAgYIIaZnNkwGCqBCYBABhedQxHewYC4BxgDAJmA2EoY5iex//OCxP8x09ZcFOpHcYv4FxgbABlABbTWiOyu5nrC2CJJhQPMwAwEGDFADssWpKajoIpSgu+4kTOxqQCyoXOHh4SS1pXicwtGI/nSNgtlx+8UO2aDQwtSmnqGeFNnoDiys4SLMQ+Y2DIWPpe8t17N6rOZeqRZDSa0mOnS1vb8p9Qqoz/skjWasfqb1ngLpNlLrEIcGVJE1zMpUfSv/5iihH+CyJSP1sEsfQpvXmKS7M5cTUxBTUUzLjEwB5inbFANVEmMZUk7GWwyqDWKqFGDANj/84LE+zbr5kwS8wdVSPg8IqFz80byv3Bi9zAoDjTNAjLoFgEA61HLmaSL3Lb6v2IhRCCUf5SNyzNWKBzocalP0NGgt8rm2XjHThs0SLu6KD0WragQGQ26w4EIGTUtlrmnZoeoOnJtPlvDPXN/yvKSfn5lijAZrFWyDdbSU+nwKtEoIjJYKj20EpA++28jnzsBD4DLvuUMNigImAoTGCIIG+DNGAoDFtgwFDAMABACQoHJiOuR5rXpjeIBgICaca72aoTloiMCgCJ5pJ7posLpg//zgsTbJ+JSYBTph0zhkvmJM2bPBLbSmRwCIS1MzAZR2WLOQU/jd23TLEYFI4SeBnygQ9+3uUZ6vnRdVxmbCso/dH8r6Lp6cURwhKhruO9hiyOTFAhs6g3FnVtI0WWd/vZlectz4qrgj2uIMg1Cit5Vxb3XZBet8tzMptqW09NUb//3WB0t5iKJb9eDEvUaU0tPWX23IVLK3/EKfP+z/+HitIxEYuqOSOO0kWsQkmWkiDUmvUlQVqVMQU1FMy4xMDEgKGIhpSSy6lgmLQCaubw1//OCxP85Y+5EAuvNTGJLSwzBAqQm8wS838lOdjDVhaYVRQhra5K+a7+92ZgqAa6b/LO9fXwpnk/WpHC1rKwmBs0Y9HVOHakJD7u3NqvNwVBxAT6Y6mXNNZxSGSSKUhmwTBU77Uj0emUMp/M7qJq7Ur/7HJ6//ly/57ZznT/fzP5qT/3c9j5eFtOh0ADgNqzblEh0ILSdAqp0LGuqDl6jVw3EJ0BpuVi/pecWGQ8ALMFE4i2CAAeZqC/GBBYAzAsNDXR8jI0PDCQE06vb6IyrOOT/84LE0SVz9nS+2YdJAMIIRBMYwHemWXrbOxmDMcojJlK3T3L2e7YtyIfHb5ZqztzC/js7bDU595WIzhqxZXj4uL5Ec8k0jUCdwyHTAE15TWTdtUz2XY+hUPJeckWx+O1vc32Ytk1fmnRus6DRCWTMPy4vO0Q8HzHu6UjdH4e79+et/L1m92nIze+U3ltrP30356W14c0nGn0WrZIAZ1Gpn4MqKwHYGVQAEg5NsTbRqEgIxIgOWkYDAaYNkIdcqWLE8CgNBwJF7Z1giYBgWA5iEP/zgsT/NBvyUBTrzS1Ab82IarB0NAEW4X+rHAEbxjUECgBCAfQ5Gi5KODdoan25dRwUTRrbeibIR0VT9up+sMka0vtMNDq1E0d0NRWT09mMyEyPU0dGKyls59Ly/9Wp7NkdKYuOeGN2c56EAK7G63N3ZXu2idzzJj1thy3WkhPtDNP+vcjM6xQuVzzg6HH8Ya2Lkyx4g0maMxUCQvgse5VVTEFNRVVVQOXdMTVNGmFGbQnbexTabaykcOCKYQIEorEl9uLIngeEZAACiCY72WBQ//OCxPIwa0ZMAOsHTMUpFtwxDkrpZPHKWJjgfhARU7HLO6n0UOTDJr82VGjBg2rGSI531LUtdNCslIqa1W/BMD4v3DaIVg8aaEwyebXIxIJHs+XmjEwtlIrk8onUe4axDLKkqqqwmOaM0uhz77HJ6HV6+pE7t0z6t2I3pOv5dX0mpOcn55HCEw5Hp1/lfPO5/ksamY0qAiJVAswNA0GhaUAgcBk+XBW20JS9OhQIwuIQ6SbswsBQvuWZTnUVUzAQNGCgGhUVj9reDckDDF4CQED/84LE7iysDmAc6kdNklBFHhqPS+iSSj4AIMw4AZKIWBGvUlTjNKRFHAEREyrDvU5HBUpgcYPXTpdr9hu8YqlS5PZVE0ZvYtBqfx3qyvMA7ZKxWHwxK6tY0YrDLwe7GlOjcS2sg80cxE9gAno2z2yzC3qvZft483WTLGxfJ8/WRqvnZtzYrPGPqczHyOz3/WTHtvu/+u1zsOX8v/+/2npcu2ad76PsALXf4KnhbkxBTUWqqhOWZjbsu3DZwYeMEaxtx7CtIcHj4IJKCOrCyJwZiP/zgsT/NrPKSBLrDU2TaJbmEhIf//Rr4GEQLW41+NxiT0l+NQ2FACRF1/oFrb1MzEMQEtzK/TC5TVA9RK5tjNAbiyqNV2iidWwx3MiZ7Dgk0fJRA5hjObqvMKm6RZCRAeToQ6ouV3vVifDdyrMXXv+nl/MjSGa9JfXzL+Jx/BXVe/tgRl7XaQmp/abcPgtCP/4E2LJ4mlx1TAoCAwRDl8Y3Clj9thBwQiEJDCw0TraRDF4HTAUCggHQEAifScwAAcEhIIS7MZRvkVC/EYDQEADS//OCxOIpoxZcFOIHTXn4e+Iw/GWxo6jAFBgyAFpXMWqz0uiSizxpnhgFKhUKj7Y4dnq9ilge3EqHVHSz9Fu/PX8qWXQ1FeUNitvbN5bWwrqK34Qw6nkpIwCNQQdqw4kCUAHcpRxzAcBACogx2TevUQiyIUQL2OohGsZyjMWSxKUMEgSpLII+O6ISB3INEIEXqb5jA50Sld7dhn30K/vQRsiqHF6FB0hO5DvKVUNgpYgxAIqAwdigkA0RVC11/iEBRCSRl48oWBQCgK/EFMQFgFT/84LE/zZMBkQA74bZAwAAcwPC42ano1TAoDBqgtEoMqwRMy+SKyhcHDBEDYNeazF7EmdqjbuTAHE5CisSGn8lnqfbVtfaQ6ST01CIPksb1It42J09E1N2G8GStMVSoq5OzNoV2RlMqS2D1DxyXkMlUyb/qduUzjkbmVsTOLoRmVJnh9P7DKy75lqZflw1fFgzoJbSuioU77csv637jL9hKltmAoJiQWjAAHDYnBACK9QLZ6vwwIAowtLk+3WIxvB8oABf7Pn/XKloWnBASHENCP/zgsTpLgteUBLqx01kEJxgCAJdRPNicItxx/IEipVAYmO5MW08LgSlr06zZ6FYpmygB42IJSJ4uMrNZLFRNaAjSQxICVp7fOTEq6ro77CBbYU1+KMMkehKcJEJRgTuTmxDq1NHdS/ImYrXN3KHh61eMo8dj1npMMFE8+A1PULvWfTyM+bWp7C/quzLTxgwKxdY7w/4GcX/xBQAVbOaMAYAAwBAAkgzIYBnEAB6guCjpfkwBwHDA+B1NAgXoHCIkwGw0A6m+vhNKIo9GAMAyYNQ//OCxPQwA3ZIAOpHSeuYdAIojAKQGPrahrBo8pd5RoAgNiwdyKtilfmNUEAsPW0iI4EiMzLK1sqKoGEc6XAVlEMiIqgcgzntTNMjHjs4YwNTIx4CV1YO7x3pUwx5Md6vrBUOm+by7nXf7ZszZ8LkdHDG+Sxtutpu51qZs+UU/bqfTJ1uYIgQn/6W1L2TNVKqvapoR6U8hEC+VNy1TEFNRTMuMTAxIChiZQzd19EIwEwEvwb5IUGpRR9wVZiEDgVNGY7WIwcxFsj6y6pG2sBcGmT/84DE+DCr5kgA8kdJ+NmWwiuxsMYqWuU1NTt2GQeLDalezLlSG6SkhhjkUw5hHFBJ7K84tKzvRbKMy2o5rc9RqJsKVRHT6WgotOpSqUYmnT0i04jnsVCOuQeqlcaiiA1BV49I8n7PbjFszEFortR5TLjn/mYkyfuaSKaW3wRGLkn/9c//oIhX133CZLuENKgTOPyS1UxBTUUzLjEwMSBGpSoAgDVIBgBmvw9qmX1eZS55gAAhiCYJ5GvxiqEYOAylYozFyVMi8oFEI26bIyVC//OCxOsr085cNOJHTIMDAHXs1yURmVWaWLMSJQzWNZb3nYAvPrIZKiTu8F2y4jzYpsFKdBKGMG6FfY6qalR9NjLvHGyFsqZpKeIVFNlcyGbNwE2qHuCRmUhbVhIkyKdQVLGNgxMlLH1f8lpS8yLSw190cqea+Fv5LFz/WfcpPPrnkX30s+lrYxQ31EZDdIQIdP+soseqC+hCBAQABstMjcOgGAKhACYyAACACzAIADFgOzCCCJNZoa4aFBDARi/KbzxNhTAMBsA0wGgRDK7N4Jj/84LE9S5MDlAU6kdN4wOBiL2PvA7qXYhJGusTAgH4OBAiSoZK7sSkzL5Mw9HOAZUYgDgVHjkiQoPGVmHrYbLPCDxELB+B6BW0pPeX+sy3ddancQ1oKdM+KLjpVNboS/Lvv/6mfNZSUFRfe5m+ulNKHzvTFNs2g1Yp7ictATEuzyynNc/Y/dv6vt03isuevM/ePU522mUWzmu//efC7mUvIBYn/9Lx9UxBTQWlGKs8YklWaeFGEAMJAFlF2xGAgNhc2jT2HzBEGFhWsOS/ymzGy//zgsT/NRvORAjyTUkAIYDCmY8/KYMjSDQGQQsMjFG/tPRSmA0lS6MXsTEone1IckjBvhTZBPWp5iSv+RlF7lxt+s2fnc2dhOL/vAwIvqZiGYiKMLwxZE8JPYxBKPK5kA5UCggxR90KF7ykfIjQ+kbX/or9U9tzLjCNGLr+7ak//5G19iX7/t/kX18v2mhViO5VS5wwbhlUDEYHs6FAKNxUiBIEMEftDUvmBAUMN05P1bCMbQpMCAYURQAPe2MucDghMRRYPbLGNxQ0MRglAwTM//OCxOsr/BZUFOpHSFIKcGGorPRl30OIKEeEU1mPvoRwVRwBAsNUPoFJm8XI1B4dPXiYxAgePm7UtI73yYkQpLJlIpZR/N94s/RdHYhWVBSrlNPKxp7nmdxBWsyM62I5yr8zVw+O0LZ3p69U7Ok8YfBMutbk02/KmfDMidEPLGIUb6xs/+Tj/f29Kqoj9tRftVXTisVRBMlHd+1XulJPv/PqTEFNRTMuMTAxIChiZXRhIDMpqqqqmYpKQeWwac4Zl8Q6u3xbozVxUujCoETnYPD/84LE/zP0FkgK6w0oeI0vUvSG5iMP0FwBBALGubeGOAFLfbg0N/6SvcuV9NFHgzj/1e97ScrOJW/CAGZrYqil791CTYN1ZBJPrxpJkG9FR/0hr/9KEUebAtDzan5ei3zPznlNM0LLS+Rl+XJPNczycyhd7w0nmx5SEVzr8i/l+ULMojfSldOcgoGIOEKIT5I/0ILndtUQQwFwcAyoQcB5u+xyJY0A5dFA4tkCBNMDWmO+eTMUQyMDATLlF9UwioAA4AoBBQwaJ8wxGCTCICbMA//zgsTeKIvyYBbph0hAYBQArxWmbPK7McU3kgqBOJB5Je9+9TW836Y2kjAcjk2orhZyyj1rdLS0lWZjUvn4xUkV5VY0VphMDSbJ0jNlGpe451xMbdU2XU62N/Lzls+PUmnyRZmPay5UbsXky3/7r3GiXbZbJnajxTYX8f5n8tMpzX+XjU15r+2MbLd42E1fzv/b8qaZaIO9s5o/GrREtpPazmpsQW2qBQDAwFTAQElDjYhdU4GKU6epbsEAwYrqmfD24Y8hmYCAMHAGoAzNN1WY//OCxP81DAJECu+M1UgNMKxGN8IgNaQmMIAJV24EodN5qHrsxUKhuYYgE4LaW4RlQ27sdTyd+TgwBS0rdJciZGRNniNs9tPRP68FJpzau1Jg5lbk4u6lmBU31RDTWsjJNc/DmYJtkje9h93PIQTId7Ts/hk78twZHHS7DH5qX12Y5W1JoccH6fzqLN3IjNS/4wp4tWLkvgkpYQsvwZUNNUsW9UqdJGExGRHGmrbaIoGraPABmDYBKaFADBEG4JAVBAALfwxJGiIZgwBoxJRZjA3/84LE7i6sFkgA6YdMAFnRep/4vvVLWxlpYAZUEkDe1o+hbfhQCVj8iIFFnc5lIWnrMsv84vKyTmU6nrYlYuwvv/JKvKYqxR13KO7byclR3dFGZzFmC3DLwktVbV/pidzoJBiOCyIkV4xiXgIUVldyXCh6scrGQyZYnd1PNd2RYasmcWUiGOIZrjfD/TULFIKJUQp6iuB4DC3YlgGojyYEAqFAXRTNYGZLVA4AlKS0wFAwwID0w3Uo7duMw7C4BAiCgWaa+z4R1XRgYApjoSJnEP/zgsT3MEP2UDTzBzECCgSWpRw/GITGohDcODgBhw4O03uVMRLIbB4DIiIljSKWe5JtSi6fQtygMzpgqZq5rfjTTU4pwSRQlLZziepP62w1CkBdHSNO96c6jtbUeWw8qNGoCTuj+VfxffPm1MszWsb3uaVVwQpyYOdqm5G1P4Rv242sFdPQ6lTiZfc3hH0h7qFOTZvk/eAFAoYJAQFACAAAGsbqGAgFAoDED4dAQFmBAOGIKznxeLGL4jmBQMBcAS5iw8ucEUAQwJFk1VpMxlCs//OCxPov+8ZIEupHNTAATRgxxHXlsdjTZ32BAHBhIulIr9Ts1DNiaUIo5ChIT+IcVMKswPqViuljIuothdmRIxSNhEONVOTEz087UGthGf2zMzDQWwkbNhiU/juqQwTCyZ2dOvHgZNGyDKMrfj3Y+kaKhw2ZijokSuR1DD2mfGLhrsGVk7cmpQl+ihfGPKTyAQVyLNk29OibGdVMQU1FMy4xMDEgKGJldGEgMylVVVVVVVVVgCa5bR+pGbvWZFGHDbo8Yi3FWIwwBcFoAHDiiVD/84LE/jHLtkQA6kdNxA2LeOMlCYCgEaVEQLGMRAI69mWctY3Yeo0OysNJP2K8punEMpzuKise2vh2n/pRPQszJa1WEidjIaX6NnRzBNTVdCOm6EFZ+MzIJEg3W3Od8JYUKFy9yKHaXmfTPsM0LJf+nOnX+z3puUL2K8n7ywti+CdrDp6/7zYE0TyX4+H/+oTHAIoLaEpMQU1FMy4xMDEgKGJldGEgMymqqqqqqqqqqqqqqqqqqqqqqqqqIQuzXXXWNvw79YytMlUPTc9GnZEJkf/zgsThKVwKXFTqRy3BwKEqGbUzq3LGRkIIbLiCS4x+KU+djLWOrKszr/PfqEk6TE9blk8b25NGaqfS0Wt5HO7x6NKeEGuNI8tDGAVAxvIdXLhBUR/jaggqTA2O5Ibh505mxQyu9ui0SgxavC0DM0iFP4cDlkRSufSikTGSzqHgxOdP/SkieSJ/BPLiVwu7Zhou4TGZmkwx4ADAMCjAoKTUqNUnS7AJAlHsDA+AAqMXVRPaceMbxDMFgIRTdxFMaAIEAKMgwYfGiYwrXpgrBVmA//OCxNono4Z0/tpHLIgTGAEACwx7Wb0rqWYYeoQgFFAMcVhVWH8ZfjPt0RbgydqzFHRU9Xec1D0oscxoH0h2VbmtWZiYnuSvmUP+2LC/bqTTAnh5Pc49eUtKy5aWc7Xo97j5s0cWirVT+zJa6S6a7K/msLnHIs1t8hHMYzEc552XbaXsyuzHxeqLU8vHaiM0Xn5cXsQk95Gdap8HKaN/l2jlursXGkb0pI///7/+xbVMQU1FMy4xMDEgKGJldGEgMylVVVVVVVUCquwIQVnhIBH/84LE/zdsEkAA74zYvfcle3OMRmnLpBCacvA+HDypKzAK5HVS6RVMDwcN0FkCGSDAZTicW/HZVV+c3pC7HWFbaR5iJSEJP6nDHP7P6haBRGWpAd21zTQtWv7VPi5c5U+1SQvIieUtDwbDZkqDYDhEgOWsKj61uHVakOY8Q3sUeeHhELaCIqK6MOvTt7ntcTPh0DIa8s0QaUwGAoEguIADM3HtAwBAEAk0b5gGBAkCJiGhh2jEpiKGxgIAqQyKKnb8wYBQjEROHm/rGqQeCxLGB//zgsTNJIGuWBLfTHQAxeNOduDpuQ2K0zNR8vZLLEPRmIXNTcDpMTc4clRjm4XFJbUemVH+PFrnSPZwqlYf8W8vXJQ5SGe2CIAg3A2DuCdY4IgQzi4rmIED2JQJLYIGdRECBCcDA3gizpoq6lGPgtBJ/9zcwxuzcjUcIaPSV3RoSmWnqZG9o7OeUOrshDla5mM6l3gzkEWsxsIhBXVlA7SBh8RKgkQYBYCifLlGGCPwmoqAoACDgAWJkoGxgRhtmMGTwYD4D44AIYAIAKgDjIE1//OCxP80W/5EIusHSDEVAIAAWpgtKTmGECuYF4Dg4ASz6WMGlkump6GlhBYDSSatXqeGs5mA05ZbTiAESFQYRQOyk0iRl9YZc2gmRYFgnFJlYiTFhdDFkwtp+7uKd5K2rYuFzxlWNql6WSllJpoRUk1koqsqx2O6Gowl7VmxXDk8aon0zUyhKutJR4dczNhEQlN9qu0LdENTM6ulSb/5OQx3fprX8lqBv6ZqT2aEAin9khQyAAfQ6rzMimVZTAamkOOWtYw6Aw8MN0WHgiBtpqL/84LE8TRz9kQI8kdVdGGWs3RpBwLG0zxAKAzBwAVfupEKs1M00ucYcA4oCXCm7n6+Jw5COFXdDUpOQo73Q3Y7alvPfC1VJHascWZANSyflJ3Jb889dtDe32PUvTCq5O0Qk65XX7h7u2y/t2lrcrmf5KRn/HfZ2hb5O8MiPM2pLTnhTTy85miwR5/wnMTwwd998qtAHE+Ldje/VQ4B4QAhBQAshAGMMkroEABIzRtrhgCgDFAAhg0h2GiePWYNoFwCAhMBcAhNB4VQCgFAEBSEbv/zgsTjKxt6SAjrBzM4dkAyUGIMB5KhYdY7uOm9stfinJA6MAABa6zd+ZDFn3tvy1hFuYlFiScwnbeVv3mwr1r1iZe+pcfaphBbsySpPS6vNzbM6k5SaLQsKSMuWNQIa6mKUeMPsFJYmieMAuea6ay5YoGOTtxDYm6CGUXC7We5aDNDazL5mczENiwUub/b6pGIujXRpZToJJOajOKVblpumbDFUx5U7+7UG6i+6Wdk0GQuabv09Gp7X3lSkRvWnN7HKhLEQrFgq3UyNky9qoW5//OCxPo6zBY4APdMvDks9EYMMCH82BxDAgFXc0uGo1BlxRlPgMgAtiQ4HMko69JW1HMILJQkLCOhpql5Q37AWDYwchiXWZzIz/atdfm4JdPVCGlhiWRUgq8NL/T8doU7Md5p0MNIKQrPOqRUpQpLVp9Y6naeh01hlA/LplN89hDf0nyc5/7EjRCZjKUPlCyTnIOTpuR3yimZT6SMi3hQEewjYiDP47+nZPyqAnQCAESCgtcPC4Ypy8puwlJ5A9AeFwdMDjQOaJBMTgeLvp2IMtL/84LE0irTnkgI4wczGMJahYEDAYQTee9zC0ZU/Uw2kPLJ4y5V6+8JICRERTTeUcXpKCvZiCQMHQnWBAsic1hgQXVt0kl8iJko74kJgPoqPqXsYJCv3qjAwOD1QfXqwcMIN8PW5MTzlEDEydzhEoisSChZMkRizvBJnQRotPV4aes5FFFalrSQg6D+1ueTR4BQZU3mXaGZCoTvCOXZdy+lROrkpxdYZkRi0u0eXZfmGuHR8ZCzVG+HmtsmGFgFPmh+HUiASDSA9PUwIg+eTsLsov/zgsTqNqvKPBLrDU2SNRgEAJhWHJ8COQYbxMDDrvrDryJnr5MOwCOoBLFqDGgwJgnUspHrlURl0vf2XA4VnJ1XlDKZJgdjiQyMxFWKkfn7SRq9o9RrURLRHpeLxTHxhx1qBgVbLUgLMGBCzZONaiZKAtWLJMECOqRgwRQw14BMhVqQXw9qo7mmot/fpooYcbIZoakCODJJiCFOaCUfIfgzJ1TM5AEzBfQaMbIK5u7qziC+JP+lJFxRPQ9xRDV9GYhgBigIiNkH6XKpUwaNgEAD//OCxNMv895AAOsHLQ4Fc5kVIw4BcmApDVw5pg6PANBMGD0af+AZzBEECOWYVPDb+T/I3D86vNA7mq1c8tZ8qhu3BUu/sterjMkXTS9PuwPazmVpqxS1XZ2r1KmSCUpED6yq5doiHWmjLVXJ9YDoOTmREi6nsN8fcEakZpCNCBTwdUv39XtuTtK8hEehDWW7ONOe2/xQttBDP6wNud/zFuf5Lly7SjAsAAEIJQGxbchk0WA4IA9L1LoMBoLhCSpQYMXiYCh4KgqDQEBABtUQHCj/84LE1yrbCkgA6wctAZgCDxh0WJkhswmF0EGYAIAhgHAD2Ky1pDK5XBLcCEAV5I1U07sM08PSiPL2mIpUlsRlNNY5vcp3ctZ0N76Sy71i/EZPFKO7YrR3T627timSSlL4bQgGKqomOlAfKooytK1mxDFRlPsTLEikIZRQlsWususdb6tKntXcqDbLMuSYNkEYdNib7mNDLgs1btOMl6mZwvnWXLrcuWrE6zM8RPwll3/+yFvG+n5SNNief+kEynIMCwCQZRmnKTTyQUMCPpBR7f/zgsTvN/wOPADvjNmD3KUzRkMAlU/O0AcT1YJGwB925u8JAkMI59ZXBm7DAayZzIClfKe3N+6Mh7hnTOeWgFABCZHi4x2f1ECGmVgw1RXkjp0HZDClVqOVxtmd9yJuzD2ZBAwTlRVzVLnGtQikKQnkIrX6nR36fRHNUz+lOjX6I9byprZKGZ5jf+/YxUM2hDiGgqe4nD5SVAAU0fgSASYAoApAAWYJY3ana+YQuVNNVYwVALTP4EMGguQwA5VqwzyPuloIwEzAkCQMgVFYw4Ae//OCxNMm+8JUVOILLIwNwAQIAIhuxNtIbllWmdkqgAhgAc3hhL8e3+zCtNDPjqxtzaFmyZbFT5SGKtLgWgkoxkVm3viIlL/3VZFkeJRkpj9ppuCPK7etJOa1lmE5uEeDMADJFDE46haFgNfhEzNTQesQiJwyirkwpsTUad1DMWC0dYFN/8kZByi2DeiWqWs92qvkqF8C/mVn/6Czma8KXgIq6ZXXQwt1TEBQHDeada0WqAAImBJ1GsLumCoKKGrIYjGFUnRAIDGCwSmTt6mTwgn/84LE+zJz7kQo8kdRgOBieMNRmHqs1y7WJQNHg7dWil0XpMMpuOyyZ7FpJcqbr45XXZ7Bj7FDnUMU4sQHJyTCRMk5N2+oKBgM5pAGhzk3M130xSy0fRA90M1s9a8hCyXOtXnLbDtu/a8A7ymk73k6d9f3Rpz3hFpYx1QVeb+YoGYVzLzCd/hQnpn5ROCszeoMtSt0j01MYvpx/Igy3x4FTEFNRTMuMTAxDM2QwCE9UJi5jDdQX0jKU6NijoIAYwRM86dXwxJBEvgsLLKteLJmAf/zgsT1MOv2TFTph3WCs0+KYBJeBgJRHatVcem/crrJakwV7pa9KhtVgL4MkzDKGdlK9lUKclR3h63vb2ytXtQfSbMt1gXvQ1jBuYM0bj7hTBmKFlCVxQZyHgYUEcswwIyKjnJWsQulI/tLIlTeFUOkON3zpRtLt7mbMfCv/zP4fJmnsD6/87Y92fdLpYMCkivCjPSaFk0wEAgiWkgYNg9Q6AiydJZS1ppgEgIGDIDSaqghBhdAJkQHxMFVB35ssyJACQDQ4DqDD481EWrwfF5m//OCxOwsO15MMusHLRz3JxGAKREp2YRGpPOVZbblDBpdLa1LG63cpuTSmREiBRJBZloAx6yjiVsaV5jJ5JniBPJ7E1PdqfZShO/MQsp4l8pN8ZvFLJ3Ldrq7yfW2x+tUPFpFZFPCdGwVPd2V+62Tt91Xk1sHF0TpraMf9722O8mw1bLNdFO/7vkeWrrMbzMzyyv6/3XKqf+0E9pMQU1FMy4xMDEgKGJldGEgMymqqqqqqqqqqqqqqkWUTccjiCv0rbZh1Kv858tZ4zouaBTcbVj/84LE/zIkFkAA9wyYaBQUoLhYsVYg7bcDBRKJjyx6ET9PhjlvOhaOq67jnT212xg4jfvYUqdXrDRGojjJOc4EJ2ND34qMoczDq5OSvIGyUp1vObuWqC3BcMGpBYwZnXJ+x6KPIjSU1T2sJG/N9t36TmOwMIdqYfysTH8m6GP2QokyzT+YZ9wYzn4qDMHDh6uoedUGIrUWApG8wMApAKZOO0FwILUMmJgBWIYLCIYpqKfp3IY4iCYMAMOgLFmTyRYELgAYTCqbD2OYDC6EAGprLv/zgsTdKFuGYF7iRyigfq7Ury+NOGrXSwitGKGTVKePNR1CGTo0UYjDSQYMZ8k3j2D6AQk5bW2rRosUyS01sbyUdlPdd2oreUooZFLwin/eSjLoEZ3gmsKiIb0nfq4cma0wZEJVBIO6VyHSQb86hmQtiIGU/c8/isWRl06lNCqkrnXMYANiwe5svMZDaoYNqUcSWTc4DBY5TEFNRTMuMTAxIChiZXRhIDMpVVVVVVVVVVVVVVVVVVVVVVUIADXE3E03WYY5sbMZpebdVwozLFNg//OCxP8xdA5AAOpHUTC0/oIgwwpxKcQ08sCxaHQ4Jm0geJMNbsijGNe1vHvF4Rp/qb5rw1tNmCaJTpugiqhsiNOhFUcTMLzXuYrZrSJfSejnQ3/3cDandhA3f+8b3/h5tunJUG09dLxsGWyJzx0fMLvkgr2zJs5aB2ythx34q1WwvaqTUj/X9Bc1j/sb9BVr7Kgtzf8LEEOAhe4QJICBQzQdpi6dSaBgKBQYBwoCphaxh4HlpieKxZUVABdKuIfIACC4UgwhjGPSSMOwEowPQCz/84LE2ifCOmGe4k0pv4gDdt/HHkEvnnSIAEG3l8jr2JROWqaIv/OVojT0t3ljfZRGLfdfu5IK2F7miRcoIdM0Sf/+eWAxryLJmpkrKzRUbMvZ74W047MW1T001oK3JLDaUzK6Ss8biJ6Uw29Rd2+MbD4xToFqdUZGotk3D2dr9DLasn7UbsXk4/x/r4g21X6++3v/a6RlWtNTaD+UOgk6xH///wOqTEFNRTMuMTAxIL7EgUXoEAioGZAoa2ZVjZ2CPGKAsYamicZtkYhhCBAAb//zgsT/NMwWQArvjNTV47bQmSocjBgQTQO7TFASRoL19xqZkV6gyp5cVAEb6/Ltyur+f3nmqU4UbJE+U9IUrOZsKRyfSQLBnxExJTmoyMclvgpXpUrrORy8kGtwzsxBkZfpo5Vi+3p+hwdXnq04ZQfl7ma56Zxv1K3uZfOY8NaS9jH5f/m2RT6ddVh/AyfDqf7jKb8MFkxBTUUzLjEwMSAoYmV0YSAzKaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqCAADstslksWZ1CGc//OCxOUqc/ZQCumHSRhglRuNtkzijzF8R8YEQYeaKf+Np+EmzQgIIkc4kjvVN6/nayqDV+X+2RTiTIgJHESs2smns00Ow1LZLSyR2KhdHSRwQZOhGD5CQ0tMu+0111P6cWws/0rViLXyaz3OyK8M/nSkU82+GcL/4ZVMz5knez/O5cZj4XxT7PnpP6X1KRmCQw22UyFdOFNokAFsAkApoKw7jJNJEgYEhkEAAE5hGgB6PM5iKHAGAlNJQ3NsaEwQgyYEC4ao/kYUCgYHgClQtOH/84LE0CUrunG+4kco9gluW6jdwqAIPAlGZHblVeX5TEjajFJMgkuqTykg0kWkwxqcr8SBlGKWoWmSqKLUqknsbjFOLKowjNap4uOsQT4VQxsAKZATQbwTEqOCnSKQyjzbCbQ36pU6sZjB1gcau0QqGPw7G7IV6YQMcY3NXOy0nfl+CTHhOZ/3onDiXSxVVQQcNMOwougzFjHGFmoiAMwSDAMBYcAc1ofwVAhAa/rjKqkAdGMrVnbu4GPYvmAwMIZkwGLXeYs6WWMRhxNL/PNGhP/zgsT/MlwWRArqR0yxIQi8qrnheKZgSxdnhgDkSn9k+eLBB48B9osCKhkzeVRn7vFqwYJugsscmFDyZMDtySSdIBZQG4klxxpxrYTUxhNPqjGHJ49dpXMscI2/n+Fz9TsuDdAzotzjGiU7rMSF3zS/pn2LV91IiAiIGRJwlMlKNHpPggzwVpyB6l0hSbGMIIlaVueIzlIZtdjz0Hh6v383rdscqZez0t9O75sf2McCVWBpqi11KGzGXZ5uu+rp2IdQPAw0HhQ4iREDwHK8X/Ak//OCxPk1xBY8AusNJOO20gaAszEBUWM9isByGYm5qty7pDo29Lal1q3y/MSl77FrKlJrJoLMTOFZYYbUUEhVRSl4HbV8SrvObpfNixeTpOkv0ZPTuspiHWZwyWSZzLzYvIyur/5IxT0s28vXP8087mbkdhqRUjzMpSaHVyj3lyUMyNjK0thPFFVRUBkZzjk9oVjX1N/98IHlwioIUrR4GDAEGzAgAjVJqCyTci0paphhgwDph+hR83JJjWEwcCJdqaeV5WXF7RCCxkOhRj2DyvX/84LE5ivT/lBU6kdR3oYlcOyLuXMkPovM0ctkMjlU9VvL+hFJsxSw+JIYZ2ZFaGMrI3Gw8GlKcgFRldlsPE06y2qjFf5NuKVxgs+ZZVTaVGITX1tlVN6hlMGDFWqMhqBi6Tq5MCi/ggwGDM1GmHrBgYOKguF6ghHPemrG4wYUCOkhEIOTRI6BJ5iHPMZ8imHUy9wlbWkGDpPCOJCAtPjGEZjBiUxBTUUzLjEwMSAoYmV0YSAzKaqqqqqqqqqqqqqqqiDI444022jpP9Smwt8scv/zgsT6M0QWQCjqR1Ai8QjMSIUU3PGL7t2i+V27SPuggMUeBZIY9SZ17HMNaqraVjvy+rKAnb0UAMWtQorpOjBOSiZulo3ZAmGNTQMx1IOc9T30Q8yNqDyZm55keZaRSlyPw6CjosmOExA0pH4VXARAqSfCU0ktL5351Pf0R/yN5PHDP9b6fCFuNV3/0VTXx1G+IP1+lUxBTUUzLjEwMSAoYmV0YSAzKaqqqqqqCAAq+7rvDINRsVeamVCl6lqgDar8R7MNBQ+siQMTFOcKOUXI//OCxNMmAiZkftmHLet2AAPNjvUxgESYBOrhS6s53dQY8SJcvn+xt03rNhAnMqKJqSmKrxtNCcWi5J7iu0Sqi0qaV2G1UtiFuqwrZB1RhyMztqjjAxXHc78hvVhsRsx1yrY6UbZQ7UOZyIlVV/FZIfQVM4ZO/lpZw9LUJTZ/5n8LN3J777HnsWZKKLI5B+E1cQk0HbGVIVACFgVBAAhQCTfFuUyRoEiUBUORVAQwgCMw3OA/xbExlBBGlQp7ICclMIOAwaKs6QhU09B8wMAweBP/84LE6Csb/lmU4kcsaY/kFy7L3wfRvh4LrcD151XVlMHbhsS7Hhw68sRvHTlOrfYxLYsXF1CQoLBnyY4KpNKan0j0vGcEf77b3bDT3XNdiWzA7AvQVyylvz+ed6/r8r1+bc52zrONWixaiBRwQoQBKYYiEDho3tQom5hYGsFmMokWkZINQjQSuM6hGN9zHBi3q+CdTfHUkJdFqJkJ4z0OYgKwUZgRMMBmZxaZJQIYGgANBB5rwo0ZfiAESUIRQHAaapiK/QqFojAh+nuh5bJKAf/zgsT/NjvyPAjrBzgOgqABmMs/MMZAgBwdl1Fdvu9r971GH4fEiBaI2rtY05LSEJH6ZkdmrKh9hDqOEZTAp0RY71qFjaSBVffvTk/TPFOhpazFJHHCj3PVBE8+dbd0jkG6xiN25h2XzaLx1RG3jFglYgetEwFomc7TzQOjC4vSl+ly2pHMjzmqr5iCjm1qg3e2Z9b7/87RH39BH9/+8tdc5NB78JIHvppLGFBVOUxhlkfXTEFNRTMuMTAxIChiZXRhIDMpVVVVVVVVVQo01Tt2//OCxOoy/A5EDOpNLaSrLOPaZNLo9CYg3MwIMP2fQwMYvdnIedKZYMYIQml6SZIA6vp2vf3emu44V2pXM94Mo0YCcSpwOpoBYWN8s1BpgKEUpJt9zKwM8Mja2GesHWkEnzB5mrJeHgv+0y85xVZXaDh/P5R/ofLe/UQXx4Jz408yIL1MntXzYjk3SV/6wNnlCprc7r/4FgJBIKFwx0CDi5akXkACVpbBNcuKYZhkfOjCBi+DANSyDAAbdmaC5aAiIc8GYc1hAkw4A4DA+sIziCX/84LEySN5smA03wbJukPzE/SLbJgGjsttw+KSY0XBwIqtqiM8Q4iKH9pZRjCjjKBkwqfQmhaKOZVAuNZjW+E7wopMpCOiXJKE0+yJzO5pBceHOZft4LIPlO6/sNp6/rI1WV68sgdm9LN0+UMyOX5f9JqowyOvLL6V6iXM/Kqcy7c/ac6RvfET4O/4Hm1dxE2RzFz5xZaOJl1T3vaYXCOFVQgFAaAosCgYG5vikquYaR+BgDl6SUAjCAnzdJujBYI1Ymlp/SWhRsIQLBI4GuvLGP/zgsT/M4v+PADqTS08DhIAqejM3Xa5K6SV1bTpqTmr0xIE3pTh4IVxbMrPJYCZfPVrGVF7nzp0uQ3UMuY66xx2voXb5zCNQbDKxhajBykYpjg3cccQLg4J+Bhnml0paLuDJGdzbgWimOOVLDF3RHJaR6tTMiI1MiIsqbn1SsP80iIpE5D/HKsjWOK3jMfoIvuaikUgCkcosjqfAipMQU1FMy4xMDECValLYsBGaphnTlYhe8SdD7MSJAGICwbGoIUBiwbZ3Teimd1kRggTmTdS//OCxPQv7BZAAOsHLGhASpu4ssm5jdv70ajqJfYFkbpWavKabkt+/hi3muSPAOxsavKJBSzE0UDUCpLOMLnUfnnUtaIgifl0fmIV3xKPNes04JVka5dybnYwczjL+eZZ0RTLIddEqdHPSdUZ52NdiVOh7IazDchjENu0ucqu5tcmrqynRyNmWILKPHRcROYjYDJ1D5maTEFNRTMuMTBBklFSrlEAGVtfo6mm2r6UutspSQMDjM/GpB4psdVjmM4Zh5oANAJpYqmQQCqCG4pQWM7/84LE7yzkDkxU4YtVl7Xjl1odqK0O7VWlyfVqcnwQJKl8asiSZWCoTKF1ipIoBKhURpp/KWV2TcbZRjjy6NVhnGdggUSQSax79vxl9kci0qmwoNwEUhxzGoqBZpBUj5CoSrcmIGJkTXhDC4S+WpVTQ1myMUjDGpJO5ta7vaqmalLNmz50yO6rIYuwyo4ys6OdlbwXQb0Bkp+WjJAjIgGJgMNzCqfFmbMIwqESAYwcEM6iPwHFalmgBgeQRh6GNhgDGFYgGOIDSZwnt3Cb2ufHov/zgsT3LuwWTFziR1Ap56k07OE981YJg2JUQq1fHs7NNlJGuml6JBeVCREmWmVVRRRqCkqLJqXRA7Sj2Chmg5xOlEavAZPPy0qSiRkHlOp32zWPMvVUxC5G7RtbZVWv5BjLvP+anJx6TTXiHvF5k60HbqDzDNZfRb9znY19/2t3QuOU1s+vRG+Gr//xlu+tB2jGZ0MwvbViNUxBgWeQSAAoLlRvYfbPqljV6yeaIQMBpgNWHCfCYNEQEAbhPXTMrTEKgJMKEg0hsjMgMMDgFitL//OAxP8xo/ZEUupNLGYc5PYWZbD7zRqW2I5flc7YkjqzsXKcGK1gmbF4XXE0mHJAhpMC0mfZ1xDbFsgZpclXF4BbikECiraCnUSZ8Rt9ONy4N4ot2o9R4Kc7ykk+t9TDAoiGOioQmsSUqiS1qMwMPIiUt21zMpLcyr+Tmn4eMC2qMyN1e08ZP6Lm6soVQcEGNRxAVIrxy/BhGApehCI4YFwskhoz19FciACjB8vToN7DDsJy7i93QT7eZlpcIwODs2vaMy8CMeD5WGQaUiIC5//zgsT5L1vyRErhh1WDbI6a6qFBerE4MoD0lyhlowhiKwOcwXYM3wWoFSBgNKSIGTxCRoSkXq4ICnguUvpLIJHOjSk/FztFn+6SWUnns9313cwjlcn8jw2NFW74znf5mfc1HWrvELXttzG9lW0Hw9EP8hMcmYSVrEzK3zOYXf5apXxc63/clW14vlY5yS7KAj67bllHFHzpLq3OKPAQgIJBVoqAEZb4G6may2aKbhAFoQBuYMgLRqpAXEwmgsCWmBG4s6ip0iTBLBPMjYzkxUwQ//OCxP8yNA5ACupM9cWAYAwDauIhI6B94+4svkCakGQTEMNNRsjTlstoTZwbhxzkLSg3MUiplY4pKrKEws4hDsmK8pnI5JBp59sULy5t6c06hT7+M5KZmhusZmGF6zT8FGiq7O0tarWLIo3JOMWe1MbmdGuW0YUiVR59JJvU93WcyO6DIo58RxUPdyg5ksyiSM/e5HP2h3Ou78QInJK72svC+02TPOqjZzsXR6d22FpYRz4h07PqAg9UnQKBQEAEvKAsBTrd5W1by3hABZg+Uhv/84LE+jfUFjgI8w04osGYZg0WdR6oZmEryTLAgiGC1fGCQVGAoBsMm5+TZ1MsZEwpoNNRzcVn+6w7B+uGMtFTmOKBZ6GekHQV2UDEm+Xti4Rj2/D1uu20zv+Q8BFBZYLhHEKEKq1D3a80FvMxDHM/jySJt0yMzlMpWKkPBjzujlDZiXQl7AuXTyPq/b+jSyH5FZ/hB0CnyBPcRWb+2qG1TEFNRTMuMTAxIChiCAADi/tFRorM3Ahs3iFlwLEjT8MpEAEBJ1NwyoQgloEzGJXFn//zgsTeKxuuTErph01VzAgGm54mEPVGN7Z7Ogs9s40C8HNfaLUkojV+UymGoa3G5ZzonJogZ3IRS3xPKK5KmZ+cmmcerIxqM9s1yZmVQHCnTllMxV0xaqcUmEGQx19GYrWkOOW7oZToSfI16mb3WVWN7mY1kyo/oZqGPdiH86Wv1RiEyulHQNQpxILER5LnQ5qDTYZsygqBIXA5JAwXAo6KLktWj+sctiRAQhkYrEAargaICFxGgMiYChwl6M0X+goYJoHZlYEzmGyDGGAqDQAa//OCxOkrW/ZZtuGLUQ4rZMw41+UzcTSWbyVW6KevSqMXZ9oMJo6OzOUFiTcxl1GBmZIFqQ8DIKcoLC0ECNBdART1RXUUYUWasgYxpO0LMi1w12DNhkk3gp92a0kfLYnNMdR2R5TJJV3vwqPrO6V7EY0sk8nzbEfaONFdMyaTAky2pc0vtX/PTSxLSGtG3Edov7DpbYTve7d2ab2dptrU+94cz8EKTEFNRTMuMTAxIChiZXRhIDMpqqqqqqqqqqqqqqqqqqqqqqqqqgBNK43E5KX/84LE/zSj9jwA74x8/oddY4UgcKjkLtMqZSYCcHyyIGJndsZ8r1H1HAIzXESWn4alblWuN9qIElZp9f2ewlOaqUUGOOLNRLKlAiFXv1BGnKGTmtj7cvDeveS6bG6tq5pbruFnHwjNM7gHM8knJv93vP+neMqHrXrDfX/fvVvvXmV0Ym9p6tNYSdU9TitVslJjv////ooIIBcwMCMRAmlqdiJqjUEBaCQPGgBFAZC4eGC7mnM/0GHI1mBAEAoAWaJhq6XqAgCMCApM+4/NAgJMFf/zgsTLI+FuaH7bzOkAVGHegnFv3ahuI302orD0Llt2MjFyoTiOrPjRJy/fWcyIhYPV1sceOZPyvAJJyrgTQQol0Ll3KEXKMJHFXB9o5qN6Yt6UbQQClVSRhI4leybv0g+f2CLk0h4MQs9KZ5J4VPPJpHK/mSDFwXNq70ShLTHNgyCOEifTIvDHrfT3DEsnjYz6ZVReETgIIJnTeOgzoFsgzPRcT+lKOf+EXn9kqR10skxBTUWqqgcDheIiAEKgObKmsWhQFpjJvqdoxmKQ1H5x//OCxP83tBY4IOsNLH5jsBA8CRfCFwY/krbonOZGDKYJgShhCowhI3LVu6Dy0nLnIHoKPwh9MCuN45relb/qLnOu3+Y/XMK2+SEwvwwynNopZcLBrJJIZzdXux0yb8x19M0M8uz36hmbaJS/hEWxwuFSSQ4ylxd1W0mK9neoaGxrTjzhf/U3mbl5ORoj/KQU+GgTKEO1EAHGBAFqoDgEHMS7hUAC6QCAl9jAsAjBwMTF1RjRtKFMH8BQwFAA0joAlcOVnBKABzBVBzDBHkCm5uT/84LE3iib2kgA6wbxYXX8le5fTsIc2BotUoOVqKxLIXbzpJfXy7L7leG5oAoIEkLILYMRaEE4WbjC1Tn50VLpSzpuYp09l/p9GO5yi5IVKSk0GVBhiL8s4rNrXKXRTyhky5yUJa1pVj6QZGaSvCU4+xEv/sa/1CNko9rTnnmoM+C0W+bmeGmNdz2iO+0hjNO//eBN2bElnRqd7+bmZzy5FAFA0IAGMAQFaSb5qoLBCHAQXmkBcUEBUCVFNqbOMFw1HAMCgBxylcOGGfhQKDNh2v/zgsT/M4QSPADvjHwwwBYwBAd9GVo2iSXqq3RCCAvEcORrunc/ygVz53eOT6J2pDJyKtKwNESLnueWt2jtZ1Vb8jzjJBRqtGUSRAYpShD7A+WIgwKMJgV6y5CA9VBEI0SCf7JnBR+jGJQFTCbDwgR3evTUclGNGTdFHIQoLI3l5WdUYkSlhVrHUjOWYONImmuglI+cYwc+iNlMGxniqUwNA9uSaxs0l4VA9g6qSHNdBgKAZiQJR/oeZjkAwcFY0AkLiDdFbUbjAwCTW81THoDw//OCxPUwA/ZAKOsG9eAp24tYLCEjNSKgtBQCjwiGIJkKAGWD1NojiTaWrqklZCBBHEKBaNoW+ys2ejLGKiticTi0JGJd9oFdhWrsTjNpum11OylrYUyeN2oeGHFypkaKHSOYTnKggfOLwG3SM4QMXVzipEIz7bj9pmz6eR711T/IzmJrnSVi1sJR6q7sMsIjy9sYgT3AVUxBTQUCZhIBYkCYYIhvC0AXAAHAknwWaAoCGCAPmFKVH/8MmN4JAIFVpPS0JwUw06DC0HzbKdzMkLz/84LE+S+UBkQq6kb9tgJAmwR0JfJ5fN3pajSbZD68XOIxSTFY5AalEsyIBQvBEjtETn9Qp9h08krktnZ1Iy9G2ga9qrWqUuX9RpOGQucFVemIptHCEokg8UoUI5GqLyRDhMcN/yhXHluS1m7WG+wYTUFeZ1SroS2mFBEgIUf9UxMLrQAUKqCEMidBBMxlUURA2/IK0wpMQU1FMy4xMDEgKGJldBUtITloVBQAEZzSBG6BHBy0OqIY6BwwYZmC8whB8RAIyNuk20t4iAARQMjCyf/zgsT7L9vePADqRxXowFCILgC1qhFzx/1I2Ix8hFVoJPhF4+20c6NIkWkukaMRmhaQn9miXO1jDZWDkUkezhOc8hbGzms+eVkoy1fMVTWdM7DJs+F9AWbw7iSAKrDvBRIOlgLIgm/i3qIfB2N/qHZubXImPnqjXWIZ+eZavG1J9//LOdV2Mu12Oiy9wSmqMKCQp/Qa9UxBTUUzLjEwMSAoYmV0YSAzKVVVVVVVVVVVVVVVVVVVVVVVVVUAKNONNqSEqgeJNIM7oCD3jjkTrMrM//OCxPEtXAZINOpG/RASOyGsSHDQqCfiEFVXiLamo0uCjKnFIcl7jL/AfWIJ4urXTSNmzBBhNCUh2UbFx3UjG3woXdjVBNHNhgMQEhCEQoHAg4YDFXpPCNJn6nTXkPMp+eeS/wy3BZ9ViptwlkIzrnCY6FOU//KZMl2M+K05l65eWuv+lQ5+cy6qC4SUFUAHAoPckHRVA1blmhxbCm5KBZqAu6qiYSmavhYDgwATB8zDvVRzFkAhIDWtWJW8jrkIBAoMzbxQzHsDUAi/3Uhi3LL/84LE2iez1lx+4kborqw+hAAsToM5fA10IUKolaQmlFFzyoo2QeP/rFzDk4E64MnTA7InpcL4AxCWaQJIho4Sh6spb8kXNFwwkh+2ga1KMMVYLdOIelXFTTQ0Pa2MeVZDZJpu17ejarS2iEe84dEqPbY9Bh4xRGYt8kJhtFFsNlak2FHRNVpVD54ejo5Zhapt7I6kyLIRRBcGpojh9nXY5ss8UEAkox0RCoMhgvCIEUqDXl5gwCWmreR1VlIQoMCz9MwaQMEQlGAKR5Tcfl/W6P/zgsT/NbQGQFTqUTWHMRCgZ52wYZiMq9XkzflE3ymiEiYX8uos+lOzrYZwTMjJ22XyQuJZQhkensyJwPFDh6apIqzNee1rekbFZVSYlP34AC5HjmVHcOpMMDsOPJRDoolzyo9RhDC4IG3dId4Mau41fFSLFQDgUxU4GJjjLShgnADTEm4lfDEWTGiPXFBhTY7UUZkDDLjsbG0JoJmL/mFUEQcVXZpMQU1FA3apmXMAgbE0GTW0NUbhDfLz4rUYkEh+xrg4mKDxiFTnIZa0VAWZ//OCxOwwLAY4AOpHMQWSNKweAcpoKmq9ytdp0EMtn7FSMqAi3NAyxDiQBIDI0Jap10LKhrBXsEZBAotDKBbY0yqQVjXRhToZjeHiZLu2KvZjouaiZYN65oWRnQOiBgbj3sp0tqq/xIZTZrQ1Km4w6IyGlik2gUrcnPPES6SohbOnE3PYk2BuhUfZSpkdcgh+sIS14VnjIFAwJAYdCIoBQwDBY0/iCNODPL2WMYHAOYglUe8nqYkgYGBSwZ5IPgiee0dBMyYGMwPBNCYt+EuJDc//84LE6yv77khU4Yc1z+ExZT9ilya+On6Q5qchXEWGLpxOdPoUpxxumz3mmWcXtoZoEDJGDtBrFZE11E8wxZxgSiemYgfds1UYtrqKN24vcxfNyrnnQx9PuyUfOdv8Mb/NNxO6KflHxijMeZgm/9ar4wLb2owgx1ZjNMyhJzw5xRE77He7Kt4ZkJqfzP7PkvSEmkMxo398qtd9wpXiTEHBJRpy22sl12qqnOC/2muA4bstzJQQRrZs3sXVYU1vDBaDxGAAIKAjC00rLZqJTg6es//zgsT/MqwGNMjrDSnyqcFx0KLJTPUp/FhxCwPilEYMuYQoSr1qQbFxbXuYw2zd9Do1VnTpxq9Y7Vq7SLZ27VX/5ZRfjcELJxLTlvq2yzuxcBL2MS0GQzblIJdTYLDI6VdCCk5iWHSLTWL23KIWZEVX+8Isr4In/DmL1Iiz2IyyJAYRWzEi3FYlgbtnTQjqilUKpCnAaoKVtO0wWAVpyAoztd5SSV6UDTi+w0CZhAOBxMyphsAACAdYzX2urhiSZIUD4zWdgwQA4AgS2vV60pli//OCxPYulBZIfNsG/Ke6FpYMjwpLGlyHAhJYh/U1OoEZXSMieaOKjp2x8bOKFb0RSf2jZ5ucPdfY5Ae56W4FjLuHET8C0kUUNQJERZpfZw9gTLG6uejvd71wIhtbrvmwYwuSmTPcwKtZaknt2k3c5eEk5N3/tu+H3Xn7iGqjHntPoOe+JYUqtxjfv+Es+6VNAiRsbnR0nt6lSTCPbV3LInaxhALqTEFNRTMuMTAxIChiZXRhIDMpqqqqqqqqqqqqqqqqqqqqqggEC7HLHHJNt9f/84LE/zSUDjQy6wz5G1MkaY1KoXZk78qbD6EnlIZdZ7asw8ghNbNRYZcaxbdlHwpghhBEISLE60KhyI12DUi1HvjzmviGmRm0FzpTwca3NnDFWJt3ahFR/FfCjS+xwrg7L6fm+vXuWfpn7RhW5J15HPnqVhl8TmfM2+zO5fkapZC8tadh5yz8tIfz+nbuIgRBY4mY1ClMQU1FAlShCKAMFRmm8WAMaRvCZ6XLSFuvqxYULZ2CIAYMlppt2nvjUTUEMChc5xfQNQwYAoccCOSvVv/zgsTOJLvGXb7aBvhta7HVmRCBJVm3TZCK1XOSIwbLG8XLoW5IVLVQuQzZrF24yqbaHSLJsa+0KqTZebRPgSRWZJCIysTRYSjqF5V6CLSZWxdIoQc3pHTx0/YwdCQgsgUlEuYRxGdoxyuF88nXQ2l3fspdU6080daTRt5hOf5E65UkPPjAXjhipXZUFmos0AfQOGCDiSsDTBYAEiAsBZk9EaVLztHgMEgAiGYQEEZCPOYCA0m+z6Bl8OCmgghEA4GGXQGIYdEoMhAAOrGq8jnZ//OCxPswBBY4VOJHNFxuZfhZkqj1NL4FEbQ2CR5dJcUvXXpZGfJ1azGUEYExrSpGosgaPka+iVucrEjEyO5/yohb4naRe1ZrpXN9i0+giQlBA0/DjYg50iqyTJrCqtnLhCqdN/WFs57TH5zdLYOzvD+AKUHmVTLNrxZTHx3Ta458/Nv/v7pXmSy41yaP0xN6UzFGOP8FmKOIOpCDcExBTUUzLjEwMSAgD6dqZfBdsuZUMhxZSpnF58nGUwMLi87ingUL1aXXfi1MO6roLBk4HMT/84LE/zLD7iwA6k0tOZJfJrtHayltzWMpfZCB/JRYdmXQRNUnxaWzAEsGOROR/CrVdHIqGskmEZMMfDwmJSbopgQYFSLNgROLHv1cbjFrcMZg1Uwo1CVwsuDaRKrl0RvBwq+NBKBZwvmrmXidJ0QoPXili4WwPZUItxM8mIZK01u3Hj6dzjHfuCro/4mgyXwo8U1QxKpMQU1FMy4xMAIxbCGigIXAAiBkxYYdXq22DMthseAIw0C85aKYmF1JqzJ4FwcNWwwBA82CM0IQsWBBof/zgsTuLIwGPPThh0zSQRK5D2rGXRbslA9Eiuw3NxNjhZm3ohYT4YsmaRsydqKLfYVQGopHlzCvhgebfUkk0UUErq1pxZIs9p5NFBck+sEkq9sxshVHCrEN84g0e+FLGPD2UhDHVY6/EDhVDrAYihSgJevJStEm9OqrZvk5gjpv8TYeb2vuHbZbD19dLsf/8XS5/6GoukxBTUUzLjEwMSAoYmV0YSAzKaqqqqqqqqqqAUabcaSjNXwausIYrVSLB/LjLkeQudGz2aEppMPTM5jc//OCxPcu5BYwUupHNIBIAY1XSROgGUZ27P3K0hp4MVo1cx0dscwMGarAiVn6nEh7RrSmQQJhJHTN2jYXJQ0q/hWpczK2C8gv90L1fPlSUWW201qRTslNj2KPYuzqjnZGI6T7M6kahb7t1ToZXKg0crujs9jrU2bZDMj5HdmZjk3orGV1Q4jRhUw8mgqIqgkLIUGII23VQJvUezAYB0LgcCZhs0YkEkMorLak5aQwLKs4/ZIwnAMt40tyXmZ03qYRbEUSEOM1OuB5n8a+UsldJPv/84LE5SpL/kR+2Ys1QHSlEdk5ASoVwHRFF7KilvcmigqbJNOQGDAklFEUIFpq4iRkYqEKdRUOw2zDn00i/vW4qkCMkuW1bltKXrMdZ3Nna2uqXP6tZHuFJ6RQIFMaRBnMZ9Qc4vKQshaRSpLqyczKaGd3uGpQtjjOm45qtlxOTrb3W3b/O17nv08Htndp3GRxqw89HeSTBQDYIRkglUShkYOgCCAKMIXyBQLwK2RW1qJgOARiwGZ/8DRkAA4kBa6Xdkctm2gJVmCAQmAoGoYNDv/zgsT/MjPuKErqTS2KGJuY/Gre0kzDluA4BtjzsIyLCtU7xy+X0d7ULVrLo43pOoX2+kk1lUkTTWiBlsYoysxc410S6RMurN+EfGcijVfcRrYILD8UoxH7cvU5Mxdd28MVaJ2QYqGtPJ9ITmoMbX1XqCvved6pZuS390J85TMrO+ykj7xLed7KI5cMZz9Qms38pfZI253vcQnSLo6MKwCOgQFCIwGCC15YwKGDOn0LhBUCCIJmFWYfr4Zh0IAwCuVAj9y19mWx8wYnyhPuXUp0//OCxPoxfAYgKusNKQmVqRBdbFh0+mciMkJk5H6WoKKT5PD8TTUC2l5o2uqfQMvsuP3PNYL5wvd/UaVTGJq5Jt2rPOSSqq9m6lrFlRQq0YYwrTsqzjLNPFd2w1t2cKt/OW27Wb4loflbmxWak2zE6vY7bKvmpa2PtY7Z85+dp7ZDs2///vrV5o3oFt/2yLaPLjyWkTr/jQYBhgMKIXCkwCAwwHkYBA2WkYWn6WrMCgqMP05PE7YMWwtCAkSVJAATXbZoyO4iC4y0lwwMBAlBGIP/84LE+C9r7iQ04wz1T7LIYD7RkSREHAemyfAwrxImKQfwRotVR1QsPb8odmiNxpAakouLOJEpBmQdN5PSVlBREq0SOTTEmb3UlVws7kzeWVScpCf/B207Pa2SRjD2aWeKooupbIUQ1DJFY3cwsj3nr058g6SmdTOke8PMEisJo81JzS9700Y5tjkp7Zt6eqkq9+lRZR7Eh+Ykzn6atLpuTp8KlYKy51goBipEJ46saA1x2dNaRNMBQAMShFPkBfBRakwLJctsyhjUMrDAgCTS0//zgsT+NCQWFADrDPD8SRESBJwuNhsusiPnTysCZXkrLaGmLYDw8wo9N6iEKt1MnPotefFbcJlU1hMfLjah0gqKRlJq5RvVMZRqHZGH9W2qmsr+hV32ms+GhEhx1Mq9eIZEZGoMEQKe4JBI65LX4HE0EKUMTMLjuJKYUT8Fg2hkbkpsHJTPjbHDMMLJggWEM47N59Bsp/oJb/cEa3qfkgoLFamAgDioDmAwIBARGBTAAIHlLiyqVQVAQLBKYOnodKu+YShIBAFQyk7+yCC1cGBo//OCxPEwVBYcMupG/F5qI6pkuB4oBTA3EEgjKsuaTJSZkTpKuTbVi6SEjNJlelqx8iuy/yj8klKkkFZpssImbipdI6o7C5mmwwjCudBOT8wGjQmYmCVGzYqjl5jVP9Ygzt96TOl3n2lVf4rOxt5HRVc0/949W6+ne9ngk+KaqZ3vxcmyyL92/f+c6GYcf/8R2w9PExv85e5necn9eO9GWVVg4LHxQHmD7ZlAqImJhigFNzBAHGDaJnC9nGFYWpILBu80UUAFWRGUKCMYa34ZBhP/84LE8zBz9hQI6kz1AgF2aQzcWnxJJeRnI3Qh+VmumJWGTGB04YyuzFgZYFZFRcxgXKdSegdJ0kANiFmTaUoWTYjwyzC1TsI4hW/WzZdGHkztl1j09+8fSpdm2mc6dM0zH5tUi+v/F+4FoI1F8Dyk72Xi8rJ/a9V5kiz0pvG+0ceMpm8nxuMRNw3KNmNjDf8+T/P1OJzknjmuj12CTANAMW4JAJigvAKBjQVdFTVMEwCwEDBiDbNBYY0DByiQDY0AayeWLWay36ghiOikmGMBEf/zgsT1L/QOCADrDOUQESZsjwoQwkiOhUX7YyPoHoVTwq7qSN7UoNiUhcvZc+MSZ0F4nCtuZ9RhiTsKJGnUYystvb0tlvkZSt71RjEtc5eEp35JF4mTZc/WEyZUteU7FRTlUlTI0VKU9HKireSVwMpKkzt3dufXzo0rImehr4xpxyPVNo4+PrmVrMDW/NJnTU5GRW6qqnJe7pGWFY3aeYSA8fEhyZOW5kQHDQOYYpcmkCAWQSo7WDhGNi7KjiwsUrMra4CRyb2b5ioJjgGYu2Qd//OCxPkw1AoAAPJM7WyWdQSoNdaZCG3uhOmmoiW7muWbc6aVITTTm8iuO2GW2ZCCTGuycv9f7J1kkdasqtP6J0tdUs9GDHuOjUtOHFuznGQq1ZLqs0hp3Ru47t3KSZu55RUJTOfBWEZcayVT7P5rNlOXaNYvnEdJEXrlTNDkSjpBrXEseZ26XJ4q4padooUSLpH81CJIwExBTUUzLjEwMSAoYmV0YSAzKVVVVVVVVVVVVVVVVVVVVQKuq+ozackKqGpAAbDH/fB4UmTb6CSzmhT/84LE+S/EDfgK4kzlaIDiErktIlqlwZqRfMujZjIrFVcMBGFXvQoCs6pUBUKBMx+qib2AQp1iqqkGFYZSZmblZuHVUBonq/S1ElxsK2FAVgpmX/jMyqqlAIUBEalhRLXDOAiZVJS+AQEfw9vjLKAk1XZgoCFARKq2q/qrVYaqQYqAiVjHAon1X/6s1oWhVjev0KsZoGVMQU1FMy4xMDEgKGJldGEgMylVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zgsTdKGQV7FTGRjRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV","yinqing":"data:audio/mp3;base64,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"};

    // 4. Web Audio 升級版：真品法器音效與聲學物理合成器
    const ZenAudio = (function () {
      let audioCtx = null;
      const audioBuffers = {
        muyu: null,
        daqing: null,
        yinqing: null
      };
      let isPreloading = false;

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

      function base64ToArrayBuffer(base64Data) {
        try {
          const binaryString = window.atob(base64Data.split(',')[1]);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          return bytes.buffer;
        } catch (e) {
          console.warn('base64ToArrayBuffer error:', e);
          return null;
        }
      }

      function preloadSamples() {
        if (isPreloading) return;
        isPreloading = true;
        const ctx = getContext();
        if (!ctx || typeof AUDIO_SAMPLES === 'undefined') return;

        ['muyu', 'daqing', 'yinqing'].forEach(key => {
          if (AUDIO_SAMPLES[key]) {
            try {
              const ab = base64ToArrayBuffer(AUDIO_SAMPLES[key]);
              if (ab) {
                ctx.decodeAudioData(ab, function (buf) {
                  audioBuffers[key] = buf;
                }, function (err) {
                  console.warn('decodeAudioData error for ' + key, err);
                });
              }
            } catch (e) {
              console.warn('Failed to decode ' + key, e);
            }
          }
        });
      }

      function playBuffer(key, volume = 0.85, pitchVariation = 0.03) {
        const ctx = getContext();
        if (!ctx) return false;
        preloadSamples();
        const buf = audioBuffers[key];
        if (!buf) return false;

        const source = ctx.createBufferSource();
        source.buffer = buf;
        source.playbackRate.value = 1.0 + (Math.random() - 0.5) * pitchVariation;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);
        return true;
      }

      return {
        init: function () {
          preloadSamples();
        },

        // 1. 木魚敲擊 (真品錄音優先，物理聲學合成降級)
        playWoodfish: function () {
          try {
            if (playBuffer('muyu', 0.9, 0.04)) return;

            // 物理聲學降級：短脈衝白噪聲撞擊 + 520Hz 亥姆霍茲空腔共鳴 + 175Hz 木身震動
            const ctx = getContext();
            if (!ctx) return;
            const now = ctx.currentTime;

            // 槌頭撞擊
            const bufSize = Math.floor(ctx.sampleRate * 0.015);
            const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
            const out = noiseBuf.getChannelData(0);
            for (let i = 0; i < bufSize; i++) {
              out[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.003));
            }
            const noiseSource = ctx.createBufferSource();
            noiseSource.buffer = noiseBuf;
            const clickFilter = ctx.createBiquadFilter();
            clickFilter.type = 'bandpass';
            clickFilter.frequency.setValueAtTime(2200, now);
            clickFilter.Q.setValueAtTime(3, now);
            const clickGain = ctx.createGain();
            clickGain.gain.setValueAtTime(0.35, now);
            clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
            noiseSource.connect(clickFilter);
            clickFilter.connect(clickGain);
            clickGain.connect(ctx.destination);
            noiseSource.start(now);

            // 樟木腔體 (520Hz)
            const f0 = 520 * (1 + (Math.random() - 0.5) * 0.03);
            const oscBody = ctx.createOscillator();
            const gainBody = ctx.createGain();
            oscBody.type = 'sine';
            oscBody.frequency.setValueAtTime(f0 + 15, now);
            oscBody.frequency.exponentialRampToValueAtTime(f0, now + 0.02);
            gainBody.gain.setValueAtTime(0.75, now);
            gainBody.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            oscBody.connect(gainBody);
            gainBody.connect(ctx.destination);
            oscBody.start(now);
            oscBody.stop(now + 0.09);

            // 木身低頻 (175Hz)
            const oscLow = ctx.createOscillator();
            const gainLow = ctx.createGain();
            oscLow.type = 'sine';
            oscLow.frequency.setValueAtTime(175, now);
            gainLow.gain.setValueAtTime(0.45, now);
            gainLow.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            oscLow.connect(gainLow);
            gainLow.connect(ctx.destination);
            oscLow.start(now);
            oscLow.stop(now + 0.06);

          } catch (e) {
            console.warn('Woodfish audio error:', e);
          }
        },

        // 2. 引磬敲擊 (高亢清越，1960Hz / 1963.5Hz 雙模態拍頻)
        playChime: function () {
          try {
            if (playBuffer('yinqing', 0.85, 0.02)) return;

            const ctx = getContext();
            if (!ctx) return;
            const now = ctx.currentTime;

            [1960, 1963.5, 4420].forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now);
              const initGain = idx === 2 ? 0.2 : 0.45;
              gain.gain.setValueAtTime(initGain, now);
              gain.gain.exponentialRampToValueAtTime(0.0001, now + (idx === 2 ? 0.8 : 2.2));
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now);
              osc.stop(now + 2.3);
            });
          } catch (e) {
            console.warn('Chime audio error:', e);
          }
        },

        // 3. 法鼓山大磬敲擊 (青銅大磬，472Hz / 475.2Hz 拍頻 3.2Hz，餘音 4.5s)
        playGrandBell: function () {
          try {
            if (playBuffer('daqing', 0.95, 0.01)) return;

            const ctx = getContext();
            if (!ctx) return;
            const now = ctx.currentTime;

            [
              { f: 472.0, g: 0.6, decay: 4.5 },
              { f: 475.2, g: 0.55, decay: 4.5 },
              { f: 236.0, g: 0.3, decay: 3.0 },
              { f: 869.0, g: 0.35, decay: 2.8 },
              { f: 1318.0, g: 0.15, decay: 1.5 }
            ].forEach(item => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(item.f, now);
              gain.gain.setValueAtTime(0.001, now);
              gain.gain.linearRampToValueAtTime(item.g, now + 0.015);
              gain.gain.exponentialRampToValueAtTime(0.0001, now + item.decay);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now);
              osc.stop(now + item.decay + 0.1);
            });
          } catch (e) {
            console.warn('Grand Bell audio error:', e);
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

    // 9.5. 法鼓山官方影音伴誦控制
    function openDdmPlayer() {
      const practice = cleanData[AppState.currentPracticeKey];
      if (!practice || !practice.youtubeId) return;

      const titleEl = document.getElementById('ddmPlayerTitle');
      const iframe = document.getElementById('ddmIframe');
      const modal = document.getElementById('ddmPlayerModal');

      if (titleEl) titleEl.textContent = '法鼓山' + practice.title + '官方念誦';
      if (iframe) {
        iframe.src = 'https://www.youtube-nocookie.com/embed/' + practice.youtubeId + '?autoplay=1&enablejsapi=1&rel=0';
      }
      if (modal) modal.classList.remove('hidden');
    }

    function closeDdmPlayer() {
      const modal = document.getElementById('ddmPlayerModal');
      const iframe = document.getElementById('ddmIframe');
      if (modal) modal.classList.add('hidden');
      if (iframe) iframe.src = ''; // 停止播放音頻
    }

    // 引磬與大磬敲擊
    function strikeYinqing() {
      ZenAudio.playChime();
      const btn = document.getElementById('strikeYinqingBtn');
      if (btn) {
        btn.classList.add('striking');
        setTimeout(() => btn.classList.remove('striking'), 150);
      }
    }

    function strikeDaqing() {
      ZenAudio.playGrandBell();
      const btn = document.getElementById('strikeDaqingBtn');
      if (btn) {
        btn.classList.add('striking');
        setTimeout(() => btn.classList.remove('striking'), 150);
      }
    }

    // 自動木魚節拍器 (45 BPM 禪定節奏)
    let autoMuyuInterval = null;
    function toggleAutoMuyu() {
      const btn = document.getElementById('autoMuyuBtn');
      if (autoMuyuInterval) {
        clearInterval(autoMuyuInterval);
        autoMuyuInterval = null;
        if (btn) {
          btn.classList.remove('bg-amber-500', 'text-stone-950');
          btn.classList.add('bg-panel-elevated', 'c-muted');
        }
        showToast('已停止自動木魚伴奏');
      } else {
        ZenAudio.playWoodfish();
        autoMuyuInterval = setInterval(() => {
          ZenAudio.playWoodfish();
          const fishBtn = document.getElementById('strikeWoodfishBtn');
          if (fishBtn) {
            fishBtn.classList.add('striking');
            setTimeout(() => fishBtn.classList.remove('striking'), 120);
          }
        }, 1333); // ~45 BPM
        if (btn) {
          btn.classList.remove('bg-panel-elevated', 'c-muted');
          btn.classList.add('bg-amber-500', 'text-stone-950');
        }
        showToast('已開啟自動木魚（45 BPM 禪定速）');
      }
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
