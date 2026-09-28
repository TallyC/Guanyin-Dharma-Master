/**
 * 定課修持日曆系統 (v1.2)
 * 1. 記錄今日定課圓滿合掌「🙏」印記
 * 2. 支援從任何月份一鍵【回到今日定課】
 * 3. 嚴格防護：不可選過去或未來的日子進行補打卡，安住當下
 * 4. SafeStorage 離線快取保存
 */

window.CalendarCompanion = (() => {
  const STORAGE_KEY = 'guanyin_practice_logs_v1';
  let curDisplayYear = new Date().getFullYear();
  let curDisplayMonth = new Date().getMonth(); // 0-11

  function getLogs() {
    return SafeStorage.getJSON(STORAGE_KEY, {});
  }

  function saveLogs(logs) {
    SafeStorage.setJSON(STORAGE_KEY, logs);
  }

  function formatDateKey(year, month, day) {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  }

  // 記錄完成定課
  function recordSession(modeName = '觀音法門定課', count = 1) {
    const now = new Date();
    const key = formatDateKey(now.getFullYear(), now.getMonth(), now.getDate());
    const logs = getLogs();

    if (!logs[key]) {
      logs[key] = {
        date: key,
        timestamp: Date.now(),
        practices: {}
      };
    }

    if (!logs[key].practices[modeName]) {
      logs[key].practices[modeName] = 0;
    }
    logs[key].practices[modeName] += count;

    saveLogs(logs);
    return logs[key];
  }

  // 今日是否已打卡
  function isTodayPracticed() {
    const now = new Date();
    const key = formatDateKey(now.getFullYear(), now.getMonth(), now.getDate());
    const logs = getLogs();
    return !!logs[key];
  }

  function getMonthStats(year, month) {
    const logs = getLogs();
    let totalDays = 0;
    let totalCount = 0;
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;

    for (const [k, v] of Object.entries(logs)) {
      if (k.startsWith(prefix)) {
        totalDays++;
        for (const cnt of Object.values(v.practices || {})) {
          totalCount += cnt;
        }
      }
    }
    return { totalDays, totalCount };
  }

  // 回到今天月份
  function resetToToday() {
    const today = new Date();
    curDisplayYear = today.getFullYear();
    curDisplayMonth = today.getMonth();
  }

  // 渲染月曆 DOM
  function renderCalendar(containerEl, onCheckInToday) {
    if (!containerEl) return;
    const logs = getLogs();

    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();
    const todayKey = formatDateKey(todayYear, todayMonth, todayDate);

    const firstDay = new Date(curDisplayYear, curDisplayMonth, 1).getDay();
    const daysInMonth = new Date(curDisplayYear, curDisplayMonth + 1, 0).getDate();

    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

    let html = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; padding-bottom:0.6rem; border-bottom:1px solid var(--border-main);">
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <button class="btn-header" id="calPrevMonth" style="padding:0.25rem 0.6rem;" title="上個月">‹ 上月</button>
          <span style="font-size:1.15rem; font-weight:700; color:var(--accent-gold); min-width:130px; text-align:center;">
            ${curDisplayYear} 年 ${monthNames[curDisplayMonth]}
          </span>
          <button class="btn-header" id="calNextMonth" style="padding:0.25rem 0.6rem;" title="下個月">下月 ›</button>
        </div>
        <button class="btn-header ${isTodayPracticed() ? '' : 'btn-primary'}" id="calReturnTodayBtn" title="回到今日定課">
          <span>⟲ 回到今日定課</span>
        </button>
      </div>

      <div style="display:grid; grid-template-columns:repeat(7, 1fr); text-align:center; font-size:0.82rem; color:var(--text-muted); margin-bottom:0.5rem;">
        <span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>
      </div>

      <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:0.4rem;">
    `;

    // 補足前置空白格
    for (let i = 0; i < firstDay; i++) {
      html += '<div style="aspect-ratio:1; opacity:0.2;"></div>';
    }

    // 填入當月每一天
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(curDisplayYear, curDisplayMonth, day);
      const isToday = (curDisplayYear === todayYear && curDisplayMonth === todayMonth && day === todayDate);
      const isPast = (curDisplayYear < todayYear) || (curDisplayYear === todayYear && curDisplayMonth < todayMonth) || (curDisplayYear === todayYear && curDisplayMonth === todayMonth && day < todayDate);
      const isFuture = (curDisplayYear > todayYear) || (curDisplayYear === todayYear && curDisplayMonth > todayMonth) || (curDisplayYear === todayYear && curDisplayMonth === todayMonth && day > todayDate);

      const record = logs[dateKey];
      const hasPracticed = !!record;

      let cellStyle = 'aspect-ratio:1; border-radius:8px; padding:0.35rem; display:flex; flex-direction:column; justify-content:space-between; transition:all 0.15s ease; border:1px solid var(--border-main);';

      if (isToday) {
        cellStyle += ' background:var(--accent-gold-light); border-color:var(--accent-gold); box-shadow:0 0 0 2px var(--accent-gold-border); cursor:pointer;';
      } else if (isPast) {
        cellStyle += ' background:var(--bg-card-subtle); cursor:default;';
      } else {
        cellStyle += ' background:var(--bg-card); opacity:0.6; cursor:not-allowed;';
      }

      let badgeHtml = '';
      if (hasPracticed) {
        badgeHtml = '<span style="font-size:1.2rem; text-align:center; line-height:1;" title="定課圓滿合掌">🙏</span>';
      } else if (isToday) {
        badgeHtml = '<span style="font-size:0.72rem; color:var(--accent-gold); text-align:center; font-weight:600;">今日未打卡</span>';
      }

      html += `
        <div class="cal-day-box ${isToday ? 'is-today' : ''} ${isPast ? 'is-past' : ''}" style="${cellStyle}" data-day="${day}" data-datekey="${dateKey}" data-istoday="${isToday}" data-ispast="${isPast}">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.82rem; font-family:var(--font-sans); font-weight:${isToday ? '700' : '400'}; color:${isToday ? 'var(--accent-gold)' : 'var(--text-muted)'};">${day}</span>
            ${isToday ? '<span style="font-size:0.68rem; background:var(--accent-gold); color:#fff; border-radius:4px; padding:0 3px;">今</span>' : ''}
          </div>
          ${badgeHtml}
        </div>
      `;
    }

    html += '</div>';

    // 底部本月統計與說明
    const stats = getMonthStats(curDisplayYear, curDisplayMonth);
    html += `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.2rem; padding-top:0.8rem; border-top:1px solid var(--border-main); font-size:0.85rem; color:var(--text-sub);">
        <div>
          <span>本月精進：<strong style="color:var(--accent-gold);">${stats.totalDays}</strong> 天</span>
          <span style="margin-left:1rem;">累計圓滿：<strong style="color:var(--accent-gold);">${stats.totalCount}</strong> 次</span>
        </div>
        <div style="font-size:0.78rem; color:var(--text-muted);">
          * 僅可記錄今日定課，不可補打過去日期
        </div>
      </div>
    `;

    containerEl.innerHTML = html;

    // 綁定切換月份
    containerEl.querySelector('#calPrevMonth').addEventListener('click', (e) => {
      e.stopPropagation();
      curDisplayMonth--;
      if (curDisplayMonth < 0) {
        curDisplayMonth = 11;
        curDisplayYear--;
      }
      renderCalendar(containerEl, onCheckInToday);
    });

    containerEl.querySelector('#calNextMonth').addEventListener('click', (e) => {
      e.stopPropagation();
      curDisplayMonth++;
      if (curDisplayMonth > 11) {
        curDisplayMonth = 0;
        curDisplayYear++;
      }
      renderCalendar(containerEl, onCheckInToday);
    });

    // 綁定「回到今日定課」按鈕
    containerEl.querySelector('#calReturnTodayBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      resetToToday();
      renderCalendar(containerEl, onCheckInToday);
      if (onCheckInToday) onCheckInToday();
    });

    // 點擊日期方塊：依指示，不可選過去的日子！只能點擊「今日」進行打卡
    containerEl.querySelectorAll('.cal-day-box').forEach(box => {
      box.addEventListener('click', () => {
        const isToday = box.getAttribute('data-istoday') === 'true';
        const isPast = box.getAttribute('data-ispast') === 'true';

        if (isToday) {
          recordSession('觀音法門定課', 1);
          renderCalendar(containerEl, onCheckInToday);
          if (onCheckInToday) onCheckInToday();
        } else if (isPast) {
          // 點擊過去的日子，明確提示不可選過去的日子
          if (window.showAppToast) {
            window.showAppToast('提醒：定課貴在當下恆持，不可補打過去日期的卡。');
          }
        }
      });
    });
  }

  return {
    recordSession,
    isTodayPracticed,
    renderCalendar,
    resetToToday
  };

})();
