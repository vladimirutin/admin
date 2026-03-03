import React, { useEffect } from 'react';

// ==========================================
// GLOBAL STYLES INJECTION
// ==========================================
export const GlobalStyles = () => {
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;700&family=Inter:wght@300;400;500;600;700&display=swap');
      
      * { box-sizing: border-box; }
      
      :root {
        --accent: #6366f1;
        --accent-glow: rgba(99,102,241,0.4);
        --emerald-glow: rgba(16,185,129,0.4);
        --rose-glow: rgba(244,63,94,0.4);
        --amber-glow: rgba(245,158,11,0.4);
      }

      body { font-family: 'Inter', sans-serif; }

      .font-display { font-family: 'Syne', sans-serif !important; }
      .font-mono { font-family: 'JetBrains Mono', monospace !important; }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }
      @keyframes pulse-ring {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(2.5); opacity: 0; }
      }
      @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      }
      @keyframes gradient-shift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      @keyframes slide-up {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slide-right {
        from { opacity: 0; transform: translateX(-24px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes scale-in {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes counter-up {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes radar-sweep {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      @keyframes data-flow {
        0% { transform: translateY(-100%); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateY(100%); opacity: 0; }
      }
      @keyframes neon-pulse {
        0%, 100% { box-shadow: 0 0 5px var(--accent-glow), 0 0 10px var(--accent-glow); }
        50% { box-shadow: 0 0 15px var(--accent-glow), 0 0 30px var(--accent-glow), 0 0 45px var(--accent-glow); }
      }
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes typewriter {
        from { width: 0; }
        to { width: 100%; }
      }
      @keyframes grid-move {
        0% { transform: translateY(0); }
        100% { transform: translateY(40px); }
      }

      .animate-float { animation: float 3s ease-in-out infinite; }
      .animate-pulse-ring { animation: pulse-ring 1.5s ease-out infinite; }
      .animate-shimmer { 
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
        background-size: 2000px 100%;
        animation: shimmer 2s infinite;
      }
      .animate-gradient { 
        background-size: 200% 200%;
        animation: gradient-shift 4s ease infinite;
      }
      .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .animate-slide-right { animation: slide-right 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .animate-radar { animation: radar-sweep 3s linear infinite; }
      .animate-blink { animation: blink 2s ease-in-out infinite; }
      .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      .animate-neon { animation: neon-pulse 2s ease-in-out infinite; }
      
      .glass {
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
      }
      
      .glow-indigo { box-shadow: 0 0 20px rgba(99,102,241,0.3), 0 0 40px rgba(99,102,241,0.1); }
      .glow-emerald { box-shadow: 0 0 20px rgba(16,185,129,0.3), 0 0 40px rgba(16,185,129,0.1); }
      .glow-rose { box-shadow: 0 0 20px rgba(244,63,94,0.3), 0 0 40px rgba(244,63,94,0.1); }
      .glow-amber { box-shadow: 0 0 20px rgba(245,158,11,0.3), 0 0 40px rgba(245,158,11,0.1); }

      .btn-hover-lift {
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
      }
      .btn-hover-lift:hover {
        transform: translateY(-2px);
      }
      .btn-hover-lift:active {
        transform: translateY(0px) scale(0.98);
      }

      .card-hover {
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease;
      }
      .card-hover:hover {
        transform: translateY(-4px) scale(1.01);
      }

      .nav-active-indicator {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 60%;
        background: linear-gradient(180deg, #818cf8, #6366f1);
        border-radius: 0 4px 4px 0;
        box-shadow: 0 0 12px rgba(99,102,241,0.6);
      }

      .stat-number {
        font-family: 'Syne', sans-serif;
        font-variant-numeric: tabular-nums;
      }

      .table-row-hover {
        transition: background 0.15s ease;
      }

      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.6); }

      .grid-bg {
        background-image: 
          linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px);
        background-size: 40px 40px;
      }

      .hexagon-bg {
        background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 2L58 17v26L30 58 2 43V17z' fill='none' stroke='rgba(99,102,241,0.06)' stroke-width='1'/%3E%3C/svg%3E");
        background-size: 60px 60px;
      }

      .noise-overlay {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
      }
      
      input[type=number]::-webkit-inner-spin-button,
      input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }

      .progress-bar {
        transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .ripple {
        position: relative;
        overflow: hidden;
      }
      .ripple::after {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.3s;
      }
      .ripple:hover::after {
        opacity: 1;
      }

      .stagger-1 { animation-delay: 0.05s; }
      .stagger-2 { animation-delay: 0.1s; }
      .stagger-3 { animation-delay: 0.15s; }
      .stagger-4 { animation-delay: 0.2s; }
      .stagger-5 { animation-delay: 0.25s; }
      .stagger-6 { animation-delay: 0.3s; }
      .stagger-7 { animation-delay: 0.35s; }
      .stagger-8 { animation-delay: 0.4s; }
    \`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
};
