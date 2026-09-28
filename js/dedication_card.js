/**
 * 禪意「迴向小卡」模組 (v1.2 - 法鼓山雲端祈福風格)
 * 1. 印章依指示採用法鼓山核心印鑑：【心安平安】與【大悲心起】
 * 2. 溫潤光明、吉祥喜悅，絕無陰暗祭祀元素
 * 3. 支援純 Canvas 向量繪製高解析度圖片與一鍵格式化文字分享
 */

window.DedicationCard = (() => {

  // 法鼓山雲端祈福標準格式文字
  function formatShareText(data) {
    const dedicator = data.dedicator || '佛弟子';
    const recipient = data.recipient || '父母師長與一切有情';
    const blessing = data.blessing || '心安平安，消災消難；身心康泰，六時吉祥。';
    const practiceName = data.practiceName || '觀音法門定課';
    const dateStr = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });

    return `【法鼓山觀音法門定課・雲端祈福迴向】🙏\n` +
      `修持功德：${practiceName}\n` +
      `修持日期：${dateStr}\n\n` +
      `📿 祈福人（迴向者）：${dedicator}\n` +
      `🌸 受迴向者（祈福對象）：${recipient}\n` +
      `🌿 祈福祈願法語：${blessing}\n\n` +
      `願以此功德，普及於一切。我等與眾生，皆共成佛道。\n` +
      `提昇人的品質・建設人間淨土\n` +
      `南無大悲觀世音菩薩 🙏`;
  }

  // 繪製四字朱紅吉祥方印 (2x2 排列：右上起順讀或由上至下)
  // 依指示：「心安平安」與「大悲心起」
  function drawFourCharSeal(ctx, x, y, text, size = 52) {
    ctx.save();
    ctx.fillStyle = '#b33927';
    ctx.strokeStyle = '#8a2315';
    ctx.lineWidth = 1.5;

    const r = 6;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + size - r, y);
    ctx.quadraticCurveTo(x + size, y, x + size, y + r);
    ctx.lineTo(x + size, y + size - r);
    ctx.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
    ctx.lineTo(x + r, y + size);
    ctx.quadraticCurveTo(x, y + size, x, y + size - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fffdf7';
    ctx.font = `bold ${Math.floor(size * 0.36)}px "Noto Serif TC", "BiauKai", "DFKai-SB", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 2x2 佈局：
    // 字1 字3
    // 字2 字4
    // 例如「心安平安」：右上「心」、右下「安」、左上「平」、左下「安」（傳統印璽讀法）或 直式排列
    const chars = text.split('');
    const half = size / 2;
    const qx1 = x + half * 0.5;
    const qx2 = x + half * 1.5;
    const qy1 = y + half * 0.52;
    const qy2 = y + half * 1.52;

    if (chars.length === 4) {
      // 傳統右起豎讀：右上字0，右下字1，左上字2，左下字3
      ctx.fillText(chars[0], qx2, qy1);
      ctx.fillText(chars[1], qx2, qy2);
      ctx.fillText(chars[2], qx1, qy1);
      ctx.fillText(chars[3], qx1, qy2);
    } else {
      ctx.fillText(text, x + size / 2, y + size / 2);
    }

    ctx.restore();
  }

  // 繪製聖潔水墨金蓮花
  function drawSacredLotus(ctx, cx, cy, goldColor) {
    ctx.save();
    ctx.translate(cx, cy);

    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 主瓣
    ctx.beginPath();
    ctx.moveTo(0, -32);
    ctx.bezierCurveTo(-14, -18, -14, 8, 0, 16);
    ctx.bezierCurveTo(14, 8, 14, -18, 0, -32);
    ctx.stroke();

    ctx.fillStyle = 'rgba(230, 180, 100, 0.18)';
    ctx.fill();

    // 左右瓣
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.bezierCurveTo(-22, 10, -36, -8, -26, -22);
    ctx.bezierCurveTo(-18, -16, -10, -4, 0, 4);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.bezierCurveTo(22, 10, 36, -8, 26, -22);
    ctx.bezierCurveTo(18, -16, 10, -4, 0, 4);
    ctx.stroke();

    // 外展開瓣
    ctx.beginPath();
    ctx.moveTo(-6, 14);
    ctx.bezierCurveTo(-34, 18, -48, 2, -42, -10);
    ctx.bezierCurveTo(-32, -4, -18, 4, -4, 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(6, 14);
    ctx.bezierCurveTo(34, 18, 48, 2, 42, -10);
    ctx.bezierCurveTo(32, -4, 18, 4, 4, 10);
    ctx.stroke();

    // 托座
    ctx.beginPath();
    ctx.arc(0, 18, 16, 0.2, Math.PI - 0.2);
    ctx.stroke();

    ctx.restore();
  }

  function drawCornerAccent(ctx, x, y, angle, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(26, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 26);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(9, 9, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    const chars = text.split('');
    let line = '';
    let currentY = y;

    for (let i = 0; i < chars.length; i++) {
      const testLine = line + chars[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY);
        line = chars[i];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
  }

  // 繪製小卡
  function renderCard(canvas, options = {}) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = 900;
    const height = 1200;
    canvas.width = width;
    canvas.height = height;

    const theme = options.theme || 'warm_gold';
    const dedicator = options.dedicator || '佛弟子';
    const recipient = options.recipient || '父母師長與一切有情';
    const blessing = options.blessing || '心安平安，消災消難；身心康泰，六時吉祥。';

    // 1. 底色
    if (theme === 'fresh_bamboo') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#f3f8f4');
      grad.addColorStop(1, '#e5eee7');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (theme === 'pure_white') {
      ctx.fillStyle = '#fafafb';
      ctx.fillRect(0, 0, width, height);
    } else {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#fdfaf5');
      grad.addColorStop(1, '#f6eee0');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. 邊框
    const frameColor = theme === 'fresh_bamboo' ? 'rgba(61, 104, 84, 0.4)' : 'rgba(158, 116, 58, 0.4)';
    const frameSubColor = theme === 'fresh_bamboo' ? 'rgba(61, 104, 84, 0.18)' : 'rgba(158, 116, 58, 0.18)';
    const textMainColor = '#241f1a';
    const textGoldColor = theme === 'fresh_bamboo' ? '#3d6854' : '#9e743a';

    ctx.strokeStyle = frameColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 50, width - 100, height - 100);

    ctx.strokeStyle = frameSubColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(60, 60, width - 120, height - 120);

    drawCornerAccent(ctx, 75, 75, 0, frameColor);
    drawCornerAccent(ctx, width - 75, 75, Math.PI / 2, frameColor);
    drawCornerAccent(ctx, width - 75, height - 75, Math.PI, frameColor);
    drawCornerAccent(ctx, 75, height - 75, -Math.PI / 2, frameColor);

    const cx = width / 2;

    // 3. 頂部聖潔金蓮
    drawSacredLotus(ctx, cx, 175, textGoldColor);

    // 4. 頂部大題：觀音法門定課・雲端祈福
    ctx.textAlign = 'center';
    ctx.font = 'bold 36px "Noto Serif TC", "BiauKai", serif';
    ctx.fillStyle = textMainColor;
    ctx.fillText('觀音法門定課・雲端祈福', cx, 275);

    // 依指示：【心安平安】四字朱紅方印
    drawFourCharSeal(ctx, cx + 210, 240, '心安平安', 52);

    // 裝飾細線
    ctx.strokeStyle = frameSubColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 180, 315);
    ctx.lineTo(cx + 180, 315);
    ctx.stroke();

    // 5. 受迴向者 (祈福對象)
    let curY = 410;
    ctx.font = '600 22px "Noto Serif TC", serif';
    ctx.fillStyle = textGoldColor;
    ctx.fillText('❖  祈 福 迴 向 對 象  ❖', cx, curY);

    curY += 52;
    ctx.font = 'bold 36px "Noto Serif TC", "BiauKai", serif';
    ctx.fillStyle = textMainColor;
    ctx.fillText(recipient, cx, curY);

    // 6. 祈願祝福法語
    curY += 95;
    ctx.font = '600 22px "Noto Serif TC", serif';
    ctx.fillStyle = textGoldColor;
    ctx.fillText('❖  祈 福 祈 願 法 語  ❖', cx, curY);

    curY += 56;
    ctx.font = '500 30px "Noto Serif TC", "BiauKai", serif';
    ctx.fillStyle = '#2d251d';
    curY = drawWrappedText(ctx, blessing, cx, curY, width - 240, 52);

    // 7. 底部敬題與聖嚴師父正念法語
    curY = Math.max(curY + 60, height - 300);

    ctx.font = 'italic 20px "Noto Serif TC", serif';
    ctx.fillStyle = textGoldColor;
    ctx.fillText('「慈悲沒有敵人，智慧不起煩惱；心安平安，吉祥自在。」', cx, curY);

    curY += 55;
    ctx.font = '600 26px "Noto Serif TC", "BiauKai", serif';
    ctx.fillStyle = textMainColor;
    ctx.fillText(`祈福人：${dedicator}  合十敬上`, cx, curY);

    curY += 45;
    ctx.font = '400 17px "Noto Sans TC", sans-serif';
    ctx.fillStyle = '#847665';
    const today = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.fillText(`歲次吉日・${today}・法鼓山觀音法門定課圓滿`, cx, curY);

    // 依指示：底部中央【大悲心起】四字朱紅寶印
    drawFourCharSeal(ctx, cx - 28, height - 130, '大悲心起', 56);
  }

  function downloadCard(canvas, filename = '法鼓山觀音定課_雲端祈福小卡.png') {
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return true;
    } catch (e) {
      console.error('Download card failed:', e);
      return false;
    }
  }

  return {
    renderCard,
    formatShareText,
    downloadCard
  };

})();
