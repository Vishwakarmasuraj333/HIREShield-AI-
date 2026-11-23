"use client";

import React, { useEffect, useRef, useState } from "react";

interface AnimatedSecurityBackgroundProps {
  variant?: "landing" | "dashboard" | "auth" | "minimal";
  className?: string;
  showScanLine?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
}

export const AnimatedSecurityBackground: React.FC<AnimatedSecurityBackgroundProps> = ({
  variant = "landing",
  className = "",
  showScanLine = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!isMounted || reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Particle density tailored by variant and screen width
    const particleCount = variant === "minimal" 
      ? 15 
      : width < 768 
      ? 20 
      : variant === "dashboard" 
      ? 28 
      : 42;

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 1.0,
        baseAlpha: Math.random() * 0.25 + 0.15,
      });
    }

    // Interactive pointer offset on desktop
    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let isTabVisible = true;
    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === "visible";
      if (isTabVisible) {
        lastTime = performance.now();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    let lastTime = performance.now();
    const maxConnectionDistance = width < 768 ? 90 : 130;

    const render = (time: number) => {
      if (!isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries smoothly
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Subtle mouse repulsion / connection
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        let alpha = p.baseAlpha;

        if (distToMouse < 120) {
          alpha = Math.min(0.6, alpha + (1 - distToMouse / 120) * 0.3);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

          if (dist < maxConnectionDistance) {
            const lineAlpha = (1 - dist / maxConnectionDistance) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isMounted, reducedMotion, variant]);

  // Opacity & styling modifiers based on variant
  const ambientGlowOpacity =
    variant === "landing"
      ? "opacity-60"
      : variant === "auth"
      ? "opacity-50"
      : variant === "dashboard"
      ? "opacity-35"
      : "opacity-20";

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
    >
      {/* Layer A: Ambient Radial Glow Lights */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${ambientGlowOpacity}`}>
        {/* Primary soft emerald ambient aura */}
        <div
          className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(209, 250, 229, 0.03) 60%, transparent 80%)",
          }}
        />
        {/* Secondary mint highlight aura */}
        <div
          className="absolute top-1/3 -right-48 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(52, 211, 153, 0.06) 0%, rgba(236, 253, 245, 0.02) 65%, transparent 80%)",
          }}
        />
        {/* Soft bottom ambient grounding aura */}
        <div
          className="absolute -bottom-40 left-1/3 w-[700px] h-[500px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, rgba(240, 253, 244, 0.02) 70%, transparent 80%)",
          }}
        />
      </div>

      {/* Layer B: Technical Security Grid */}
      <div className="absolute inset-0 security-grid-bg opacity-70" />

      {/* Layer C: Canvas Animated Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />

      {/* Layer D: Restrained Decorative Security Motifs */}
      <div className="absolute inset-0 overflow-hidden opacity-25">
        {/* Subtle Shield Outline (Top-right quadrant) */}
        <svg
          className="absolute top-16 right-12 w-64 h-64 text-emerald-600/30 transform rotate-12 transition-transform duration-700 hidden lg:block"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="0.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>

        {/* Minimal Node Matrix (Bottom-left quadrant) */}
        <div className="absolute bottom-20 left-12 w-48 h-48 border border-emerald-500/10 rounded-2xl hidden md:block">
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full border border-emerald-500/30 bg-emerald-100/50" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full border border-emerald-500/30 bg-emerald-100/50" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full border border-emerald-500/30 bg-emerald-100/50" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full border border-emerald-500/30 bg-emerald-100/50" />
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-dashed border-emerald-500/20 animate-pulse-subtle" />
          </div>
        </div>
      </div>

      {/* Layer E: Optional Soft Scanning Horizon Line in Hero */}
      {showScanLine && !reducedMotion && (
        <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent animate-scan-line" />
      )}
    </div>
  );
};
