import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react';

// ==========================================
// ANIMATED COUNTER
// ==========================================
export function AnimatedCounter({ value, duration = 1000 }) {
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
    }, [value, duration]);

    return <span>{display}</span>;
}

// ==========================================
// LIVE PULSE DOT
// ==========================================
export function PulseDot({ color = 'emerald', size = 'sm' }) {
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
// BUTTONS & CARDS
// ==========================================
export function NavButton({ id, label, icon, active, onClick, badge, isDarkMode }) {
    return (
        <button
            onClick={() => onClick(id)}
            className={`relative flex w-full items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ripple overflow-hidden ${active
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

export function StatCard({ title, value, icon, color, subtext, onClick, isDarkMode, trend }) {
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
            className={`relative p-5 rounded-2xl border cursor-pointer group card-hover overflow-hidden ${isDarkMode
                    ?\`bg-[#0d1424] border-white/5 hover:border-indigo-500/30\` 
          : \`bg-white border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-200\`
      }`}
    >
    <div className={\`absolute inset-0 bg-gradient-to-br \${c.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500\`}></div>
      <div className={\`absolute top-0 right-0 w-24 h-24 \${c.bg} rounded-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform duration-500\`}></div>
      
      <div className="relative z-10">
        <div className={\`inline-flex p-2.5 rounded-xl \${c.bg} \${c.border} border mb-4 transition-transform duration-300 group-hover:scale-110\`}>
          {React.cloneElement(icon, { className: \`w-5 h-5 \${c.text}\` })}
        </div>
        
        <div className={\`font-display text-3xl font-bold mb-1 stat-number \${isDarkMode ? 'text-white' : 'text-slate-900'}\`}>
          <AnimatedCounter value={typeof value === 'string' ? value.split('/')[0] : value} />
          {typeof value === 'string' && value.includes('/') && (
            <span className={\`text-lg \${isDarkMode ? 'text-slate-500' : 'text-slate-400'}\`}>/{value.split('/')[1]}</span>
          )}
        </div>
        
        <p className={\`font-semibold text-xs uppercase tracking-wider leading-tight \${isDarkMode ? 'text-slate-400' : 'text-slate-500'}\`}>{title}</p>
        
        {subtext && (
          <p className={\`text-[10px] mt-2 flex items-center gap-1 \${isDarkMode ? 'text-slate-600' : 'text-slate-400'}\`}>
            <span className="w-1 h-1 rounded-full bg-current"></span>{subtext}
          </p>
        )}
      </div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const configs = { 
    active: { cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "emerald" }, 
    pending: { cls: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "amber" }, 
    rejected: { cls: "bg-rose-500/10 text-rose-400 border-rose-500/20", dot: "rose" } 
  };
  const c = configs[status] || configs.pending;
  return (
    <span className={\`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border \${c.cls}\`}>
      <PulseDot color={c.dot} />
      {status}
    </span>
  );
}

export function PrescriptionStatusBadge({ status }) {
  const configs = { 
    issued: { cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" }, 
    partial: { cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" }, 
    completed: { cls: "bg-slate-500/10 text-slate-400 border-slate-500/20" } 
  };
  const c = configs[status] || { cls: "bg-slate-500/10 text-slate-400 border-slate-500/20" };
  return <span className={\`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border \${c.cls}\`}>{status}</span>;
}

export function ActionButton({ onClick, label, icon, variant, isDarkMode }) {
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
      className={\`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider btn-hover-lift ripple transition-all duration-200 border \${
        isDarkMode 
          ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20' 
          : 'bg-white border-gray-200 text-slate-600 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
      }\`}
    >
      {icon}{label}
    </button>
  );
}

export function PaginationFooter({ currentPage, totalPages, onPageChange, isDarkMode }) {
  if (totalPages <= 1) return null;
  return (
    <div className={\`flex justify-between items-center px-6 py-4 border-t \${isDarkMode ? 'border-white/5' : 'border-gray-100'}\`}>
      <span className={\`font-mono text-[11px] \${isDarkMode ? 'text-slate-600' : 'text-slate-400'}\`}>
        PAGE <span className="text-indigo-400">{currentPage}</span> / {totalPages}
      </span>
      <div className="flex gap-2">
        <button 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={\`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-all btn-hover-lift disabled:opacity-30 disabled:cursor-not-allowed \${
            isDarkMode ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white border-gray-200 text-slate-600 hover:bg-gray-50'
          }\`}
        >
          <ChevronLeft className="w-3 h-3" /> PREV
        </button>
        <button 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={\`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-all btn-hover-lift disabled:opacity-30 disabled:cursor-not-allowed \${
            isDarkMode ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white border-gray-200 text-slate-600 hover:bg-gray-50'
          }\`}
        >
          NEXT <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
