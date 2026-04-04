"use client";

import { MousePosition } from '@/types/types';
import React, { useRef, useEffect } from 'react';


export const MorphingBlob: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef<MousePosition>({ x: 0.5, y: 0.5 });
  const currentPos = useRef<MousePosition>({ x: 0.5, y: 0.5 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const resize = (): void => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent): void => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      };
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const animate = (): void => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * 0.05;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * 0.05;

      ctx.clearRect(0, 0, w, h);

      const gradient = ctx.createRadialGradient(
        w * currentPos.current.x,
        h * currentPos.current.y,
        0,
        w * currentPos.current.x,
        h * currentPos.current.y,
        Math.max(w, h) * 0.8
      );

      const hue1 = (time * 0.5 + currentPos.current.x * 60) % 360;
      const hue2 = (hue1 + 80) % 360;
      const hue3 = (hue1 + 160) % 360;

      gradient.addColorStop(0, `hsla(${hue1}, 70%, 50%, 0.8)`);
      gradient.addColorStop(0.4, `hsla(${hue2}, 60%, 40%, 0.6)`);
      gradient.addColorStop(0.7, `hsla(${hue3}, 50%, 30%, 0.4)`);
      gradient.addColorStop(1, 'hsla(0, 0%, 0%, 0.2)');

      ctx.save();
      ctx.translate(w / 2, h / 2);

      ctx.beginPath();
      const points = 12;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const radiusVariation =
          Math.sin(time * 0.02 + i * 0.5) * 40 +
          Math.sin(time * 0.03 + i * 0.3) * 30 +
          Math.cos(currentPos.current.x * 10 + i) * 20 +
          Math.sin(currentPos.current.y * 10 + i) * 20;

        const radius = Math.min(w, h) * 0.35 + radiusVariation;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevAngle = ((i - 1) / points) * Math.PI * 2;
          const prevRadiusVariation =
            Math.sin(time * 0.02 + (i - 1) * 0.5) * 40 +
            Math.sin(time * 0.03 + (i - 1) * 0.3) * 30 +
            Math.cos(currentPos.current.x * 10 + (i - 1)) * 20 +
            Math.sin(currentPos.current.y * 10 + (i - 1)) * 20;
          const prevRadius = Math.min(w, h) * 0.35 + prevRadiusVariation;
          const prevX = Math.cos(prevAngle) * prevRadius;
          const prevY = Math.sin(prevAngle) * prevRadius;

          const cpX = (prevX + x) / 2;
          const cpY = (prevY + y) / 2;
          ctx.quadraticCurveTo(prevX, prevY, cpX, cpY);
        }
      }
      ctx.closePath();

      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.shadowBlur = 60;
      ctx.shadowColor = `hsla(${hue1}, 70%, 50%, 0.5)`;
      ctx.fill();

      ctx.restore();

      time++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[70vh] overflow-hidden mb-32">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'blur(40px) brightness(1.2)' }}
      />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-white text-7xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tight">
          Our Work
        </h1>
        <p className="text-zinc-300 text-xl md:text-2xl lg:text-3xl max-w-4xl leading-relaxed">
          A collection of work pushing the boundaries of design,<br />technology, and human experience.
        </p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />
    </div>
  );
};