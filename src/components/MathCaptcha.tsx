// src/components/MathCaptcha.tsx
import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { t } from '../i18n';

const CANVAS_W = 140;
const CANVAS_H = 48;

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateCaptcha = () => {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const ops = ['+', '-', '*'] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let answer: number;
  if (op === '+') answer = a + b;
  else if (op === '-') { 
    answer = Math.abs(a - b);
    return { question: `${Math.max(a,b)} - ${Math.min(a,b)} = ?`, answer };
  }
  else answer = a * b;
  return { question: `${a} ${op} ${b} = ?`, answer };
};
const drawCaptcha = (canvas: HTMLCanvasElement | null, question: string) => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  ctx.fillStyle = '#f0f4ff';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  for (let i = 0; i < 80; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * CANVAS_W, Math.random() * CANVAS_H, Math.random() * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rand(80, 180)},${rand(80, 180)},${rand(80, 180)},0.5)`;
    ctx.fill();
  }

  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * CANVAS_W, Math.random() * CANVAS_H);
    ctx.lineTo(Math.random() * CANVAS_W, Math.random() * CANVAS_H);
    ctx.strokeStyle = `rgba(${rand(60, 160)},${rand(60, 160)},0,0.5)`;
    ctx.lineWidth = Math.random() * 1.5 + 0.5;
    ctx.stroke();
  }

  const chars = question.split('');
  const startX = 10;
  const charW = (CANVAS_W - 20) / chars.length;
  chars.forEach((ch, i) => {
    ctx.save();
    const x = startX + i * charW + charW / 2;
    const y = CANVAS_H / 2 + rand(-4, 4);
    ctx.translate(x, y);
    ctx.rotate((Math.random() - 0.5) * 0.5);
    ctx.font = `bold ${rand(20, 26)}px monospace`;
    ctx.fillStyle = `rgb(${rand(10, 80)},${rand(10, 80)},${rand(100, 180)})`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });

  ctx.beginPath();
  ctx.moveTo(0, CANVAS_H / 2 + rand(-6, 6));
  for (let x = 0; x < CANVAS_W; x += 10) {
    ctx.lineTo(x, CANVAS_H / 2 + Math.sin(x / 8) * rand(4, 8));
  }
  ctx.strokeStyle = `rgba(${rand(80, 150)},${rand(80, 150)},0,0.4)`;
  ctx.lineWidth = 1.2;
  ctx.stroke();
};

// از بیرون می‌شه reset() صدا زد
export interface MathCaptchaRef {
  reset: () => void;
  validate: () => boolean; // true = درسته، false = اشتباه
}

interface MathCaptchaProps {
  error?: string;
  onValidChange?: (valid: boolean) => void;
}

const MathCaptcha = forwardRef<MathCaptchaRef, MathCaptchaProps>(({ error }, ref) => {
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [input, setInput] = useState('');
  const [localError, setLocalError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawCaptcha(canvasRef.current, captcha.question);
  }, [captcha]);

  const reset = useCallback(() => {
    setCaptcha(generateCaptcha());
    setInput('');
    setLocalError('');
  }, []);

  const validate = useCallback((): boolean => {
    if (!input.trim()) {
      setLocalError(t("auth.captcha.required"));
      return false;
    }
    if (parseInt(input, 10) !== captcha.answer) {
      setLocalError(t("auth.captcha.wrong"));
      reset();
      return false;
    }
    setLocalError('');
    return true;
  }, [input, captcha.answer, reset]);

  useImperativeHandle(ref, () => ({ reset, validate }));

  const displayError = localError || error;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{t("auth.captcha.label")}</label>
      <div className="flex items-center gap-3" style={{ direction: 'ltr' }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          onClick={reset}
          title={t("auth.captcha.clickToChange")}
          className="rounded-xl border border-gray-200 cursor-pointer"
        />
        <input
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={input}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9-]/g, '').slice(0, 4);
            setInput(val);
            if (localError) setLocalError('');
          }}
          placeholder={t("auth.captcha.answer")}
          className={`w-20 px-3 py-3 rounded-xl border text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            displayError ? 'border-red-400 bg-red-50' : 'border-gray-200'
          }`}
        />
        <button
          type="button"
          onClick={reset}
          title={t("auth.captcha.newQuestion")}
          className="text-gray-400 hover:text-blue-500 transition-colors text-2xl"
        >
          ↻
        </button>
      </div>
      {displayError && <p className="mt-1 text-xs text-red-600">{displayError}</p>}
    </div>
  );
});

MathCaptcha.displayName = 'MathCaptcha';
export default MathCaptcha;