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

// 產生全新的 index.html
const html = `<!DOCTYPE html>
<html lang="zh-TW" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>觀音法門定課 v1.1 — 普門品・大悲咒・心經（法鼓山修持定課系統）</title>
  <meta name="description" content="法鼓山觀音法門修持定課系統：普門品、大悲咒、心經三種日課，手機經本翻頁模式、10遍佛號短課、Nano Banana禪意美學Logo。">

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Google Fonts: 楷體與思源宋體 -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500;600;700;900&family=Noto+Sans+TC:wght@300;400;500;600&display=swap" rel="stylesheet">

  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            obsidian: '#14171A',
            darkSlate: '#1C2024',
            warmSand: '#EBE6DC',
            teaGold: '#D4AF37',
            celadon: '#4A7C59',
            cinnabar: '#B83A22',
            parchment: '#E6DFD5'
          },
          fontFamily: {
            serif: ['"Noto Serif TC"', 'BiauKai', 'DFKai-SB', 'serif'],
            sans: ['"Noto Sans TC"', 'sans-serif']
          }
        }
      }
    }
  </script>

  <style>
    /* 全域防禦與護眼配色系統 */
    :root {
      --bg-base: #14171A;
      --bg-surface: #1C2024;
      --bg-surface-elevated: #24292F;
      --border-subtle: rgba(212, 175, 55, 0.18);
      --border-focus: rgba(212, 175, 55, 0.55);
      --text-primary: #E6DFD5;
      --text-secondary: #ADA598;
      --text-muted: #7E766B;
      --accent-gold: #D4AF37;
      --accent-gold-glow: rgba(212, 175, 55, 0.15);
      --accent-celadon: #4A7C59;
      --accent-cinnabar: #B83A22;
      --card-overlay: rgba(28, 32, 36, 0.82);
      --hero-pattern: radial-gradient(circle at 50% 18%, rgba(212, 175, 55, 0.08) 0%, rgba(20, 23, 26, 0.96) 72%);
    }

    [data-theme="stone"] {
      --bg-base: #EBE6DC;
      --bg-surface: #F4EFE6;
      --bg-surface-elevated: #EDE7DC;
      --border-subtle: rgba(160, 120, 50, 0.22);
      --border-focus: rgba(160, 120, 50, 0.6);
      --text-primary: #2C261E;
      --text-secondary: #584F43;
      --text-muted: #82786C;
      --accent-gold: #9A6D1A;
      --accent-gold-glow: rgba(154, 109, 26, 0.12);
      --accent-celadon: #2D6A4F;
      --accent-cinnabar: #A8321B;
      --card-overlay: rgba(244, 239, 230, 0.92);
      --hero-pattern: radial-gradient(circle at 50% 18%, rgba(154, 109, 26, 0.08) 0%, rgba(235, 230, 220, 0.96) 72%);
    }

    [data-theme="celadon"] {
      --bg-base: #131E1B;
      --bg-surface: #1B2925;
      --bg-surface-elevated: #233430;
      --border-subtle: rgba(94, 168, 134, 0.22);
      --border-focus: rgba(94, 168, 134, 0.6);
      --text-primary: #E1ECE6;
      --text-secondary: #9DB4A9;
      --text-muted: #6E857B;
      --accent-gold: #D4AF37;
      --accent-gold-glow: rgba(94, 168, 134, 0.15);
      --accent-celadon: #5EA886;
      --accent-cinnabar: #C04E38;
      --card-overlay: rgba(27, 41, 37, 0.88);
      --hero-pattern: radial-gradient(circle at 50% 18%, rgba(94, 168, 134, 0.1) 0%, rgba(19, 30, 27, 0.96) 72%);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      background-color: var(--bg-base);
      color: var(--text-primary);
      font-family: var(--font-serif, "Noto Serif TC", serif);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.7;
      transition: background-color 0.3s ease, color 0.3s ease;
      background-image: var(--hero-pattern);
      background-attachment: fixed;
      user-select: none;
    }

    /* 頂部導覽列 */
    .app-header {
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(12px);
      background-color: rgba(28, 32, 36, 0.88);
      border-bottom: 1px solid var(--border-subtle);
      transition: all 0.3s ease;
    }
    [data-theme="stone"] .app-header {
      background-color: rgba(244, 239, 230, 0.92);
    }
    [data-theme="celadon"] .app-header {
      background-color: rgba(27, 41, 37, 0.92);
    }

    /* 禪意卡片懸浮微動效 */
    .zen-card {
      background-color: var(--card-overlay);
      border: 1px solid var(--border-subtle);
      backdrop-filter: blur(8px);
      transition: all 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .zen-card:hover {
      transform: translateY(-3px);
      border-color: var(--border-focus);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
    }
    [data-theme="stone"] .zen-card:hover {
      box-shadow: 0 12px 24px rgba(70, 58, 45, 0.12);
    }

    /* 經本翻頁動效 (Book Flip Animation) */
    .book-page-wrap {
      perspective: 1200px;
      transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s ease;
    }
    .page-slide-left {
      animation: pageTurnLeft 0.22s ease-out forwards;
    }
    .page-slide-right {
      animation: pageTurnRight 0.22s ease-out forwards;
    }

    @keyframes pageTurnLeft {
      0% { transform: translateX(24px) scale(0.98); opacity: 0; }
      100% { transform: translateX(0) scale(1); opacity: 1; }
    }
    @keyframes pageTurnRight {
      0% { transform: translateX(-24px) scale(0.98); opacity: 0; }
      100% { transform: translateX(0) scale(1); opacity: 1; }
    }

    /* 木魚敲擊微動畫 */
    @keyframes fish-strike {
      0% { transform: scale(1); }
      40% { transform: scale(0.92) rotate(-3deg); }
      100% { transform: scale(1); }
    }
    .striking {
      animation: fish-strike 0.15s ease;
    }

    /* 彈窗遮罩 */
    .modal-backdrop {
      background: rgba(10, 12, 14, 0.82);
      backdrop-filter: blur(6px);
      transition: opacity 0.25s ease;
    }
  </style>
</head>
<body class="relative selection:bg-amber-900 selection:text-amber-100">

  <!-- ==================== 頂部導覽列 ==================== -->
  <header class="app-header w-full px-4 sm:px-8 py-3 relative z-40">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-3">
      
      <!-- 左側 Logo 與標題 -->
      <div id="brandLogoHomeBtn" class="flex items-center gap-3 cursor-pointer select-none group">
        <!-- 動態 Logo 容器 (支援 Nano Banana 高清圓標) -->
        <div id="currentLogoContainer" class="w-10 h-10 rounded-full border border-amber-500/40 p-0.5 overflow-hidden flex items-center justify-center bg-black/40 shadow-inner group-hover:border-amber-400 group-hover:scale-105 transition-all" title="點選更換 Logo">
          <!-- 動態載入 Logo 圖片 -->
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-base sm:text-lg font-bold tracking-wider text-primary group-hover:text-amber-400 transition-colors">
              觀音法門定課
            </h1>
            <span class="text-[10px] font-sans px-1.5 py-0.2 rounded border border-amber-600/40 text-amber-500 font-medium">v1.1</span>
          </div>
          <p class="text-[11px] text-muted hidden sm:block tracking-wide">法鼓山大事關懷・觀世音菩薩修持日課</p>
        </div>
      </div>

      <!-- 右側「日課」、「設定」與外觀選單 -->
      <div class="flex items-center gap-2 sm:gap-3">
        
        <!-- 「日課」選單按鈕（合掌與經卷圖標） -->
        <button id="openDailyRecordsBtn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-subtle hover:border-amber-500/70 hover:bg-amber-500/10 text-xs sm:text-sm font-medium transition-all" title="修持日曆與打卡紀錄">
          <svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            <path d="M9 7h6"/>
            <path d="M9 11h6"/>
          </svg>
          <span>日課</span>
          <span id="dailyCheckIndicator" class="w-2 h-2 rounded-full bg-emerald-500 hidden" title="今日已圓滿打卡"></span>
        </button>

        <!-- 「設定」選單按鈕（引磬與齒輪圖標） -->
        <button id="openSettingsBtn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-subtle hover:border-amber-500/70 hover:bg-amber-500/10 text-xs sm:text-sm font-medium transition-all" title="系統設定與Logo更換">
          <svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span class="hidden sm:inline">設定</span>
        </button>

      </div>
    </div>
  </header>

  <!-- ==================== 主要視圖區塊 ==================== -->
  <main class="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-8 py-5 sm:py-8 relative z-10 flex flex-col justify-start">
    
    <!-- ==================== 1. 首頁視圖 (HOME VIEW) ==================== -->
    <div id="homeView" class="w-full flex flex-col items-center">
      
      <!-- 禪意標題與法語橫幅 -->
      <div class="text-center max-w-3xl mb-8 sm:mb-10 mt-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/25 bg-amber-500/5 text-amber-500 text-xs sm:text-sm mb-3">
          <span>🙏</span>
          <span class="tracking-widest">念觀音・求觀音・學觀音・做觀音</span>
        </div>
        <h2 class="text-2xl sm:text-4xl font-bold tracking-widest text-primary mb-3">
          觀音法門日課修持
        </h2>
        <p class="text-xs sm:text-sm text-secondary max-w-xl mx-auto leading-relaxed">
          遵照法鼓山聖嚴法師「觀音法門修持方法」與僧團大事關懷課誦標準。收錄三門核心日課，請選擇今日欲持誦之定課：
        </p>
      </div>

      <!-- 三種定課卡片網格 -->
      <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8 mb-8">
        
        <!-- 卡片 1：《普門品》定課 -->
        <div class="zen-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden group cursor-pointer" onclick="openPracticeConfig('pumenpin')">
          <div class="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          
          <div>
            <div class="w-14 h-14 rounded-2xl bg-emerald-900/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:border-emerald-500/60 transition-colors">
              <svg class="w-8 h-8" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 44 C22 52 42 52 56 44"/>
                <path d="M14 42 Q32 20 50 14 Q38 32 32 44"/>
                <circle cx="32" cy="18" r="4" fill="currentColor"/>
              </svg>
            </div>

            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-500/30">法華精髓</span>
              <span class="text-xs text-muted">全品20分 / 偈頌5分</span>
            </div>

            <h3 class="text-xl font-bold tracking-wide text-primary group-hover:text-amber-400 transition-colors mb-2">
              《普門品》定課
            </h3>
            
            <p class="text-xs text-amber-500/90 font-medium mb-3">
              慈悲救護・三十二應普門示現
            </p>

            <p class="text-xs text-secondary leading-relaxed mb-6">
              聞名免七難、離三毒、滿二願。支援「全品長行＋偈頌」或切換「32偈頌專修短課」，彈性自在。
            </p>
          </div>

          <div class="pt-4 border-t border-subtle flex items-center justify-between text-xs font-medium">
            <span class="text-muted">全品 或 偈頌專修</span>
            <button class="px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 group-hover:bg-amber-500 group-hover:text-stone-900 transition-all font-semibold flex items-center gap-1">
              <span>發心持誦</span>
              <span>→</span>
            </button>
          </div>
        </div>

        <!-- 卡片 2：〈大悲咒〉定課 -->
        <div class="zen-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden group cursor-pointer" onclick="openPracticeConfig('dabeizhou')">
          <div class="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          
          <div>
            <div class="w-14 h-14 rounded-2xl bg-amber-900/30 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:border-amber-500/60 transition-colors">
              <svg class="w-8 h-8" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="32" cy="32" r="22"/>
                <circle cx="32" cy="32" r="12"/>
                <path d="M32 10 L32 54"/>
                <path d="M10 32 L54 32"/>
                <path d="M16 16 L48 48"/>
                <path d="M16 48 L48 16"/>
              </svg>
            </div>

            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-semibold px-2 py-0.5 rounded bg-amber-900/40 text-amber-400 border border-amber-500/30">神咒除障</span>
              <span class="text-xs text-muted">遍數隨喜</span>
            </div>

            <h3 class="text-xl font-bold tracking-wide text-primary group-hover:text-amber-400 transition-colors mb-2">
              〈大悲咒〉定課
            </h3>
            
            <p class="text-xs text-amber-500/90 font-medium mb-3">
              千手千眼・廣大圓滿無礙大悲心
            </p>

            <p class="text-xs text-secondary leading-relaxed mb-6">
              八十四句神咒。發十大宏願、六向無畏心，藉陀羅尼清淨自心，消除累劫宿業與煩惱障礙。
            </p>
          </div>

          <div class="pt-4 border-t border-subtle flex items-center justify-between text-xs font-medium">
            <span class="text-muted">可選 3、7 或 21 遍</span>
            <button class="px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 group-hover:bg-amber-500 group-hover:text-stone-900 transition-all font-semibold flex items-center gap-1">
              <span>發心持誦</span>
              <span>→</span>
            </button>
          </div>
        </div>

        <!-- 卡片 3：《心經》定課 -->
        <div class="zen-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden group cursor-pointer" onclick="openPracticeConfig('xinjing')">
          <div class="absolute top-0 right-0 w-28 h-28 bg-sky-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          
          <div>
            <div class="w-14 h-14 rounded-2xl bg-sky-900/30 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-5 group-hover:border-sky-500/60 transition-colors">
              <svg class="w-8 h-8" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M32 10 C46 10 54 22 54 34 C54 48 42 54 30 54 C18 54 10 44 10 32 C10 18 24 12 34 12"/>
              </svg>
            </div>

            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-semibold px-2 py-0.5 rounded bg-sky-900/40 text-sky-400 border border-sky-500/30">般若空慧</span>
              <span class="text-xs text-muted">約 5 分鐘</span>
            </div>

            <h3 class="text-xl font-bold tracking-wide text-primary group-hover:text-amber-400 transition-colors mb-2">
              《心經》定課
            </h3>
            
            <p class="text-xs text-amber-500/90 font-medium mb-3">
              般若波羅蜜多・照見五蘊皆空
            </p>

            <p class="text-xs text-secondary leading-relaxed mb-6">
              二百六十字經文精華。體悟無所得、心無罣礙無有恐怖，向內觀照，契合無上菩提正道。
            </p>
          </div>

          <div class="pt-4 border-t border-subtle flex items-center justify-between text-xs font-medium">
            <span class="text-muted">經心 260 字</span>
            <button class="px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 group-hover:bg-amber-500 group-hover:text-stone-900 transition-all font-semibold flex items-center gap-1">
              <span>發心持誦</span>
              <span>→</span>
            </button>
          </div>
        </div>

      </div>

      <!-- 額外推薦：三門合修完整定課橫幅 -->
      <div class="w-full zen-card rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-amber-500/20 bg-amber-500/5">
        <div class="flex items-center gap-3.5 text-center sm:text-left">
          <div class="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-500 flex-shrink-0">
            <span>✨</span>
          </div>
          <div>
            <h4 class="text-sm sm:text-base font-bold text-primary">三門合修・完整貫通定課</h4>
            <p class="text-xs text-secondary">前導淨水讚開經唯一次，連貫持誦「普門品 ➔ 大悲咒 ➔ 心經」，圓滿讚偈、發願、皈依與迴向。</p>
          </div>
        </div>
        <button onclick="openPracticeConfig('merged')" class="px-4 py-2 rounded-lg bg-amber-500 text-stone-950 font-semibold text-xs sm:text-sm hover:bg-amber-400 transition-colors flex-shrink-0">
          啟動三門合修
        </button>
      </div>

    </div>

    <!-- ==================== 2. 專注持誦視圖 (PRACTICE VIEW) ==================== -->
    <div id="practiceView" class="w-full flex-col hidden">
      
      <!-- 頂部控制列 (返回、範圍切換、翻書/卷軸切換、計數) -->
      <div class="zen-card rounded-xl p-3 sm:p-4 mb-4 flex flex-wrap items-center justify-between gap-2.5 border border-subtle">
        
        <div class="flex items-center gap-2">
          <button onclick="returnToHome()" class="px-2.5 py-1 rounded-md border border-subtle hover:border-amber-500 hover:text-amber-400 text-xs flex items-center gap-1 transition-all">
            <span>←</span>
            <span>首頁</span>
          </button>
          <div class="h-3.5 w-[1px] bg-subtle"></div>
          <h2 id="practiceTitleDisplay" class="text-sm sm:text-base font-bold text-primary">
            《普門品》定課
          </h2>
          <!-- 普門品專屬範圍切換晶片 -->
          <button id="scopeToggleChipBtn" onclick="togglePracticeScopeInView()" class="hidden px-2.5 py-0.5 rounded-full border border-sky-500/40 bg-sky-500/15 text-sky-300 text-[11px] font-semibold hover:bg-sky-500/30 transition-all flex items-center gap-1">
            <span>⇄</span>
            <span>範圍切換</span>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <!-- 【經本翻頁 ⇄ 卷軸連貫】切換開關 -->
          <button id="btnToggleReadingMode" onclick="toggleReadingMode()" class="px-2.5 py-1 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-all flex items-center gap-1.5" title="切換經本翻書或卷軸模式">
            <span id="readingModeIcon">📖</span>
            <span id="readingModeText">經本翻頁</span>
          </button>

          <!-- 當前修持計數徽章 -->
          <div id="badgeMantraRep" class="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-500 font-semibold text-xs">
            遍數：<span id="currentMantraRepText">1</span>/<span id="targetMantraRepText">1</span>
          </div>
          <div id="badgeBuddhaRep" class="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-xs">
            聖號：<span id="currentBuddhaCountText">0</span>/<span id="targetBuddhaCountText">10</span>
          </div>
        </div>

      </div>

      <!-- A. 經本翻頁視圖 (BOOK MODE - 手機專屬折頁翻書體驗) -->
      <div id="bookModeContainer" class="w-full flex flex-col items-center">
        
        <!-- 經本外框與卡片 -->
        <div id="bookPageCard" class="book-page-wrap w-full zen-card rounded-2xl p-6 sm:p-10 border border-amber-500/35 relative min-h-[460px] sm:min-h-[520px] flex flex-col justify-between shadow-2xl bg-gradient-to-b from-stone-900/90 to-stone-950/95">
          
          <!-- 翻頁卡片頂部：頁碼與科判標題 -->
          <div class="flex items-center justify-between pb-3 border-b border-subtle/60 text-xs">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              <span id="bookPageTitle" class="font-bold text-amber-500 tracking-wider">【開經偈】</span>
              <span id="bookPageSubtitle" class="text-muted text-[11px] hidden sm:inline"></span>
            </div>
            <div class="text-muted font-sans tracking-widest text-[11px]">
              頁碼 <span id="bookCurrentPageNum" class="text-amber-400 font-bold">1</span> / <span id="bookTotalPageNum">10</span>
            </div>
          </div>

          <!-- 翻頁卡片正文區塊 (支援左右滑動與點擊翻頁) -->
          <div id="bookPageContent" class="my-auto py-6 sm:py-8 space-y-4 leading-loose text-center sm:text-left text-lg sm:text-xl font-serif text-primary tracking-wide">
            <!-- 動態載入當前頁經文 -->
          </div>

          <!-- 翻頁卡片底部：左右翻頁控制與手勢引導 -->
          <div class="pt-4 border-t border-subtle/60 flex items-center justify-between">
            <button id="bookPrevPageBtn" onclick="prevBookPage()" class="px-4 py-2 rounded-xl border border-subtle hover:border-amber-500 hover:bg-amber-500/10 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all text-secondary disabled:opacity-30 disabled:pointer-events-none">
              <span>❮</span>
              <span>上一頁</span>
            </button>

            <!-- 翻頁進度小指示點 (手機友善) -->
            <div id="bookPageDots" class="hidden sm:flex items-center gap-1 text-[11px] text-muted">
              <!-- 動態生成點 -->
            </div>

            <button id="bookNextPageBtn" onclick="nextBookPage()" class="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 active:scale-95 text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md">
              <span id="bookNextBtnText">下一頁</span>
              <span>❯</span>
            </button>
          </div>

          <!-- 手機翻頁提示微字 -->
          <div class="text-center text-[10px] text-muted/60 pt-2 tracking-widest sm:hidden">
            ← 支援左右滑動手勢翻頁 →
          </div>

        </div>

      </div>

      <!-- B. 卷軸連續視圖 (SCROLL MODE) -->
      <div id="scrollModeContainer" class="w-full flex-col hidden">
        <!-- 科判快速跳轉膠囊列 -->
        <div id="sectionNavPills" class="flex items-center gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar text-xs"></div>
        <!-- 經文主內容容器 -->
        <div id="scriptureContentContainer" class="zen-card rounded-2xl p-6 sm:p-10 mb-20 space-y-12 leading-loose text-base sm:text-lg font-serif"></div>
      </div>

      <!-- 底部懸浮禪意輔助工具列 (木魚、計數、字級、打卡) -->
      <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl zen-card rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between border border-amber-500/30 shadow-2xl bg-stone-900/95 backdrop-blur-md">
        
        <!-- 木魚按鈕 -->
        <button id="strikeWoodfishBtn" class="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/30 text-amber-400 text-xs font-medium transition-all group" title="敲擊木魚 (或按鍵盤空白鍵)">
          <span class="text-base group-active:scale-90 transition-transform">🪘</span>
          <span>敲木魚</span>
        </button>

        <!-- 當前遍數/聲數累加快捷鍵 -->
        <button id="incrementRepBtn" class="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm hover:bg-amber-400 active:scale-95 transition-all shadow-md">
          <span>+1 遍 / 聲</span>
        </button>

        <!-- 字級切換 -->
        <div class="flex items-center gap-1 border border-subtle rounded-full px-1.5 py-0.5 text-xs text-secondary">
          <button onclick="setFontSize('normal')" id="btnFontNormal" class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">中</button>
          <button onclick="setFontSize('large')" id="btnFontLarge" class="px-2 py-0.5 rounded-full hover:text-amber-400">大</button>
          <button onclick="setFontSize('xlarge')" id="btnFontXLarge" class="px-2 py-0.5 rounded-full hover:text-amber-400">特</button>
        </div>

        <!-- 圓滿完成打卡按鈕 -->
        <button onclick="finishPracticeAndCheckIn()" class="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm transition-all shadow flex items-center gap-1">
          <span>🙏</span>
          <span class="hidden sm:inline">圓滿打卡</span>
        </button>

      </div>

    </div>

  </main>

  <!-- ==================== 彈窗 1：遍數設定彈窗 (CONFIG MODAL) ==================== -->
  <div id="practiceConfigModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop hidden">
    <div class="zen-card w-full max-w-lg rounded-2xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl relative">
      
      <div class="flex items-center justify-between mb-5 pb-3 border-b border-subtle">
        <div class="flex items-center gap-2.5">
          <span class="text-xl">🪷</span>
          <h3 id="configModalTitle" class="text-lg font-bold text-primary">設定定課遍數</h3>
        </div>
        <button onclick="closePracticeConfig()" class="text-muted hover:text-primary text-xl font-bold p-1">✕</button>
      </div>

      <!-- 普門品專屬：修持範圍選擇 -->
      <div id="pumenpinScopeWrapper" class="mb-5 hidden">
        <label class="block text-xs font-semibold text-sky-400 mb-2">普門品修持範圍：</label>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <button type="button" onclick="setPumenpinScope('all')" id="pumenpinScope_all" class="py-2.5 px-3 rounded-lg border text-center transition-all border-amber-500 bg-amber-500 text-stone-950 font-bold flex flex-col items-center gap-0.5">
            <span class="font-bold">全品圓滿持誦</span>
            <span class="text-[10px] opacity-80 font-normal">長行＋32偈頌 (約20分)</span>
          </button>
          <button type="button" onclick="setPumenpinScope('jisong')" id="pumenpinScope_jisong" class="py-2.5 px-3 rounded-lg border text-center transition-all border-subtle bg-surface text-secondary hover:border-amber-500/50 flex flex-col items-center gap-0.5">
            <span class="font-bold">偈頌專修短課</span>
            <span class="text-[10px] text-muted font-normal">精選32偈頌 (約5~7分)</span>
          </button>
        </div>
      </div>

      <!-- 咒語/經文遍數配置 -->
      <div class="mb-5">
        <label class="block text-xs font-semibold text-amber-500 mb-2">經文／咒語修持遍數：</label>
        <div id="mantraOptionsGrid" class="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs">
          <!-- 動態載入遍數按鈕 -->
        </div>
      </div>

      <!-- 佛號聲數配置 (加入 10 遍推薦選項) -->
      <div class="mb-7">
        <label class="block text-xs font-semibold text-emerald-400 mb-2">南無觀世音菩薩聖號聲數 (新增10遍定課短課)：</label>
        <div id="buddhaOptionsGrid" class="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs">
          <!-- 動態載入聖號按鈕 -->
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-4 border-t border-subtle">
        <button onclick="closePracticeConfig()" class="px-4 py-2 rounded-lg border border-subtle hover:bg-white/5 text-xs font-medium text-secondary">
          取消
        </button>
        <button onclick="startConfiguredPractice()" class="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-1.5">
          <span>開始定課</span>
          <span>→</span>
        </button>
      </div>

    </div>
  </div>

  <!-- ==================== 彈窗 2：日課歷程與打卡日曆 (DAILY RECORDS MODAL) ==================== -->
  <div id="dailyRecordsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop hidden">
    <div class="zen-card w-full max-w-2xl rounded-2xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl max-h-[90vh] overflow-y-auto">
      
      <div class="flex items-center justify-between mb-5 pb-3 border-b border-subtle">
        <div class="flex items-center gap-2">
          <span class="text-xl">📿</span>
          <h3 class="text-lg font-bold text-primary">日課修持與打卡日曆</h3>
        </div>
        <button onclick="closeDailyRecords()" class="text-muted hover:text-primary text-xl font-bold p-1">✕</button>
      </div>

      <!-- 今日打卡狀態摘要 -->
      <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 mb-6 flex items-center justify-between">
        <div>
          <div class="text-xs text-amber-500 font-semibold mb-1">今日定課狀態</div>
          <div id="todayStatusText" class="text-sm font-bold text-primary">尚未完成今日定課</div>
        </div>
        <button onclick="manualCheckInToday()" id="btnCheckInNow" class="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5">
          <span>🙏</span>
          <span>手動打卡</span>
        </button>
      </div>

      <!-- 打卡月曆視圖 -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-3 text-xs font-bold text-secondary">
          <span id="calendarMonthTitle">2026年 10月</span>
          <span class="text-muted">🙏 代表已圓滿打卡</span>
        </div>
        <div class="grid grid-cols-7 gap-1.5 text-center text-xs text-muted mb-1 font-sans">
          <div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div>
        </div>
        <div id="calendarDaysGrid" class="grid grid-cols-7 gap-1.5 text-center text-xs"></div>
      </div>

      <!-- 禪意迴向卡製作區塊 -->
      <div class="pt-4 border-t border-subtle">
        <h4 class="text-xs font-bold text-amber-500 mb-2">生成禪意迴向小卡</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <input type="text" id="dedicateNameInput" placeholder="迴向者姓名 (例：佛弟子)" class="px-3 py-2 rounded-lg bg-surface border border-subtle text-xs text-primary focus:border-amber-500 outline-none">
          <input type="text" id="dedicateTargetInput" placeholder="祈福對象 (例：歷代先祖、闔家親友)" class="px-3 py-2 rounded-lg bg-surface border border-subtle text-xs text-primary focus:border-amber-500 outline-none">
        </div>
        <div class="flex items-center justify-end gap-2">
          <button onclick="copyDedicationText()" class="px-3 py-1.5 rounded-md border border-subtle hover:bg-white/5 text-xs text-secondary">
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

  <!-- ==================== 彈窗 3：設定選單 (SETTINGS & NANO BANANA LOGO) ==================== -->
  <div id="settingsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop hidden">
    <div class="zen-card w-full max-w-lg rounded-2xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl max-h-[90vh] overflow-y-auto">
      
      <div class="flex items-center justify-between mb-5 pb-3 border-b border-subtle">
        <div class="flex items-center gap-2">
          <span class="text-xl">⚙️</span>
          <h3 class="text-lg font-bold text-primary">修持系統設定</h3>
        </div>
        <button onclick="closeSettings()" class="text-muted hover:text-primary text-xl font-bold p-1">✕</button>
      </div>

      <!-- 1. 5 款 Nano Banana 高清禪意 Logo -->
      <div class="mb-6">
        <label class="block text-xs font-semibold text-amber-500 mb-1">
          自訂標誌 (Nano Banana 頂級禪意美學標誌)：
        </label>
        <p class="text-[11px] text-muted mb-3">AI 依據觀音象徵精繪之極簡曜石黑金標誌：</p>
        
        <div id="logoSelectionGrid" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <!-- 動態載入 5 款 Logo 選項卡 -->
        </div>
      </div>

      <!-- 2. 外觀護眼色彩主題 -->
      <div class="mb-6">
        <label class="block text-xs font-semibold text-primary mb-2">護眼色彩調性：</label>
        <div class="grid grid-cols-3 gap-2 text-xs">
          <button onclick="setTheme('dark')" id="themeBtn_dark" class="p-2.5 rounded-xl border border-amber-500/40 bg-zinc-900 text-amber-400 font-bold flex flex-col items-center gap-1">
            <span class="w-4 h-4 rounded-full bg-zinc-800 border border-amber-500/50"></span>
            <span>曜石夜修</span>
          </button>
          <button onclick="setTheme('stone')" id="themeBtn_stone" class="p-2.5 rounded-xl border border-subtle bg-stone-200 text-stone-800 font-medium flex flex-col items-center gap-1">
            <span class="w-4 h-4 rounded-full bg-stone-300 border border-stone-500/50"></span>
            <span>暖沙微陽</span>
          </button>
          <button onclick="setTheme('celadon')" id="themeBtn_celadon" class="p-2.5 rounded-xl border border-subtle bg-emerald-950 text-emerald-300 font-medium flex flex-col items-center gap-1">
            <span class="w-4 h-4 rounded-full bg-emerald-900 border border-emerald-500/50"></span>
            <span>青瓷冷茶</span>
          </button>
        </div>
      </div>

      <!-- 3. 木魚伴讀音訊設定 -->
      <div class="mb-4">
        <label class="block text-xs font-semibold text-primary mb-2">虛擬木魚伴讀音訊：</label>
        <div class="flex items-center justify-between p-3 rounded-xl bg-surface border border-subtle text-xs">
          <span>空白鍵快速敲擊木魚</span>
          <input type="checkbox" id="settingSpacebarWoodfish" checked onchange="toggleSetting('spacebarWoodfish', this.checked)" class="accent-amber-500 w-4 h-4">
        </div>
      </div>

      <div class="flex justify-end pt-3 border-t border-subtle">
        <button onclick="closeSettings()" class="px-5 py-2 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs">
          完成設定
        </button>
      </div>

    </div>
  </div>

  <!-- ==================== 自訂 TOAST 通知組件 ==================== -->
  <div id="toastNotification" class="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-stone-900/95 border border-amber-500/40 text-amber-400 text-xs sm:text-sm font-medium shadow-2xl pointer-events-none transition-all duration-300 opacity-0 -translate-y-2 flex items-center gap-2 backdrop-blur-md">
    <span id="toastIcon">🙏</span>
    <span id="toastMessage">操作完成</span>
  </div>

  <!-- ==================== 核心邏輯與經文資料腳本 ==================== -->
  <script>
    /**
     * 觀音法門定課系統 (v1.1)
     * 1. 5款 Nano Banana 高清禪意美學 Logo
     * 2. 佛號次數新增「10 聲」推薦選項
     * 3. 手機經本折頁翻書模式 (Book Mode) 與滑動手勢
     * 4. 普門品全品 / 偈頌專修切換
     * 5. Web Audio 木魚與引磬、打卡日曆、SafeStorage 安全儲存
     */

    // 1. 內嵌經文資料庫
    window.PRACTICES_DB = ${JSON.stringify(cleanData)};

    // 2. 5 款 Nano Banana 高清禪意美學 Logo (黑金古茶 #14171a / #d4af37)
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

    // 3. SafeStorage 代理
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
      readingMode: 'book', // 'book' (經本翻頁) | 'scroll' (卷軸連貫)
      currentBookPageIdx: 0,
      bookPagesList: [],
      targetMantraRep: 1,
      currentMantraRep: 0,
      targetBuddhaCount: 10, // 預設 10 聲
      currentBuddhaCount: 0,
      selectedLogoIndex: 0,
      theme: 'dark',
      fontSize: 'normal',
      spacebarWoodfish: true
    };

    // 初始化
    document.addEventListener('DOMContentLoaded', () => {
      loadSavedState();
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
        AppState.theme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
      }

      const savedMode = SafeStorage.getItem('zen_reading_mode');
      if (savedMode) AppState.readingMode = savedMode;

      const savedFont = SafeStorage.getItem('zen_font_size');
      if (savedFont) setFontSize(savedFont, false);
    }

    // 6. Logo 管理
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
          <div onclick="selectLogo(\${idx})" class="p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 \${
            isSelected ? 'border-amber-500 bg-amber-500/15' : 'border-subtle bg-surface hover:border-amber-500/50'
          }">
            <div class="w-12 h-12 rounded-full border border-amber-500/40 overflow-hidden flex-shrink-0 bg-black shadow-md">
              <img src="\${logo.imgSrc}" alt="\${logo.name}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-primary">\${logo.name}</span>
                <span class="text-[10px] text-amber-500 px-1 py-0.2 rounded bg-amber-500/10 font-sans">\${logo.tag}</span>
              </div>
              <p class="text-[11px] text-muted truncate">\${logo.desc}</p>
            </div>
            \${isSelected ? '<span class="text-amber-500 text-sm font-bold">✓</span>' : ''}
          </div>
        \`;
      }).join('');
    }

    // 7. 定課設定 Modal 與佛號「10遍」短課選項
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
          num === tempMantraRep ? 'border-amber-500 bg-amber-500 text-stone-950 font-bold' : 'border-subtle bg-surface text-secondary hover:border-amber-500/50'
        }">
          \${num} 遍
        </button>
      \`).join('');

      // 聖號選項 (包含 10 遍定課選項)
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
          opt.val === tempBuddhaCount ? 'border-emerald-500 bg-emerald-600 text-white font-bold' : 'border-subtle bg-surface text-secondary hover:border-emerald-500/50'
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
        btnAll.className = 'py-2.5 px-3 rounded-lg border text-center transition-all border-amber-500 bg-amber-500 text-stone-950 font-bold flex flex-col items-center gap-0.5';
        btnJi.className = 'py-2.5 px-3 rounded-lg border text-center transition-all border-subtle bg-surface text-secondary hover:border-amber-500/50 flex flex-col items-center gap-0.5';
      } else {
        btnJi.className = 'py-2.5 px-3 rounded-lg border text-center transition-all border-emerald-500 bg-emerald-600 text-white font-bold flex flex-col items-center gap-0.5';
        btnAll.className = 'py-2.5 px-3 rounded-lg border text-center transition-all border-subtle bg-surface text-secondary hover:border-amber-500/50 flex flex-col items-center gap-0.5';
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
            : '<span>⇄</span><span class="text-emerald-300 font-bold">偈頌專修</span>';
        } else {
          scopeChip.classList.add('hidden');
        }
      }
    }

    function setTempMantraRep(num) {
      tempMantraRep = num;
      document.querySelectorAll('[id^="mantraOptBtn_"]').forEach(b => {
        b.className = 'py-2 rounded-lg border text-center transition-all border-subtle bg-surface text-secondary hover:border-amber-500/50';
      });
      const activeBtn = document.getElementById('mantraOptBtn_' + num);
      if (activeBtn) activeBtn.className = 'py-2 rounded-lg border text-center transition-all border-amber-500 bg-amber-500 text-stone-950 font-bold';
    }

    function setTempBuddhaCount(val) {
      tempBuddhaCount = val;
      document.querySelectorAll('[id^="buddhaOptBtn_"]').forEach(b => {
        b.className = 'py-2 rounded-lg border text-center transition-all border-subtle bg-surface text-secondary hover:border-emerald-500/50';
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

    // 8. 專注持誦視圖與翻頁引擎 (Book Mode Engine)
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

    // 切換 經本翻頁 ⇄ 卷軸連貫
    function toggleReadingMode() {
      AppState.readingMode = AppState.readingMode === 'book' ? 'scroll' : 'book';
      SafeStorage.setItem('zen_reading_mode', AppState.readingMode);
      updateReadingModeDisplay();
      showToast('已切換為：' + (AppState.readingMode === 'book' ? '📖 經本翻頁模式' : '📜 卷軸連貫模式'));
    }

    function updateReadingModeDisplay() {
      const isBook = AppState.readingMode === 'book';
      const icon = document.getElementById('readingModeIcon');
      const text = document.getElementById('readingModeText');
      const bookContainer = document.getElementById('bookModeContainer');
      const scrollContainer = document.getElementById('scrollModeContainer');

      if (icon) icon.textContent = isBook ? '📖' : '📜';
      if (text) text.textContent = isBook ? '翻頁模式' : '卷軸模式';

      if (isBook) {
        bookContainer.classList.remove('hidden');
        scrollContainer.classList.add('hidden');
      } else {
        bookContainer.classList.add('hidden');
        scrollContainer.classList.remove('hidden');
      }
    }

    // 分割經文為經本折頁 (Pages)
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
          // 偈頌專修：跳過長行
          sections = sections.filter(s => s.id !== 'pumenpin_changhang');
        }
      }

      // 產生經本頁面清單
      AppState.bookPagesList = [];
      sections.forEach(sec => {
        // 短篇段落保持 1 頁
        if (sec.lines.length <= 18) {
          AppState.bookPagesList.push({
            id: sec.id,
            title: sec.title,
            desc: sec.desc || '',
            lines: sec.lines
          });
        } else if (sec.id === 'pumenpin_changhang') {
          // 普門品長行分 4 頁折頁
          AppState.bookPagesList.push(
            { id: sec.id + '_1', title: '【普門品・長行】', desc: '（一）問名因緣・救水火刀鬼諸難', lines: sec.lines.slice(0, 10) },
            { id: sec.id + '_2', title: '【普門品・長行】', desc: '（二）常念離三毒・受持福不唐捐', lines: sec.lines.slice(10, 16) },
            { id: sec.id + '_3', title: '【普門品・長行】', desc: '（三）三十三身普門示現', lines: sec.lines.slice(16, 23) },
            { id: sec.id + '_4', title: '【普門品・長行】', desc: '（四）施無畏者・瓔珞分奉二佛', lines: sec.lines.slice(23) }
          );
        } else if (sec.id === 'pumenpin_jisong') {
          // 偈頌分 2 頁折頁
          AppState.bookPagesList.push(
            { id: sec.id + '_1', title: '【普門品・偈頌】', desc: '（上）世尊妙相具・念彼觀音力', lines: sec.lines.slice(0, 16) },
            { id: sec.id + '_2', title: '【普門品・偈頌】', desc: '（下）五觀清淨智・梵音海潮音', lines: sec.lines.slice(16) }
          );
        } else if (sec.id === 'dabeizhou_84') {
          // 大悲咒分 2 頁
          AppState.bookPagesList.push(
            { id: sec.id + '_1', title: '【大悲咒・前段】', desc: '1~42句 陀羅尼心咒', lines: sec.lines.slice(0, 42) },
            { id: sec.id + '_2', title: '【大悲咒・後段】', desc: '43~84句 娑婆訶圓滿', lines: sec.lines.slice(42) }
          );
        } else {
          // 通用均分
          const chunkSize = 14;
          for (let i = 0; i < sec.lines.length; i += chunkSize) {
            AppState.bookPagesList.push({
              id: sec.id + '_' + (i / chunkSize + 1),
              title: sec.title,
              desc: sec.desc || '',
              lines: sec.lines.slice(i, i + chunkSize)
            });
          }
        }
      });

      if (AppState.currentBookPageIdx >= AppState.bookPagesList.length) {
        AppState.currentBookPageIdx = 0;
      }

      // 渲染翻頁模式
      renderBookPage('none');
      // 同步渲染卷軸模式
      renderScrollContent(sections);
    }

    // 渲染當前經本頁面
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

      // 內容渲染
      const contentEl = document.getElementById('bookPageContent');
      let html = '';
      page.lines.forEach(line => {
        const isFayuan = line.startsWith('南無大悲觀世音');
        const isSix = line.startsWith('我若向');
        const isJingyun = line.startsWith('經云：');

        if (isFayuan) {
          html += \`<p class="text-amber-400 font-medium py-0.5 border-l-2 border-amber-500/50 pl-3 my-1">\${line}</p>\`;
        } else if (isSix) {
          html += \`<p class="text-emerald-400 font-medium py-0.5 border-l-2 border-emerald-500/50 pl-3 my-1">\${line}</p>\`;
        } else if (isJingyun) {
          html += \`<p class="text-xs sm:text-sm text-secondary italic mb-2">\${line}</p>\`;
        } else {
          html += \`<p class="my-1.5">\${line}</p>\`;
        }
      });
      contentEl.innerHTML = html;

      // 翻頁微動效
      const card = document.getElementById('bookPageCard');
      card.classList.remove('page-slide-left', 'page-slide-right');
      void card.offsetWidth; // 觸發 reflow
      if (animDirection === 'left') card.classList.add('page-slide-left');
      else if (animDirection === 'right') card.classList.add('page-slide-right');

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

      // 進度點
      const dotsEl = document.getElementById('bookPageDots');
      if (dotsEl) {
        dotsEl.innerHTML = list.map((_, i) => \`
          <span class="w-1.5 h-1.5 rounded-full transition-all \${i === idx ? 'w-4 bg-amber-500' : 'bg-subtle'}"></span>
        \`).join('');
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

    // 觸控手勢滑動與點擊翻頁 (Swipe & Tap on Mobile)
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

      // 手機滑動手勢
      const card = document.getElementById('bookPageCard');
      let touchStartX = 0;
      let touchStartY = 0;

      card.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      card.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        // 若水平位移顯著大於垂直位移，判定為翻頁滑動
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
          if (diffX < 0) {
            // 向左滑 -> 下一頁
            nextBookPage();
          } else {
            // 向右滑 -> 上一頁
            prevBookPage();
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
        pillBtn.className = 'px-3 py-1 rounded-full border border-subtle bg-surface text-secondary hover:border-amber-500/70 hover:text-amber-400 whitespace-nowrap flex-shrink-0 transition-all';
        pillBtn.textContent = sec.title.replace(/[【】]/g, '');
        pillBtn.onclick = () => {
          const target = document.getElementById(secAnchorId);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };
        navContainer.appendChild(pillBtn);

        const secDiv = document.createElement('section');
        secDiv.id = secAnchorId;
        secDiv.className = 'pt-4 border-b border-subtle/50 pb-8';

        let innerHtml = \`
          <div class="flex items-center gap-2 mb-4">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            <h3 class="text-base sm:text-lg font-bold text-amber-500 tracking-wider">\${sec.title}</h3>
            \${sec.desc ? \`<span class="text-xs text-muted hidden sm:inline">(\${sec.desc})</span>\` : ''}
          </div>
          <div class="space-y-3 leading-loose text-primary tracking-wide">
        \`;

        sec.lines.forEach(line => {
          const isFayuan = line.startsWith('南無大悲觀世音');
          const isSix = line.startsWith('我若向');
          const isJingyun = line.startsWith('經云：');

          if (isFayuan) {
            innerHtml += \`<p class="text-amber-400 font-medium pl-3 border-l-2 border-amber-500/40 my-1">\${line}</p>\`;
          } else if (isSix) {
            innerHtml += \`<p class="text-emerald-400 font-medium pl-3 border-l-2 border-emerald-500/40 my-1">\${line}</p>\`;
          } else if (isJingyun) {
            innerHtml += \`<p class="text-xs sm:text-sm text-secondary italic mb-2">\${line}</p>\`;
          } else {
            innerHtml += \`<p class="my-1.5">\${line}</p>\`;
          }
        });

        innerHtml += '</div>';
        secDiv.innerHTML = innerHtml;
        container.appendChild(secDiv);
      });
    }

    // 9. 木魚與計數
    function strikeWoodfish() {
      ZenAudio.playWoodfish();
      const btn = document.getElementById('strikeWoodfishBtn');
      if (btn) {
        btn.classList.add('striking');
        setTimeout(() => btn.classList.remove('striking'), 160);
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

    // 10. 字級切換
    function setFontSize(size, notify = true) {
      AppState.fontSize = size;
      SafeStorage.setItem('zen_font_size', size);
      const bookEl = document.getElementById('bookPageContent');
      const scrollEl = document.getElementById('scriptureContentContainer');

      ['btnFontNormal', 'btnFontLarge', 'btnFontXLarge'].forEach(id => {
        const b = document.getElementById(id);
        if (b) b.className = 'px-2 py-0.5 rounded-full hover:text-amber-400';
      });

      const applySize = (el, cls) => {
        if (!el) return;
        el.classList.remove('text-base', 'text-lg', 'text-xl', 'text-2xl');
        el.classList.add(cls);
      };

      if (size === 'large') {
        applySize(bookEl, 'text-2xl');
        applySize(scrollEl, 'text-xl');
        document.getElementById('btnFontLarge').className = 'px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold';
      } else if (size === 'xlarge') {
        applySize(bookEl, 'text-3xl');
        applySize(scrollEl, 'text-2xl');
        document.getElementById('btnFontXLarge').className = 'px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold';
      } else {
        applySize(bookEl, 'text-xl');
        applySize(scrollEl, 'text-lg');
        document.getElementById('btnFontNormal').className = 'px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold';
      }

      if (notify) showToast('已調整字級');
    }

    // 11. 外觀主題
    function setTheme(theme) {
      AppState.theme = theme;
      SafeStorage.setItem('zen_theme', theme);
      document.documentElement.setAttribute('data-theme', theme);

      ['themeBtn_dark', 'themeBtn_stone', 'themeBtn_celadon'].forEach(id => {
        const b = document.getElementById(id);
        if (b) b.classList.remove('border-amber-500', 'font-bold');
      });
      const activeBtn = document.getElementById('themeBtn_' + theme);
      if (activeBtn) activeBtn.classList.add('border-amber-500', 'font-bold');

      showToast('已切換護眼主題：' + (theme === 'dark' ? '曜石夜修' : theme === 'stone' ? '暖沙微陽' : '青瓷冷茶'));
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
          statusText.className = 'text-sm font-bold text-emerald-400';
          if (checkInBtn) checkInBtn.classList.add('hidden');
        } else {
          statusText.textContent = '今日尚未打卡';
          statusText.className = 'text-sm font-bold text-amber-500';
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
        emptyCell.className = 'h-10 rounded-lg bg-surface/30 opacity-20';
        grid.appendChild(emptyCell);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
        const hasLog = !!logs[dateStr];
        const isToday = day === todayDate;

        const cell = document.createElement('div');
        cell.className = \`h-10 rounded-lg p-1 flex flex-col items-center justify-between border transition-all text-[11px] \${
          isToday ? 'border-amber-500 bg-amber-500/10' : 'border-subtle bg-surface'
        } \${hasLog ? 'border-emerald-500/60 bg-emerald-950/20' : ''}\`;

        cell.innerHTML = \`
          <span class="\${isToday ? 'font-bold text-amber-400' : 'text-muted'}">\${day}</span>
          <span>\${hasLog ? '🙏' : ''}</span>
        \`;
        grid.appendChild(cell);
      }
    }

    // 13. 迴向小卡 Canvas 產生器
    function generateDedicationCardImage() {
      const canvas = document.getElementById('dedicationCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const author = document.getElementById('dedicateNameInput').value.trim() || '佛弟子';
      const target = document.getElementById('dedicateTargetInput').value.trim() || '法界眾生、闔家眷屬';

      ctx.fillStyle = '#14171A';
      ctx.fillRect(0, 0, 800, 500);

      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 740, 440);

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, 720, 420);

      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 26px "Noto Serif TC", serif';
      ctx.textAlign = 'center';
      ctx.fillText('觀音法門定課・修持迴向', 400, 95);

      ctx.fillStyle = '#E6DFD5';
      ctx.font = '18px "Noto Serif TC", serif';
      ctx.fillText('迴向功德主：' + author + '    ｜    祈福對象：' + target, 400, 145);

      ctx.fillStyle = '#D4AF37';
      ctx.font = '22px "Noto Serif TC", serif';
      ctx.fillText('願消三障諸煩惱　願得智慧真明了', 400, 220);
      ctx.fillText('普願罪障悉消除　世世常行菩薩道', 400, 265);

      ctx.fillStyle = '#9DB4A9';
      ctx.font = '16px "Noto Serif TC", serif';
      ctx.fillText('千處祈求千處現　苦海常作度人舟', 400, 335);
      ctx.fillText('南無大悲觀世音菩薩摩訶薩', 400, 370);

      ctx.fillStyle = '#7E766B';
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
      }, 2400);
    }

    // 頂部事件綁定
    document.getElementById('brandLogoHomeBtn').addEventListener('click', returnToHome);
    document.getElementById('openDailyRecordsBtn').addEventListener('click', openDailyRecords);
    document.getElementById('openSettingsBtn').addEventListener('click', openSettings);
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
console.log('Successfully built v1.1 index.html with Book Flip Mode, 10 Buddha Reps, and Nano Banana Logos!');
