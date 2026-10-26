const fs = require('fs');
const path = require('path');

// 讀取已經萃取好的純淨經文資料
const cleanData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'clean_practices.json'), 'utf8'));

// 確保 xinjing 包含開經偈與大悲發願偈
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

// 補全 xinjing
if (!cleanData.xinjing.sections.find(s => s.id === 'kaijing')) {
  cleanData.xinjing.sections.splice(1, 0, kaijingSection);
}
if (!cleanData.xinjing.sections.find(s => s.id === 'dabei_fayuan')) {
  // 插在觀音偈之後
  const idx = cleanData.xinjing.sections.findIndex(s => s.id === 'guanyinji');
  cleanData.xinjing.sections.splice(idx + 1, 0, fayuanSection);
}

// 補全 dabeizhou 開經偈
if (!cleanData.dabeizhou.sections.find(s => s.id === 'kaijing')) {
  cleanData.dabeizhou.sections.splice(1, 0, kaijingSection);
}

// 產生 index.html
const html = `<!DOCTYPE html>
<html lang="zh-TW" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>觀音法門定課 v1.0 — 普門品・大悲咒・心經（法鼓山修持定課系統）</title>
  <meta name="description" content="法鼓山觀音法門修持定課系統：普門品、大悲咒、心經三種日課，靈活遍數自訂、5款禪意極簡Logo、合掌打卡日曆與護眼禪風。">

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
      --card-overlay: rgba(28, 32, 36, 0.78);
      --hero-pattern: radial-gradient(circle at 50% 18%, rgba(212, 175, 55, 0.07) 0%, rgba(20, 23, 26, 0.96) 72%);
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
      --card-overlay: rgba(244, 239, 230, 0.88);
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
      --card-overlay: rgba(27, 41, 37, 0.85);
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
    }

    /* 禪意背景微光山水遮罩 */
    .zen-bg-watermark {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      opacity: 0.045;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Cpath d='M0 500 C150 420 300 520 450 460 C600 400 700 480 800 440 L800 600 L0 600 Z' fill='%23D4AF37'/%3E%3Cpath d='M0 540 C180 480 320 560 500 510 C650 470 720 530 800 500 L800 600 L0 600 Z' fill='%23D4AF37' opacity='0.7'/%3E%3Ccircle cx='400' cy='220' r='140' fill='%23D4AF37' opacity='0.15'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: center bottom;
      background-size: cover;
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
      transform: translateY(-4px);
      border-color: var(--border-focus);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
    }
    [data-theme="stone"] .zen-card:hover {
      box-shadow: 0 12px 24px rgba(70, 58, 45, 0.12);
    }

    /* 彈窗遮罩 */
    .modal-backdrop {
      background: rgba(10, 12, 14, 0.78);
      backdrop-filter: blur(6px);
      transition: opacity 0.25s ease;
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

    /* 自訂捲軸 */
    ::-webkit-scrollbar {
      width: 7px;
      height: 7px;
    }
    ::-webkit-scrollbar-track {
      background: var(--bg-base);
    }
    ::-webkit-scrollbar-thumb {
      background: var(--border-subtle);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--border-focus);
    }
  </style>
</head>
<body class="relative selection:bg-amber-900 selection:text-amber-100">

  <!-- 背景水墨禪意浮水印 -->
  <div class="zen-bg-watermark"></div>

  <!-- ==================== 頂部導覽列 ==================== -->
  <header class="app-header w-full px-4 sm:px-8 py-3.5 relative z-40">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-3">
      
      <!-- 左側 Logo 與標題 -->
      <div id="brandLogoHomeBtn" class="flex items-center gap-3 cursor-pointer select-none group">
        <!-- 動態 Logo 容器 -->
        <div id="currentLogoContainer" class="w-9 h-9 text-amber-500 flex items-center justify-center p-1 rounded-full border border-amber-500/30 group-hover:border-amber-500/80 transition-all" title="點選更換 Logo">
          <!-- 預設第 1 款 Logo：淨瓶甘露 -->
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-base sm:text-lg font-bold tracking-wider text-primary group-hover:text-amber-400 transition-colors">
              觀音法門定課
            </h1>
            <span class="text-[10px] font-sans px-1.5 py-0.5 rounded border border-amber-600/40 text-amber-500 font-medium">v1.0</span>
          </div>
          <p class="text-[11px] text-muted hidden sm:block tracking-wide">法鼓山大事關懷・觀世音菩薩修持日課</p>
        </div>
      </div>

      <!-- 右側「日課」、「設定」與外觀選單 -->
      <div class="flex items-center gap-2 sm:gap-3">
        
        <!-- 「日課」選單按鈕（合掌與經卷圖標） -->
        <button id="openDailyRecordsBtn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-subtle hover:border-amber-500/70 hover:bg-amber-500/10 text-xs sm:text-sm font-medium transition-all" title="修持日曆與打卡紀錄">
          <svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <!-- 經卷/日課圖標 -->
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            <path d="M9 7h6"/>
            <path d="M9 11h6"/>
          </svg>
          <span>日課</span>
          <span id="dailyCheckIndicator" class="w-1.5 h-1.5 rounded-full bg-emerald-500 hidden" title="今日已圓滿打卡"></span>
        </button>

        <!-- 「設定」選單按鈕（引磬與齒輪圖標） -->
        <button id="openSettingsBtn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-subtle hover:border-amber-500/70 hover:bg-amber-500/10 text-xs sm:text-sm font-medium transition-all" title="系統設定與Logo更換">
          <svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <!-- 禪鐘/引磬設定圖標 -->
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span class="hidden sm:inline">設定</span>
        </button>

      </div>
    </div>
  </header>

  <!-- ==================== 主要視圖區塊 (首頁 vs 誦念視圖) ==================== -->
  <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 relative z-10 flex flex-col justify-start">
    
    <!-- ==================== 1. 首頁視圖 (HOME VIEW) ==================== -->
    <div id="homeView" class="w-full flex flex-col items-center">
      
      <!-- 禪意標題與法語橫幅 -->
      <div class="text-center max-w-3xl mb-8 sm:mb-12 mt-2">
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

      <!-- 三種定課卡片網格 (文字與圖像各異) -->
      <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10">
        
        <!-- 卡片 1：《普門品》定課 -->
        <div class="zen-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden group cursor-pointer" onclick="openPracticeConfig('pumenpin')">
          <div class="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          
          <div>
            <!-- 專屬圖像：慈航法印 (觀音普門示現印) -->
            <div class="w-14 h-14 rounded-2xl bg-emerald-900/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:border-emerald-500/60 transition-colors">
              <svg class="w-8 h-8" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <!-- 慈航渡人印 -->
                <path d="M8 44 C22 52 42 52 56 44"/>
                <path d="M14 42 Q32 20 50 14 Q38 32 32 44"/>
                <circle cx="32" cy="18" r="4" fill="currentColor"/>
              </svg>
            </div>

            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-500/30">法華精髓</span>
              <span class="text-xs text-muted">約 20 分鐘</span>
            </div>

            <h3 class="text-xl font-bold tracking-wide text-primary group-hover:text-amber-400 transition-colors mb-2">
              《普門品》定課
            </h3>
            
            <p class="text-xs text-amber-500/90 font-medium mb-3">
              慈悲救護・三十二應普門示現
            </p>

            <p class="text-xs text-secondary leading-relaxed mb-6">
              聞名免七難、離三毒、滿二願。收錄完整長行與三十二偈頌，感念觀音尋聲救苦之大悲宏誓。
            </p>
          </div>

          <div class="pt-4 border-t border-subtle flex items-center justify-between text-xs font-medium">
            <span class="text-muted">全品 2,400 字</span>
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
            <!-- 專屬圖像：金輪曼陀羅印 -->
            <div class="w-14 h-14 rounded-2xl bg-amber-900/30 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:border-amber-500/60 transition-colors">
              <svg class="w-8 h-8" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <!-- 陀羅尼密咒金輪印 -->
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
              八十四句神咒。發十大願、摧折刀山火湯，藉陀羅尼清淨自心，消除累劫宿業與煩惱障礙。
            </p>
          </div>

          <div class="pt-4 border-t border-subtle flex items-center justify-between text-xs font-medium">
            <span class="text-muted">推薦 3、7 或 21 遍</span>
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
            <!-- 專屬圖像：空性一筆圓相印 (Enso Circle) -->
            <div class="w-14 h-14 rounded-2xl bg-sky-900/30 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-5 group-hover:border-sky-500/60 transition-colors">
              <svg class="w-8 h-8" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <!-- 禪意圓相一筆一劃 -->
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
      
      <!-- 頂部返回與遍數進度條 -->
      <div class="zen-card rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3 border border-subtle">
        <div class="flex items-center gap-3">
          <button onclick="returnToHome()" class="px-2.5 py-1 rounded-md border border-subtle hover:border-amber-500 hover:text-amber-400 text-xs flex items-center gap-1 transition-all">
            <span>←</span>
            <span>回首頁</span>
          </button>
          <div class="h-4 w-[1px] bg-subtle"></div>
          <h2 id="practiceTitleDisplay" class="text-base sm:text-lg font-bold text-primary">
            《普門品》定課
          </h2>
          <button id="scopeToggleChipBtn" onclick="togglePracticeScopeInView()" class="hidden px-2.5 py-1 rounded-full border border-sky-500/40 bg-sky-500/15 text-sky-300 text-xs font-semibold hover:bg-sky-500/30 transition-all flex items-center gap-1">
            <span>⇄</span>
            <span>切換範圍</span>
          </button>
        </div>

        <!-- 當前修持計數徽章 -->
        <div class="flex items-center gap-2 text-xs">
          <div id="badgeMantraRep" class="px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-500 font-semibold">
            經咒進度：第 <span id="currentMantraRepText">1</span> / <span id="targetMantraRepText">1</span> 遍
          </div>
          <div id="badgeBuddhaRep" class="px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold">
            聖號：<span id="currentBuddhaCountText">0</span> / <span id="targetBuddhaCountText">108</span> 聲
          </div>
        </div>
      </div>

      <!-- 科判快速跳轉膠囊列 -->
      <div id="sectionNavPills" class="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar text-xs">
        <!-- 動態渲染錨點按鈕 -->
      </div>

      <!-- 經文主內容容器 -->
      <div id="scriptureContentContainer" class="zen-card rounded-2xl p-6 sm:p-10 mb-20 space-y-12 leading-loose text-base sm:text-lg font-serif">
        <!-- 動態渲染各科判內容 -->
      </div>

      <!-- 底部懸浮禪意輔助工具列 (木魚、計數、字級、打卡) -->
      <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl zen-card rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between border border-amber-500/30 shadow-2xl bg-stone-900/90 backdrop-blur-md">
        
        <!-- 木魚按鈕 -->
        <button id="strikeWoodfishBtn" class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/30 text-amber-400 text-xs font-medium transition-all group" title="敲擊木魚 (或按鍵盤空白鍵)">
          <span class="text-base group-active:scale-90 transition-transform">🪘</span>
          <span>敲木魚</span>
        </button>

        <!-- 當前遍數/聲數累加快捷鍵 -->
        <div class="flex items-center gap-2">
          <button id="incrementRepBtn" class="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm hover:bg-amber-400 active:scale-95 transition-all shadow-md">
            <span>+1 遍 / 聲</span>
          </button>
        </div>

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

      <!-- 咒語/經文遍數配置 -->
      
      <!-- 普門品專屬：修持範圍選擇 -->
      <div id="pumenpinScopeWrapper" class="mb-6 hidden">
        <label class="block text-xs font-semibold text-sky-400 mb-2">普門品修持範圍：</label>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <button type="button" onclick="setPumenpinScope('all')" id="pumenpinScope_all" class="py-2.5 px-3 rounded-lg border text-center transition-all border-amber-500 bg-amber-500 text-stone-950 font-bold flex flex-col items-center gap-0.5">
            <span class="font-bold">全品圓滿持誦</span>
            <span class="text-[10px] opacity-80 font-normal">長行＋32偈頌 (約20分鐘)</span>
          </button>
          <button type="button" onclick="setPumenpinScope('jisong')" id="pumenpinScope_jisong" class="py-2.5 px-3 rounded-lg border text-center transition-all border-subtle bg-surface text-secondary hover:border-amber-500/50 flex flex-col items-center gap-0.5">
            <span class="font-bold">偈頌專修版</span>
            <span class="text-[10px] text-muted font-normal">精選32偈頌 (約5~7分鐘)</span>
          </button>
        </div>
      </div>
      <div class="mb-6">
        <label class="block text-xs font-semibold text-amber-500 mb-2">經文／咒語修持遍數：</label>
        <div id="mantraOptionsGrid" class="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs">
          <!-- 動態載入遍數按鈕 -->
        </div>
      </div>

      <!-- 佛號聲數配置 -->
      <div class="mb-8">
        <label class="block text-xs font-semibold text-emerald-400 mb-2">南無觀世音菩薩聖號聲數：</label>
        <div id="buddhaOptionsGrid" class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
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
        <div id="calendarDaysGrid" class="grid grid-cols-7 gap-1.5 text-center text-xs">
          <!-- 動態載入月曆格 -->
        </div>
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

  <!-- ==================== 彈窗 3：設定選單 (SETTINGS & LOGO MODAL) ==================== -->
  <div id="settingsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop hidden">
    <div class="zen-card w-full max-w-lg rounded-2xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl max-h-[90vh] overflow-y-auto">
      
      <div class="flex items-center justify-between mb-5 pb-3 border-b border-subtle">
        <div class="flex items-center gap-2">
          <span class="text-xl">⚙️</span>
          <h3 class="text-lg font-bold text-primary">修持系統設定</h3>
        </div>
        <button onclick="closeSettings()" class="text-muted hover:text-primary text-xl font-bold p-1">✕</button>
      </div>

      <!-- 1. 5 款 Logo 選擇 (線條 <= 5 筆，粗細筆鋒融合) -->
      <div class="mb-6">
        <label class="block text-xs font-semibold text-amber-500 mb-1">
          自訂禪意標誌 (5 款極簡筆鋒設計)：
        </label>
        <p class="text-[11px] text-muted mb-3">嚴格控制在 3 至 4 筆劃內，融合毛筆側鋒與行草氣韻：</p>
        
        <div id="logoSelectionGrid" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
     * 觀音法門定課系統 (v1.0)
     * 1. 5款線條<=5之極簡筆鋒禪意Logo
     * 2. 三種獨立定課與三門合修
     * 3. 遍數配置、Web Audio木魚與引磬、打卡日曆、SafeStorage安全保護
     */

    // 1. 內嵌經文資料庫
    window.PRACTICES_DB = ${JSON.stringify(cleanData)};

    // 2. 5 款極簡書法 Logo 規格 (線條 <= 5 筆，粗細筆鋒融合)
    window.ZEN_LOGOS = [
      {
        id: 'logo_01_vase',
        name: '淨瓶甘露',
        strokes: '3 筆',
        desc: '大悲甘露・遍灑三千',
        svg: '<svg viewBox="0 0 100 100" class="w-full h-full"><path d="M42 22 Q44 32 36 48 Q28 62 38 78 Q45 88 50 88 Q55 88 62 78 Q72 62 64 48 Q56 32 58 22" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M38 20 C44 24 56 24 62 20" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M50 7 C47 12 46 15 50 17 C54 15 53 12 50 7 Z" fill="currentColor"/></svg>'
      },
      {
        id: 'logo_02_willow',
        name: '楊枝拂塵',
        strokes: '4 筆',
        desc: '柔和忍辱・手內楊枝',
        svg: '<svg viewBox="0 0 100 100" class="w-full h-full"><path d="M78 18 Q55 35 38 58 Q26 74 22 88" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/><path d="M68 28 Q80 25 86 34 Q76 38 68 28" fill="currentColor"/><path d="M52 42 Q68 42 72 54 Q60 55 52 42" fill="currentColor"/><path d="M38 58 Q50 64 52 76 Q42 74 38 58" fill="currentColor"/></svg>'
      },
      {
        id: 'logo_03_lotus',
        name: '大悲心蓮',
        strokes: '4 筆',
        desc: '火燄化紅蓮・自性清淨',
        svg: '<svg viewBox="0 0 100 100" class="w-full h-full"><path d="M18 68 C32 86 68 86 82 68" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/><path d="M50 18 C42 35 44 64 50 78 C56 64 58 35 50 18 Z" fill="currentColor" opacity="0.95"/><path d="M46 76 C32 66 24 45 34 32 C38 48 44 64 46 76 Z" fill="currentColor" opacity="0.75"/><path d="M54 76 C68 66 76 45 66 32 C62 48 56 64 54 76 Z" fill="currentColor" opacity="0.75"/></svg>'
      },
      {
        id: 'logo_04_ear',
        name: '耳根圓通',
        strokes: '3 筆',
        desc: '反聞自性・入流亡所',
        svg: '<svg viewBox="0 0 100 100" class="w-full h-full"><path d="M50 16 C75 16 84 38 80 58 C76 74 62 86 46 86 C32 86 24 74 24 60 C24 42 36 28 52 28 C62 28 68 36 66 48 C64 56 56 62 48 60" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/><path d="M48 60 C42 58 40 52 44 46" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><circle cx="48" cy="74" r="4.5" fill="currentColor"/></svg>'
      },
      {
        id: 'logo_05_boat',
        name: '一葉慈航',
        strokes: '3 筆',
        desc: '苦海度人舟・同登彼岸',
        svg: '<svg viewBox="0 0 100 100" class="w-full h-full"><path d="M14 62 C34 78 66 78 86 62 C68 69 32 69 14 62 Z" fill="currentColor"/><path d="M22 60 Q50 32 78 22 Q58 44 50 64" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M24 82 C42 86 58 86 76 82" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>'
      }
    ];

    // 3. SafeStorage 代理 (防止 file:/// 本機環境拋出例外)
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
        // 木魚：柔和雙頻衰減正弦波
        playWoodfish: function () {
          try {
            const ctx = getContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            
            // 主音調
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

            // 敲擊點擊諧波
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

        // 引磬：清亮高頻長餘音
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
      currentView: 'home', // 'home' | 'practice'
      currentPracticeKey: 'pumenpin',
      pumenpinScope: 'all', // 'all' (全品) | 'jisong' (偈頌專修)
      targetMantraRep: 1,
      currentMantraRep: 0,
      targetBuddhaCount: 108,
      currentBuddhaCount: 0,
      selectedLogoIndex: 0,
      theme: 'dark',
      fontSize: 'normal', // 'normal' | 'large' | 'xlarge'
      spacebarWoodfish: true
    };

    // 初始化載入
    document.addEventListener('DOMContentLoaded', () => {
      loadSavedState();
      renderCurrentLogo();
      renderLogoSelectionSettings();
      setupKeyListeners();
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

      const savedFont = SafeStorage.getItem('zen_font_size');
      if (savedFont) {
        setFontSize(savedFont, false);
      }
    }

    // 6. Logo 管理
    function renderCurrentLogo() {
      const logo = window.ZEN_LOGOS[AppState.selectedLogoIndex] || window.ZEN_LOGOS[0];
      const container = document.getElementById('currentLogoContainer');
      if (container) {
        container.innerHTML = logo.svg;
        container.setAttribute('title', '目前標誌：' + logo.name + ' (' + logo.strokes + ') - 點選設定切換');
      }
    }

    function selectLogo(index) {
      AppState.selectedLogoIndex = index;
      SafeStorage.setItem('zen_logo_idx', index);
      renderCurrentLogo();
      renderLogoSelectionSettings();
      showToast('已切換標誌為【' + window.ZEN_LOGOS[index].name + '】');
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
            <div class="w-10 h-10 text-amber-500 flex-shrink-0 p-1 border rounded-lg border-amber-500/25 bg-surface-elevated">
              \${logo.svg}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-primary">\${logo.name}</span>
                <span class="text-[10px] text-amber-500 px-1 py-0.2 rounded bg-amber-500/10">\${logo.strokes}</span>
              </div>
              <p class="text-[11px] text-muted truncate">\${logo.desc}</p>
            </div>
            \${isSelected ? '<span class="text-amber-500 text-sm font-bold">✓</span>' : ''}
          </div>
        \`;
      }).join('');
    }

    // 7. 定課遍數設定 Modal
    let pendingPracticeKey = 'pumenpin';
    let tempMantraRep = 1;
    let tempBuddhaCount = 108;

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
      const scopeWrapper = document.getElementById('pumenpinScopeWrapper');
      if (scopeWrapper) {
        if (practiceKey === 'pumenpin') {
          scopeWrapper.classList.remove('hidden');
          setPumenpinScope(AppState.pumenpinScope || 'all');
        } else {
          scopeWrapper.classList.add('hidden');
        }
      }

      // 遍數選項
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

      // 聖號選項
      const buddhaOptions = [
        { label: '108 聲', val: 108 },
        { label: '300 聲', val: 300 },
        { label: '1000 聲', val: 1000 },
        { label: '自由計數', val: 0 }
      ];
      tempBuddhaCount = 108;

      buddhaGrid.innerHTML = buddhaOptions.map(opt => \`
        <button type="button" onclick="setTempBuddhaCount(\${opt.val})" id="buddhaOptBtn_\${opt.val}" class="py-2 rounded-lg border text-center transition-all \${
          opt.val === tempBuddhaCount ? 'border-emerald-500 bg-emerald-600 text-white font-bold' : 'border-subtle bg-surface text-secondary hover:border-emerald-500/50'
        }">
          \${opt.label}
        </button>
      \`).join('');

      modal.classList.remove('hidden');
    }

    function setTempMantraRep(num) {
      tempMantraRep = num;
      const btns = document.querySelectorAll('[id^="mantraOptBtn_"]');
      btns.forEach(b => {
        b.className = 'py-2 rounded-lg border text-center transition-all border-subtle bg-surface text-secondary hover:border-amber-500/50';
      });
      const activeBtn = document.getElementById('mantraOptBtn_' + num);
      if (activeBtn) activeBtn.className = 'py-2 rounded-lg border text-center transition-all border-amber-500 bg-amber-500 text-stone-950 font-bold';
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
      renderPracticeContent();
      const scopeChip = document.getElementById('scopeToggleChipBtn');
      if (scopeChip) {
        scopeChip.textContent = AppState.pumenpinScope === 'all' ? '模式：全品 (長行+偈頌)' : '模式：偈頌專修 (32偈)';
      }
      const scopeText = AppState.pumenpinScope === 'all' ? '全品（長行＋偈頌）' : '偈頌專修（三十二偈）';
      showToast('已切換為：' + scopeText);
    }

    function setTempBuddhaCount(val) {
      tempBuddhaCount = val;
      const btns = document.querySelectorAll('[id^="buddhaOptBtn_"]');
      btns.forEach(b => {
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

      closePracticeConfig();
      enterPracticeView();
    }

    // 8. 專注持誦視圖渲染
    function enterPracticeView() {
      AppState.currentView = 'practice';
      document.getElementById('homeView').classList.add('hidden');
      document.getElementById('practiceView').classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // 標題與進度
      const practiceNames = {
        pumenpin: '《觀世音菩薩普門品》定課',
        dabeizhou: '〈大悲咒〉定課',
        xinjing: '《般若波羅蜜多心經》定課',
        merged: '三門合修完整定課'
      };
      document.getElementById('practiceTitleDisplay').textContent = practiceNames[AppState.currentPracticeKey] || '定課持誦';
      const scopeChip = document.getElementById('scopeToggleChipBtn');
      if (scopeChip) {
        if (AppState.currentPracticeKey === 'pumenpin') {
          scopeChip.classList.remove('hidden');
          scopeChip.innerHTML = AppState.pumenpinScope === 'all' 
            ? '<span>⇄</span><span>範圍：全品 (長行+偈頌)</span>' 
            : '<span>⇄</span><span class="text-emerald-300 font-bold">範圍：偈頌專修 (32偈)</span>';
        } else {
          scopeChip.classList.add('hidden');
        }
      }
      document.getElementById('targetMantraRepText').textContent = AppState.targetMantraRep;
      document.getElementById('currentMantraRepText').textContent = AppState.currentMantraRep;
      document.getElementById('targetBuddhaCountText').textContent = AppState.targetBuddhaCount > 0 ? AppState.targetBuddhaCount : '自由';
      document.getElementById('currentBuddhaCountText').textContent = AppState.currentBuddhaCount;

      renderPracticeContent();
    }

    function returnToHome() {
      AppState.currentView = 'home';
      document.getElementById('practiceView').classList.add('hidden');
      document.getElementById('homeView').classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderPracticeContent() {
      const container = document.getElementById('scriptureContentContainer');
      const navContainer = document.getElementById('sectionNavPills');
      container.innerHTML = '';
      navContainer.innerHTML = '';

      let sections = [];
      if (AppState.currentPracticeKey === 'merged') {
        // 合併定課
        const p1 = window.PRACTICES_DB.pumenpin.sections;
        const p2 = window.PRACTICES_DB.dabeizhou.sections;
        const p3 = window.PRACTICES_DB.xinjing.sections;

        // 去重前導與結尾
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
          // 過濾掉長行，直接從開經偈接至偈頌
          sections = sections.filter(s => s.id !== 'pumenpin_changhang');
        }
      }

      // 渲染科判按鈕與段落
      sections.forEach((sec, idx) => {
        const secAnchorId = 'sec_' + sec.id + '_' + idx;

        // 導航按鈕
        const pillBtn = document.createElement('button');
        pillBtn.className = 'px-3 py-1 rounded-full border border-subtle bg-surface text-secondary hover:border-amber-500/70 hover:text-amber-400 whitespace-nowrap flex-shrink-0 transition-all';
        pillBtn.textContent = sec.title.replace(/[【】]/g, '');
        pillBtn.onclick = () => {
          const target = document.getElementById(secAnchorId);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };
        navContainer.appendChild(pillBtn);

        // 經文內容卡片
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
          // 特別加亮觀音發願十大宏願
          const isFayuan = line.startsWith('南無大悲觀世音');
          const isSixDirect = line.startsWith('我若向');
          const isJingyun = line.startsWith('經云：');

          if (isFayuan) {
            innerHtml += \`<p class="text-amber-400/90 font-medium pl-2 sm:pl-4 border-l-2 border-amber-500/40 my-1">\${line}</p>\`;
          } else if (isSixDirect) {
            innerHtml += \`<p class="text-emerald-400/90 font-medium pl-2 sm:pl-4 border-l-2 border-emerald-500/40 my-1">\${line}</p>\`;
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

    // 9. 木魚與計數器互動
    function strikeWoodfish() {
      ZenAudio.playWoodfish();
      const btn = document.getElementById('strikeWoodfishBtn');
      if (btn) {
        btn.classList.add('striking');
        setTimeout(() => btn.classList.remove('striking'), 160);
      }
    }

    function incrementPracticeCount() {
      // 若當前經咒未滿，優先 +1 經咒
      if (AppState.currentMantraRep < AppState.targetMantraRep) {
        AppState.currentMantraRep++;
        document.getElementById('currentMantraRepText').textContent = AppState.currentMantraRep;
        ZenAudio.playWoodfish();

        if (AppState.currentMantraRep >= AppState.targetMantraRep) {
          ZenAudio.playChime();
          showToast('🎉 經咒持誦圓滿達標（' + AppState.targetMantraRep + ' 遍）！');
        }
      } else {
        // 累積聖號
        AppState.currentBuddhaCount++;
        document.getElementById('currentBuddhaCountText').textContent = AppState.currentBuddhaCount;
        ZenAudio.playWoodfish();

        if (AppState.targetBuddhaCount > 0 && AppState.currentBuddhaCount === AppState.targetBuddhaCount) {
          ZenAudio.playChime();
          showToast('🙏 觀音聖號已滿 ' + AppState.targetBuddhaCount + ' 聲，發願圓滿！');
        }
      }
    }

    function setupKeyListeners() {
      const strikeBtn = document.getElementById('strikeWoodfishBtn');
      if (strikeBtn) strikeBtn.addEventListener('click', strikeWoodfish);

      const incBtn = document.getElementById('incrementRepBtn');
      if (incBtn) incBtn.addEventListener('click', incrementPracticeCount);

      window.addEventListener('keydown', (e) => {
        // 空白鍵敲木魚
        if (e.code === 'Space' && AppState.spacebarWoodfish) {
          // 若不是在輸入框內
          if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
          e.preventDefault();
          strikeWoodfish();
        }
      });
    }

    // 10. 字級切換
    function setFontSize(size, notify = true) {
      AppState.fontSize = size;
      SafeStorage.setItem('zen_font_size', size);
      const container = document.getElementById('scriptureContentContainer');
      if (!container) return;

      container.classList.remove('text-base', 'text-lg', 'text-xl', 'text-2xl');
      ['btnFontNormal', 'btnFontLarge', 'btnFontXLarge'].forEach(id => {
        const b = document.getElementById(id);
        if (b) b.className = 'px-2 py-0.5 rounded-full hover:text-amber-400';
      });

      if (size === 'large') {
        container.classList.add('text-xl');
        const b = document.getElementById('btnFontLarge');
        if (b) b.className = 'px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold';
      } else if (size === 'xlarge') {
        container.classList.add('text-2xl');
        const b = document.getElementById('btnFontXLarge');
        if (b) b.className = 'px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold';
      } else {
        container.classList.add('text-lg');
        const b = document.getElementById('btnFontNormal');
        if (b) b.className = 'px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold';
      }

      if (notify) showToast('已調整字級為：' + (size === 'large' ? '大字' : size === 'xlarge' ? '特大' : '標準'));
    }

    // 11. 外觀主題切換
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

    // 12. 日課打卡與修持日曆
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
        buddhaCount: AppState.currentBuddhaCount || 108,
        ...details
      };
      SafeStorage.setItem('zen_practice_logs', JSON.stringify(logs));
      updateDailyCheckStatus();
    }

    function finishPracticeAndCheckIn() {
      ZenAudio.playChime();
      savePracticeLogForToday({ completed: true });
      showToast('🙏 今日定課已圓滿打卡！功德迴向法界');
      setTimeout(() => {
        openDailyRecords();
      }, 500);
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
      const month = now.getMonth(); // 0-indexed
      document.getElementById('calendarMonthTitle').textContent = year + '年 ' + (month + 1) + '月';

      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const logs = getPracticeLogs();
      const todayDate = now.getDate();

      // 空白日
      for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'h-10 rounded-lg bg-surface/30 opacity-20';
        grid.appendChild(emptyCell);
      }

      // 每日
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

      // 背景護眼暗調
      ctx.fillStyle = '#14171A';
      ctx.fillRect(0, 0, 800, 500);

      // 外邊框
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 740, 440);

      // 內邊框
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, 720, 420);

      // 頂部標題
      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 26px "Noto Serif TC", serif';
      ctx.textAlign = 'center';
      ctx.fillText('觀音法門定課・修持迴向', 400, 95);

      // 迴向對象
      ctx.fillStyle = '#E6DFD5';
      ctx.font = '18px "Noto Serif TC", serif';
      ctx.fillText('迴向功德主：' + author + '    ｜    祈福對象：' + target, 400, 145);

      // 迴向四句偈
      ctx.fillStyle = '#D4AF37';
      ctx.font = '22px "Noto Serif TC", serif';
      ctx.fillText('願消三障諸煩惱　願得智慧真明了', 400, 220);
      ctx.fillText('普願罪障悉消除　世世常行菩薩道', 400, 265);

      // 大悲發願兩句
      ctx.fillStyle = '#9DB4A9';
      ctx.font = '16px "Noto Serif TC", serif';
      ctx.fillText('千處祈求千處現　苦海常作度人舟', 400, 335);
      ctx.fillText('南無大悲觀世音菩薩摩訶薩', 400, 370);

      // 日期
      ctx.fillStyle = '#7E766B';
      ctx.font = '13px sans-serif';
      ctx.fillText('法鼓山觀音法門定課系統敬製 ・ ' + getTodayString(), 400, 430);

      // 下載 PNG
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
      if (key === 'spacebarWoodfish') {
        AppState.spacebarWoodfish = val;
      }
    }

    // 15. 自訂 Toast 通知
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

    // 綁定頂部導覽列按鈕
    document.getElementById('brandLogoHomeBtn').addEventListener('click', returnToHome);
    document.getElementById('openDailyRecordsBtn').addEventListener('click', openDailyRecords);
    document.getElementById('openSettingsBtn').addEventListener('click', openSettings);
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
console.log('Successfully built and updated 觀音法門定課/index.html');
