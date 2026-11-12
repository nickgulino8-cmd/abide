// The Abide companion — an original, procedurally animated serpent coiled upon a vine.
// Rendered on <canvas> so it can breathe, sway, blink and respond in real time.
//
// Design rules (from the product brief):
//  • It evolves through 7 stages with consistent faithfulness and NEVER regresses.
//  • It never suffers, looks injured or sad. On a hard day it rests peacefully beside a
//    small dawn-light: a gentle sign that the journey continues.
import { useEffect, useRef } from 'react';
import type { Flourish } from '@/lib/progress';

export type CompanionMood = 'calm' | 'joyful' | 'resting';

interface Props {
  stage: number; // 1..7
  mood?: CompanionMood;
  flourishes?: Flourish[];
  animated?: boolean;
  height?: number;
  className?: string;
  onTap?: () => void;
  ariaLabel?: string;
}

type RGB = [number, number, number];
const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const css = (c: RGB, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

interface Palette {
  base: RGB;
  light: RGB;
  dark: RGB;
  iris: RGB;
  glow: number; // aura strength 0..1
  scales: number; // scale texture strength
  markings: number; // gold markings strength
  sheen: number; // gold shimmer along body
  size: number; // overall scale
  leaves: number;
}

const GOLD: RGB = hex('#d9b15e');
const GOLD_DEEP: RGB = hex('#b8892f');

const PALETTES: Palette[] = [
  { base: hex('#8b918a'), light: hex('#b9bcb2'), dark: hex('#5c615b'), iris: hex('#8e8466'), glow: 0, scales: 0, markings: 0, sheen: 0, size: 0.84, leaves: 1 },
  { base: hex('#7f9c86'), light: hex('#b8ccb4'), dark: hex('#516b58'), iris: hex('#b99b55'), glow: 0.08, scales: 0.08, markings: 0, sheen: 0, size: 0.87, leaves: 2 },
  { base: hex('#5f9070'), light: hex('#a2c9a7'), dark: hex('#3b6448'), iris: hex('#c9a456'), glow: 0.16, scales: 0.2, markings: 0, sheen: 0, size: 0.9, leaves: 3 },
  { base: hex('#3f8059'), light: hex('#86c099'), dark: hex('#225339'), iris: hex('#d4ab55'), glow: 0.26, scales: 0.28, markings: 0.15, sheen: 0, size: 0.94, leaves: 5 },
  { base: hex('#2f7856'), light: hex('#7fc196'), dark: hex('#1a4a33'), iris: hex('#e0b75c'), glow: 0.36, scales: 0.32, markings: 0.75, sheen: 0.08, size: 0.97, leaves: 6 },
  { base: hex('#2b7c5c'), light: hex('#95d6ad'), dark: hex('#164a33'), iris: hex('#ecc46a'), glow: 0.5, scales: 0.36, markings: 0.95, sheen: 0.16, size: 1.0, leaves: 8 },
  { base: hex('#2a7354'), light: hex('#ade5c0'), dark: hex('#123d2b'), iris: hex('#f3d27e'), glow: 0.66, scales: 0.4, markings: 1, sheen: 0.5, size: 1.03, leaves: 10 },
];

const W = 290;
const H = 252;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
}

export default function Companion({
  stage,
  mood = 'calm',
  flourishes = [],
  animated = true,
  height = 260,
  className,
  onTap,
  ariaLabel,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    pointer: { x: 0, y: 0, active: false },
    reactAt: -10,
    blinkAt: 2.5,
    particles: [] as Particle[],
    visible: true,
    t0: performance.now(),
  });
  const props = useRef({ stage, mood, flourishes });
  props.current = { stage, mood, flourishes };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const live = animated && !reduced;
    let raf = 0;
    let scale = 1;
    let ox = 0;
    let oy = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      scale = Math.min(cw / W, ch / H) * dpr;
      ox = (canvas.width - W * scale) / 2;
      oy = (canvas.height - H * scale) / 2;
      if (!live) draw(0);
    };

    const draw = (t: number) => {
      const { stage: st, mood: md, flourishes: fl } = props.current;
      const P = PALETTES[Math.max(0, Math.min(6, st - 1))];
      const dark = document.documentElement.classList.contains('dark');
      const S = state.current;
      const resting = md === 'resting';
      const react = Math.max(0, 1 - (t - S.reactAt) / 1.3);
      const reacting = react > 0;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(scale, 0, 0, scale, ox, oy);

      const cx = 145;
      const cy = 186;
      const sz = P.size;
      const breathe = 1 + Math.sin(t * (resting ? 0.8 : 1.25)) * 0.028;

      // Pointer influence
      const px = S.pointer.active ? Math.max(-1, Math.min(1, (S.pointer.x - cx) / 140)) : Math.sin(t * 0.35) * 0.3;
      const py = S.pointer.active ? Math.max(-1, Math.min(1, (S.pointer.y - 120) / 140)) : 0;

      const swayX = (Math.sin(t * 0.7) * 7 + px * 10) * (resting ? 0.4 : 1);
      const lift = reacting ? Math.sin(Math.PI * (1 - react)) * 16 : 0;
      const bob = Math.sin(t * 1.4) * (resting ? 1.5 : 3) - lift + (resting ? 12 : 0);

      // ── Body centreline ──
      const N = 210;
      const sCoil = 0.6;
      const turns = 1.25;
      const rx = 82 * sz;
      const ry = 25 * sz;
      const W0 = 15.5 * sz;
      const beads: { x: number; y: number; z: number; w: number; s: number; i: number; nx: number; ny: number }[] = [];
      let endX = 0;
      let endY = 0;
      const coilPoint = (u: number) => {
        const th = u * turns * Math.PI * 2;
        const r = 1 - 0.24 * u;
        const wave = Math.sin(th * 3 - t * 1.5) * 1.8;
        return {
          x: cx + (rx * r + wave) * Math.cos(th),
          y: cy + (ry * r + wave * 0.3) * Math.sin(th) - u * 12,
          z: Math.sin(th) + u * 0.6,
        };
      };
      const end = coilPoint(1);
      endX = end.x;
      endY = end.y;
      const headX = cx + 8 + swayX;
      const headY = cy - 128 * sz + bob;
      const p1 = { x: endX - 52, y: endY - 6 };
      const p2 = { x: cx + 54 + swayX * 0.4, y: cy - 78 * sz + bob * 0.4 };
      for (let i = 0; i < N; i++) {
        const s = i / (N - 1);
        let x: number;
        let y: number;
        let z: number;
        if (s <= sCoil) {
          const c = coilPoint(s / sCoil);
          x = c.x;
          y = c.y;
          z = c.z;
          // tail flick
          if (s < 0.06) {
            const k = 1 - s / 0.06;
            x += Math.sin(t * 2.2) * 3 * k;
            y -= k * 4;
          }
        } else {
          const v = (s - sCoil) / (1 - sCoil);
          const m = 1 - v;
          x = m * m * m * endX + 3 * m * m * v * p1.x + 3 * m * v * v * p2.x + v * v * v * headX;
          y = m * m * m * endY + 3 * m * m * v * p1.y + 3 * m * v * v * p2.y + v * v * v * headY;
          z = 2 + v;
        }
        let w = W0;
        if (s < 0.24) w = 1.2 + (W0 - 1.2) * smooth(s / 0.24);
        else if (s > 0.7) w = W0 * (1 - 0.36 * smooth((s - 0.7) / 0.3));
        beads.push({ x, y, z, w: w * breathe, s, i, nx: 0, ny: -1 });
      }

      // Cross-section normals (pointing toward the light, up-left) for seamless tube shading.
      for (let i = 0; i < N; i++) {
        const a = beads[Math.max(0, i - 2)];
        const c = beads[Math.min(N - 1, i + 2)];
        let tx = c.x - a.x;
        let ty = c.y - a.y;
        const len = Math.hypot(tx, ty) || 1;
        tx /= len;
        ty /= len;
        let nx = -ty;
        let ny = tx;
        if (nx * -0.45 + ny * -0.9 < 0) {
          nx = -nx;
          ny = -ny;
        }
        beads[i].nx = nx;
        beads[i].ny = ny;
      }

      // ── Background light ──
      if (fl.includes('radiance')) {
        ctx.save();
        ctx.translate(headX, headY + 30);
        ctx.rotate(t * 0.05);
        for (let k = 0; k < 14; k++) {
          ctx.rotate((Math.PI * 2) / 14);
          const g = ctx.createLinearGradient(0, 0, 0, -170);
          g.addColorStop(0, css(GOLD, dark ? 0.16 : 0.2));
          g.addColorStop(1, css(GOLD, 0));
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.moveTo(-5, 0);
          ctx.lineTo(5, 0);
          ctx.lineTo(16, -170);
          ctx.lineTo(-16, -170);
          ctx.fill();
        }
        ctx.restore();
      }
      const auraA = P.glow * (dark ? 0.55 : 0.4) * (0.9 + Math.sin(t * 0.9) * 0.1);
      if (auraA > 0) {
        const g = ctx.createRadialGradient(cx, cy - 70, 10, cx, cy - 60, 150);
        g.addColorStop(0, css(mix(P.light, GOLD, 0.35), auraA));
        g.addColorStop(0.55, css(P.light, auraA * 0.35));
        g.addColorStop(1, css(P.light, 0));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // ── Ground shadow ──
      const sh = ctx.createRadialGradient(cx, cy + 20, 5, cx, cy + 20, rx * 1.25);
      sh.addColorStop(0, `rgba(10,25,18,${dark ? 0.45 : 0.18})`);
      sh.addColorStop(1, 'rgba(10,25,18,0)');
      ctx.fillStyle = sh;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 20, rx * 1.25, ry * 1.1, 0, 0, Math.PI * 2);
      ctx.fill();

      // ── The vine ──
      drawVine(ctx, t, P, st, fl.includes('blossoms'), dark, cx, cy, live);

      // ── Halo (behind head) ──
      const hw = W0 * 1.72 * breathe;
      const hh = W0 * 1.34 * breathe;
      if (fl.includes('halo') || st >= 7) {
        ctx.save();
        ctx.shadowColor = css(GOLD, 0.9);
        ctx.shadowBlur = 14;
        ctx.strokeStyle = css(GOLD, fl.includes('halo') ? 0.75 : 0.4);
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.ellipse(headX, headY - hh * 0.3, hw * 1.65, hw * 1.65 * 0.92, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // ── Body beads (depth-sorted), with a texture pass so markings are never hidden ──
      beads.sort((a, b) => a.z - b.z || a.i - b.i);
      const drawBead = (b: (typeof beads)[number]) => {
        let base = P.base;
        if (P.sheen > 0) base = mix(P.base, GOLD, P.sheen * (0.5 + 0.5 * Math.sin(b.s * 22 - t * 1.3)));
        const g = ctx.createLinearGradient(b.x + b.nx * b.w, b.y + b.ny * b.w, b.x - b.nx * b.w, b.y - b.ny * b.w);
        g.addColorStop(0, css(mix(P.light, base, 0.35)));
        g.addColorStop(0.22, css(P.light));
        g.addColorStop(0.5, css(base));
        g.addColorStop(0.86, css(P.dark));
        g.addColorStop(1, css(mix(P.dark, [0, 0, 0], 0.25)));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.w, 0, Math.PI * 2);
        ctx.fill();
      };
      const texture = (b: (typeof beads)[number], neck: boolean) => {
        if (b.w < 6) return;
        // staggered scale lattice
        if (P.scales > 0 && b.i % 3 === 0) {
          const row = (b.i / 3) % 2 ? 0.42 : -0.05;
          ctx.strokeStyle = css(P.light, P.scales * 0.9);
          ctx.lineWidth = 0.8;
          for (const off of [-0.5, 0.5]) {
            const sx = b.x + (off + row * 0.5) * b.w * 0.9;
            const sy = b.y - b.w * (neck ? 0.05 : 0.25);
            ctx.beginPath();
            ctx.arc(sx, sy, b.w * 0.28, Math.PI * 0.05, Math.PI * 0.95);
            ctx.stroke();
          }
        }
        // cream belly down the front of the neck
        if (neck && b.i % 2 === 0) {
          ctx.fillStyle = css(mix(P.light, hex('#f4ecd6'), 0.55), 0.55);
          ctx.beginPath();
          ctx.ellipse(b.x + b.w * 0.05, b.y + b.w * 0.05, b.w * 0.42, b.w * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        // gold markings along the spine
        if (P.markings > 0 && b.i % 9 === 4 && b.s < 0.93 && !neck) {
          const d = b.w * 0.36;
          const my = b.y - b.w * 0.42;
          ctx.save();
          if (st >= 6) {
            ctx.shadowColor = css(GOLD, 0.9);
            ctx.shadowBlur = 7;
          }
          ctx.fillStyle = css(mix(GOLD, GOLD_DEEP, 0.25), P.markings);
          ctx.beginPath();
          ctx.moveTo(b.x, my - d * 0.6);
          ctx.lineTo(b.x + d, my);
          ctx.lineTo(b.x, my + d * 0.6);
          ctx.lineTo(b.x - d, my);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        if (P.markings > 0 && neck && b.i % 9 === 4 && b.s < 0.95) {
          for (const sx of [-1, 1]) {
            ctx.fillStyle = css(GOLD, P.markings * 0.85);
            ctx.beginPath();
            ctx.arc(b.x + sx * b.w * 0.72, b.y, b.w * 0.13, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      };
      // luminous rim for the later stages: one blurred silhouette behind the body
      if (st >= 6) {
        ctx.save();
        ctx.shadowColor = css(GOLD, st >= 7 ? 0.95 : 0.6);
        ctx.shadowBlur = st >= 7 ? 22 : 12;
        ctx.fillStyle = css(mix(P.light, GOLD, 0.5));
        ctx.beginPath();
        for (const b of beads) {
          ctx.moveTo(b.x + b.w, b.y);
          ctx.arc(b.x, b.y, b.w, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.restore();
      }
      const coil = beads.filter((b) => b.z < 2);
      const neckBeads = beads.filter((b) => b.z >= 2);
      coil.forEach(drawBead);
      // texture only on the visible, front-facing parts of the coil
      for (const b of coil) if (b.z > 0.15 || b.s > 0.45) texture(b, false);
      neckBeads.forEach(drawBead);
      for (const b of neckBeads) texture(b, true);

      // ── Head ──
      const tilt = (px * 0.1 + Math.sin(t * 0.6) * 0.04) * (resting ? 0.3 : 1) + (resting ? 0.08 : 0);
      ctx.save();
      ctx.translate(headX, headY - hh * 0.12);
      ctx.rotate(tilt);
      const hg = ctx.createRadialGradient(-hw * 0.35, -hh * 0.55, 1, 0, 0, hw * 1.4);
      hg.addColorStop(0, css(P.light));
      hg.addColorStop(0.55, css(P.sheen ? mix(P.base, GOLD, P.sheen * 0.6) : P.base));
      hg.addColorStop(1, css(P.dark));
      ctx.fillStyle = hg;
      ctx.beginPath();
      ctx.ellipse(0, -hh * 0.08, hw, hh * 0.86, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, hh * 0.36, hw * 0.74, hh * 0.56, 0, 0, Math.PI * 2);
      ctx.fill();
      // soft highlight
      ctx.fillStyle = 'rgba(255,255,255,0.16)';
      ctx.beginPath();
      ctx.ellipse(-hw * 0.32, -hh * 0.5, hw * 0.42, hh * 0.22, -0.4, 0, Math.PI * 2);
      ctx.fill();
      // forehead crest
      if (P.markings > 0) {
        ctx.save();
        if (st >= 6) {
          ctx.shadowColor = css(GOLD);
          ctx.shadowBlur = 8;
        }
        ctx.fillStyle = css(GOLD, P.markings);
        const d = hw * 0.16;
        ctx.beginPath();
        ctx.moveTo(0, -hh * 0.72 - d);
        ctx.lineTo(d * 0.75, -hh * 0.72);
        ctx.lineTo(0, -hh * 0.72 + d);
        ctx.lineTo(-d * 0.75, -hh * 0.72);
        ctx.fill();
        ctx.restore();
      }
      // eyes
      if (t > S.blinkAt + 0.16) S.blinkAt = t + 2.8 + Math.random() * 3.5;
      const blinking = live && t > S.blinkAt && t < S.blinkAt + 0.16;
      const ex = hw * 0.47;
      const ey = -hh * 0.14;
      const er = hw * 0.27;
      const eyeDark = dark ? '#0d1712' : '#16241c';
      if (resting || reacting || md === 'joyful') {
        // closed, peaceful (resting) or happy (∩) eyes
        ctx.strokeStyle = eyeDark;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        for (const sx of [-1, 1]) {
          ctx.beginPath();
          if (resting) ctx.arc(sx * ex, ey - er * 0.2, er * 0.75, Math.PI * 0.15, Math.PI * 0.85);
          else ctx.arc(sx * ex, ey + er * 0.35, er * 0.75, Math.PI * 1.15, Math.PI * 1.85);
          ctx.stroke();
        }
      } else {
        for (const sx of [-1, 1]) {
          ctx.save();
          ctx.translate(sx * ex, ey);
          ctx.scale(1, blinking ? 0.1 : 1);
          const ig = ctx.createRadialGradient(0, 0, er * 0.2, 0, 0, er);
          ig.addColorStop(0, eyeDark);
          ig.addColorStop(0.62, eyeDark);
          ig.addColorStop(0.8, css(P.iris));
          ig.addColorStop(1, css(mix(P.iris, P.dark, 0.5)));
          ctx.fillStyle = ig;
          if (st >= 4) {
            ctx.shadowColor = css(P.iris, 0.6);
            ctx.shadowBlur = st >= 6 ? 6 : 3;
          }
          ctx.beginPath();
          ctx.arc(0, 0, er, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          // pupils look toward the pointer
          ctx.fillStyle = 'rgba(255,255,255,0.92)';
          ctx.beginPath();
          ctx.arc(-er * 0.28 + px * er * 0.18, -er * 0.32 + py * er * 0.12, er * 0.24, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.beginPath();
          ctx.arc(er * 0.3 + px * er * 0.1, er * 0.3, er * 0.1, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      // nostrils & gentle smile
      ctx.fillStyle = 'rgba(16,30,22,0.35)';
      for (const sx of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(sx * hw * 0.17, hh * 0.5, 1.2, 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = 'rgba(16,30,22,0.38)';
      ctx.lineWidth = 1.3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      const smile = reacting || md === 'joyful' ? 0.95 : 0.84;
      ctx.moveTo(-hw * 0.26, hh * 0.68);
      ctx.quadraticCurveTo(0, hh * smile, hw * 0.26, hh * 0.68);
      ctx.stroke();
      if (st >= 3 && (md === 'joyful' || reacting)) {
        ctx.fillStyle = css(hex('#e9a48c'), 0.22);
        for (const sx of [-1, 1]) {
          ctx.beginPath();
          ctx.ellipse(sx * hw * 0.62, hh * 0.24, hw * 0.16, hh * 0.09, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // crown of light
      if (st >= 7) {
        ctx.save();
        ctx.shadowColor = css(GOLD);
        ctx.shadowBlur = 10;
        ctx.fillStyle = css(hex('#fff1c8'), 0.95);
        for (let k = -1; k <= 1; k++) {
          const a = -Math.PI / 2 + k * 0.5;
          const r = hw * 1.18;
          const tw = 1.6 + Math.sin(t * 2 + k) * 0.5;
          ctx.beginPath();
          ctx.arc(Math.cos(a) * r, -hh * 0.1 + Math.sin(a) * r, tw, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      ctx.restore();

      // ── Dawn light (resting mood): progress can continue ──
      if (resting) {
        const dx = headX + 70;
        const dy = headY + 6 + Math.sin(t * 0.9) * 4;
        const pulse = 0.75 + Math.sin(t * 1.3) * 0.2;
        const dg = ctx.createRadialGradient(dx, dy, 1, dx, dy, 34);
        dg.addColorStop(0, `rgba(255,240,205,${0.95 * pulse})`);
        dg.addColorStop(0.25, `rgba(244,201,120,${0.7 * pulse})`);
        dg.addColorStop(1, 'rgba(244,201,120,0)');
        ctx.fillStyle = dg;
        ctx.beginPath();
        ctx.arc(dx, dy, 34, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Ripple on tap ──
      if (reacting) {
        const p = 1 - react;
        ctx.strokeStyle = css(GOLD, 0.55 * react);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(headX, headY - hh * 0.1, hw + p * 60, 0, Math.PI * 2);
        ctx.stroke();
      }

      // ── Particles ──
      if (live) {
        const moteRate = st >= 6 ? 0.06 : st >= 5 ? 0.03 : st >= 3 ? 0.012 : 0;
        if (Math.random() < moteRate)
          S.particles.push({ x: cx + (Math.random() - 0.5) * 220, y: cy + 10, vx: (Math.random() - 0.5) * 0.15, vy: -0.25 - Math.random() * 0.35, life: 0, max: 260 + Math.random() * 200, size: 0.8 + Math.random() * 1.6 });
      }
      S.particles = S.particles.filter((q) => q.life < q.max);
      for (const q of S.particles) {
        q.x += q.vx;
        q.y += q.vy;
        q.vy *= 0.999;
        q.life++;
        const a = Math.sin((q.life / q.max) * Math.PI);
        const pg = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, q.size * 4);
        pg.addColorStop(0, css(hex('#fff3cf'), a));
        pg.addColorStop(0.4, css(GOLD, a * 0.6));
        pg.addColorStop(1, css(GOLD, 0));
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.arc(q.x, q.y, q.size * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      const t = (now - state.current.t0) / 1000;
      if (state.current.visible && !document.hidden) draw(t);
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    const io = new IntersectionObserver(([e]) => (state.current.visible = e.isIntersecting));
    io.observe(canvas);
    if (live) raf = requestAnimationFrame(loop);
    else draw(0);

    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const dpr = canvas.width / r.width;
      return { x: ((e.clientX - r.left) * dpr - ox) / scale, y: ((e.clientY - r.top) * dpr - oy) / scale };
    };
    const move = (e: PointerEvent) => {
      const p = toLocal(e);
      state.current.pointer = { ...p, active: true };
    };
    const leave = () => (state.current.pointer.active = false);
    const down = (e: PointerEvent) => {
      const p = toLocal(e);
      const S = state.current;
      S.reactAt = (performance.now() - S.t0) / 1000;
      if (live && props.current.flourishes.includes('embers')) {
        for (let k = 0; k < 26; k++) {
          const a = Math.random() * Math.PI * 2;
          const v = 0.6 + Math.random() * 1.6;
          S.particles.push({ x: p.x, y: p.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.6, life: 0, max: 70 + Math.random() * 50, size: 0.8 + Math.random() * 1.4 });
        }
      } else if (live) {
        for (let k = 0; k < 5; k++)
          S.particles.push({ x: p.x + (Math.random() - 0.5) * 20, y: p.y, vx: (Math.random() - 0.5) * 0.4, vy: -0.6 - Math.random() * 0.6, life: 0, max: 80, size: 1 + Math.random() });
      }
      if (!live) draw(0);
      onTapRef.current?.();
    };
    const redraw = () => {
      if (!live) draw(0);
    };
    canvas.addEventListener('abide-redraw', redraw);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerleave', leave);
    canvas.addEventListener('pointerdown', down);
    return () => {
      canvas.removeEventListener('abide-redraw', redraw);
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
      canvas.removeEventListener('pointerdown', down);
    };
  }, [animated]);

  const onTapRef = useRef(onTap);
  onTapRef.current = onTap;

  // Static companions (or reduced motion) redraw when their props change.
  useEffect(() => {
    canvasRef.current?.dispatchEvent(new Event('abide-redraw'));
  }, [stage, mood, flourishes, animated]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={ariaLabel ?? `Your companion, stage ${stage}`}
      className={className}
      style={{ width: '100%', height, touchAction: 'manipulation', cursor: onTap ? 'pointer' : 'default', display: 'block' }}
    />
  );
}

function drawVine(
  ctx: CanvasRenderingContext2D,
  t: number,
  P: Palette,
  stage: number,
  blossoms: boolean,
  dark: boolean,
  cx: number,
  cy: number,
  live: boolean,
) {
  const a = { x: cx - 150, y: cy + 34 };
  const b = { x: cx - 60, y: cy + 8 };
  const c = { x: cx + 70, y: cy + 52 };
  const d = { x: cx + 152, y: cy + 22 };
  const at = (u: number) => {
    const m = 1 - u;
    return {
      x: m * m * m * a.x + 3 * m * m * u * b.x + 3 * m * u * u * c.x + u * u * u * d.x,
      y: m * m * m * a.y + 3 * m * m * u * b.y + 3 * m * u * u * c.y + u * u * u * d.y,
    };
  };
  const bark: RGB = mix(hex(dark ? '#5d5140' : '#7a6748'), hex('#5b7a52'), Math.min(1, (stage - 1) / 6) * 0.5);
  ctx.save();
  ctx.lineCap = 'round';
  ctx.strokeStyle = css(bark, dark ? 0.9 : 0.85);
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.bezierCurveTo(b.x, b.y, c.x, c.y, d.x, d.y);
  ctx.stroke();
  // tendrils
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = css(mix(bark, hex('#7fae78'), 0.5), 0.8);
  for (const u of [0.12, 0.88]) {
    const p = at(u);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    for (let k = 1; k <= 14; k++) {
      const r = 9 - k * 0.5;
      const ang = k * 0.9 + (u > 0.5 ? 0 : Math.PI);
      ctx.lineTo(p.x + Math.cos(ang) * r + (u > 0.5 ? k * 0.8 : -k * 0.8), p.y - k * 0.9 + Math.sin(ang) * r * 0.5);
    }
    ctx.stroke();
  }
  // leaves
  const leafSpots = [0.06, 0.92, 0.2, 0.8, 0.32, 0.7, 0.03, 0.97, 0.15, 0.86];
  const leafCol: RGB = mix(hex('#8aa78a'), hex('#4f9a64'), Math.min(1, (stage - 1) / 5));
  for (let k = 0; k < Math.min(P.leaves, leafSpots.length); k++) {
    const u = leafSpots[k];
    const p = at(u);
    const side = k % 2 ? 1 : -1;
    const sway = live ? Math.sin(t * 1.1 + k) * 0.12 : 0;
    const len = 15 + (k % 3) * 3;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(-Math.PI / 2 + side * 0.9 + sway);
    const lg = ctx.createLinearGradient(0, 0, len, 0);
    lg.addColorStop(0, css(mix(leafCol, hex('#2d5a3a'), 0.3)));
    lg.addColorStop(1, css(mix(leafCol, hex('#cfe6c4'), 0.25)));
    ctx.fillStyle = lg;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(len * 0.5, -len * 0.42, len, 0);
    ctx.quadraticCurveTo(len * 0.5, len * 0.42, 0, 0);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(1, 0);
    ctx.lineTo(len * 0.85, 0);
    ctx.stroke();
    ctx.restore();
  }
  // blossoms (30-day flourish)
  if (blossoms) {
    for (const u of [0.1, 0.26, 0.76, 0.9]) {
      const p = at(u);
      const fy = p.y - 9;
      ctx.fillStyle = 'rgba(255,252,244,0.95)';
      for (let k = 0; k < 5; k++) {
        const ang = (k / 5) * Math.PI * 2 + (live ? t * 0.2 : 0);
        ctx.beginPath();
        ctx.ellipse(p.x + Math.cos(ang) * 3.4, fy + Math.sin(ang) * 3.4, 2.6, 1.8, ang, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = css(GOLD);
      ctx.beginPath();
      ctx.arc(p.x, fy, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // grapes (final stage) — the fruit of abiding
  if (stage >= 7) {
    const p = at(0.6);
    ctx.strokeStyle = css(bark);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + 1, p.y + 6);
    ctx.stroke();
    const rows = [4, 3, 3, 2, 1];
    let yy = p.y + 8;
    rows.forEach((n) => {
      for (let k = 0; k < n; k++) {
        const gx = p.x + 1 + (k - (n - 1) / 2) * 4.6;
        const gg = ctx.createRadialGradient(gx - 1, yy - 1, 0.2, gx, yy, 2.6);
        gg.addColorStop(0, '#d8c3e0');
        gg.addColorStop(0.55, '#7b5a8c');
        gg.addColorStop(1, '#43304f');
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.arc(gx, yy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      yy += 3.9;
    });
    ctx.fillStyle = css(hex('#5d9a6a'));
    ctx.beginPath();
    ctx.moveTo(p.x + 2, p.y + 4);
    ctx.quadraticCurveTo(p.x + 12, p.y - 2, p.x + 16, p.y + 7);
    ctx.quadraticCurveTo(p.x + 9, p.y + 10, p.x + 2, p.y + 4);
    ctx.fill();
  }
  ctx.restore();
}
