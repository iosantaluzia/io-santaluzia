/**
 * Utilitário para converter a logo PNG em SVG
 * Este script analisa a imagem e extrai os círculos para criar um SVG equivalente
 */

export async function convertLogoToSvg(imagePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Não foi possível criar contexto do canvas'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const circles: Array<{
        x: number;
        y: number;
        radius: number;
        color: string;
      }> = [];

      // Detectar círculos na imagem
      // Esta é uma implementação simplificada - para precisão total,
      // seria necessário um algoritmo mais sofisticado de detecção de círculos
      const width = imageData.width;
      const height = imageData.height;
      const data = imageData.data;

      // Agrupar pixels por cor e posição para detectar círculos
      const colorGroups = new Map<string, Array<{ x: number; y: number }>>();

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];

          // Ignorar pixels transparentes ou muito escuros (fundo preto)
          if (a < 128 || (r < 50 && g < 50 && b < 50)) continue;

          // Agrupar por cor similar
          const colorKey = `${Math.round(r / 10) * 10},${Math.round(g / 10) * 10},${Math.round(b / 10) * 10}`;
          
          if (!colorGroups.has(colorKey)) {
            colorGroups.set(colorKey, []);
          }
          colorGroups.get(colorKey)!.push({ x, y });
        }
      }

      // Para cada grupo de cor, encontrar o centro e raio aproximado
      colorGroups.forEach((points, colorKey) => {
        if (points.length < 10) return; // Ignorar grupos muito pequenos

        const [r, g, b] = colorKey.split(',').map(Number);
        const color = `rgb(${r},${g},${b})`;

        // Calcular bounding box
        const xs = points.map(p => p.x);
        const ys = points.map(p => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const radius = Math.max((maxX - minX) / 2, (maxY - minY) / 2);

        circles.push({
          x: centerX,
          y: centerY,
          radius,
          color
        });
      });

      // Gerar SVG
      const svg = generateSvgFromCircles(circles, width, height);
      resolve(svg);
    };

    img.onerror = () => {
      reject(new Error('Erro ao carregar a imagem'));
    };

    img.src = imagePath;
  });
}

function generateSvgFromCircles(
  circles: Array<{ x: number; y: number; radius: number; color: string }>,
  width: number,
  height: number
): string {
  const svgCircles = circles
    .map(circle => {
      return `<circle cx="${circle.x}" cy="${circle.y}" r="${circle.radius}" fill="${circle.color}"/>`;
    })
    .join('\n    ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="black"/>
  ${svgCircles}
</svg>`;
}

