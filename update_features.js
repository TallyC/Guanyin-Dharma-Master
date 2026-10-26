const fs = require('fs');
let code = fs.readFileSync('觀音法門定課/build_app.js', 'utf8');

// 1. Add pumenpinScope to AppState
code = code.replace(
  "currentPracticeKey: 'pumenpin',",
  "currentPracticeKey: 'pumenpin',\n      pumenpinScope: 'all', // 'all' (全品) | 'jisong' (偈頌專修)"
);

// 2. Add scope area in practiceConfigModal
const scopeAreaHtml = `
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
`;

code = code.replace(
  '<div class="mb-6">\n        <label class="block text-xs font-semibold text-amber-500 mb-2">經文／咒語修持遍數：</label>',
  scopeAreaHtml + '      <div class="mb-6">\n        <label class="block text-xs font-semibold text-amber-500 mb-2">經文／咒語修持遍數：</label>'
);

// 3. In openPracticeConfig, show/hide pumenpinScopeWrapper
code = code.replace(
  "title.textContent = '設定 ' + (practiceNames[practiceKey] || '定課') + ' 遍數';",
  `title.textContent = '設定 ' + (practiceNames[practiceKey] || '定課') + ' 遍數';
      const scopeWrapper = document.getElementById('pumenpinScopeWrapper');
      if (scopeWrapper) {
        if (practiceKey === 'pumenpin') {
          scopeWrapper.classList.remove('hidden');
          setPumenpinScope(AppState.pumenpinScope || 'all');
        } else {
          scopeWrapper.classList.add('hidden');
        }
      }`
);

// 4. Add setPumenpinScope function
const newFunctions = `
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
`;

code = code.replace(
  'function setTempBuddhaCount(val) {',
  newFunctions + '\n    function setTempBuddhaCount(val) {'
);

// 5. In renderPracticeContent(), filter out pumenpin_changhang if jisong
code = code.replace(
  'const item = window.PRACTICES_DB[AppState.currentPracticeKey];\n        sections = item ? item.sections : [];',
  `const item = window.PRACTICES_DB[AppState.currentPracticeKey];
        sections = item ? [...item.sections] : [];
        if (AppState.currentPracticeKey === 'pumenpin' && AppState.pumenpinScope === 'jisong') {
          // 過濾掉長行，直接從開經偈接至偈頌
          sections = sections.filter(s => s.id !== 'pumenpin_changhang');
        }`
);

// 6. In practice view header, add scope toggle button
code = code.replace(
  '<h2 id="practiceTitleDisplay" class="text-base sm:text-lg font-bold text-primary">\n            《普門品》定課\n          </h2>',
  `<h2 id="practiceTitleDisplay" class="text-base sm:text-lg font-bold text-primary">
            《普門品》定課
          </h2>
          <button id="scopeToggleChipBtn" onclick="togglePracticeScopeInView()" class="hidden px-2.5 py-1 rounded-full border border-sky-500/40 bg-sky-500/15 text-sky-300 text-xs font-semibold hover:bg-sky-500/30 transition-all flex items-center gap-1">
            <span>⇄</span>
            <span>切換範圍</span>
          </button>`
);

// 7. In enterPracticeView(), show scopeToggleChipBtn if pumenpin
code = code.replace(
  "document.getElementById('practiceTitleDisplay').textContent = practiceNames[AppState.currentPracticeKey] || '定課持誦';",
  `document.getElementById('practiceTitleDisplay').textContent = practiceNames[AppState.currentPracticeKey] || '定課持誦';
      const scopeChip = document.getElementById('scopeToggleChipBtn');
      if (scopeChip) {
        if (AppState.currentPracticeKey === 'pumenpin') {
          scopeChip.classList.remove('hidden');
          scopeChip.innerHTML = AppState.pumenpinScope === 'all' 
            ? '<span>⇄</span><span>範圍：全品 (長行+偈頌)</span>' 
            : '<span>⇄</span><span class=\"text-emerald-300 font-bold\">範圍：偈頌專修 (32偈)</span>';
        } else {
          scopeChip.classList.add('hidden');
        }
      }`
);

fs.writeFileSync('觀音法門定課/build_app.js', code, 'utf8');
console.log('Successfully updated build_app.js');
