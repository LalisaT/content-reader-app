const http = require('http');
const fs = require('fs');

async function processIcon() {
  const targets = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9222/json/list', r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
  const t = targets.find(x => x.url.includes('3000')) || targets[0];
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r, { once: true }));

  function send(method, params = {}) {
    return new Promise(r => {
      const id = Math.floor(Math.random() * 1000000);
      const h = e => {
        const m = JSON.parse(e.data);
        if (m.id === id) { ws.removeEventListener('message', h); r(m.result); }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const rawBytes = fs.readFileSync('C:/Users/PC/.gemini/antigravity/brain/9c9e58d1-0dc7-4c88-a0e8-4946d42b389f/.user_uploaded/media_1791586060430_30ee5722.png');
  const base64Data = rawBytes.toString('base64');

  const evalResult = await send('Runtime.evaluate', {
    expression: `
      (async () => {
        const img = new Image();
        img.src = 'data:image/png;base64,${base64Data}';
        await new Promise(r => img.onload = r);

        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;

        // 1. First canvas: find the circle bounds
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // The circle is centered at (w/2, h/2). Radius is approximately w * 0.46
        const cx = w / 2;
        const cy = h / 2;
        // Find radius where color is blue
        let r = Math.min(cx, cy) * 0.94;

        // Create a premium black version canvas:
        // Inside circle:
        // - Blue background pixels become deep luxury black (#0b0f19 or gradient)
        // - Dark shadow pixels become sleek obsidian shadow
        // - White silhouette pixels become crisp brilliant white
        // - Outside the circle: 100% transparent
        const outCanvas = document.createElement('canvas');
        outCanvas.width = w;
        outCanvas.height = h;
        const outCtx = outCanvas.getContext('2d');
        const outData = outCtx.createImageData(w, h);

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            const dx = x - cx;
            const dy = y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > r) {
              // Outside the circle -> Transparent!
              outData.data[idx] = 0;
              outData.data[idx + 1] = 0;
              outData.data[idx + 2] = 0;
              outData.data[idx + 3] = 0;
            } else {
              const red = data[idx];
              const green = data[idx + 1];
              const blue = data[idx + 2];
              const alpha = data[idx + 3];

              // Anti-aliased circle edge
              let edgeAlpha = 1;
              if (dist > r - 1.5) {
                edgeAlpha = Math.max(0, (r - dist) / 1.5);
              }

              // Check if pixel is white silhouette (businessman, briefcase, stairs)
              const isWhite = red > 220 && green > 220 && blue > 220;
              // Check if pixel is dark tie/shadow
              const isDarkBlueOrShadow = blue > red && red < 50 && green < 80;

              if (isWhite) {
                // Crisp white
                outData.data[idx] = 255;
                outData.data[idx + 1] = 255;
                outData.data[idx + 2] = 255;
                outData.data[idx + 3] = Math.round(255 * edgeAlpha);
              } else if (isDarkBlueOrShadow) {
                // Dark tie / shadow -> subtle deep charcoal
                outData.data[idx] = 20;
                outData.data[idx + 1] = 25;
                outData.data[idx + 2] = 35;
                outData.data[idx + 3] = Math.round(255 * edgeAlpha);
              } else {
                // Blue background -> Convert to Premium Obsidian Black (#0b0f19)
                // With subtle luxury radial shading
                const normDist = dist / r;
                const shade = Math.round(15 + (1 - normDist) * 12); // subtle inner glow
                outData.data[idx] = shade;
                outData.data[idx + 1] = shade + 4;
                outData.data[idx + 2] = shade + 14; // deep midnight sapphire/black
                outData.data[idx + 3] = Math.round(255 * edgeAlpha);
              }
            }
          }
        }

        outCtx.putImageData(outData, 0, 0);

        // Also add a subtle luxury gold/slate rim stroke around circle edge
        outCtx.beginPath();
        outCtx.arc(cx, cy, r - 1, 0, Math.PI * 2);
        outCtx.strokeStyle = 'rgba(245, 158, 11, 0.4)'; // luxury gold rim
        outCtx.lineWidth = 3;
        outCtx.stroke();

        return {
          width: w,
          height: h,
          radius: r,
          dataUrl: outCanvas.toDataURL('image/png')
        };
      })()
    `,
    returnByValue: true,
    awaitPromise: true
  });

  console.log('Processed icon result:', evalResult.result.value.width, 'x', evalResult.result.value.height);
  const dataUrl = evalResult.result.value.dataUrl;
  const base64Out = dataUrl.replace(/^data:image\/png;base64,/, '');

  fs.writeFileSync('C:/Users/PC/.gemini/antigravity/scratch/content_reader_app/public/career-growth-icon-black.png', Buffer.from(base64Out, 'base64'));
  fs.writeFileSync('C:/Users/PC/.gemini/antigravity/brain/9c9e58d1-0dc7-4c88-a0e8-4946d42b389f/career_growth_icon_black_preview.png', Buffer.from(base64Out, 'base64'));
  console.log('Saved career-growth-icon-black.png successfully');

  ws.close();
}

processIcon().catch(console.error);
