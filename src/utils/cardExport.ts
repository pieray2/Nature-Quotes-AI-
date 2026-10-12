import { NatureQuote, CardCustomization } from '../types';

export async function exportQuoteCardToImage(quote: NatureQuote, config: CardCustomization): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not initialize canvas context');

  let width = 1200;
  let height = 1200;

  if (config.aspectRatio === '4:5') {
    width = 1080;
    height = 1350;
  } else if (config.aspectRatio === '16:9') {
    width = 1920;
    height = 1080;
  }

  canvas.width = width;
  canvas.height = height;

  // Background painting
  if (quote.bgImage) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Image load failed'));
        img.src = quote.bgImage!;
      });
      // Draw cover
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShiftX = (canvas.width - img.width * ratio) / 2;
      const centerShiftY = (canvas.height - img.height * ratio) / 2;
      ctx.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);

      // Dark moody gradient overlay
      const overlay = ctx.createLinearGradient(0, 0, 0, height);
      overlay.addColorStop(0, 'rgba(10, 16, 13, 0.55)');
      overlay.addColorStop(0.5, 'rgba(8, 14, 11, 0.72)');
      overlay.addColorStop(1, 'rgba(6, 10, 8, 0.88)');
      ctx.fillStyle = overlay;
      ctx.fillRect(0, 0, width, height);
    } catch {
      // Fallback gradient if image fails crossOrigin or network
      drawFallbackGradient(ctx, width, height, config.theme);
    }
  } else {
    drawFallbackGradient(ctx, width, height, config.theme);
  }

  // Draw elegant border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  const margin = 50;
  ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

  // Inner accent line
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)'; // emerald tint
  ctx.lineWidth = 1;
  ctx.strokeRect(margin + 12, margin + 12, width - (margin + 12) * 2, height - (margin + 12) * 2);

  // Typography Settings
  const isLightText = config.textColor === 'light';
  ctx.fillStyle = isLightText ? '#FFFFFF' : '#0F172A';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  let fontName = 'Georgia, serif';
  if (config.font === 'display') fontName = '"Playfair Display", Georgia, serif';
  if (config.font === 'cinzel') fontName = '"Cinzel", serif';
  if (config.font === 'sans') fontName = '"Inter", system-ui, sans-serif';
  if (config.font === 'mono') fontName = '"JetBrains Mono", monospace';

  let quoteFontSize = width > 1200 ? 54 : 44;
  if (config.fontSize === 'sm') quoteFontSize *= 0.8;
  if (config.fontSize === 'lg') quoteFontSize *= 1.15;
  if (config.fontSize === 'xl') quoteFontSize *= 1.3;

  ctx.font = `italic 400 ${quoteFontSize}px ${fontName}`;

  // Word wrap calculation
  const maxWidth = width - margin * 4 - 80;
  const words = quote.quote.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine + ' ' + word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);

  const lineHeight = quoteFontSize * 1.45;
  const totalTextHeight = lines.length * lineHeight;
  let startY = (height / 2) - (totalTextHeight / 2) - 30;

  // Draw Quote Mark icon
  ctx.font = `italic 700 ${quoteFontSize * 1.6}px ${fontName}`;
  ctx.fillStyle = 'rgba(52, 211, 153, 0.45)';
  ctx.fillText('“', width / 2, startY - 45);

  // Draw Quote text
  ctx.fillStyle = isLightText ? '#F8FAFC' : '#1E293B';
  ctx.font = `italic 400 ${quoteFontSize}px ${fontName}`;
  lines.forEach((line, index) => {
    ctx.fillText(line, width / 2, startY + index * lineHeight);
  });

  // Draw Author
  if (config.showAuthor) {
    const authorY = startY + lines.length * lineHeight + 40;
    // Decorative divider line
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.5)';
    ctx.beginPath();
    ctx.moveTo(width / 2 - 60, authorY - 15);
    ctx.lineTo(width / 2 + 60, authorY - 15);
    ctx.stroke();

    ctx.font = `600 ${Math.round(quoteFontSize * 0.48)}px ${fontName}`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(`— ${quote.author.toUpperCase()} —`, width / 2, authorY + 15);

    if (quote.source) {
      ctx.font = `italic 300 ${Math.round(quoteFontSize * 0.38)}px ${fontName}`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText(quote.source, width / 2, authorY + 45);
    }
  }

  // Draw Watermark / Branding
  if (config.showWatermark) {
    ctx.font = `500 16px "Inter", sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText('NATURE QUOTES AI ✦ SANCTUARY OF WISDOM', width / 2, height - margin - 22);
  }

  return canvas.toDataURL('image/png');
}

function drawFallbackGradient(ctx: CanvasRenderingContext2D, width: number, height: number, theme: string) {
  const grad = ctx.createLinearGradient(0, 0, width, height);
  if (theme === 'forest-fog') {
    grad.addColorStop(0, '#062017');
    grad.addColorStop(0.5, '#0a3022');
    grad.addColorStop(1, '#02100b');
  } else if (theme === 'ocean-deep') {
    grad.addColorStop(0, '#031b28');
    grad.addColorStop(0.5, '#07324c');
    grad.addColorStop(1, '#020f18');
  } else if (theme === 'mountain-sunrise') {
    grad.addColorStop(0, '#2d152b');
    grad.addColorStop(0.5, '#4a1525');
    grad.addColorStop(1, '#1b0e26');
  } else if (theme === 'starlight') {
    grad.addColorStop(0, '#090a1a');
    grad.addColorStop(0.5, '#131438');
    grad.addColorStop(1, '#04050d');
  } else {
    grad.addColorStop(0, '#101a14');
    grad.addColorStop(0.5, '#192820');
    grad.addColorStop(1, '#0a120e');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}
