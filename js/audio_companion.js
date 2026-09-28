/**
 * Web Audio API 柔和木魚、引磬合成音效與計數器
 * 嚴格遵循全域規則：加 try-catch 防護，在無音效卡或限制時核心操作流程不受阻礙。
 */

window.ZenAudio = (() => {
  let audioCtx = null;

  function getContext() {
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          audioCtx = new AudioContext();
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    } catch (e) {
      console.warn('[ZenAudio] Web Audio initialization caught:', e);
      return null;
    }
  }

  return {
    // 敲木魚 (篤！)
    playMuyu() {
      try {
        const ctx = getContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // 溫和實木敲擊頻率
        osc.type = 'sine';
        osc.frequency.setValueAtTime(460, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.09);

        gain.gain.setValueAtTime(0.7, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.13);
      } catch (e) {
        console.warn('[ZenAudio] playMuyu caught:', e);
      }
    },

    // 敲引磬 (叮～～ 清澈悠遠)
    playQing() {
      try {
        const ctx = getContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        // 磬聲泛音
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1760, ctx.currentTime); // A6
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(3520, ctx.currentTime);

        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.6);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc2.start();
        osc.stop(ctx.currentTime + 2.7);
        osc2.stop(ctx.currentTime + 2.7);
      } catch (e) {
        console.warn('[ZenAudio] playQing caught:', e);
      }
    }
  };
})();
