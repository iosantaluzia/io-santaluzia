/**
 * Script para corrigir círculos que extrapolam os limites do SVG
 */

interface Circle {
  cx: number;
  cy: number;
  r: number;
  fill: string;
}

export function fixLogoSvg(svgContent: string): string {
  const viewBoxWidth = 1080;
  const viewBoxHeight = 934;
  
  // Extrair círculos do SVG
  const circleRegex = /<circle\s+cx="([^"]+)"\s+cy="([^"]+)"\s+r="([^"]+)"\s+fill="([^"]+)"/g;
  const circles: Circle[] = [];
  let match;
  
  while ((match = circleRegex.exec(svgContent)) !== null) {
    circles.push({
      cx: parseFloat(match[1]),
      cy: parseFloat(match[2]),
      r: parseFloat(match[3]),
      fill: match[4]
    });
  }
  
  // Corrigir círculos que extrapolam
  const fixedCircles = circles.map(circle => {
    let { cx, cy, r } = circle;
    
    // Verificar e corrigir limites horizontais
    if (cx - r < 0) {
      // Círculo sai pela esquerda - reduzir raio ou mover
      r = Math.min(r, cx);
    }
    if (cx + r > viewBoxWidth) {
      // Círculo sai pela direita - reduzir raio
      r = Math.min(r, viewBoxWidth - cx);
    }
    
    // Verificar e corrigir limites verticais
    if (cy - r < 0) {
      // Círculo sai por cima - reduzir raio
      r = Math.min(r, cy);
    }
    if (cy + r > viewBoxHeight) {
      // Círculo sai por baixo - reduzir raio
      r = Math.min(r, viewBoxHeight - cy);
    }
    
    // Garantir que o raio não seja negativo ou muito pequeno
    r = Math.max(0.1, r);
    
    return { ...circle, r };
  });
  
  // Gerar novo SVG
  const circlesSVG = fixedCircles
    .map(c => `<circle cx="${c.cx.toFixed(2)}" cy="${c.cy.toFixed(2)}" r="${c.r.toFixed(2)}" fill="${c.fill}"/>`)
    .join('\n  ');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${viewBoxWidth}" height="${viewBoxHeight}" viewBox="0 0 ${viewBoxWidth} ${viewBoxHeight}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${viewBoxWidth}" height="${viewBoxHeight}" fill="black"/>
  ${circlesSVG}
</svg>`;
}

