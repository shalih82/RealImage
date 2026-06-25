import { useEffect, useRef } from 'react';

// Characters: wedding-themed letters, numbers, and decorative Unicode
const CHAR_SETS = [
  'LOVEWEDDINGPHOTOFILMCANDIDCINEMATIC',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  '0123456789',
  '♥♦★✦◆●○◇◈△▽',
  'REALIMAGE',
];
const ALL_CHARS = CHAR_SETS.join('');

interface MatrixTextRainProps {
  /** Overall opacity of the canvas (0–1). Default 0.12 */
  opacity?: number;
  /** Base speed multiplier. Default 1 */
  speed?: number;
  /** Primary color for the characters. Default '#5BA4B5' (teal accent) */
  color?: string;
  /** Fixed position fullscreen or relative to parent */
  fixed?: boolean;
  /** z-index of the canvas */
  zIndex?: number;
}

interface Column {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  fontSize: number;
  opacity: number;
  length: number;
}

export default function MatrixTextRain({
  opacity = 0.12,
  speed = 1,
  color = '#5BA4B5',
  fixed = true,
  zIndex = 0,
}: MatrixTextRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const columnsRef = useRef<Column[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const randomChar = () => ALL_CHARS[Math.floor(Math.random() * ALL_CHARS.length)];

    const initColumns = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cols: Column[] = [];
      const colWidth = 28; // spacing between columns
      const numCols = Math.ceil(w / colWidth);

      for (let i = 0; i < numCols; i++) {
        const fontSize = 12 + Math.random() * 6;
        const trailLength = 8 + Math.floor(Math.random() * 15);
        const chars: string[] = [];
        for (let j = 0; j < trailLength; j++) {
          chars.push(randomChar());
        }

        cols.push({
          x: i * colWidth + Math.random() * 10,
          y: -Math.random() * h * 1.5, // stagger start positions
          speed: (0.3 + Math.random() * 0.7) * speed,
          chars,
          fontSize,
          opacity: 0.15 + Math.random() * 0.4,
          length: trailLength,
        });
      }
      columnsRef.current = cols;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      initColumns();
    };

    resize();
    window.addEventListener('resize', resize);

    // Parse the hex color to rgb
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
        : { r: 91, g: 164, b: 181 };
    };

    const rgb = hexToRgb(color);
    const w = () => canvas.width / Math.min(window.devicePixelRatio, 2);
    const h = () => canvas.height / Math.min(window.devicePixelRatio, 2);

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);

      const width = w();
      const height = h();
      ctx.clearRect(0, 0, width, height);

      const columns = columnsRef.current;

      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        col.y += col.speed * 1.2;

        // Reset column when it goes below screen
        if (col.y - col.length * col.fontSize > height) {
          col.y = -col.length * col.fontSize - Math.random() * 200;
          col.speed = (0.3 + Math.random() * 0.7) * speed;
          // Randomize some chars
          for (let j = 0; j < col.chars.length; j++) {
            if (Math.random() > 0.5) {
              col.chars[j] = randomChar();
            }
          }
        }

        // Draw each character in the trail
        for (let j = 0; j < col.length; j++) {
          const charY = col.y - j * col.fontSize;

          // Skip if off screen
          if (charY < -col.fontSize || charY > height + col.fontSize) continue;

          // Fade: head is brightest, tail fades out
          const trailFade = 1 - j / col.length;
          // Edge fade (top and bottom of screen)
          const edgeFadeTop = Math.min(charY / 80, 1);
          const edgeFadeBottom = Math.min((height - charY) / 80, 1);
          const edgeFade = Math.max(0, Math.min(edgeFadeTop, edgeFadeBottom));

          const charOpacity = col.opacity * trailFade * edgeFade;

          if (charOpacity < 0.01) continue;

          // Head character is brighter and white-ish
          if (j === 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${charOpacity * 0.8})`;
          } else if (j === 1) {
            ctx.fillStyle = `rgba(${rgb.r + 60}, ${rgb.g + 40}, ${rgb.b + 20}, ${charOpacity * 0.6})`;
          } else {
            ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${charOpacity * 0.4})`;
          }

          ctx.font = `${col.fontSize}px "Courier New", monospace`;
          ctx.fillText(col.chars[j], col.x, charY);

          // Occasionally mutate a character
          if (Math.random() < 0.002) {
            col.chars[j] = randomChar();
          }
        }
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [color, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: fixed ? 'fixed' : 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex,
        pointerEvents: 'none',
        opacity,
      }}
    />
  );
}
