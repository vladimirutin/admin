import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ShieldCheck, Users, CheckCircle, XCircle, LogOut, Activity, RefreshCw, 
  LayoutDashboard, Settings, Bell, Mail, Lock, Unlock, Save, Edit2, X, 
  Server, FileText, Clock, Trash2, Grid, DollarSign, AlertTriangle, MapPin, 
  Wifi, WifiOff, ShoppingBag, User, ChevronRight, Power, Eye, ClipboardList, 
  AlertOctagon, Search, ArrowRight, TrendingUp, MoreHorizontal, FileSearch, 
  Stethoscope, Menu, FileBadge, ToggleLeft, ToggleRight, Database, Download, 
  HardDrive, Globe, Sun, Moon, EyeOff, Wrench, Cpu, Thermometer, Printer, 
  Scan, Package, LifeBuoy, BarChart3, Send, MessageSquare, Layers, Zap,
  Megaphone, AlertCircle, CheckSquare, CheckCircle2, Monitor, ChevronLeft,
  Sparkles, TrendingDown, Shield, Radio, Waves, ChevronDown, Star, Target,
  Gauge, Network, FlaskConical, BrainCircuit
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { 
  getFirestore, collection, query, getDocs, doc, updateDoc, limit, 
  serverTimestamp, deleteDoc, getDoc, setDoc, onSnapshot, addDoc, where
} from "firebase/firestore";
import { signInAnonymously, getAuth } from "firebase/auth";

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyBT93hmr81TT_-KltaYxcYwms_xKxg3c1I",
  authDomain: "medivend-a3d51.firebaseapp.com",
  projectId: "medivend-a3d51",
  storageBucket: "medivend-a3d51.firebasestorage.app",
  messagingSenderId: "743343498567",
  appId: "1:743343498567:web:2d50fb42346f31350d1862"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const appId = 'medivend-local';

const ADMIN_STORAGE_KEY = 'medivend_admin_creds';
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123',
  email: 'admin@medivend.com',
  displayName: 'System Administrator',
  photoUrl: 'image_3f1ac4.png',
  recentLogins: []
};

// ==========================================
// GLOBAL STYLES INJECTION
// ==========================================
const GlobalStyles = () => {
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
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
};

// ==========================================
// ANIMATED COUNTER
// ==========================================
function AnimatedCounter({ value, duration = 1000 }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  
  useEffect(() => {
    const start = prev.current;
    const end = Number(value) || 0;
    const startTime = Date.now();
    
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else prev.current = end;
    };
    
    requestAnimationFrame(tick);
  }, [value]);
  
  return <span>{display}</span>;
}

// ==========================================
// LIVE PULSE DOT
// ==========================================
function PulseDot({ color = 'emerald', size = 'sm' }) {
  const colors = {
    emerald: 'bg-emerald-500',
    rose: 'bg-rose-500',
    amber: 'bg-amber-500',
    indigo: 'bg-indigo-500',
    slate: 'bg-slate-500',
  };
  const sizes = { sm: 'w-2 h-2', md: 'w-3 h-3' };
  return (
    <span className="relative inline-flex">
      <span className={`${sizes[size]} ${colors[color]} rounded-full`}></span>
      <span className={`absolute inset-0 ${colors[color]} rounded-full animate-ping opacity-75`}></span>
    </span>
  );
}

// ==========================================
// 1. HELPER COMPONENTS (ENHANCED)
// ==========================================

function NavButton({ id, label, icon, active, onClick, badge, isDarkMode }) {
  return (
    <button 
      onClick={() => onClick(id)} 
      className={`relative flex w-full items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ripple overflow-hidden ${
        active 
          ? isDarkMode 
            ? 'bg-gradient-to-r from-indigo-600/20 to-indigo-500/5 text-indigo-400 shadow-lg' 
            : 'bg-gradient-to-r from-indigo-50 to-indigo-50/50 text-indigo-600'
          : isDarkMode 
            ? 'text-slate-500 hover:bg-white/5 hover:text-slate-200' 
            : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
      }`}
    >
      {active && <span className="nav-active-indicator"></span>}
      <div className="flex items-center gap-3 relative z-10">
        <div className={`transition-all duration-300 ${active ? 'scale-110' : 'group-hover:scale-105'}`}>
          {React.cloneElement(icon, { 
            className: `w-4.5 h-4.5 transition-colors ${active ? 'text-indigo-400' : isDarkMode ? 'text-slate-500 group-hover:text-slate-200' : 'text-slate-400 group-hover:text-slate-700'}` 
          })}
        </div>
        <span className="font-display font-semibold text-xs uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-center gap-2 relative z-10">
        {badge ? (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white bg-indigo-600 animate-pulse shadow-lg shadow-indigo-500/30">{badge}</span>
        ) : null}
        {active && <ChevronRight className="w-3.5 h-3.5 text-indigo-400 opacity-60" />}
      </div>
    </button>
  );
}

function StatCard({ title, value, icon, color, subtext, onClick, isDarkMode, trend }) {
  const configs = { 
    amber: { 
      bg: "bg-amber-500/10", text: "text-amber-400", 
      border: "border-amber-500/20", glow: "hover:glow-amber",
      gradient: "from-amber-500/20 to-transparent"
    }, 
    blue: { 
      bg: "bg-blue-500/10", text: "text-blue-400", 
      border: "border-blue-500/20", glow: "hover:glow-indigo",
      gradient: "from-blue-500/20 to-transparent"
    }, 
    emerald: { 
      bg: "bg-emerald-500/10", text: "text-emerald-400", 
      border: "border-emerald-500/20", glow: "hover:glow-emerald",
      gradient: "from-emerald-500/20 to-transparent"
    }, 
    red: { 
      bg: "bg-rose-500/10", text: "text-rose-400", 
      border: "border-rose-500/20", glow: "hover:glow-rose",
      gradient: "from-rose-500/20 to-transparent"
    } 
  };
  const c = configs[color];
  
  return (
    <div 
      onClick={onClick} 
      className={`relative p-5 rounded-2xl border cursor-pointer group card-hover overflow-hidden ${
        isDarkMode 
          ? `bg-[#0d1424] border-white/5 hover:border-indigo-500/30` 
          : `bg-white border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-200`
      }`}
    >
      {/* Background gradient accent */}
      <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      {/* Corner decoration */}
      <div className={`absolute top-0 right-0 w-24 h-24 ${c.bg} rounded-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform duration-500`}></div>
      
      <div className="relative z-10">
        <div className={`inline-flex p-2.5 rounded-xl ${c.bg} ${c.border} border mb-4 transition-transform duration-300 group-hover:scale-110`}>
          {React.cloneElement(icon, { className: `w-5 h-5 ${c.text}` })}
        </div>
        
        <div className={`font-display text-3xl font-bold mb-1 stat-number ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          <AnimatedCounter value={typeof value === 'string' ? value.split('/')[0] : value} />
          {typeof value === 'string' && value.includes('/') && (
            <span className={`text-lg ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>/{value.split('/')[1]}</span>
          )}
        </div>
        
        <p className={`font-semibold text-xs uppercase tracking-wider leading-tight ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
        
        {subtext && (
          <p className={`text-[10px] mt-2 flex items-center gap-1 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
            <span className="w-1 h-1 rounded-full bg-current"></span>{subtext}
          </p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const configs = { 
    active: { cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "emerald" }, 
    pending: { cls: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "amber" }, 
    rejected: { cls: "bg-rose-500/10 text-rose-400 border-rose-500/20", dot: "rose" } 
  };
  const c = configs[status] || configs.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${c.cls}`}>
      <PulseDot color={c.dot} />
      {status}
    </span>
  );
}

function PrescriptionStatusBadge({ status }) {
  const configs = { 
    issued: { cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" }, 
    partial: { cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" }, 
    completed: { cls: "bg-slate-500/10 text-slate-400 border-slate-500/20" } 
  };
  const c = configs[status] || { cls: "bg-slate-500/10 text-slate-400 border-slate-500/20" };
  return <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${c.cls}`}>{status}</span>;
}

function ActionButton({ onClick, label, icon, variant, isDarkMode }) {
  if (variant === 'primary') {
    return (
      <button 
        onClick={onClick} 
        className="w-full relative overflow-hidden flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 to-indigo-500 btn-hover-lift glow-indigo ripple transition-all duration-200"
      >
        <div className="animate-shimmer absolute inset-0 opacity-30"></div>
        {icon}{label}
      </button>
    );
  }
  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider btn-hover-lift ripple transition-all duration-200 border ${
        isDarkMode 
          ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20' 
          : 'bg-white border-gray-200 text-slate-600 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
      }`}
    >
      {icon}{label}
    </button>
  );
}

function PaginationFooter({ currentPage, totalPages, onPageChange, isDarkMode }) {
  if (totalPages <= 1) return null;
  return (
    <div className={`flex justify-between items-center px-6 py-4 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
      <span className={`font-mono text-[11px] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
        PAGE <span className="text-indigo-400">{currentPage}</span> / {totalPages}
      </span>
      <div className="flex gap-2">
        <button 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-all btn-hover-lift disabled:opacity-30 disabled:cursor-not-allowed ${
            isDarkMode ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white border-gray-200 text-slate-600 hover:bg-gray-50'
          }`}
        >
          <ChevronLeft className="w-3 h-3" /> PREV
        </button>
        <button 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-all btn-hover-lift disabled:opacity-30 disabled:cursor-not-allowed ${
            isDarkMode ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white border-gray-200 text-slate-600 hover:bg-gray-50'
          }`}
        >
          NEXT <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function MobileMenu({ children, isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} 
        className={`p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-slate-500 hover:bg-white/10 hover:text-slate-200' : 'text-slate-400 hover:bg-gray-100 hover:text-slate-600'}`}
      >
        <MoreHorizontal className="w-4 h-4"/>
      </button>
      {isOpen && (
        <div className={`absolute right-0 top-10 w-48 rounded-2xl shadow-2xl border z-[100] flex flex-col p-2 gap-0.5 animate-scale-in glass ${isDarkMode ? 'bg-[#1a2234] border-white/10' : 'bg-white border-gray-100 shadow-xl'}`}>
          {children}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. MODALS & CHARTS (ENHANCED)
// ==========================================

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, type = 'info', confirmText = "Confirm", isLoading = false, isDarkMode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className={`w-full max-w-sm rounded-3xl border overflow-hidden shadow-2xl animate-scale-in ${
        type === 'danger' 
          ? isDarkMode ? 'bg-[#1a1020] border-rose-500/20' : 'bg-white border-rose-100' 
          : isDarkMode ? 'bg-[#0f1829] border-indigo-500/20' : 'bg-white border-indigo-100'
      }`}>
        <div className="p-8 text-center">
          <div className={`relative w-20 h-20 mx-auto mb-6`}>
            <div className={`absolute inset-0 rounded-2xl opacity-30 animate-pulse ${type === 'danger' ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
            <div className={`relative w-full h-full rounded-2xl flex items-center justify-center ${
              type === 'danger' 
                ? 'bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-500/30' 
                : 'bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/30'
            }`}>
              {type === 'danger' ? <AlertTriangle className="w-8 h-8 text-white" /> : <CheckCircle2 className="w-8 h-8 text-white" />}
            </div>
          </div>
          <h3 className={`font-display text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
          <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{message}</p>
        </div>
        <div className={`p-5 flex gap-3 border-t ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
          <button onClick={onClose} disabled={isLoading} className={`flex-1 py-3 text-sm font-bold rounded-xl border transition-all btn-hover-lift disabled:opacity-50 ${isDarkMode ? 'text-slate-300 border-white/10 hover:bg-white/5' : 'text-slate-600 border-gray-200 hover:bg-white'}`}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isLoading} className={`flex-1 flex justify-center items-center py-3 text-sm font-bold text-white rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 btn-hover-lift ${
            type === 'danger' ? 'bg-gradient-to-r from-rose-500 to-pink-600 shadow-rose-500/30' : 'bg-gradient-to-r from-indigo-600 to-blue-600 shadow-indigo-500/30'
          }`}>
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function PasswordModal({ onClose, currentCreds, onUpdate, isDarkMode, onNotify }) {
  const [p, setP] = useState({ cur: '', new: '', conf: '' });
  const [show, setShow] = useState({ cur: false, new: false, conf: false });
  
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className={`p-8 rounded-3xl w-full max-w-sm shadow-2xl border animate-scale-in ${isDarkMode ? 'bg-[#0f1829] border-white/10' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <Lock className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className={`font-display font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Change Password</h3>
        </div>
        <div className="space-y-3">
          {['cur', 'new', 'conf'].map((field, i) => (
            <div key={field} className="relative">
              <label className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {field === 'cur' ? 'Current Password' : field === 'new' ? 'New Password' : 'Confirm Password'}
              </label>
              <div className="relative">
                <input 
                  type={show[field] ? "text" : "password"} 
                  placeholder="••••••••" 
                  className={`w-full border pr-10 p-3 rounded-xl text-sm font-mono transition-all outline-none focus:ring-2 focus:ring-indigo-500/30 ${isDarkMode ? 'border-white/10 bg-black/20 text-white focus:border-indigo-500/50' : 'border-gray-200 bg-gray-50 text-slate-900 focus:border-indigo-400'}`} 
                  value={p[field]} 
                  onChange={e => setP({...p, [field]: e.target.value})} 
                />
                <button type="button" onClick={() => setShow(s => ({...s, [field]: !s[field]}))} className={`absolute right-3 top-3 ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}>
                  {show[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all btn-hover-lift border ${isDarkMode ? 'text-slate-300 border-white/10 hover:bg-white/5' : 'text-slate-600 border-gray-200 hover:bg-gray-50'}`}>Cancel</button>
          <button 
            onClick={() => { 
              if(p.cur !== currentCreds.password) return onNotify('Wrong current password', 'error'); 
              if(p.new !== p.conf) return onNotify('Passwords do not match', 'error'); 
              if(p.new.length < 6) return onNotify('Password too short', 'error');
              onUpdate(p.new); 
            }} 
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 btn-hover-lift transition-all"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

function BroadcastModal({ onClose, onSend, isDarkMode }) {
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('normal');
  const [target, setTarget] = useState('all');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setIsSending(true);
    await new Promise(r => setTimeout(r, 800));
    onSend(message, priority, target);
    setIsSending(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className={`w-full max-w-md rounded-3xl shadow-2xl border animate-scale-in overflow-hidden ${isDarkMode ? 'bg-[#0f1829] border-white/10' : 'bg-white border-gray-200'}`}>
        <div className={`p-6 border-b ${isDarkMode ? 'border-white/5 bg-gradient-to-r from-indigo-900/20 to-transparent' : 'border-gray-100 bg-gradient-to-r from-indigo-50 to-transparent'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <Megaphone className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className={`font-display font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>System Broadcast</h3>
                <p className="text-xs text-slate-500">Send alerts to your network</p>
              </div>
            </div>
            <button onClick={onClose} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-gray-100 text-slate-500'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <label className={`text-[10px] font-bold uppercase tracking-widest mb-2 block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Message</label>
            <textarea 
              autoFocus rows="3"
              className={`w-full p-4 rounded-xl border text-sm outline-none resize-none transition-all focus:ring-2 focus:ring-indigo-500/30 ${isDarkMode ? 'bg-black/20 border-white/10 text-white focus:border-indigo-500/50 placeholder-slate-600' : 'bg-gray-50 border-gray-200 text-slate-900 focus:border-indigo-400'}`}
              placeholder="e.g., Scheduled maintenance Sunday at 12 PM..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            ></textarea>
            <p className={`text-[10px] mt-1 text-right ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>{message.length}/500</p>
          </div>
          
          <div>
            <label className={`text-[10px] font-bold uppercase tracking-widest mb-2 block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Target</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'All Network', icon: <Globe className="w-4 h-4" />, color: 'indigo' },
                { id: 'doctors', label: 'Doctors Only', icon: <Users className="w-4 h-4" />, color: 'blue' },
                { id: 'kiosks', label: 'Kiosks Only', icon: <Server className="w-4 h-4" />, color: 'emerald' },
              ].map(t => (
                <button 
                  key={t.id} onClick={() => setTarget(t.id)}
                  className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all btn-hover-lift ${
                    target === t.id 
                      ? t.color === 'indigo' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20'
                      : t.color === 'blue' ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
                      : 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20'
                      : isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-gray-200 text-slate-600 hover:bg-gray-50'
                  }`}
                >
                  {t.icon}
                  <span className="text-[10px] font-bold uppercase tracking-wide mt-1">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`text-[10px] font-bold uppercase tracking-widest mb-2 block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Priority</label>
            <div className="flex gap-2">
              <button onClick={() => setPriority('normal')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all btn-hover-lift ${priority === 'normal' ? 'bg-slate-600 text-white border-slate-600' : isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-gray-200 text-slate-600 hover:bg-gray-50'}`}>
                Normal
              </button>
              <button onClick={() => setPriority('high')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all btn-hover-lift ${priority === 'high' ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white border-rose-500 shadow-lg shadow-rose-500/20' : isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-gray-200 text-slate-600 hover:bg-gray-50'}`}>
                🔴 High Priority
              </button>
            </div>
          </div>
        </div>

        <div className={`px-6 pb-6 flex justify-end gap-3`}>
          <button onClick={onClose} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all btn-hover-lift border ${isDarkMode ? 'text-slate-300 border-white/10 hover:bg-white/5' : 'text-slate-600 border-gray-200 hover:bg-gray-50'}`}>Cancel</button>
          <button 
            onClick={handleSend}
            disabled={!message.trim() || isSending}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 btn-hover-lift transition-all"
          >
            {isSending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            {isSending ? 'Sending...' : 'Broadcast'}
          </button>
        </div>
      </div>
    </div>
  );
}

function TopPrescribedChart({ transactions, isDarkMode }) {
  const freqMap = {};
  if (transactions?.length > 0) {
    transactions.forEach(tx => {
      (tx.items || []).forEach(item => {
        const name = item.name || item.medicine || "Unknown";
        const qty = Number(item.qty || item.quantity || 1);
        freqMap[name] = (freqMap[name] || 0) + qty;
      });
    });
  }

  const sorted = Object.entries(freqMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxVal = Math.max(...sorted.map(s => s[1]), 1);
  const colors = ['from-indigo-500 to-violet-500', 'from-blue-500 to-cyan-400', 'from-emerald-500 to-teal-400', 'from-amber-500 to-orange-400', 'from-rose-500 to-pink-400'];

  return (
    <div className="space-y-5">
      {sorted.map(([name, count], i) => (
        <div key={i}>
          <div className="flex justify-between text-xs mb-2">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${colors[i]} inline-block`}></span>
              <span className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{name}</span>
            </div>
            <span className="font-mono font-bold text-indigo-400">{count}</span>
          </div>
          <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
            <div 
              className={`h-full bg-gradient-to-r ${colors[i]} rounded-full progress-bar shadow-sm`}
              style={{ width: `${(count / maxVal) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
      {sorted.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 opacity-40">
          <BarChart3 className="w-10 h-10 text-slate-500 mb-2" />
          <p className="text-sm text-slate-500">No prescription data yet</p>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. SUB-VIEW COMPONENTS (ENHANCED)
// ==========================================

function TableContainer({ children, isDarkMode, className = '' }) {
  // Removed overflow-hidden from this wrapper to prevent mobile dropdown clipping!
  return (
    <div className={`rounded-2xl border animate-slide-up ${isDarkMode ? 'bg-[#0d1424] border-white/5' : 'bg-white border-gray-100 shadow-sm'} ${className}`}>
      {children}
    </div>
  );
}

function TableHeader({ isDarkMode, children }) {
  return (
    <thead className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'bg-white/3 text-slate-500' : 'bg-gray-50 text-slate-400'}`}>
      {children}
    </thead>
  );
}

function InventoryView({ medicines, db, appId, isDarkMode, onNotify }) {
  const [newItem, setNewItem] = useState({ name: '', generic: '', stock: 0, price: 0 });
  const [isAdding, setIsAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;
  
  const filtered = medicines.filter(m => 
    (m.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (m.generic?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'medicines'), newItem);
      setIsAdding(false);
      setNewItem({ name: '', generic: '', stock: 0, price: 0 });
      onNotify("Medicine added to Master Database");
    } catch (err) {
      onNotify(err.message, 'error');
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'medicines', deleteId));
      onNotify("Medicine removed from database");
    } catch (err) { onNotify(err.message, 'error'); }
    setDeleteId(null);
  };

  return (
    <>
      <ConfirmationModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} title="Remove Medicine?" message="This medicine will be removed from the Master Database across all doctors." confirmText="Remove" type="danger" isDarkMode={isDarkMode} />
      
      <TableContainer isDarkMode={isDarkMode} className="max-w-7xl mx-auto">
        <div className={`p-5 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <div>
            <h3 className={`font-display font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Master Medicine Database</h3>
            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{medicines.length} medicines · Updates push to all doctors</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className={`w-full pl-8 pr-3 py-2 rounded-xl text-xs border outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder-slate-600 focus:border-indigo-500/50' : 'bg-gray-50 border-gray-200 text-slate-700 placeholder-slate-400'}`} />
            </div>
            <button 
              onClick={() => setIsAdding(!isAdding)} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold btn-hover-lift transition-all ${isAdding ? (isDarkMode ? 'bg-white/10 text-slate-300 border border-white/10' : 'bg-gray-100 text-slate-600 border border-gray-200') : 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20'}`}
            >
              {isAdding ? <><X className="w-3.5 h-3.5" /> Cancel</> : <>+ Add</>}
            </button>
          </div>
        </div>

        {isAdding && (
          <form onSubmit={handleAdd} className={`p-5 border-b grid grid-cols-2 md:grid-cols-5 gap-3 animate-slide-up ${isDarkMode ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-indigo-50/50 border-indigo-100'}`}>
            {['Brand Name', 'Generic Name'].map((placeholder, i) => (
              <input key={i} placeholder={placeholder} required
                className={`p-3 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium ${isDarkMode ? 'bg-black/20 border-white/10 text-white placeholder-slate-600' : 'bg-white border-gray-200 text-slate-900'}`}
                value={i === 0 ? newItem.name : newItem.generic}
                onChange={e => setNewItem({...newItem, [i === 0 ? 'name' : 'generic']: e.target.value})} />
            ))}
            <input type="number" placeholder="Stock Qty" required
              className={`p-3 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-mono ${isDarkMode ? 'bg-black/20 border-white/10 text-white placeholder-slate-600' : 'bg-white border-gray-200 text-slate-900'}`}
              value={newItem.stock} onChange={e => setNewItem({...newItem, stock: parseInt(e.target.value)})} />
            <input type="number" placeholder="Price (PHP)" required
              className={`p-3 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-mono ${isDarkMode ? 'bg-black/20 border-white/10 text-white placeholder-slate-600' : 'bg-white border-gray-200 text-slate-900'}`}
              value={newItem.price} onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value)})} />
            <button type="submit" className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-xl p-3 text-xs hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/20 btn-hover-lift">Save to DB</button>
          </form>
        )}

        {/* Mobile */}
        <div className="md:hidden divide-y divide-white/5">
          {currentData.length === 0 ? (
            <div className="p-10 text-center">
              <Package className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500 italic">No medicines found</p>
            </div>
          ) : currentData.map(m => (
            <div key={m.id} className={`p-4 relative flex flex-col gap-2 transition-colors ${isDarkMode ? 'hover:bg-white/3' : 'hover:bg-gray-50'}`}>
              <div className="absolute top-4 right-4 z-20">
                <MobileMenu isDarkMode={isDarkMode}>
                  <button onClick={() => setDeleteId(m.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl">
                    <Trash2 className="w-3.5 h-3.5"/> Remove
                  </button>
                </MobileMenu>
              </div>
              <div>
                <p className={`font-bold text-sm pr-10 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{m.name}</p>
                <p className="text-xs text-slate-500 italic">{m.generic}</p>
              </div>
              <div className="flex gap-4">
                <div><p className="text-[10px] text-slate-500 uppercase font-bold">Stock</p><p className={`text-xs font-mono font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{m.stock}</p></div>
                <div><p className="text-[10px] text-slate-500 uppercase font-bold">Price</p><p className="text-xs font-bold text-emerald-400">₱{m.price}</p></div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto rounded-b-2xl">
          <table className="w-full text-left text-sm">
            <TableHeader isDarkMode={isDarkMode}>
              <tr><th className="px-6 py-3.5">Medicine</th><th className="px-6 py-3.5">Generic</th><th className="px-6 py-3.5">Stock</th><th className="px-6 py-3.5">Price</th><th className="px-6 py-3.5 text-right">Action</th></tr>
            </TableHeader>
            <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-50'}`}>
              {currentData.map(m => (
                <tr key={m.id} className={`table-row-hover ${isDarkMode ? 'hover:bg-white/3' : 'hover:bg-gray-50'}`}>
                  <td className={`px-6 py-4 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{m.name}</td>
                  <td className={`px-6 py-4 text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{m.generic}</td>
                  <td className="px-6 py-4"><span className={`font-mono text-xs px-2.5 py-1 rounded-lg ${isDarkMode ? 'bg-white/5 text-slate-300' : 'bg-gray-100 text-slate-600'}`}>{m.stock}</span></td>
                  <td className="px-6 py-4 font-bold font-mono text-emerald-400">₱{m.price}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setDeleteId(m.id)} className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all btn-hover-lift">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} isDarkMode={isDarkMode} />
      </TableContainer>
    </>
  );
}

function SupportView({ tickets, db, appId, isDarkMode, onNotify }) {
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [hiddenTickets, setHiddenTickets] = useState([]);
  const itemsPerPage = 10;

  const handleStatusUpdate = async (ticket, newStatus) => {
    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'support_tickets', ticket.id), { ...ticket, status: newStatus }, { merge: true });
      onNotify(`Ticket marked as ${newStatus.replace('_', ' ')}`);
    } catch (e) { onNotify("Failed to update status", 'error'); }
  };

  const confirmDelete = async () => {
    setHiddenTickets(prev => [...prev, deleteId]);
    try { await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'support_tickets', deleteId)); } catch (e) {}
    setDeleteId(null);
    onNotify("Ticket deleted");
  };

  const filteredTickets = tickets.filter(t => !hiddenTickets.includes(t.id)).filter(t => filter === 'all' ? true : t.status === filter);
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const currentData = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const filterTabs = ['all', 'open', 'in_progress', 'resolved'];
  const counts = { all: tickets.length, open: tickets.filter(t => t.status === 'open').length, in_progress: tickets.filter(t => t.status === 'in_progress').length, resolved: tickets.filter(t => t.status === 'resolved').length };

  return (
    <>
      <ConfirmationModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} title="Delete Ticket?" message="This support ticket will be permanently deleted." confirmText="Delete" type="danger" isDarkMode={isDarkMode} />
      
      <TableContainer isDarkMode={isDarkMode} className="max-w-7xl mx-auto">
        <div className={`p-5 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className={`font-display font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Support Ticketing</h3>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Manage doctor issues and alerts</p>
            </div>
            <div className={`flex p-1 rounded-xl gap-1 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
              {filterTabs.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all flex items-center gap-1.5 ${
                    filter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {f.replace('_', ' ')}
                  {counts[f] > 0 && <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-white/20' : isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}>{counts[f]}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-white/5">
          {currentData.length === 0 ? (
            <div className="p-10 text-center">
              <LifeBuoy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500 italic">No tickets found</p>
            </div>
          ) : currentData.map(t => (
            <div key={t.id} className={`p-4 md:p-5 flex flex-col md:flex-row justify-between items-start gap-4 transition-colors ${
              isDarkMode ? 'hover:bg-white/3' : 'hover:bg-gray-50'
            } ${t.priority === 'high' ? (isDarkMode ? 'border-l-2 border-rose-500' : 'border-l-2 border-rose-400 bg-rose-50/50') : ''}`}>
              <div className="flex gap-4 items-start w-full relative">
                <div className="absolute top-0 right-0 md:hidden z-20">
                  <MobileMenu isDarkMode={isDarkMode}>
                    {t.status === 'open' && <button onClick={() => handleStatusUpdate(t, 'in_progress')} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-indigo-400 hover:bg-indigo-500/10 rounded-xl">In Progress</button>}
                    {t.status !== 'resolved' && <button onClick={() => handleStatusUpdate(t, 'resolved')} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-emerald-400 hover:bg-emerald-500/10 rounded-xl">Resolve</button>}
                    <button onClick={() => setDeleteId(t.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-rose-400 hover:bg-rose-500/10 rounded-xl"><Trash2 className="w-3.5 h-3.5"/> Delete</button>
                  </MobileMenu>
                </div>
                <div className={`p-3 rounded-xl flex-shrink-0 ${t.priority === 'high' ? 'bg-rose-500/15 text-rose-400' : isDarkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-500'}`}>
                  {t.type === 'kiosk_alert' ? <AlertCircle className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                </div>
                <div className="flex-1 pr-10 md:pr-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.subject}</h4>
                    {t.priority === 'high' && <span className="text-[9px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full">HIGH</span>}
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      t.status === 'open' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                      : t.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>{t.status.replace('_', ' ')}</span>
                  </div>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.message}</p>
                  <p className={`text-[10px] mt-2 font-mono ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                    {t.sender} · {t.timestamp?.seconds ? new Date(t.timestamp.seconds * 1000).toLocaleString() : 'Just now'}
                  </p>
                </div>
              </div>
              
              <div className="hidden md:flex gap-2 self-center flex-shrink-0">
                {t.status === 'open' && (
                  <button onClick={() => handleStatusUpdate(t, 'in_progress')} className="px-3 py-1.5 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 rounded-lg text-xs font-bold transition-all btn-hover-lift">
                    In Progress
                  </button>
                )}
                {t.status !== 'resolved' && (
                  <button onClick={() => handleStatusUpdate(t, 'resolved')} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-emerald-500/20 btn-hover-lift">
                    <CheckSquare className="w-3.5 h-3.5"/> Resolve
                  </button>
                )}
                <button onClick={() => setDeleteId(t.id)} className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all btn-hover-lift">
                  <Trash2 className="w-4 h-4"/>
                </button>
              </div>
            </div>
          ))}
        </div>
        <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} isDarkMode={isDarkMode} />
      </TableContainer>
    </>
  );
}

function DoctorsView({ doctors, filter, setFilter, onRefresh, onUpdateStatus, onUpdatePassword, onDelete, loading, isDarkMode }) {
  const [viewDoc, setViewDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredDocs = doctors.filter(doc => 
    (doc.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (doc.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (doc.license?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const currentData = filteredDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const filterBtns = ['pending', 'active', 'rejected', 'all'];

  return (
    <>
      <TableContainer isDarkMode={isDarkMode} className="max-w-7xl mx-auto">
        <div className={`p-5 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className={`font-display font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Medical Practitioners</h3>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{doctors.length} registered physicians</p>
            </div>
            <button onClick={onRefresh} className={`p-2 rounded-lg transition-all btn-hover-lift ${isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-emerald-400' : 'text-slate-400 hover:bg-gray-100 hover:text-emerald-600'}`}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}/>
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className={`flex p-1 rounded-xl gap-1 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
              {filterBtns.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all whitespace-nowrap ${
                    filter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >{f}</button>
              ))}
            </div>
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input type="text" placeholder="Search doctors..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className={`w-full pl-8 pr-3 py-2 rounded-xl text-xs border outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder-slate-600' : 'bg-white border-gray-200 text-slate-700 placeholder-slate-400'}`} />
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden divide-y divide-white/5">
          {currentData.length === 0 ? (
            <div className="p-10 text-center"><Users className="w-8 h-8 text-slate-600 mx-auto mb-2" /><p className="text-xs text-slate-500 italic">No doctors found</p></div>
          ) : currentData.map(doc => (
            <div key={doc.id} className={`p-4 relative flex flex-col gap-3 transition-colors ${isDarkMode ? 'hover:bg-white/3' : 'hover:bg-gray-50'}`}>
              <div className="absolute top-4 right-4 z-20">
                <MobileMenu isDarkMode={isDarkMode}>
                  <button onClick={() => { setViewDoc(doc); setShowPassword(false); setIsEditingPassword(false); }} className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left rounded-xl ${isDarkMode ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-gray-100'}`}><Eye className="w-3.5 h-3.5"/> View</button>
                  {doc.status === 'pending' && (<><button onClick={() => onUpdateStatus(doc.id, 'active')} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-emerald-400 hover:bg-emerald-500/10 rounded-xl"><CheckCircle className="w-3.5 h-3.5"/> Approve</button><button onClick={() => onUpdateStatus(doc.id, 'rejected')} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-rose-400 hover:bg-rose-500/10 rounded-xl"><XCircle className="w-3.5 h-3.5"/> Reject</button></>)}
                  {doc.status === 'active' && <button onClick={() => onUpdateStatus(doc.id, 'rejected')} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-rose-400 hover:bg-rose-500/10 rounded-xl"><XCircle className="w-3.5 h-3.5"/> Revoke</button>}
                  {doc.status === 'rejected' && <button onClick={() => onUpdateStatus(doc.id, 'active')} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-emerald-400 hover:bg-emerald-500/10 rounded-xl"><CheckCircle className="w-3.5 h-3.5"/> Restore</button>}
                  <button onClick={() => onDelete(doc.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-rose-400 hover:bg-rose-500/10 rounded-xl"><Trash2 className="w-3.5 h-3.5"/> Delete</button>
                </MobileMenu>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm ${isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>{doc.name?.charAt(0) || '?'}</div>
                <div>
                  <p className={`font-bold text-sm pr-10 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{doc.name}</p>
                  <p className="text-xs text-slate-500">{doc.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={doc.status} />
                <span className={`font-mono text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{doc.license}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto rounded-b-2xl">
          <table className="w-full text-left">
            <TableHeader isDarkMode={isDarkMode}>
              <tr><th className="px-6 py-4">Physician</th><th className="px-6 py-4">License</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr>
            </TableHeader>
            <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-50'}`}>
              {currentData.length === 0 ? (
                <tr><td colSpan="4" className="p-10 text-center text-xs text-slate-500 italic">No doctors found</td></tr>
              ) : currentData.map(doc => (
                <tr key={doc.id} className={`table-row-hover ${isDarkMode ? 'hover:bg-white/3' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-display font-bold text-xs ${isDarkMode ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>{doc.name?.charAt(0) || '?'}</div>
                      <div>
                        <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{doc.name}</p>
                        <p className={`text-[11px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{doc.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-mono text-[11px] px-2 py-1 rounded-lg ${isDarkMode ? 'bg-white/5 text-slate-400' : 'bg-gray-100 text-slate-600'}`}>{doc.license}</span>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={doc.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => { setViewDoc(doc); setShowPassword(false); setIsEditingPassword(false); }} className={`p-2 rounded-lg transition-all btn-hover-lift ${isDarkMode ? 'text-slate-500 hover:text-blue-400 hover:bg-blue-500/10' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`} title="View"><Eye className="w-4 h-4"/></button>
                      {doc.status === 'pending' && (<><button onClick={() => onUpdateStatus(doc.id, 'active')} className="p-2 text-emerald-400 bg-emerald-500/10 rounded-lg hover:bg-emerald-500/20 btn-hover-lift"><CheckCircle className="w-4 h-4"/></button><button onClick={() => onUpdateStatus(doc.id, 'rejected')} className="p-2 text-rose-400 bg-rose-500/10 rounded-lg hover:bg-rose-500/20 btn-hover-lift"><XCircle className="w-4 h-4"/></button></>)}
                      {doc.status === 'active' && <button onClick={() => onUpdateStatus(doc.id, 'rejected')} className="text-[10px] font-bold text-rose-400 border border-rose-500/30 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 btn-hover-lift">Revoke</button>}
                      {doc.status === 'rejected' && <button onClick={() => onUpdateStatus(doc.id, 'active')} className="text-[10px] font-bold text-emerald-400 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg hover:bg-emerald-500/10 btn-hover-lift">Restore</button>}
                      <button onClick={() => onDelete(doc.id)} className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all btn-hover-lift ml-1"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} isDarkMode={isDarkMode} />
      </TableContainer>
      
      {viewDoc && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className={`rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border animate-scale-in ${isDarkMode ? 'bg-[#0f1829] border-white/10' : 'bg-white border-gray-200'}`}>
            <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-white/10 bg-gradient-to-r from-indigo-900/20 to-transparent' : 'border-gray-100 bg-gradient-to-r from-indigo-50 to-transparent'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold ${isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>{viewDoc.name?.charAt(0) || '?'}</div>
                <div>
                  <h3 className={`font-display font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{viewDoc.name}</h3>
                  <p className="text-xs text-slate-500">Verification Details</p>
                </div>
              </div>
              <button onClick={() => setViewDoc(null)} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-gray-100 text-slate-500'}`}><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className={`p-4 rounded-2xl border text-center ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                <FileBadge className="w-10 h-10 text-slate-500 mx-auto mb-2"/>
                <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>PRC License ID</p>
                <p className="text-xs text-slate-500">No image uploaded</p>
              </div>
              
              {[
                { label: 'Account Credentials', fields: [
                  { label: 'Full Name', value: viewDoc.name, span: 2 },
                  { label: 'Email', value: viewDoc.email, mono: true, span: 2 },
                  { label: 'Password', isPassword: true },
                ]},
                { label: 'Clinic Information', fields: [
                  { label: 'Clinic Name', value: viewDoc.clinicDetails?.name || 'N/A', span: 2 },
                  { label: 'Address', value: viewDoc.clinicDetails?.address || 'N/A', span: 2 },
                  { label: 'Contact', value: viewDoc.clinicDetails?.contactNumber || 'N/A' },
                  { label: 'License No', value: viewDoc.license, mono: true },
                  { label: 'PTR No', value: viewDoc.clinicDetails?.ptr || 'N/A', mono: true },
                  { label: 'S2 License', value: viewDoc.clinicDetails?.s2 || 'N/A', mono: true },
                ]},
              ].map(section => (
                <div key={section.label}>
                  <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{section.label}</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {section.fields.map((f, i) => (
                      <div key={i} className={f.span === 2 ? 'col-span-2' : ''}>
                        <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">{f.label}</p>
                        {f.isPassword ? (
                          isEditingPassword ? (
                            <div className="flex items-center gap-2">
                              <input type="text" className={`flex-1 p-2 rounded-lg border text-xs outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono ${isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-white border-gray-200 text-slate-900'}`} value={newPasswordVal} onChange={e => setNewPasswordVal(e.target.value)} placeholder="New password" />
                              <button onClick={async () => { if (!newPasswordVal.trim()) return; await onUpdatePassword(viewDoc.id, newPasswordVal); setIsEditingPassword(false); setViewDoc(prev => ({...prev, password: newPasswordVal})); }} className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg btn-hover-lift"><CheckSquare className="w-4 h-4"/></button>
                              <button onClick={() => setIsEditingPassword(false)} className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg btn-hover-lift"><X className="w-4 h-4"/></button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <p className={`font-mono text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{showPassword ? viewDoc.password : '••••••••'}</p>
                              <div className="flex gap-2">
                                <button onClick={() => { setIsEditingPassword(true); setNewPasswordVal(viewDoc.password); }} className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300">Edit</button>
                                <button onClick={() => setShowPassword(!showPassword)} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300">{showPassword ? 'Hide' : 'Show'}</button>
                              </div>
                            </div>
                          )
                        ) : (
                          <p className={`${f.mono ? 'font-mono' : ''} ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{f.value}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className={`p-4 border-t flex justify-end ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
              <button onClick={() => setViewDoc(null)} className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20 btn-hover-lift">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MachinesView({ machines, onPing, onRunDiagnostics, onReboot, onLock, onDelete, isDarkMode }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(machines.length / itemsPerPage);
  const currentData = machines.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const statusConfig = {
    online: { cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', icon: <Wifi className="w-3 h-3"/>, dot: 'emerald' },
    rebooting: { cls: 'bg-amber-500/15 text-amber-400 border-amber-500/20', icon: <RefreshCw className="w-3 h-3 animate-spin"/>, dot: 'amber' },
    locked: { cls: 'bg-slate-500/15 text-slate-400 border-slate-500/20', icon: <Lock className="w-3 h-3"/>, dot: 'slate' },
    offline: { cls: 'bg-rose-500/15 text-rose-400 border-rose-500/20', icon: <WifiOff className="w-3 h-3"/>, dot: 'rose' },
  };

  return (
    <TableContainer isDarkMode={isDarkMode} className="max-w-7xl mx-auto">
      <div className={`p-5 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
        <h3 className={`font-display font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Kiosk Network</h3>
        <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{machines.length} machines registered · {machines.filter(m => m.status === 'online').length} online</p>
      </div>
      
      {/* Mobile */}
      <div className="md:hidden divide-y divide-white/5">
        {currentData.length === 0 ? (
          <div className="p-10 text-center"><Server className="w-8 h-8 text-slate-600 mx-auto mb-2" /><p className="text-xs text-slate-500 italic">No kiosks connected</p></div>
        ) : currentData.map(m => {
          const sc = statusConfig[m.status] || statusConfig.offline;
          return (
            <div key={m.id} className={`p-4 relative flex flex-col gap-3 transition-colors ${isDarkMode ? 'hover:bg-white/3' : 'hover:bg-gray-50'}`}>
              <div className="absolute top-4 right-4 z-20">
                <MobileMenu isDarkMode={isDarkMode}>
                  <button onClick={() => onPing(m.id)} className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left rounded-xl ${isDarkMode ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-gray-100'}`}><Activity className="w-3.5 h-3.5"/> Ping</button>
                  <button onClick={() => onRunDiagnostics(m)} className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left rounded-xl ${isDarkMode ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-gray-100'}`}><Wrench className="w-3.5 h-3.5"/> Diagnostics</button>
                  <button onClick={() => onReboot(m.id)} className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left rounded-xl ${isDarkMode ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-gray-100'}`}><Power className="w-3.5 h-3.5"/> Reboot</button>
                  <button onClick={() => onLock(m.id, m.status)} className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left rounded-xl ${isDarkMode ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-gray-100'}`}>{m.status === 'locked' ? <Unlock className="w-3.5 h-3.5"/> : <Lock className="w-3.5 h-3.5"/>} {m.status === 'locked' ? 'Unlock' : 'Lock'}</button>
                  <button onClick={() => onDelete(m.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-rose-400 hover:bg-rose-500/10 rounded-xl"><Trash2 className="w-3.5 h-3.5"/> Remove</button>
                </MobileMenu>
              </div>
              <div>
                <p className={`font-bold text-sm font-mono pr-10 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{m.id}</p>
                <p className="text-xs text-slate-500 mt-0.5">{m.location}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border w-fit ${sc.cls}`}>
                {sc.icon} {m.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto rounded-b-2xl">
        <table className="w-full text-left text-sm">
          <TableHeader isDarkMode={isDarkMode}>
            <tr><th className="px-6 py-4">Kiosk ID</th><th className="px-6 py-4">Location</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Controls</th></tr>
          </TableHeader>
          <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-50'}`}>
            {currentData.length === 0 ? (
              <tr><td colSpan="4" className="p-10 text-center text-xs text-slate-500 italic">No kiosks connected</td></tr>
            ) : currentData.map(m => {
              const sc = statusConfig[m.status] || statusConfig.offline;
              return (
                <tr key={m.id} className={`table-row-hover ${isDarkMode ? 'hover:bg-white/3' : 'hover:bg-gray-50'}`}>
                  <td className={`px-6 py-4 font-bold font-mono text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{m.id}</td>
                  <td className={`px-6 py-4 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{m.location}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${sc.cls}`}>
                      {sc.icon} {m.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      {[
                        { action: () => onPing(m.id), icon: <Activity size={14}/>, title: 'Ping' },
                        { action: () => onRunDiagnostics(m), icon: <Wrench size={14}/>, title: 'Diagnostics' },
                        { action: () => onReboot(m.id), icon: <Power size={14}/>, title: 'Reboot' },
                        { action: () => onLock(m.id, m.status), icon: m.status === 'locked' ? <Unlock size={14}/> : <Lock size={14}/>, title: m.status === 'locked' ? 'Unlock' : 'Lock' },
                      ].map((btn, i) => (
                        <button key={i} onClick={btn.action} title={btn.title}
                          className={`p-2 rounded-lg transition-all btn-hover-lift ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-slate-500 hover:text-slate-700'}`}>
                          {btn.icon}
                        </button>
                      ))}
                      <button onClick={() => onDelete(m.id)} className="p-2 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg text-rose-400 btn-hover-lift ml-1"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} isDarkMode={isDarkMode} />
    </TableContainer>
  );
}

function TransactionsView({ transactions, onHide, onClearView, isDarkMode }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const currentData = transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <TableContainer isDarkMode={isDarkMode} className="max-w-7xl mx-auto">
      <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
        <div>
          <h3 className={`font-display font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Prescription Registry</h3>
          <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{transactions.length} records in view</p>
        </div>
        <button onClick={onClearView} className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-xl text-xs font-bold uppercase tracking-wide transition-all btn-hover-lift border border-rose-500/20">
          <Trash2 className="w-3.5 h-3.5"/> Clear View
        </button>
      </div>
      
      <div className="md:hidden divide-y divide-white/5">
        {currentData.length === 0 ? (
          <div className="p-10 text-center"><FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" /><p className="text-xs text-slate-500 italic">No transactions</p></div>
        ) : currentData.map(tx => (
          <div key={tx.id} className={`p-4 relative flex flex-col gap-2 transition-colors ${isDarkMode ? 'hover:bg-white/3' : 'hover:bg-gray-50'}`}>
            <div className="absolute top-4 right-4 z-20">
              <MobileMenu isDarkMode={isDarkMode}><button onClick={() => onHide(tx.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-rose-400 hover:bg-rose-500/10 rounded-xl"><Trash2 className="w-3.5 h-3.5"/> Hide</button></MobileMenu>
            </div>
            <div><p className={`font-bold text-sm pr-10 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tx.doctorName}</p><p className="text-xs text-slate-500">{tx.patient?.name}</p><p className="text-[10px] font-mono text-slate-600 mt-1">{tx.id}</p></div>
            <div className="flex gap-3 items-center"><span className="font-bold text-emerald-400 font-mono">₱{tx.grandTotal?.toFixed(2)}</span><PrescriptionStatusBadge status={tx.status || 'issued'}/></div>
          </div>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto rounded-b-2xl">
        <table className="w-full text-left">
          <TableHeader isDarkMode={isDarkMode}>
            <tr><th className="px-6 py-4">Rx ID</th><th className="px-6 py-4">Doctor</th><th className="px-6 py-4">Patient</th><th className="px-6 py-4">Value</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-center">Action</th></tr>
          </TableHeader>
          <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-50'}`}>
            {currentData.length === 0 ? (
              <tr><td colSpan="6" className="p-10 text-center text-xs text-slate-500 italic">No transactions</td></tr>
            ) : currentData.map(tx => (
              <tr key={tx.id} className={`table-row-hover ${isDarkMode ? 'hover:bg-white/3' : 'hover:bg-gray-50'}`}>
                <td className={`px-6 py-4 font-mono text-[11px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{tx.id?.slice(0, 8)}...</td>
                <td className={`px-6 py-4 font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tx.doctorName}</td>
                <td className={`px-6 py-4 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{tx.patient?.name}</td>
                <td className="px-6 py-4 font-bold font-mono text-emerald-400">₱{tx.grandTotal?.toFixed(2)}</td>
                <td className="px-6 py-4"><PrescriptionStatusBadge status={tx.status || 'issued'}/></td>
                <td className="px-6 py-4 text-center"><button onClick={() => onHide(tx.id)} className={`p-2 rounded-lg transition-all btn-hover-lift ${isDarkMode ? 'text-slate-600 hover:text-rose-400 hover:bg-rose-900/20' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'}`}><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} isDarkMode={isDarkMode} />
    </TableContainer>
  );
}

function AuditView({ logs, onHide, onClearView, isDarkMode }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const currentData = logs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <TableContainer isDarkMode={isDarkMode} className="max-w-7xl mx-auto">
      <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
        <div>
          <h3 className={`font-display font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Security Audit Log</h3>
          <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{logs.length} system events</p>
        </div>
        <button onClick={onClearView} className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-xl text-xs font-bold uppercase tracking-wide transition-all btn-hover-lift border border-rose-500/20">
          <Trash2 className="w-3.5 h-3.5"/> Clear View
        </button>
      </div>
      
      <div className="md:hidden divide-y divide-white/5">
        {currentData.length === 0 ? (
          <div className="p-10 text-center"><ClipboardList className="w-8 h-8 text-slate-600 mx-auto mb-2" /><p className="text-xs text-slate-500 italic">No audit logs</p></div>
        ) : currentData.map((log, i) => (
          <div key={i} className={`p-4 relative flex flex-col gap-2 transition-colors ${isDarkMode ? 'hover:bg-white/3' : 'hover:bg-gray-50'}`}>
            <div className="absolute top-4 right-4 z-20">
              <MobileMenu isDarkMode={isDarkMode}><button onClick={() => onHide(log.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl"><Trash2 className="w-3.5 h-3.5"/> Hide</button></MobileMenu>
            </div>
            <p className={`font-bold text-sm pr-10 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{log.action}</p>
            <p className="text-xs text-slate-400">{log.details}</p>
            <p className="text-[10px] font-mono text-slate-600">{log.time} · {log.user}</p>
          </div>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto rounded-b-2xl">
        <table className="w-full text-left text-sm">
          <TableHeader isDarkMode={isDarkMode}>
            <tr><th className="px-6 py-4">Action</th><th className="px-6 py-4">Details</th><th className="px-6 py-4">User</th><th className="px-6 py-4 text-right">Timestamp</th><th className="px-6 py-4 text-center">Action</th></tr>
          </TableHeader>
          <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-50'}`}>
            {currentData.length === 0 ? (
              <tr><td colSpan="5" className="p-10 text-center text-xs text-slate-500 italic">No audit logs</td></tr>
            ) : currentData.map((log, i) => (
              <tr key={i} className={`table-row-hover ${isDarkMode ? 'hover:bg-white/3' : 'hover:bg-gray-50'}`}>
                <td className={`px-6 py-4 font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{log.action}</td>
                <td className={`px-6 py-4 text-xs max-w-xs truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{log.details}</td>
                <td className={`px-6 py-4 font-mono text-[11px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{log.user}</td>
                <td className={`px-6 py-4 text-right font-mono text-[11px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{log.time}</td>
                <td className="px-6 py-4 text-center"><button onClick={() => onHide(log.id)} className={`p-2 rounded-lg transition-all btn-hover-lift ${isDarkMode ? 'text-slate-600 hover:text-rose-400 hover:bg-rose-900/20' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'}`}><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} isDarkMode={isDarkMode} />
    </TableContainer>
  );
}

function SettingsView({ profile, setProfile, onSave, isEditing, setIsEditing, setShowPassword, isDarkMode, transactions, auditLogs, doctors, machines, medicines, supportTickets, onNotify }) {
  const [activeSettingTab, setActiveSettingTab] = useState('profile');

  const downloadCSV = (data, filename) => {
    if (!data?.length) return onNotify("No data to export", "error");
    const header = Object.keys(data[0]);
    const csv = [header.join(','), ...data.map(row => header.map(f => JSON.stringify(row[f] ?? '')).join(','))].join('\r\n');
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], {type:'text/csv'})), download: filename, hidden: true });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const handleFullBackup = () => {
    const backup = { timestamp: new Date().toISOString(), doctors, machines, transactions, auditLogs, medicines, supportTickets };
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], {type:'application/json'})), download: `medivend_backup_${Date.now()}.json`, hidden: true });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const settingTabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'data', label: 'Data', icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <div className={`w-full max-w-4xl mx-auto rounded-2xl border overflow-hidden flex flex-col md:flex-row animate-slide-up ${isDarkMode ? 'bg-[#0d1424] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
      <div className={`md:w-56 border-r p-4 flex-shrink-0 ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
        <p className={`font-display font-bold text-xs uppercase tracking-widest mb-4 px-3 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Settings</p>
        <nav className="space-y-1">
          {settingTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveSettingTab(tab.id)} 
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all btn-hover-lift ${
                activeSettingTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-gray-100'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="hidden md:block"></div>

      {/* Mobile tabs */}
      <div className={`md:hidden w-full border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex">
          {settingTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveSettingTab(tab.id)} className={`flex-1 px-3 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors ${activeSettingTab === tab.id ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 md:p-8">
        {activeSettingTab === 'profile' && (
          <div className="space-y-6 animate-slide-up">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-5 gap-3 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
              <div>
                <h4 className={`font-display font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Admin Profile</h4>
                <p className="text-xs text-slate-500 mt-0.5">Manage your account details</p>
              </div>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-xl hover:bg-indigo-500/20 btn-hover-lift">
                  <Edit2 className="w-3.5 h-3.5"/> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className={`px-3 py-2 text-xs font-bold rounded-xl border btn-hover-lift ${isDarkMode ? 'text-slate-400 border-white/10 hover:bg-white/5' : 'text-slate-600 border-gray-200 hover:bg-gray-100'}`}>Cancel</button>
                  <button onClick={onSave} className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20 btn-hover-lift">
                    <Save className="w-3.5 h-3.5"/> Save
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {[
                { label: 'Display Name', key: 'displayName', type: 'text' },
                { label: 'Username', key: 'username', type: 'text' },
                { label: 'Email Address', key: 'email', type: 'email' },
              ].map(field => (
                <div key={field.key}>
                  <label className={`block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2`}>{field.label}</label>
                  <input 
                    type={field.type} disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl outline-none text-sm transition-all ${isEditing ? 'focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50' : 'border-transparent cursor-default'} ${isDarkMode ? 'bg-white/5 text-slate-200 border-white/10' : 'bg-gray-50 text-slate-700 border-gray-200'} ${!isEditing ? (isDarkMode ? 'bg-transparent' : 'bg-transparent') : ''}`}
                    value={profile?.[field.key] || ''}
                    onChange={e => setProfile({...profile, [field.key]: e.target.value})}
                  />
                </div>
              ))}
            </div>
            <div className={`pt-5 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
              <button onClick={setShowPassword} className="flex items-center gap-2 text-xs text-indigo-400 font-bold hover:text-indigo-300 transition-colors btn-hover-lift">
                <Lock className="w-3.5 h-3.5"/> Change Password
              </button>
            </div>
          </div>
        )}

        {activeSettingTab === 'security' && (
          <div className="space-y-6 animate-slide-up">
            <div className={`border-b pb-5 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
              <h4 className={`font-display font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Security</h4>
              <p className="text-xs text-slate-500 mt-0.5">Manage access and authentication</p>
            </div>
            
            <div>
              <h5 className={`text-xs font-bold text-slate-500 uppercase tracking-widest mb-3`}>Recent Login Activity</h5>
              {profile?.recentLogins?.length > 0 ? (
                profile.recentLogins.map((session, i) => (
                  <div key={i} className={`flex justify-between items-center p-3 rounded-xl mb-2 border text-xs ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex items-center gap-2">
                      {i === 0 && <PulseDot color="emerald" />}
                      <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{session.device || 'Admin Device'} {i === 0 && '(Current)'}</span>
                    </div>
                    <span className="text-slate-500 font-mono">
                      {new Date(session.time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                ))
              ) : (
                <div className={`p-4 text-center rounded-xl border text-xs italic ${isDarkMode ? 'bg-white/5 border-white/5 text-slate-500' : 'bg-gray-50 border-gray-100 text-slate-400'}`}>
                  No recent login activity recorded.
                </div>
              )}
            </div>
          </div>
        )}

        {activeSettingTab === 'data' && (
          <div className="space-y-6 animate-slide-up">
            <div className={`border-b pb-5 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
              <h4 className={`font-display font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Data Management</h4>
              <p className="text-xs text-slate-500 mt-0.5">Export logs and manage system storage</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Export Rx Logs', icon: <Download className="w-6 h-6" />, action: () => downloadCSV(transactions, 'transactions.csv'), color: 'emerald' },
                { label: 'Export Audit', icon: <FileText className="w-6 h-6" />, action: () => downloadCSV(auditLogs, 'audit.csv'), color: 'blue' },
                { label: 'Clear Cache', icon: <Trash2 className="w-6 h-6" />, action: () => onNotify('Cache cleared'), color: 'rose', dashed: true },
                { label: 'Full Backup', icon: <Database className="w-6 h-6" />, action: handleFullBackup, color: 'indigo' },
              ].map((item, i) => (
                <button key={i} onClick={item.action}
                  className={`flex flex-col items-center justify-center p-5 border rounded-2xl transition-all group btn-hover-lift ${
                    item.dashed ? 'border-dashed' : ''
                  } ${isDarkMode ? `border-white/10 hover:bg-${item.color}-500/5 hover:border-${item.color}-500/20` : `border-gray-200 hover:bg-${item.color}-50 hover:border-${item.color}-200`}`}
                >
                  <div className={`text-slate-500 group-hover:text-${item.color}-500 transition-colors mb-2`}>{item.icon}</div>
                  <span className={`text-xs font-bold text-slate-400 group-hover:text-${item.color}-500 transition-colors text-center`}>{item.label}</span>
                </button>
              ))}
            </div>
            <div className={`p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl`}>
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-bold text-amber-400 flex items-center gap-2"><HardDrive className="w-4 h-4"/> Storage</p>
                <span className="text-xs font-mono text-amber-400">2.25 / 5 GB</span>
              </div>
              <div className="w-full bg-amber-500/20 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-full w-[45%] rounded-full progress-bar"></div>
              </div>
              <p className="text-[11px] text-amber-500/70 mt-2">45% of quota used</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 4. ADMIN LOGIN (PREMIUM REDESIGN)
// ==========================================
function AdminLogin({ onLogin, cloudProfile }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setTimeout(() => setStep(1), 100);
    setTimeout(() => setStep(2), 300);
    setTimeout(() => setStep(3), 500);
  }, []);

  useEffect(() => {
    let interval;
    if (isLocked && lockoutTimer > 0) {
      interval = setInterval(() => setLockoutTimer(p => p - 1), 1000);
    } else if (lockoutTimer === 0 && isLocked) {
      setIsLocked(false); setFailedAttempts(0); setError('');
    }
    return () => clearInterval(interval);
  }, [isLocked, lockoutTimer]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLocked) return;
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 900));
    const targetUser = cloudProfile?.username || 'admin';
    const targetPass = cloudProfile?.password || 'admin123';
    
    if (username === targetUser && password === targetPass) {
      try {
        const deviceName = /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'Mobile Device' : 'Desktop Session';
        const updatedLogins = [{ time: Date.now(), device: deviceName }, ...(cloudProfile?.recentLogins || [])].slice(0, 5);
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'admin_profile'), { recentLogins: updatedLogins }, { merge: true });
      } catch (err) {
        console.error("Failed to log session", err);
      }
      onLogin();
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts); setLoading(false);
      if (newAttempts >= 5) { setIsLocked(true); setLockoutTimer(30); setError("Account locked."); }
      else setError(`Invalid credentials. ${5 - newAttempts} attempts remaining.`);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#060b18] font-sans overflow-hidden relative">
      <GlobalStyles />
      
      {/* Animated grid background */}
      <div className="absolute inset-0 grid-bg opacity-50"></div>
      
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay:'1s'}}></div>
      
      {/* Left panel */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center p-6 relative z-10">
        <div 
          className="w-full max-w-md"
          style={{ 
            opacity: step >= 2 ? 1 : 0, 
            transform: step >= 2 ? 'none' : 'translateY(30px)',
            transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 rounded-3xl bg-indigo-500/20 blur-xl scale-150 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 ring-1 ring-white/10">
                <ShieldCheck className="w-9 h-9 text-white" />
              </div>
            </div>
            <h1 className="font-display font-black text-4xl text-white tracking-tight mb-2">MediVend</h1>
            <p className="text-slate-500 text-sm font-medium tracking-widest uppercase">Super Admin Portal</p>
          </div>

          {/* Form card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-white font-display font-bold text-xl mb-1">Sign In</h2>
              <p className="text-slate-500 text-xs">Authorized personnel only</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Username</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input 
                    required type="text"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all text-white text-sm placeholder-slate-600 font-medium"
                    placeholder="admin" value={username} onChange={e => setUsername(e.target.value)} disabled={isLocked}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input 
                    required type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all text-white text-sm placeholder-slate-600 font-mono"
                    placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} disabled={isLocked}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className={`flex items-center gap-2 p-3 rounded-xl text-xs font-medium border animate-slide-up ${
                  isLocked ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {isLocked ? `Locked. Retry in ${lockoutTimer}s` : error}
                </div>
              )}

              <button 
                type="submit" disabled={loading || isLocked}
                className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all btn-hover-lift flex justify-center items-center gap-2 text-sm"
              >
                <div className="animate-shimmer absolute inset-0 opacity-20"></div>
                {loading ? <><RefreshCw className="w-4 h-4 animate-spin"/> Authenticating...</> : isLocked ? <><Lock className="w-4 h-4"/> Locked</> : <><Shield className="w-4 h-4"/> Access Portal</>}
              </button>
            </form>
            
            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-center gap-2">
              <PulseDot color="emerald" />
              <span className="text-[11px] text-slate-600 font-mono">Secure Connection · TLS 1.3</span>
            </div>
          </div>
          
          <p className="text-center text-[11px] text-slate-700 mt-6 font-mono">MediVend v2.5 · Unauthorized access is prohibited</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden lg:flex w-1/2 bg-black/20 relative overflow-hidden items-center justify-center border-l border-white/5">
        <div className="absolute inset-0 hexagon-bg opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-blue-900/20"></div>
        
        <div 
          className="relative z-10 text-center max-w-sm px-8"
          style={{ 
            opacity: step >= 3 ? 1 : 0, 
            transform: step >= 3 ? 'none' : 'translateX(30px)',
            transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
          }}
        >
          {/* Radar animation */}
          <div className="relative w-40 h-40 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border border-indigo-500/20"></div>
            <div className="absolute inset-4 rounded-full border border-indigo-500/30"></div>
            <div className="absolute inset-8 rounded-full border border-indigo-500/40 bg-indigo-500/5"></div>
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div className="w-1/2 h-full origin-right animate-radar bg-gradient-to-r from-transparent to-indigo-500/20"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="w-10 h-10 text-indigo-400 animate-pulse" />
            </div>
            {[0, 1, 2].map(i => (
              <div key={i} className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50"
                style={{ top: `${25 + i*20}%`, left: `${20 + i*25}%`, animationDelay: `${i * 0.5}s` }}>
                <div className="w-full h-full rounded-full bg-emerald-400 animate-ping opacity-75"></div>
              </div>
            ))}
          </div>
          
          <h2 className="font-display font-black text-3xl text-white mb-3">All Systems Optimal</h2>
          <p className="text-slate-400 text-sm leading-relaxed">Real-time network monitoring active. All kiosks reporting normal status.</p>
          
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { label: 'Uptime', value: '99.9%', color: 'emerald' },
              { label: 'Kiosks', value: 'Online', color: 'blue' },
              { label: 'Security', value: 'Active', color: 'indigo' },
            ].map((stat, i) => (
              <div key={i} className={`p-3 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20`}>
                <p className={`text-lg font-display font-bold text-${stat.color}-400`}>{stat.value}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide font-bold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. ADMIN DASHBOARD (PREMIUM REDESIGN)
// ==========================================
function AdminDashboard({ onLogout, initialProfile }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [doctors, setDoctors] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [machines, setMachines] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [adminProfile, setAdminProfile] = useState(initialProfile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [hiddenTxIds, setHiddenTxIds] = useState(initialProfile?.hiddenTransactions || []);
  const [hiddenAuditIds, setHiddenAuditIds] = useState(initialProfile?.hiddenAudits || []);
  const [confirmConfig, setConfirmConfig] = useState(null);
  const [notification, setNotification] = useState(null);
  const [diagnosticMachine, setDiagnosticMachine] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setLoading(true);
    const subs = [
      onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'doctors')), snap => setDoctors(snap.docs.map(d => ({ id: d.id, ...d.data() }))), err => console.error(err)),
      onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'prescriptions')), snap => { const list = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => (b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)); setTransactions(list); setLoading(false); }, err => console.error(err)),
      onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'machines')), snap => setMachines(snap.docs.map(d => ({ id: d.id, ...d.data() }))), err => console.error(err)),
      onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'audit_logs'), limit(20)), snap => { const logs = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => (b.timestamp?.seconds||0)-(a.timestamp?.seconds||0)); setAuditLogs(logs); setLoading(false); }, err => { console.error(err); setLoading(false); }),
      onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'medicines')), snap => setMedicines(snap.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'support_tickets')), snap => setSupportTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })))),
    ];
    return () => subs.forEach(u => u());
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const saveHiddenPreferences = async (updates) => {
    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'admin_profile'), updates, { merge: true });
      setAdminProfile(prev => ({...prev, ...updates}));
    } catch (e) { console.error("Failed to save view preferences:", e); }
  };

  const updateDoctorStatus = async (docId, newStatus) => {
    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'doctors', docId), { status: newStatus, adminReviewedAt: serverTimestamp() }, { merge: true });
      await addAuditLog('Doctor Status Update', `Set ${docId} to ${newStatus}`);
      showNotification(`Doctor status updated to ${newStatus}`);
    } catch (e) { showNotification("Update failed: " + e.message, 'error'); }
  };

  const handleDoctorPasswordUpdate = async (docId, newPassword) => {
    if (!newPassword) return;
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'doctors', docId), { password: newPassword });
      await addAuditLog("Doctor Mgmt", `Updated password for doctor ${docId}`);
      showNotification("Doctor password updated");
    } catch (e) { showNotification("Update failed: " + e.message, 'error'); }
  };

  const handleDeleteDoctor = (docId) => {
    setConfirmConfig({
      title: "Delete Doctor Account?",
      message: `Permanently remove ${docId}?\n\nThis action cannot be undone.`,
      type: 'danger', confirmText: 'Delete Account',
      onConfirm: async () => {
        setConfirmConfig(null);
        try {
          await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'doctors', docId));
          await addAuditLog("Doctor Deletion", `Removed doctor: ${docId}`);
          showNotification("Doctor account deleted");
        } catch(e) { showNotification("Deletion failed: " + e.message, 'error'); }
      }
    });
  };

  const handlePingMachine = async (machineId) => {
    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'machines', machineId), { lastPing: serverTimestamp(), status: 'online' }, { merge: true });
      showNotification(`Ping to ${machineId} — OK`);
      await addAuditLog("Ping", `Pinged ${machineId}`);
    } catch(e) { showNotification("Ping failed: " + e.message, 'error'); }
  };

  const handleRunDiagnostics = (machine) => {
    const isOnline = machine.status === 'online';
    setDiagnosticMachine({
      ...machine,
      cpuTemp: isOnline ? (35 + Math.random() * 15).toFixed(1) + '°C' : 'N/A',
      printerPaper: isOnline ? Math.floor(Math.random() * 100) + '%' : 'Unknown',
      printerStatus: isOnline ? 'Ready' : 'Offline',
      motorStatus: isOnline ? 'Optimal' : 'Offline',
      scannerStatus: isOnline ? 'Active' : 'Not Detected',
      healthScore: isOnline ? Math.floor(90 + Math.random() * 10) + '%' : '0%',
      recommendation: isOnline ? 'System functioning normally. All sensors reporting within normal parameters.' : 'Check power and network connection.',
      slots: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        medicine: ['Biogesic', 'Neozep', 'Amoxicillin', 'Solmux', 'Bioflu', 'Alaxan', 'Decolgen', 'Tuseran', 'Diatabs', 'Kremil-S'][i],
        stock: isOnline ? Math.floor(Math.random() * 100) : 0,
        status: isOnline ? (Math.random() > 0.95 ? 'Jam' : 'OK') : 'Offline'
      }))
    });
  };

  const handleRebootMachine = (machineId) => {
    setConfirmConfig({
      title: "Reboot Kiosk?",
      message: `Send reboot command to ${machineId}?\n\nKiosk will be unavailable for ~30 seconds.`,
      type: 'info', confirmText: 'Reboot Now',
      onConfirm: async () => {
        setConfirmConfig(null);
        try {
          const ref = doc(db, 'artifacts', appId, 'public', 'data', 'machines', machineId);
          await setDoc(ref, { status: 'rebooting' }, { merge: true });
          showNotification(`Rebooting ${machineId}...`);
          setTimeout(async () => { await setDoc(ref, { status: 'offline' }, { merge: true }); setTimeout(async () => { await setDoc(ref, { status: 'online', lastPing: serverTimestamp() }, { merge: true }); showNotification(`${machineId} online`); await addAuditLog("Reboot", `Rebooted ${machineId}`); }, 3000); }, 1500);
        } catch(e) { showNotification("Reboot failed: " + e.message, 'error'); }
      }
    });
  };

  const handleLockMachine = (machineId, currentStatus) => {
    const newStatus = currentStatus === 'locked' ? 'online' : 'locked';
    setConfirmConfig({
      title: newStatus === 'locked' ? "Lock Kiosk?" : "Unlock Kiosk?",
      message: `${newStatus === 'locked' ? 'Lock' : 'Unlock'} kiosk ${machineId}?`,
      type: newStatus === 'locked' ? 'danger' : 'info',
      confirmText: newStatus === 'locked' ? 'Lock' : 'Unlock',
      onConfirm: async () => {
        setConfirmConfig(null);
        try {
          await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'machines', machineId), { status: newStatus }, { merge: true });
          await addAuditLog("Security", `${newStatus.toUpperCase()} ${machineId}`);
        } catch(e) { showNotification("Command failed: " + e.message, 'error'); }
      }
    });
  };

  const handleDeleteMachine = (machineId) => {
    setConfirmConfig({
      title: "Remove Kiosk?",
      message: `Remove ${machineId} from network?\n\nThis cannot be undone.`,
      type: 'danger', confirmText: 'Remove',
      onConfirm: async () => {
        setConfirmConfig(null);
        try {
          await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'machines', machineId));
          await addAuditLog("Removal", `Removed kiosk ${machineId}`);
          showNotification("Kiosk removed");
        } catch(e) { showNotification("Failed: " + e.message, 'error'); }
      }
    });
  };

  const addAuditLog = async (action, details) => {
    try {
      await setDoc(doc(collection(db, 'artifacts', appId, 'public', 'data', 'audit_logs')), {
        action, details, user: adminProfile.username,
        time: new Date().toLocaleTimeString(), timestamp: serverTimestamp()
      });
    } catch(e) { console.error("Audit log failed:", e); }
  };

  const handleBroadcast = async (msg, priority, target) => {
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'broadcasts'), {
        message: msg, priority, target, timestamp: serverTimestamp(), active: true, sentBy: adminProfile.username, type: 'admin_broadcast'
      });
      await addAuditLog("Broadcast", `Sent to ${target}: ${msg.slice(0, 40)}...`);
      showNotification(`Broadcast sent to ${target === 'all' ? 'entire network' : target}!`);
      setShowBroadcastModal(false);
    } catch (e) { showNotification("Broadcast failed", 'error'); }
  };

  const handleHideAuditLog = (id) => {
    setConfirmConfig({
      title: "Hide Record?",
      message: "Hide this log from your view?\n\nThe record stays saved in the database.",
      type: 'danger', confirmText: 'Hide',
      onConfirm: async () => {
        setConfirmConfig(null);
        const newHidden = [...hiddenAuditIds, id];
        setHiddenAuditIds(newHidden);
        await saveHiddenPreferences({ hiddenAudits: newHidden });
      }
    });
  };

  const handleClearViewAudit = () => {
    setConfirmConfig({
      title: "Clear All Audit Records?",
      message: "Hide all current records from view?\n\nAll records remain safe in the database.",
      type: 'danger', confirmText: 'Clear View',
      onConfirm: async () => {
        setConfirmConfig(null);
        const newHidden = Array.from(new Set([...hiddenAuditIds, ...auditLogs.map(l => l.id)]));
        setHiddenAuditIds(newHidden);
        await saveHiddenPreferences({ hiddenAudits: newHidden });
      }
    });
  };

  const handleHideTransaction = (id) => {
    setConfirmConfig({
      title: "Hide Record?",
      message: "Hide this transaction from your view?\n\nThe record stays saved in the database.",
      type: 'danger', confirmText: 'Hide',
      onConfirm: async () => {
        setConfirmConfig(null);
        const newHidden = [...hiddenTxIds, id];
        setHiddenTxIds(newHidden);
        await saveHiddenPreferences({ hiddenTransactions: newHidden });
      }
    });
  };

  const handleClearViewTransactions = () => {
    setConfirmConfig({
      title: "Clear All Records?",
      message: "Hide all transactions from view?\n\nAll records remain safe in the database.",
      type: 'danger', confirmText: 'Clear View',
      onConfirm: async () => {
        setConfirmConfig(null);
        const newHidden = Array.from(new Set([...hiddenTxIds, ...transactions.map(t => t.id)]));
        setHiddenTxIds(newHidden);
        await saveHiddenPreferences({ hiddenTransactions: newHidden });
      }
    });
  };

  const handleSaveProfile = async () => {
    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'admin_profile'), adminProfile);
      setIsEditingProfile(false);
      showNotification("Profile saved and synced");
      await addAuditLog("Profile Update", "Admin profile updated");
    } catch(e) { showNotification("Save failed: " + e.message, 'error'); }
  };

  const handlePasswordUpdate = async (newPass) => {
    try {
      const updated = { ...adminProfile, password: newPass };
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'admin_profile'), updated, { merge: true });
      setAdminProfile(updated);
      setShowPasswordModal(false);
      showNotification("Password updated");
      await addAuditLog("Password Change", "Admin password updated");
    } catch(e) { showNotification("Failed: " + e.message, 'error'); }
  };

  const pendingDocs = doctors.filter(d => d.status === 'pending').length;
  const activeDocs = doctors.filter(d => d.status === 'active').length;
  const activeMachines = machines.filter(m => m.status === 'online').length;
  const openTickets = supportTickets.filter(t => t.status === 'open').length;
  const totalNotifications = pendingDocs + openTickets;
  const displayedDoctors = doctors.filter(d => filter === 'all' ? true : d.status === filter);
  const displayedTransactions = transactions.filter(t => !hiddenTxIds.includes(t.id));
  const displayedAuditLogs = auditLogs.filter(l => !hiddenAuditIds.includes(l.id));

  const feedItems = [
    ...displayedTransactions.map(t => ({ ...t, _type: 'rx', _sortTime: t.createdAt?.seconds || 0 })),
    ...displayedAuditLogs.map(l => ({ ...l, _type: 'audit', _sortTime: l.timestamp?.seconds || 0 }))
  ].sort((a, b) => b._sortTime - a._sortTime).slice(0, 8);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    setDiagnosticMachine(null);
  };

  const navSections = [
    { label: 'Workspace', items: [{ id: 'overview', label: 'Dashboard', icon: <LayoutDashboard /> }] },
    { label: 'Network', items: [
      { id: 'doctors', label: 'Doctors', icon: <Users />, badge: pendingDocs },
      { id: 'machines', label: 'Kiosks', icon: <Server /> },
    ]},
    { label: 'Inventory & Support', items: [
      { id: 'inventory', label: 'Master List', icon: <Package /> },
      { id: 'support', label: 'Support', icon: <LifeBuoy />, badge: openTickets > 0 ? openTickets : null },
    ]},
    { label: 'Compliance', items: [
      { id: 'transactions', label: 'Logs', icon: <FileText /> },
      { id: 'audit', label: 'Audit', icon: <ClipboardList /> },
    ]},
  ];

  return (
    <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#060b18] text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
      <GlobalStyles />
      
      {/* Notification */}
      {notification && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold animate-slide-up glass border ${
          notification.type === 'error' 
            ? 'bg-rose-600/90 text-white border-rose-500/30 shadow-rose-500/20' 
            : 'bg-emerald-600/90 text-white border-emerald-500/30 shadow-emerald-500/20'
        }`}>
          {notification.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {notification.message}
        </div>
      )}

      <ConfirmationModal isOpen={!!confirmConfig} {...confirmConfig} onClose={() => setConfirmConfig(null)} isDarkMode={isDarkMode} />

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 border-r flex flex-col transform transition-all duration-300 ease-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 ${isDarkMode ? 'bg-[#090e1d] border-white/5' : 'bg-white border-gray-100 shadow-xl'}`}>
        
        {/* Logo area */}
        <div className={`relative p-5 border-b overflow-hidden ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent"></div>
          <div className="relative flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-indigo-500/30 blur-md"></div>
              <div className="relative bg-gradient-to-br from-indigo-600 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className={`font-display font-black text-lg tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>MediVend</h1>
              <div className="flex items-center gap-1.5">
                <PulseDot color="emerald" />
                <p className="text-[10px] font-bold text-emerald-500 tracking-widest uppercase">Super Admin</p>
              </div>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className={`md:hidden ml-auto p-1.5 rounded-lg ${isDarkMode ? 'text-slate-500 hover:bg-white/5' : 'text-slate-400 hover:bg-gray-100'}`}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto custom-scrollbar">
          {navSections.map(section => (
            <div key={section.label}>
              <p className={`px-4 mb-2 text-[9px] font-black uppercase tracking-[0.15em] ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`}>{section.label}</p>
              <div className="space-y-0.5">
                {section.items.map(item => (
                  <NavButton key={item.id} id={item.id} label={item.label} icon={item.icon} active={activeTab === item.id} onClick={handleNavClick} badge={item.badge} isDarkMode={isDarkMode} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Admin profile in sidebar */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-white/5 bg-black/20' : 'border-gray-100 bg-gray-50'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-display font-bold text-sm shadow-lg shadow-indigo-500/20">
              {adminProfile?.displayName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-xs truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{adminProfile?.displayName}</p>
              <p className="text-[10px] text-slate-500 truncate">{adminProfile?.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout} 
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all btn-hover-lift border ${
              isDarkMode ? 'text-slate-500 border-white/5 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20' : 'text-slate-400 border-gray-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-w-0 overflow-hidden relative ${isDarkMode ? 'bg-[#060b18]' : 'bg-slate-50'}`}>
        
        {/* Header */}
        <header className={`h-16 border-b flex items-center justify-between px-4 md:px-6 z-10 sticky top-0 transition-all glass ${isDarkMode ? 'bg-[#060b18]/90 border-white/5' : 'bg-white/90 border-gray-100 shadow-sm'}`}>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className={`md:hidden p-2 rounded-xl transition-all ${isDarkMode ? 'text-slate-400 hover:bg-white/5' : 'text-slate-600 hover:bg-gray-100'}`}>
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className={`font-display font-bold text-lg capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {activeTab === 'overview' ? 'Dashboard' : activeTab.replace('-', ' ')}
              </h2>
              <p className={`text-[10px] font-mono hidden sm:block ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono font-semibold ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-gray-100 border-gray-200 text-slate-600'}`}>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className={`p-2 rounded-xl transition-all btn-hover-lift border ${isDarkMode ? 'bg-white/5 border-white/10 text-amber-400 hover:bg-white/10' : 'bg-gray-100 border-gray-200 text-indigo-500 hover:bg-gray-200'}`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)} 
                className={`p-2 rounded-xl transition-all btn-hover-lift border relative ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-400 hover:text-indigo-400' : 'bg-gray-100 border-gray-200 text-slate-500 hover:text-indigo-600'}`}
              >
                <Bell className="w-4 h-4" />
                {totalNotifications > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-lg shadow-rose-500/30">
                    {totalNotifications}
                  </span>
                )}
              </button>
              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsNotifOpen(false)}></div>
                  <div className={`absolute right-0 top-12 w-72 rounded-2xl shadow-2xl border z-20 overflow-hidden animate-scale-in glass ${isDarkMode ? 'bg-[#0f1829] border-white/10' : 'bg-white border-gray-100'}`}>
                    <div className={`px-4 py-3 border-b flex items-center justify-between ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                      <span className={`font-display font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Notifications</span>
                      {totalNotifications > 0 && <span className="text-[10px] font-bold bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/20">{totalNotifications} new</span>}
                    </div>
                    {pendingDocs > 0 && (
                      <button onClick={() => { setActiveTab('doctors'); setFilter('pending'); setIsNotifOpen(false); }} className={`w-full p-4 text-left flex items-center justify-between transition-all hover:bg-amber-500/5 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-amber-500/10"><Users className="w-4 h-4 text-amber-400"/></div>
                          <div><p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Pending Approvals</p><p className="text-xs text-slate-500">Review doctor applications</p></div>
                        </div>
                        <span className="bg-amber-500/15 text-amber-400 text-xs px-2 py-1 rounded-xl font-bold border border-amber-500/20">{pendingDocs}</span>
                      </button>
                    )}
                    {openTickets > 0 && (
                      <button onClick={() => { setActiveTab('support'); setIsNotifOpen(false); }} className={`w-full p-4 text-left flex items-center justify-between transition-all hover:bg-rose-500/5`}>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-rose-500/10"><LifeBuoy className="w-4 h-4 text-rose-400"/></div>
                          <div><p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Open Tickets</p><p className="text-xs text-slate-500">Requires response</p></div>
                        </div>
                        <span className="bg-rose-500/15 text-rose-400 text-xs px-2 py-1 rounded-xl font-bold border border-rose-500/20">{openTickets}</span>
                      </button>
                    )}
                    {totalNotifications === 0 && (
                      <div className="p-6 text-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>All clear!</p>
                        <p className="text-xs text-slate-500">No new notifications</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Avatar */}
            <button 
              onClick={() => setActiveTab('settings')}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-display font-bold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all btn-hover-lift ring-2 ring-indigo-500/20 hover:ring-indigo-500/40"
            >
              {adminProfile?.displayName?.charAt(0) || 'A'}
            </button>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className={`flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 ${isDarkMode ? 'bg-[#060b18]' : 'bg-slate-50'}`}>
          
          {/* DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              
              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Pending Approvals', value: pendingDocs, icon: <Users className="w-5 h-5" />, color: 'amber', subtext: 'Needs attention', onClick: () => { setActiveTab('doctors'); setFilter('pending'); } },
                  { title: 'All Doctors', value: doctors.length, icon: <Stethoscope className="w-5 h-5" />, color: 'blue', subtext: 'Registered network', onClick: () => setActiveTab('doctors') },
                  { title: 'Master Inventory', value: medicines.length, icon: <Package className="w-5 h-5" />, color: 'emerald', subtext: 'Medicine SKUs', onClick: () => setActiveTab('inventory') },
                  { title: 'Security Events', value: displayedAuditLogs.length, icon: <AlertOctagon className="w-5 h-5" />, color: 'red', subtext: 'System events', onClick: () => setActiveTab('audit') },
                ].map((card, i) => (
                  <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 0.07}s`, animationFillMode: 'both', opacity: 0 }}>
                    <StatCard {...card} isDarkMode={isDarkMode} />
                  </div>
                ))}
              </div>

              {/* Network Health */}
              <div className={`p-6 rounded-2xl border animate-slide-up ${isDarkMode ? 'bg-[#0d1424] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`} style={{ animationDelay: '0.2s', animationFillMode: 'both', opacity: 0 }}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className={`font-display font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Network Health</h3>
                    <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{transactions.length} total prescriptions processed</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <PulseDot color="emerald" />
                    <span className="text-xs font-bold text-emerald-400 hidden sm:block">Systems Operational</span>
                    <span className="text-xs font-bold text-emerald-400 sm:hidden">OK</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      <Users className="w-3.5 h-3.5 text-blue-400"/> Provider Status
                    </p>
                    <div className="space-y-4">
                      {[
                        { label: `Active Physicians (${activeDocs})`, pct: doctors.length > 0 ? (activeDocs / doctors.length) * 100 : 0, color: 'from-blue-500 to-cyan-400', textColor: 'text-blue-400' },
                        { label: `Pending Review (${pendingDocs})`, pct: doctors.length > 0 ? (pendingDocs / doctors.length) * 100 : 0, color: 'from-amber-500 to-orange-400', textColor: 'text-amber-400' },
                      ].map((bar, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-2">
                            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>{bar.label}</span>
                            <span className={`font-bold font-mono ${bar.textColor}`}>{Math.round(bar.pct)}%</span>
                          </div>
                          <div className={`w-full rounded-full h-2 overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                            <div className={`h-full bg-gradient-to-r ${bar.color} rounded-full progress-bar`} style={{ width: `${bar.pct}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      <Server className="w-3.5 h-3.5 text-emerald-400"/> Kiosk Connectivity
                    </p>
                    <div className="space-y-4">
                      {[
                        { label: `Online (${activeMachines})`, pct: machines.length > 0 ? (activeMachines / machines.length) * 100 : 0, color: 'from-emerald-500 to-teal-400', textColor: 'text-emerald-400' },
                        { label: `Offline (${machines.length - activeMachines})`, pct: machines.length > 0 ? ((machines.length - activeMachines) / machines.length) * 100 : 0, color: 'from-slate-500 to-slate-600', textColor: 'text-slate-400' },
                      ].map((bar, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-2">
                            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>{bar.label}</span>
                            <span className={`font-bold font-mono ${bar.textColor}`}>{Math.round(bar.pct)}%</span>
                          </div>
                          <div className={`w-full rounded-full h-2 overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                            <div className={`h-full bg-gradient-to-r ${bar.color} rounded-full progress-bar`} style={{ width: `${bar.pct}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts + Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Top Prescribed */}
                <div className={`lg:col-span-2 p-6 rounded-2xl border animate-slide-up ${isDarkMode ? 'bg-[#0d1424] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`} style={{ animationDelay: '0.3s', animationFillMode: 'both', opacity: 0 }}>
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="w-5 h-5 text-indigo-400" />
                    <h3 className={`font-display font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Top Prescribed Medicines</h3>
                  </div>
                  <TopPrescribedChart transactions={transactions} isDarkMode={isDarkMode} />
                </div>

                {/* Quick Actions */}
                <div className={`p-6 rounded-2xl border animate-slide-up ${isDarkMode ? 'bg-[#0d1424] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`} style={{ animationDelay: '0.35s', animationFillMode: 'both', opacity: 0 }}>
                  <h3 className={`font-display font-bold text-base mb-5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Quick Actions</h3>
                  <div className="space-y-2.5">
                    <ActionButton onClick={() => { setActiveTab('doctors'); setFilter('pending'); }} icon={<Users className="w-4 h-4"/>} label={`Review ${pendingDocs} Pending`} variant="primary" />
                    <ActionButton onClick={() => setShowBroadcastModal(true)} icon={<Megaphone className="w-4 h-4"/>} label="Send Broadcast" variant="secondary" isDarkMode={isDarkMode} />
                    <ActionButton onClick={() => setActiveTab('audit')} icon={<Shield className="w-4 h-4"/>} label="Security Audit" variant="secondary" isDarkMode={isDarkMode} />
                    <ActionButton onClick={() => setActiveTab('support')} icon={<LifeBuoy className="w-4 h-4"/>} label={`Support ${openTickets > 0 ? `(${openTickets})` : ''}`} variant="secondary" isDarkMode={isDarkMode} />
                  </div>
                </div>
              </div>
              
              {/* Activity Feed */}
              <div className={`p-6 rounded-2xl border animate-slide-up ${isDarkMode ? 'bg-[#0d1424] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`} style={{ animationDelay: '0.4s', animationFillMode: 'both', opacity: 0 }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <h3 className={`font-display font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Live Activity Feed</h3>
                  </div>
                  <PulseDot color="indigo" />
                </div>
                <div className="space-y-1 relative">
                  <div className={`absolute left-3.5 top-2 bottom-2 w-px ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}></div>
                  {feedItems.length === 0 ? (
                    <div className="pl-10 py-4 text-sm text-slate-500 italic">No recent activity</div>
                  ) : feedItems.map((item, idx) => (
                    <div key={item.id + idx} className={`py-3 pl-10 pr-3 relative flex justify-between items-center rounded-xl transition-colors cursor-default ${isDarkMode ? 'hover:bg-white/3' : 'hover:bg-gray-50'}`}>
                      <div className={`absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 border-2 rounded-full z-10 ${item._type === 'rx' ? 'bg-[#060b18] border-blue-500' : 'bg-[#060b18] border-amber-500'}`}></div>
                      <div className="min-w-0 pr-4">
                        <p className={`font-semibold text-xs truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {item._type === 'rx' ? 'Prescription Issued' : item.action}
                        </p>
                        <p className={`text-[11px] mt-0.5 truncate ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          {item._type === 'rx' ? `Dr. ${item.doctorName} · ${item.patient?.name}` : item.details}
                        </p>
                      </div>
                      <span className={`text-[10px] font-mono flex-shrink-0 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                        {item._type === 'rx' ? item.date : item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'doctors' && <DoctorsView doctors={displayedDoctors} filter={filter} setFilter={setFilter} onRefresh={() => {}} onUpdateStatus={updateDoctorStatus} onUpdatePassword={handleDoctorPasswordUpdate} onDelete={handleDeleteDoctor} loading={loading} isDarkMode={isDarkMode} />}
          {activeTab === 'machines' && <MachinesView machines={machines} onPing={handlePingMachine} onRunDiagnostics={handleRunDiagnostics} onReboot={handleRebootMachine} onLock={handleLockMachine} onDelete={handleDeleteMachine} isDarkMode={isDarkMode} />}
          {activeTab === 'inventory' && <InventoryView medicines={medicines} db={db} appId={appId} isDarkMode={isDarkMode} onNotify={showNotification} />}
          {activeTab === 'support' && <SupportView tickets={supportTickets} db={db} appId={appId} isDarkMode={isDarkMode} onNotify={showNotification} />}
          {activeTab === 'transactions' && <TransactionsView transactions={displayedTransactions} onHide={handleHideTransaction} onClearView={handleClearViewTransactions} isDarkMode={isDarkMode} />}
          {activeTab === 'audit' && <AuditView logs={displayedAuditLogs} onHide={handleHideAuditLog} onClearView={handleClearViewAudit} isDarkMode={isDarkMode} />}
          {activeTab === 'settings' && <SettingsView profile={adminProfile} setProfile={setAdminProfile} onSave={handleSaveProfile} isEditing={isEditingProfile} setIsEditing={setIsEditingProfile} setShowPassword={() => setShowPasswordModal(true)} isDarkMode={isDarkMode} transactions={transactions} auditLogs={auditLogs} doctors={doctors} machines={machines} medicines={medicines} supportTickets={supportTickets} onNotify={showNotification} />}
        </main>

        {/* Modals */}
        {showPasswordModal && <PasswordModal onClose={() => setShowPasswordModal(false)} currentCreds={adminProfile} onUpdate={handlePasswordUpdate} isDarkMode={isDarkMode} onNotify={showNotification} />}
        {showBroadcastModal && <BroadcastModal onClose={() => setShowBroadcastModal(false)} onSend={handleBroadcast} isDarkMode={isDarkMode} />}

        {/* Diagnostics Modal */}
        {diagnosticMachine && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-scale-in">
            <div className={`rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border flex flex-col max-h-[90vh] ${isDarkMode ? 'bg-[#0d1424] border-white/10' : 'bg-white border-gray-200'}`}>
              <div className={`p-5 border-b flex justify-between items-center flex-shrink-0 ${isDarkMode ? 'border-white/10 bg-gradient-to-r from-indigo-900/20 to-transparent' : 'border-gray-100'}`}>
                <div>
                  <h3 className={`font-display font-bold text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Activity className="w-5 h-5 text-emerald-400"/> Kiosk Diagnostics
                  </h3>
                  <p className={`text-xs mt-0.5 font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{diagnosticMachine.id} · {diagnosticMachine.location}</p>
                </div>
                <button onClick={() => setDiagnosticMachine(null)} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-gray-100 text-slate-500'}`}><X className="w-5 h-5"/></button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                <div className="flex gap-4">
                  <div className={`flex-1 text-center p-5 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <div className={`text-5xl font-display font-black mb-1 ${diagnosticMachine.status === 'online' ? 'text-emerald-400' : 'text-rose-400'}`}>{diagnosticMachine.healthScore}</div>
                    <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">Health Score</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Remote Commands</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Ping', icon: <Activity size={14}/>, action: () => { handlePingMachine(diagnosticMachine.id); setDiagnosticMachine(null); } },
                        { label: 'Reboot', icon: <Power size={14}/>, action: () => { handleRebootMachine(diagnosticMachine.id); setDiagnosticMachine(null); } },
                      ].map((btn, i) => (
                        <button key={i} onClick={btn.action} className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-xs font-bold transition-all btn-hover-lift ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10' : 'bg-gray-100 hover:bg-gray-200 text-slate-700 border border-gray-200'}`}>
                          {btn.icon} {btn.label}
                        </button>
                      ))}
                      <button onClick={() => { handleLockMachine(diagnosticMachine.id, diagnosticMachine.status); setDiagnosticMachine(null); }} className={`col-span-2 flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all btn-hover-lift border ${diagnosticMachine.status === 'locked' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/25' : 'bg-rose-500/15 text-rose-400 border-rose-500/20 hover:bg-rose-500/25'}`}>
                        {diagnosticMachine.status === 'locked' ? <><Unlock size={14}/> Unlock</> : <><Lock size={14}/> Lock Kiosk</>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 border-t flex justify-end flex-shrink-0 ${isDarkMode ? 'bg-white/3 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                <button onClick={() => setDiagnosticMachine(null)} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 to-indigo-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/20 btn-hover-lift">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 6. MAIN ENTRY POINT
// ==========================================
export default function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await signInAnonymously(auth);
        const adminRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'admin_profile');
        const snap = await getDoc(adminRef);
        if (snap.exists()) setAdminProfile(snap.data());
        else { await setDoc(adminRef, DEFAULT_ADMIN); setAdminProfile(DEFAULT_ADMIN); }
      } catch (err) {
        console.error("Init failed:", err);
        setAdminProfile(DEFAULT_ADMIN);
      } finally {
        setLoadingProfile(false);
      }
    };
    init();
  }, []);

  if (loadingProfile) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#060b18] font-sans">
        <GlobalStyles />
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-3xl bg-indigo-500/20 blur-xl animate-pulse"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-indigo-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30">
              <ShieldCheck className="w-9 h-9 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold text-slate-300 font-display">Connecting to Secure Server</p>
            <div className="flex items-center justify-center gap-1.5">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdminLoggedIn) return <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} cloudProfile={adminProfile} />;
  return <AdminDashboard onLogout={() => setIsAdminLoggedIn(false)} initialProfile={adminProfile} />;
}