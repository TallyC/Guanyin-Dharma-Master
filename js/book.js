/**
 * 觀音法門定課 - 仿古經書摺本版控制器 (Traditional Sutra Book Controller) v1.5
 * 1. 原生 HTML5 <ruby> 經書排版，告別積木方塊感，達到頂級電子書（Kindle/Apple Books/CBETA）流暢水準
 * 2. 三大純淨讀誦模式：【經書注音】、【純淨大字】、【三音研習】
 * 3. 沉浸全屏誦經模式 (Zen Immersive Mode)：點擊螢幕中央隱藏/浮現選單，全屏專注讀誦
 * 4. 支援手機 Wi-Fi 區域網路同步掃碼預覽
 * 5. 支援傳統直書右至左 (vertical-rl) 與橫書經本自由切換
 * 6. 整合 SafeStorage 快取、修持日曆打卡、法鼓山雲端祈福小卡
 */

(function () {
  'use strict';

  const state = {
    currentKey: 'merged', // merged, pumenpin, dabeizhou, xinjing
    theme: 'stone', // stone, dark
    direction: 'vertical-rl', // vertical-rl, horizontal-tb
    readMode: 'zhuyin', // zhuyin, pure, study
    fontSize: 'normal', // normal, large, xlarge
    maskMode: 'none', // none, char
    showPunct: true,
    zenImmersive: false,
    currentPage: 1,
    totalPages: 1
  };

  let el = {};

  window.showAppToast = function (msg) {
    showToast(msg);
  };

  document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    loadPreferences();
    bindEvents();
    renderCurrentBookScripture();
    updateCheckInButtonState();
  });

  function getScriptureDatabase() {
    return window.GUANYIN_PRACTICE_DATA || window.GUANYIN_SCRIPTURES || {};
  }

  function cacheElements() {
    el = {
      recordPracticeBtn: document.getElementById('recordPracticeBtn'),
      recordPracticeText: document.getElementById('recordPracticeText'),
      openCalendarBtn: document.getElementById('openCalendarBtn'),
      openDedicationBtn: document.getElementById('openDedicationBtn'),
      openMobileQrBtn: document.getElementById('openMobileQrBtn'),
      zenImmersiveToggleBtn: document.getElementById('zenImmersiveToggleBtn'),
      zenImmersiveText: document.getElementById('zenImmersiveText'),
      floatingZenMenuBtn: document.getElementById('floatingZenMenuBtn'),
      themeToggleBtn: document.getElementById('themeToggleBtn'),
      directionToggleBtn: document.getElementById('directionToggleBtn'),
      directionText: document.getElementById('directionText'),

      openSettingsDrawerBtn: document.getElementById('openSettingsDrawerBtn'),
      closeSettingsDrawerBtn: document.getElementById('closeSettingsDrawerBtn'),
      settingsDrawer: document.getElementById('settingsDrawer'),
      drawerTogglePunct: document.getElementById('drawerTogglePunct'),
      drawerReadModeBtns: document.querySelectorAll('.drawer-btn-readmode'),
      drawerFontSizeBtns: document.querySelectorAll('.drawer-btn-size'),
      drawerMaskModeBtns: document.querySelectorAll('.drawer-btn-mask'),
      drawerSectionQuickSelect: document.getElementById('drawerSectionQuickSelect'),
      drawerRecordBtn: document.getElementById('drawerRecordBtn'),
      drawerRecordText: document.getElementById('drawerRecordText'),
      drawerCalendarBtn: document.getElementById('drawerCalendarBtn'),
      drawerDedicationBtn: document.getElementById('drawerDedicationBtn'),
      drawerThemeBtn: document.getElementById('drawerThemeBtn'),

      modeTabs: document.querySelectorAll('.book-tab-btn'),
      readModeBtns: document.querySelectorAll('.reading-mode-selector .mode-btn'),
      sectionQuickSelect: document.getElementById('sectionQuickSelect'),

      togglePunct: document.getElementById('togglePunct'),
      fontSizeBtns: document.querySelectorAll('.book-controls-group [data-size]'),
      maskModeBtns: document.querySelectorAll('.book-controls-group [data-mask]'),

      bookCoverHeader: document.querySelector('.book-cover-header'),
      bookCoverTitle: document.getElementById('bookCoverTitle'),
      bookCoverSub: document.getElementById('bookCoverSub'),
      sutraBodyContainer: document.getElementById('sutraBodyContainer'),
      bookStageWrapper: document.getElementById('bookStageWrapper'),
      bookHeader: document.querySelector('.book-header'),
      bookSubnav: document.getElementById('bookSubnav'),

      bookPaginationBar: document.getElementById('bookPaginationBar'),
      bookPrevPageBtn: document.getElementById('bookPrevPageBtn'),
      bookNextPageBtn: document.getElementById('bookNextPageBtn'),
      pageCounterDisplay: document.getElementById('pageCounterDisplay'),
      pageProgressSlider: document.getElementById('pageProgressSlider'),
      tapZonePrev: document.getElementById('tapZonePrev'),
      tapZoneNext: document.getElementById('tapZoneNext'),

      mobileQrModal: document.getElementById('mobileQrModal'),
      closeMobileQrModalBtn: document.getElementById('closeMobileQrModalBtn'),
      mobileUrlInput: document.getElementById('mobileUrlInput'),
      copyMobileUrlBtn: document.getElementById('copyMobileUrlBtn'),

      calendarModal: document.getElementById('calendarModal'),
      closeCalendarModalBtn: document.getElementById('closeCalendarModalBtn'),
      calendarMount: document.getElementById('calendarMount'),

      dedicationModal: document.getElementById('dedicationModal'),
      closeDedicationModalBtn: document.getElementById('closeDedicationModalBtn'),
      dedicationCardCanvas: document.getElementById('dedicationCardCanvas'),
      cardStyleRadios: document.querySelectorAll('input[name="cardStyle"]'),
      blessingPresetSelect: document.getElementById('blessingPresetSelect'),
      dedicatorInput: document.getElementById('dedicatorInput'),
      recipientInput: document.getElementById('recipientInput'),
      blessingMsgInput: document.getElementById('blessingMsgInput'),
      downloadCardBtn: document.getElementById('downloadCardBtn'),
      copyCardTextBtn: document.getElementById('copyCardTextBtn'),

      toastContainer: document.getElementById('toastContainer')
    };
  }

  function loadPreferences() {
    state.theme = SafeStorage.getItem('gy_book_theme', 'stone') || 'stone';
    document.documentElement.setAttribute('data-theme', state.theme);

    // 人體工學智慧預設：手機螢幕 (<=768px) 預設橫排；寬螢幕預設直排經摺
    const savedDir = SafeStorage.getItem('gy_book_direction', null);
    if (savedDir) {
      state.direction = savedDir;
    } else {
      state.direction = (window.innerWidth <= 768) ? 'horizontal-tb' : 'vertical-rl';
    }
    applyDirection(state.direction);

    state.readMode = SafeStorage.getItem('gy_book_readmode', 'zhuyin') || 'zhuyin';
    applyReadMode(state.readMode);

    state.fontSize = SafeStorage.getItem('gy_book_fontsize', 'normal') || 'normal';
    applyFontSize(state.fontSize);

    state.showPunct = SafeStorage.getItem('gy_show_punct_v12', 'true') === 'true';
    if (el.togglePunct) el.togglePunct.checked = state.showPunct;
    if (el.drawerTogglePunct) el.drawerTogglePunct.checked = state.showPunct;
    applyVisibilityToggles();
  }

  function applyDirection(dir) {
    state.direction = dir;
    SafeStorage.setItem('gy_book_direction', dir);
    if (el.bookStageWrapper) {
      el.bookStageWrapper.classList.remove('layout-vertical-rl', 'layout-horizontal-tb');
      el.bookStageWrapper.classList.add(dir === 'vertical-rl' ? 'layout-vertical-rl' : 'layout-horizontal-tb');
    }
    if (el.directionText) {
      el.directionText.textContent = dir === 'vertical-rl' ? '切換橫排經本' : '切換直排經摺';
    }
    resetBookScrollPosition();
  }

  function resetBookScrollPosition() {
    if (!el.sutraBodyContainer) return;
    setTimeout(() => {
      if (state.direction === 'vertical-rl') {
        el.sutraBodyContainer.scrollLeft = 0;
        const firstSec = document.getElementById('book-sec-0');
        if (firstSec) {
          firstSec.scrollIntoView({ behavior: 'auto', inline: 'start', block: 'start' });
        }
      } else {
        el.sutraBodyContainer.scrollTop = 0;
      }
      state.currentPage = 1;
      updatePaginationState();
    }, 40);
  }

  function updatePaginationState() {
    if (!el.sutraBodyContainer) return;
    const isVertical = state.direction === 'vertical-rl';
    let total = 1;
    let current = 1;

    if (isVertical) {
      const scrollWidth = el.sutraBodyContainer.scrollWidth;
      const clientWidth = el.sutraBodyContainer.clientWidth || 1;
      total = Math.max(1, Math.ceil(scrollWidth / clientWidth));
      // 直排由右往左滾動，scrollLeft 數值計算
      const scrollLeft = Math.abs(el.sutraBodyContainer.scrollLeft);
      current = Math.min(total, Math.max(1, Math.round(scrollLeft / clientWidth) + 1));
    } else {
      const scrollHeight = el.sutraBodyContainer.scrollHeight;
      const clientHeight = el.sutraBodyContainer.clientHeight || 1;
      total = Math.max(1, Math.ceil(scrollHeight / clientHeight));
      const scrollTop = el.sutraBodyContainer.scrollTop;
      current = Math.min(total, Math.max(1, Math.round(scrollTop / clientHeight) + 1));
    }

    state.totalPages = total;
    state.currentPage = current;

    if (el.pageCounterDisplay) {
      el.pageCounterDisplay.textContent = `第 ${current} / ${total} 頁`;
    }
    if (el.pageProgressSlider) {
      el.pageProgressSlider.min = 1;
      el.pageProgressSlider.max = total;
      el.pageProgressSlider.value = current;
    }
    if (el.bookPrevPageBtn) {
      el.bookPrevPageBtn.disabled = current <= 1;
    }
    if (el.bookNextPageBtn) {
      el.bookNextPageBtn.disabled = current >= total;
    }
  }

  function goToPage(targetPage) {
    if (!el.sutraBodyContainer) return;
    const isVertical = state.direction === 'vertical-rl';
    const page = Math.max(1, Math.min(state.totalPages, targetPage));
    state.currentPage = page;

    if (isVertical) {
      const clientWidth = el.sutraBodyContainer.clientWidth;
      const targetScroll = (page - 1) * clientWidth;
      el.sutraBodyContainer.scrollTo({
        left: -targetScroll,
        behavior: 'smooth'
      });
    } else {
      const clientHeight = el.sutraBodyContainer.clientHeight;
      const targetScroll = (page - 1) * clientHeight;
      el.sutraBodyContainer.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
    setTimeout(updatePaginationState, 250);
  }

  function turnNextPage() {
    goToPage(state.currentPage + 1);
  }

  function turnPrevPage() {
    goToPage(state.currentPage - 1);
  }

  function applyReadMode(mode) {
    state.readMode = mode;
    SafeStorage.setItem('gy_book_readmode', mode);

    document.body.classList.remove('mode-zhuyin', 'mode-pure', 'mode-study');
    document.body.classList.add(`mode-${mode}`);

    if (el.readModeBtns) {
      el.readModeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-readmode') === mode);
      });
    }
    if (el.drawerReadModeBtns) {
      el.drawerReadModeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-readmode') === mode);
      });
    }

    // 重新渲染以適配不同模式下的結構與排版
    renderCurrentBookScripture();
  }

  function applyFontSize(size) {
    state.fontSize = size;
    document.body.classList.remove('size-large', 'size-xlarge');
    if (size === 'large') document.body.classList.add('size-large');
    if (size === 'xlarge') document.body.classList.add('size-xlarge');
    SafeStorage.setItem('gy_book_fontsize', size);

    if (el.fontSizeBtns) {
      el.fontSizeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-size') === size);
      });
    }
    if (el.drawerFontSizeBtns) {
      el.drawerFontSizeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-size') === size);
      });
    }

    setTimeout(updatePaginationState, 100);
  }

  function applyMaskMode(mode) {
    state.maskMode = mode;
    if (el.sutraBodyContainer) {
      const rubies = el.sutraBodyContainer.querySelectorAll('.sutra-ruby');
      rubies.forEach(r => {
        if (mode === 'char') {
          r.classList.add('masked');
          r.classList.remove('revealed');
        } else {
          r.classList.remove('masked', 'revealed');
        }
      });
    }

    if (el.maskModeBtns) {
      el.maskModeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-mask') === mode);
      });
    }
    if (el.drawerMaskModeBtns) {
      el.drawerMaskModeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-mask') === mode);
      });
    }
  }

  function applyVisibilityToggles() {
    document.body.classList.toggle('hide-punct', !state.showPunct);
    SafeStorage.setItem('gy_show_punct_v12', state.showPunct ? 'true' : 'false');
  }

  function toggleZenImmersiveMode(force) {
    if (typeof force === 'boolean') {
      state.zenImmersive = force;
    } else {
      state.zenImmersive = !state.zenImmersive;
    }

    document.body.classList.toggle('zen-immersive-active', state.zenImmersive);

    if (el.floatingZenMenuBtn) {
      el.floatingZenMenuBtn.classList.toggle('hidden', !state.zenImmersive);
    }
    if (el.zenImmersiveText) {
      el.zenImmersiveText.textContent = state.zenImmersive ? '退出沉浸' : '沉浸誦經';
    }

    if (state.zenImmersive) {
      showToast('🔲 已進入全屏沉浸誦經（輕觸經文中央可喚出選單）');
    } else {
      showToast('已退出沉浸模式，功能選單已還原');
    }
  }

  function bindEvents() {
    // 沉浸誦經模式切換
    if (el.zenImmersiveToggleBtn) {
      el.zenImmersiveToggleBtn.addEventListener('click', () => {
        toggleZenImmersiveMode();
      });
    }
    if (el.floatingZenMenuBtn) {
      el.floatingZenMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleZenImmersiveMode(false);
      });
    }

    // 點擊經文正文中央，若處於沉浸模式，可靈活喚出/隱藏選單
    if (el.sutraBodyContainer) {
      el.sutraBodyContainer.addEventListener('click', (e) => {
        if (e.target.closest('.sutra-ruby.masked')) {
          // 默誦遮蔽點擊揭示，不切換選單
          return;
        }
        if (state.zenImmersive) {
          toggleZenImmersiveMode(false);
        }
      });
    }

    // 手機掃碼預覽彈窗
    if (el.openMobileQrBtn) {
      el.openMobileQrBtn.addEventListener('click', () => {
        openModal(el.mobileQrModal);
      });
    }
    if (el.closeMobileQrModalBtn) {
      el.closeMobileQrModalBtn.addEventListener('click', () => {
        closeModal(el.mobileQrModal);
      });
    }
    if (el.copyMobileUrlBtn && el.mobileUrlInput) {
      el.copyMobileUrlBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(el.mobileUrlInput.value).then(() => {
          showToast('手機連線網址已複製至剪貼簿！');
        }).catch(() => {
          el.mobileUrlInput.select();
          document.execCommand('copy');
          showToast('手機連線網址已複製！');
        });
      });
    }

    // 經本排版方向切換 (直排經摺 / 橫排經本)
    el.directionToggleBtn.addEventListener('click', () => {
      const nextDir = state.direction === 'vertical-rl' ? 'horizontal-tb' : 'vertical-rl';
      applyDirection(nextDir);
      showToast(nextDir === 'vertical-rl' ? '已切換為大藏經直排雙絲欄經摺裝' : '已切換為橫排經本典籍裝');
    });

    // 暗黑金泥主題切換
    el.themeToggleBtn.addEventListener('click', () => {
      state.theme = state.theme === 'stone' ? 'dark' : 'stone';
      document.documentElement.setAttribute('data-theme', state.theme);
      SafeStorage.setItem('gy_book_theme', state.theme);
      showToast(state.theme === 'dark' ? '已切換至曜石金泥夜修模式' : '已切換至暖日古宣紙模式');
    });

    // 定課模式切換 (三門合併 / 普門品 / 大悲咒 / 心經)
    el.modeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        el.modeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        state.currentKey = tab.getAttribute('data-mode');
        renderCurrentBookScripture();
      });
    });

    // 電子書三大閱讀模式切換
    if (el.readModeBtns) {
      el.readModeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          applyReadMode(btn.getAttribute('data-readmode'));
        });
      });
    }
    if (el.drawerReadModeBtns) {
      el.drawerReadModeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          applyReadMode(btn.getAttribute('data-readmode'));
        });
      });
    }

    // 句讀標點開關
    if (el.togglePunct) {
      el.togglePunct.addEventListener('change', (e) => {
        state.showPunct = e.target.checked;
        if (el.drawerTogglePunct) el.drawerTogglePunct.checked = state.showPunct;
        applyVisibilityToggles();
      });
    }
    if (el.drawerTogglePunct) {
      el.drawerTogglePunct.addEventListener('change', (e) => {
        state.showPunct = e.target.checked;
        if (el.togglePunct) el.togglePunct.checked = state.showPunct;
        applyVisibilityToggles();
      });
    }

    // 字級大小切換
    el.fontSizeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        applyFontSize(btn.getAttribute('data-size'));
      });
    });
    if (el.drawerFontSizeBtns) {
      el.drawerFontSizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          applyFontSize(btn.getAttribute('data-size'));
        });
      });
    }

    // 默誦背誦切換
    el.maskModeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        applyMaskMode(btn.getAttribute('data-mask'));
      });
    });
    if (el.drawerMaskModeBtns) {
      el.drawerMaskModeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          applyMaskMode(btn.getAttribute('data-mask'));
        });
      });
    }

    // 段落直達
    if (el.sectionQuickSelect) {
      el.sectionQuickSelect.addEventListener('change', (e) => {
        scrollToSection(e.target.value);
      });
    }
    if (el.drawerSectionQuickSelect) {
      el.drawerSectionQuickSelect.addEventListener('change', (e) => {
        scrollToSection(e.target.value);
        closeModal(el.settingsDrawer);
      });
    }

    // 今日定課打卡
    el.recordPracticeBtn.addEventListener('click', () => {
      const db = getScriptureDatabase();
      const data = db[state.currentKey];
      const name = data ? (data.name || data.title) : '觀音法門定課';
      CalendarCompanion.recordSession(name, 1);
      updateCheckInButtonState();
      showToast('🙏 今日定課已圓滿記錄！隨喜讚歎！');
    });

    // 修持日曆彈窗
    el.openCalendarBtn.addEventListener('click', () => {
      openModal(el.calendarModal);
      CalendarCompanion.renderCalendar(el.calendarMount, () => {
        updateCheckInButtonState();
        showToast('🙏 今日定課已圓滿記錄！');
      });
    });
    el.closeCalendarModalBtn.addEventListener('click', () => {
      closeModal(el.calendarModal);
    });

    // 雲端祈福卡彈窗
    el.openDedicationBtn.addEventListener('click', () => {
      openModal(el.dedicationModal);
      refreshCardPreview();
    });
    el.closeDedicationModalBtn.addEventListener('click', () => {
      closeModal(el.dedicationModal);
    });

    el.cardStyleRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.checked) refreshCardPreview();
      });
    });

    el.blessingPresetSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val && val !== 'custom') {
        el.blessingMsgInput.value = val;
      }
      refreshCardPreview();
    });

    [el.dedicatorInput, el.recipientInput, el.blessingMsgInput].forEach(inp => {
      inp.addEventListener('input', () => {
        refreshCardPreview();
      });
    });

    el.downloadCardBtn.addEventListener('click', () => {
      const ok = DedicationCard.downloadCard(el.dedicationCardCanvas);
      if (ok) showToast('法鼓山雲端祈福小卡已成功下載！');
    });

    // 抽屜快捷：今日定課打卡
    if (el.drawerRecordBtn) {
      el.drawerRecordBtn.addEventListener('click', () => {
        const db = getScriptureDatabase();
        const data = db[state.currentKey];
        const name = data ? (data.name || data.title) : '觀音法門定課';
        CalendarCompanion.recordSession(name, 1);
        updateCheckInButtonState();
        showToast('🙏 今日定課已圓滿記錄！隨喜讚歎！');
      });
    }

    // 抽屜快捷：修持日曆
    if (el.drawerCalendarBtn) {
      el.drawerCalendarBtn.addEventListener('click', () => {
        closeModal(el.settingsDrawer);
        openModal(el.calendarModal);
        CalendarCompanion.renderCalendar(el.calendarMount, () => {
          updateCheckInButtonState();
          showToast('🙏 今日定課已圓滿記錄！');
        });
      });
    }

    // 抽屜快捷：雲端祈福卡
    if (el.drawerDedicationBtn) {
      el.drawerDedicationBtn.addEventListener('click', () => {
        closeModal(el.settingsDrawer);
        openModal(el.dedicationModal);
        refreshCardPreview();
      });
    }

    // 抽屜快捷：夜修主題切換
    if (el.drawerThemeBtn) {
      el.drawerThemeBtn.addEventListener('click', () => {
        state.theme = state.theme === 'stone' ? 'dark' : 'stone';
        document.documentElement.setAttribute('data-theme', state.theme);
        SafeStorage.setItem('gy_book_theme', state.theme);
        showToast(state.theme === 'dark' ? '已切換至曜石金泥夜修模式' : '已切換至暖日古宣紙模式');
      });
    }

    el.copyCardTextBtn.addEventListener('click', () => {
      const db = getScriptureDatabase();
      const text = DedicationCard.formatShareText({
        dedicator: el.dedicatorInput.value.trim() || '佛弟子',
        recipient: el.recipientInput.value.trim() || '父母師長與一切有情',
        blessing: el.blessingMsgInput.value.trim(),
        practiceName: db[state.currentKey]?.name || '觀音法門定課'
      });
      navigator.clipboard.writeText(text).then(() => {
        showToast('法鼓山祈願法語已複製至剪貼簿！');
      }).catch(() => {
        showToast('請手動複製文字');
      });
    });

    // 經本細部設置底抽屜
    if (el.openSettingsDrawerBtn) {
      el.openSettingsDrawerBtn.addEventListener('click', () => {
        openModal(el.settingsDrawer);
      });
    }
    if (el.closeSettingsDrawerBtn) {
      el.closeSettingsDrawerBtn.addEventListener('click', () => {
        closeModal(el.settingsDrawer);
      });
    }

    // 電子書翻頁導航按鈕
    if (el.bookPrevPageBtn) {
      el.bookPrevPageBtn.addEventListener('click', () => {
        turnPrevPage();
      });
    }
    if (el.bookNextPageBtn) {
      el.bookNextPageBtn.addEventListener('click', () => {
        turnNextPage();
      });
    }

    // 翻頁進度條拖曳
    if (el.pageProgressSlider) {
      el.pageProgressSlider.addEventListener('input', (e) => {
        goToPage(parseInt(e.target.value, 10));
      });
    }

    // 螢幕左右側快速點擊翻頁 (Tap-to-turn zones)
    if (el.tapZonePrev) {
      el.tapZonePrev.addEventListener('click', (e) => {
        e.stopPropagation();
        turnPrevPage();
      });
    }
    if (el.tapZoneNext) {
      el.tapZoneNext.addEventListener('click', (e) => {
        e.stopPropagation();
        turnNextPage();
      });
    }

    // 滾動時自動同步頁碼
    if (el.sutraBodyContainer) {
      let scrollTimer = null;
      el.sutraBodyContainer.addEventListener('scroll', () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(updatePaginationState, 60);
      }, { passive: true });
    }

    // 視窗尺寸改變時重新計算總頁數 (電子書自適應字級與螢幕寬度)
    window.addEventListener('resize', () => {
      updatePaginationState();
    });

    // 鍵盤左右方向鍵與 PageUp/PageDown 快捷翻頁
    window.addEventListener('keydown', (e) => {
      // 避免在輸入框打字時誤觸翻頁
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault();
        turnNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault();
        turnPrevPage();
      }
    });

    // 手機觸控左右滑動手勢 (Swipe Gesture)
    let touchStartX = 0;
    let touchStartY = 0;
    if (el.sutraBodyContainer) {
      el.sutraBodyContainer.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length > 0) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      el.sutraBodyContainer.addEventListener('touchend', (e) => {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const deltaY = e.changedTouches[0].clientY - touchStartY;

        // 若水平滑動距離顯著大於垂直移動，判斷為翻頁手勢
        if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
          if (state.direction === 'vertical-rl') {
            // 直排：向左滑為下一折，向右滑為上一折
            if (deltaX < 0) turnNextPage();
            else turnPrevPage();
          } else {
            // 橫排：向左滑翻下一頁，向右滑翻上一頁
            if (deltaX < 0) turnNextPage();
            else turnPrevPage();
          }
        }
      }, { passive: true });
    }

    // 點擊遮罩關閉彈窗
    [el.calendarModal, el.dedicationModal, el.settingsDrawer, el.mobileQrModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal(modal);
        });
      }
    });
  }

  function scrollToSection(idx) {
    const targetSec = document.getElementById(`book-sec-${idx}`);
    if (targetSec && el.sutraBodyContainer) {
      if (state.direction === 'vertical-rl') {
        const cRect = el.sutraBodyContainer.getBoundingClientRect();
        const tRect = targetSec.getBoundingClientRect();
        const deltaX = cRect.right - tRect.right;
        el.sutraBodyContainer.scrollBy({ left: -deltaX, behavior: 'smooth' });
      } else {
        targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  // 渲染經書版內容（流暢原生 <ruby> 排版，告別方塊積木拼湊）
  function renderCurrentBookScripture() {
    const db = getScriptureDatabase();
    const data = db[state.currentKey];
    if (!data) return;

    if (el.bookCoverTitle) el.bookCoverTitle.textContent = data.name || data.title || '觀音法門定課';
    if (el.bookCoverSub) el.bookCoverSub.textContent = data.theme || data.desc || '大悲總持・普門廣度・般若空慧';

    if (data.sections) {
      let optHtml = '';
      data.sections.forEach((sec, idx) => {
        optHtml += `<option value="${idx}">${sec.title.replace(/[\u3010\u3011]/g, '')}</option>`;
      });
      if (el.sectionQuickSelect) el.sectionQuickSelect.innerHTML = optHtml;
      if (el.drawerSectionQuickSelect) el.drawerSectionQuickSelect.innerHTML = optHtml;
    }

    const customMap = SafeStorage.getJSON('gy_custom_chars', {});

    // 輔助函式：渲染字詞陣列（支持 ruby、注音、拼音、標點、空格、默誦遮蔽）
    function renderWordList(words, sIdx, lIdx, offset) {
      let chunk = '';
      words.forEach((wObj, localIdx) => {
        const cIdx = offset + localIdx;
        const rawChar = wObj.char || '';
        const rawZh = wObj.zh || '';
        const rawPy = wObj.py || '';

        const customKey = `${state.currentKey}_${sIdx}_${lIdx}_${cIdx}`;
        const custom = customMap[customKey];

        const charText = (custom && custom.t) ? custom.t : rawChar;
        const charZhuyin = (custom && custom.z) ? custom.z : rawZh;
        const charPinyin = (custom && custom.p) ? custom.p : rawPy;

        const isPunctuation = /[\uff0c\u3002\u3001\uff1b\uff1a\uff1f\uff01\u300c\u300d\u300e\u300f\u300a\u300b\uff08\uff09\u2014\u2026\u00b7()]/.test(charText);
        const isSpace = /[\s\u3000]/.test(charText);

        if (isSpace) {
          chunk += `<span class="sutra-space">\u3000</span>`;
        } else if (isPunctuation) {
          chunk += `<span class="sutra-punct">${charText}</span>`;
        } else {
          const maskedClass = (state.maskMode === 'char') ? ' masked' : '';
          chunk += `<ruby class="sutra-ruby${maskedClass}" data-sidx="${sIdx}" data-lidx="${lIdx}" data-cidx="${cIdx}">`;
          chunk += `<span class="sutra-char">${charText}</span>`;
          
          if (state.readMode !== 'pure' && charZhuyin) {
            chunk += `<rt class="sutra-rt">${charZhuyin}</rt>`;
          }
          if (state.readMode === 'study' && charPinyin) {
            chunk += `<span class="sutra-pinyin">${charPinyin}</span>`;
          }
          chunk += `</ruby>`;
        }
      });
      return chunk;
    }

    let html = '';

    data.sections.forEach((sec, sIdx) => {
      const title = sec.title || '';
      const isGathaSec = /偈頌|開經偈|迴向偈|三皈依|發願/.test(title);
      const isMantraSec = /陀羅尼|大悲咒/.test(title);
      const isProseSec = /長行|心經/.test(title);
      const isChantSec = /讚|聖號/.test(title);

      let secClass = 'sutra-book-section';
      if (isMantraSec) secClass += ' section-mantra';
      else if (isGathaSec) secClass += ' section-gatha';
      else if (isProseSec) secClass += ' section-prose';
      else if (isChantSec) secClass += ' section-chant';

      html += `<div class="${secClass}" id="book-sec-${sIdx}">`;

      if (isMantraSec) {
        html += `<div class="sutra-mantra-container">`;
      }

      sec.lines.forEach((line, lIdx) => {
        const lineText = line.text || '';
        const words = line.words || [];

        // 檢查是否為 4 句式五言偈（普門品偈頌核心：5字 + 5字 + 5字 + 5字）
        const spaceIndices = [];
        words.forEach((w, idx) => {
          if (w.char === '　' || w.char === ' ') spaceIndices.push(idx);
        });

        if (isGathaSec && spaceIndices.length >= 3) {
          // 四句五言偈頌：完美對稱拆分為 2 行，每行 10 字！
          const mid = spaceIndices[1];
          const row1Words = words.slice(0, mid);
          const row2Words = words.slice(mid + 1);

          html += `<div class="sutra-gatha-stanza" data-sidx="${sIdx}" data-lidx="${lIdx}">`;
          html += `<div class="sutra-line-flow gatha-row">${renderWordList(row1Words, sIdx, lIdx, 0)}</div>`;
          html += `<div class="sutra-line-flow gatha-row">${renderWordList(row2Words, sIdx, lIdx, mid + 1)}</div>`;
          html += `</div>`;
        } else if (isMantraSec) {
          // 大悲咒神咒：齊頭對齊！
          html += `<div class="sutra-line-flow mantra-row" data-sidx="${sIdx}" data-lidx="${lIdx}">`;
          html += renderWordList(words, sIdx, lIdx, 0);
          html += `</div>`;
        } else if (isProseSec || (isGathaSec && spaceIndices.length < 3 && lineText.length > 25)) {
          // 長行散文（含偈頌尾聲的散文流通分）：左右兩端對齊，首行縮排
          html += `<div class="sutra-line-flow prose-row" data-sidx="${sIdx}" data-lidx="${lIdx}">`;
          html += renderWordList(words, sIdx, lIdx, 0);
          html += `</div>`;
        } else {
          // 讚偈、聖號與其他短行
          const isHonorific = /南無|三稱/.test(lineText);
          const rowClass = isHonorific ? ' chant-honorific-row' : ' chant-row';
          html += `<div class="sutra-line-flow${rowClass}" data-sidx="${sIdx}" data-lidx="${lIdx}">`;
          html += renderWordList(words, sIdx, lIdx, 0);
          html += `</div>`;
        }
      });

      if (isMantraSec) {
        html += `</div>`; // 關閉 sutra-mantra-container
      }

      html += `</div>`;
    });

    el.sutraBodyContainer.innerHTML = html;

    // 默誦遮蔽點擊揭示
    el.sutraBodyContainer.querySelectorAll('.sutra-ruby').forEach(ruby => {
      ruby.addEventListener('click', () => {
        if (ruby.classList.contains('masked')) {
          ruby.classList.toggle('revealed');
        }
      });
    });

    resetBookScrollPosition();
  }

  function updateCheckInButtonState() {
    const isChecked = CalendarCompanion.isTodayRecorded();
    [
      { btn: el.recordPracticeBtn, txt: el.recordPracticeText },
      { btn: el.drawerRecordBtn, txt: el.drawerRecordText }
    ].forEach(item => {
      if (!item.btn) return;
      if (isChecked) {
        item.btn.classList.add('btn-active');
        item.btn.style.background = 'var(--book-cinnabar)';
        item.btn.style.borderColor = 'var(--book-cinnabar)';
        item.btn.style.color = '#fff';
        if (item.txt) item.txt.textContent = '今日定課已打卡';
      } else {
        item.btn.classList.remove('btn-active');
        item.btn.style.background = '';
        item.btn.style.borderColor = '';
        item.btn.style.color = '';
        if (item.txt) item.txt.textContent = '今日定課打卡';
      }
    });
  }

  function refreshCardPreview() {
    let style = 'warm_gold';
    el.cardStyleRadios.forEach(r => {
      if (r.checked) style = r.value;
    });

    const db = getScriptureDatabase();
    DedicationCard.drawCard(el.dedicationCardCanvas, {
      style: style,
      dedicator: el.dedicatorInput.value.trim() || '佛弟子',
      recipient: el.recipientInput.value.trim() || '父母師長與一切有情',
      blessing: el.blessingMsgInput.value.trim() || '大悲心起，心安平安。祈願身心安和，障礙消除，福慧增長。',
      practiceName: db[state.currentKey]?.name || '觀音法門定課'
    });
  }

  function openModal(m) {
    if (!m) return;
    m.classList.remove('hidden');
    m.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(m) {
    if (!m) return;
    m.classList.add('hidden');
    m.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showToast(msg) {
    if (!el.toastContainer) return;
    const t = document.createElement('div');
    t.className = 'app-toast';
    t.textContent = msg;
    el.toastContainer.appendChild(t);
    setTimeout(() => {
      if (t.parentNode) t.parentNode.removeChild(t);
    }, 2600);
  }

})();
