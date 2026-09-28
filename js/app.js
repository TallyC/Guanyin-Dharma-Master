/**
 * 觀音法門定課 - 課誦控制器 (v1.2 - 法鼓山專注修持版)
 * 1. 經文徹底無畫線、徹底無下方小標，全卷連貫
 * 2. 獨立打卡按鈕，不強迫跳轉祈福卡
 * 3. 支援從日曆「回到今日定課」，嚴格不可補打過去日期的卡
 * 4. 點擊「雲端祈福卡」獨立開啟
 */

(function () {
  'use strict';

  const state = {
    currentKey: 'merged', // merged, pumenpin, dabeizhou, xinjing
    theme: 'stone', // stone (暖沙護眼), dark (曜石夜修)
    fontSize: 'normal', // normal, large, xlarge
    maskMode: 'none', // none, ruby, char
    showZhuyin: true,
    showPinyin: true,
    showPunct: true,
    editingCharInfo: null
  };

  let el = {};

  // 全域暴露 Toast 方便 calendar 調用
  window.showAppToast = function (msg) {
    showToast(msg);
  };

  document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    loadPreferences();
    bindEvents();
    renderCurrentScripture();
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
      themeToggleBtn: document.getElementById('themeToggleBtn'),
      themeIcon: document.getElementById('themeIcon'),
      themeText: document.getElementById('themeText'),

      modeTabs: document.querySelectorAll('.mode-tab-btn'),
      sectionQuickSelect: document.getElementById('sectionQuickSelect'),

      toggleZhuyin: document.getElementById('toggleZhuyin'),
      togglePinyin: document.getElementById('togglePinyin'),
      togglePunct: document.getElementById('togglePunct'),
      fontSizeBtns: document.querySelectorAll('[data-size]'),
      maskModeBtns: document.querySelectorAll('[data-mask]'),

      scriptureTitle: document.getElementById('scriptureTitle'),
      scriptureSubtitle: document.getElementById('scriptureSubtitle'),
      scriptureContainer: document.getElementById('scriptureContainer'),

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

      editCharModal: document.getElementById('editCharModal'),
      closeEditCharModalBtn: document.getElementById('closeEditCharModalBtn'),
      editCharOriginalPreview: document.getElementById('editCharOriginalPreview'),
      editCharText: document.getElementById('editCharText'),
      editCharZhuyin: document.getElementById('editCharZhuyin'),
      editCharPinyin: document.getElementById('editCharPinyin'),
      saveCharEditBtn: document.getElementById('saveCharEditBtn'),
      resetCharEditBtn: document.getElementById('resetCharEditBtn'),

      toastContainer: document.getElementById('toastContainer')
    };
  }

  function loadPreferences() {
    state.theme = SafeStorage.getItem('gy_theme_v12', 'stone') || 'stone';
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeUI();

    state.fontSize = SafeStorage.getItem('gy_fontsize_v12', 'normal') || 'normal';
    applyFontSize(state.fontSize);

    state.showZhuyin = SafeStorage.getItem('gy_show_zhuyin_v12', 'true') === 'true';
    state.showPinyin = SafeStorage.getItem('gy_show_pinyin_v12', 'true') === 'true';
    state.showPunct = SafeStorage.getItem('gy_show_punct_v12', 'true') === 'true';

    if (el.toggleZhuyin) el.toggleZhuyin.checked = state.showZhuyin;
    if (el.togglePinyin) el.togglePinyin.checked = state.showPinyin;
    if (el.togglePunct) el.togglePunct.checked = state.showPunct;
    applyVisibilityToggles();
  }

  function applyFontSize(size) {
    state.fontSize = size;
    document.body.classList.remove('font-normal', 'font-large', 'font-xlarge');
    document.body.classList.add(`font-${size}`);
    SafeStorage.setItem('gy_fontsize_v12', size);

    if (el.fontSizeBtns) {
      el.fontSizeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-size') === size);
      });
    }
  }

  function applyVisibilityToggles() {
    document.body.classList.toggle('hide-zhuyin', !state.showZhuyin);
    document.body.classList.toggle('hide-pinyin', !state.showPinyin);
    document.body.classList.toggle('hide-punct', !state.showPunct);

    SafeStorage.setItem('gy_show_zhuyin_v12', state.showZhuyin ? 'true' : 'false');
    SafeStorage.setItem('gy_show_pinyin_v12', state.showPinyin ? 'true' : 'false');
    SafeStorage.setItem('gy_show_punct_v12', state.showPunct ? 'true' : 'false');
  }

  function applyMaskMode(mode) {
    state.maskMode = mode;
    const words = document.querySelectorAll('.word-unit');
    words.forEach(w => {
      w.classList.remove('masked', 'revealed');
      if (mode === 'char') {
        w.classList.add('masked');
      }
    });

    if (mode === 'ruby') {
      document.body.classList.add('hide-zhuyin', 'hide-pinyin');
    } else {
      applyVisibilityToggles();
    }

    if (el.maskModeBtns) {
      el.maskModeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-mask') === mode);
      });
    }

    if (mode === 'char') {
      showToast('已開啟默誦背誦模式，點擊文字方塊可單獨翻開核對！');
    }
  }

  function updateCheckInButtonState() {
    if (!el.recordPracticeBtn || !el.recordPracticeText) return;
    const isDone = CalendarCompanion.isTodayPracticed();
    if (isDone) {
      el.recordPracticeBtn.classList.remove('btn-primary');
      el.recordPracticeText.textContent = '今日定課已圓滿 🙏';
    } else {
      el.recordPracticeBtn.classList.add('btn-primary');
      el.recordPracticeText.textContent = '今日定課打卡';
    }
  }

  function bindEvents() {
    // 主題切換
    el.themeToggleBtn.addEventListener('click', () => {
      state.theme = state.theme === 'stone' ? 'dark' : 'stone';
      SafeStorage.setItem('gy_theme_v12', state.theme);
      document.documentElement.setAttribute('data-theme', state.theme);
      updateThemeUI();
      showToast(state.theme === 'dark' ? '已切換為夜修專注暗調' : '已切換為日間暖沙護眼調');
    });

    // 模式切換
    el.modeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const mode = tab.getAttribute('data-mode');
        if (mode && mode !== state.currentKey) {
          state.currentKey = mode;
          el.modeTabs.forEach(t => t.classList.toggle('active', t === tab));
          renderCurrentScripture();
        }
      });
    });

    // 段落直達
    el.sectionQuickSelect.addEventListener('change', (e) => {
      const idx = e.target.value;
      const targetSec = document.getElementById(`sec-${idx}`);
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // 顯隱開關
    el.toggleZhuyin.addEventListener('change', (e) => {
      state.showZhuyin = e.target.checked;
      applyVisibilityToggles();
    });
    el.togglePinyin.addEventListener('change', (e) => {
      state.showPinyin = e.target.checked;
      applyVisibilityToggles();
    });
    el.togglePunct.addEventListener('change', (e) => {
      state.showPunct = e.target.checked;
      applyVisibilityToggles();
    });

    // 字級切換
    el.fontSizeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        applyFontSize(btn.getAttribute('data-size'));
      });
    });

    // 遮蔽模式
    el.maskModeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        applyMaskMode(btn.getAttribute('data-mask'));
      });
    });

    // 頂部「🙏 定課打卡」：只負責打卡，不強行彈出祈福卡！
    el.recordPracticeBtn.addEventListener('click', () => {
      const db = getScriptureDatabase();
      const data = db[state.currentKey];
      const name = data ? (data.name || data.title) : '觀音法門定課';

      CalendarCompanion.recordSession(name, 1);
      updateCheckInButtonState();
      showToast('🙏 今日定課已圓滿記錄！隨喜讚歎！');
    });

    // 日曆彈窗
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

    // 獨立開啟「🌸 雲端祈福卡」
    el.openDedicationBtn.addEventListener('click', () => {
      openModal(el.dedicationModal);
      refreshCardPreview();
    });
    el.closeDedicationModalBtn.addEventListener('click', () => {
      closeModal(el.dedicationModal);
    });

    // 小卡風格單選
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

    // 字音校訂事件
    el.closeEditCharModalBtn.addEventListener('click', () => {
      closeModal(el.editCharModal);
    });

    el.editCharZhuyin.addEventListener('input', () => {
      const zh = el.editCharZhuyin.value.trim();
      el.editCharPinyin.value = PinyinEngine.zhuyinToPinyin(zh);
    });

    el.saveCharEditBtn.addEventListener('click', () => {
      saveCharCustomization();
    });

    el.resetCharEditBtn.addEventListener('click', () => {
      resetCharCustomization();
    });

    // 彈窗背景與 ESC
    [el.calendarModal, el.dedicationModal, el.editCharModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal(el.calendarModal);
        closeModal(el.dedicationModal);
        closeModal(el.editCharModal);
      }
    });
  }

  function updateThemeUI() {
    if (!el.themeIcon || !el.themeText) return;
    const isDark = state.theme === 'dark';
    el.themeIcon.textContent = isDark ? '☀️' : '🌙';
    el.themeText.textContent = isDark ? '日間暖沙' : '夜修暗調';
  }

  // 渲染當前經文：徹底無小標、徹底無畫線
  function renderCurrentScripture() {
    const db = getScriptureDatabase();
    const data = db[state.currentKey];
    if (!data) return;

    el.scriptureTitle.textContent = data.name || data.title || '觀音法門定課';
    el.scriptureSubtitle.textContent = data.theme || data.desc || '法鼓山大事關懷課誦實錄・聖嚴師父修持法門';

    // 更新段落下拉選單
    if (el.sectionQuickSelect && data.sections) {
      let optHtml = '';
      data.sections.forEach((sec, idx) => {
        optHtml += `<option value="${idx}">${sec.title.replace(/[【】]/g, '')}</option>`;
      });
      el.sectionQuickSelect.innerHTML = optHtml;
    }

    const customMap = SafeStorage.getJSON('gy_custom_chars', {});

    let html = '';
    data.sections.forEach((sec, sIdx) => {
      // 僅設置錨點容器，徹底刪除 <div class="section-head"> 與小標題，徹底無任何橫線
      html += `<section class="scripture-section" id="sec-${sIdx}">`;

      sec.lines.forEach((line, lIdx) => {
        const lineText = line.text || '';
        const words = line.words || [];
        const isGatha = lineText.includes('　') || words.length <= 10;
        const gathaClass = isGatha ? ' gatha-center' : '';

        html += `<div class="sentence-block${gathaClass}" data-sidx="${sIdx}" data-lidx="${lIdx}">`;

        words.forEach((wObj, cIdx) => {
          const rawChar = wObj.char || '';
          const rawZh = wObj.zh || '';
          const rawPy = wObj.py || '';

          const customKey = `${state.currentKey}_${sIdx}_${lIdx}_${cIdx}`;
          const custom = customMap[customKey];

          const charText = (custom && custom.t) ? custom.t : rawChar;
          const charZhuyin = (custom && custom.z) ? custom.z : rawZh;
          const charPinyin = (custom && custom.p) ? custom.p : rawPy;

          const isPunctuation = /[，。、；：？！「」『』]/.test(charText);
          const isSpace = /[s　]/.test(charText);

          if (isSpace) {
            html += `<span class="word-spacer"></span>`;
          } else if (isPunctuation) {
            html += `<span class="punct-unit">${charText}</span>`;
          } else {
            html += `<div class="word-unit" data-sidx="${sIdx}" data-lidx="${lIdx}" data-cidx="${cIdx}" title="點擊校訂字音">`;
            html += `<span class="ruby-bopomofo">${charZhuyin || '&nbsp;'}</span>`;
            html += `<span class="ruby-char">${charText}</span>`;
            html += `<span class="ruby-pinyin">${charPinyin || '&nbsp;'}</span>`;
            html += `</div>`;
          }
        });

        html += `</div>`;
      });

      html += `</section>`;
    });

    el.scriptureContainer.innerHTML = html;

    // 綁定字元點擊事件 (單字校訂或默誦翻開)
    el.scriptureContainer.querySelectorAll('.word-unit').forEach(unit => {
      unit.addEventListener('click', (e) => {
        e.stopPropagation();
        if (state.maskMode === 'char' && unit.classList.contains('masked')) {
          unit.classList.toggle('revealed');
          return;
        }

        const sIdx = parseInt(unit.getAttribute('data-sidx'), 10);
        const lIdx = parseInt(unit.getAttribute('data-lidx'), 10);
        const cIdx = parseInt(unit.getAttribute('data-cidx'), 10);
        openEditCharModal(sIdx, lIdx, cIdx);
      });
    });

    applyVisibilityToggles();
  }

  // 字音校訂彈窗
  function openEditCharModal(sIdx, lIdx, cIdx) {
    const db = getScriptureDatabase();
    const data = db[state.currentKey];
    if (!data || !data.sections[sIdx] || !data.sections[sIdx].lines[lIdx]) return;
    const words = data.sections[sIdx].lines[lIdx].words;
    const charObj = words[cIdx];
    if (!charObj) return;

    const customKey = `${state.currentKey}_${sIdx}_${lIdx}_${cIdx}`;
    const customMap = SafeStorage.getJSON('gy_custom_chars', {});
    const custom = customMap[customKey];

    state.editingCharInfo = {
      key: customKey,
      sIdx, lIdx, cIdx,
      original: charObj
    };

    el.editCharOriginalPreview.textContent = charObj.char;
    el.editCharText.value = (custom && custom.t) ? custom.t : charObj.char;
    el.editCharZhuyin.value = (custom && custom.z) ? custom.z : charObj.zh;
    el.editCharPinyin.value = (custom && custom.p) ? custom.p : charObj.py;

    openModal(el.editCharModal);
  }

  function saveCharCustomization() {
    if (!state.editingCharInfo) return;
    const newT = el.editCharText.value.trim() || state.editingCharInfo.original.char;
    const newZ = el.editCharZhuyin.value.trim();
    const newP = el.editCharPinyin.value.trim() || PinyinEngine.zhuyinToPinyin(newZ);

    const customMap = SafeStorage.getJSON('gy_custom_chars', {});
    customMap[state.editingCharInfo.key] = { t: newT, z: newZ, p: newP };
    SafeStorage.setJSON('gy_custom_chars', customMap);

    closeModal(el.editCharModal);
    renderCurrentScripture();
    showToast(`已儲存「${newT}」的讀音校訂！`);
  }

  function resetCharCustomization() {
    if (!state.editingCharInfo) return;
    const customMap = SafeStorage.getJSON('gy_custom_chars', {});
    delete customMap[state.editingCharInfo.key];
    SafeStorage.setJSON('gy_custom_chars', customMap);

    closeModal(el.editCharModal);
    renderCurrentScripture();
    showToast('已還原為原典預設字音！');
  }

  // 刷新迴向小卡
  function refreshCardPreview() {
    const checked = document.querySelector('input[name="cardStyle"]:checked');
    const style = checked ? checked.value : 'warm_gold';

    DedicationCard.renderCard(el.dedicationCardCanvas, {
      theme: style,
      dedicator: el.dedicatorInput.value.trim() || '佛弟子',
      recipient: el.recipientInput.value.trim() || '父母師長與一切有情',
      blessing: el.blessingMsgInput.value.trim() || '心安平安，消災消難；身心康泰，六時吉祥。'
    });
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  function showToast(msg, duration = 2800) {
    if (!el.toastContainer) return;
    const item = document.createElement('div');
    item.className = 'toast-item';
    item.textContent = msg;
    el.toastContainer.appendChild(item);

    setTimeout(() => {
      item.style.opacity = '0';
      item.style.transition = 'opacity 0.25s ease';
      setTimeout(() => {
        if (item.parentNode) item.parentNode.removeChild(item);
      }, 250);
    }, duration);
  }

})();
