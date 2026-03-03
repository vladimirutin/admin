import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Lock, EyeOff, Eye, Megaphone, X, Globe, Users, Server, RefreshCw, Send, MoreHorizontal } from 'lucide-react';

// ==========================================
// MENUS 
// ==========================================
export function MobileMenu({ children, isDarkMode }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className={`p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-slate-500 hover:bg-white/10 hover:text-slate-200' : 'text-slate-400 hover:bg-gray-100 hover:text-slate-600'}`}
            >
                <MoreHorizontal className="w-4 h-4" />
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
// MODALS
// ==========================================
export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, type = 'info', confirmText = "Confirm", isLoading = false, isDarkMode }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className={`w-full max-w-sm rounded-3xl border overflow-hidden shadow-2xl animate-scale-in ${type === 'danger'
                    ? isDarkMode ? 'bg-[#1a1020] border-rose-500/20' : 'bg-white border-rose-100'
                    : isDarkMode ? 'bg-[#0f1829] border-indigo-500/20' : 'bg-white border-indigo-100'
                }`}>
                <div className="p-8 text-center">
                    <div className={`relative w-20 h-20 mx-auto mb-6`}>
                        <div className={`absolute inset-0 rounded-2xl opacity-30 animate-pulse ${type === 'danger' ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
                        <div className={`relative w-full h-full rounded-2xl flex items-center justify-center ${type === 'danger'
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
                    <button onClick={onConfirm} disabled={isLoading} className={`flex-1 flex justify-center items-center py-3 text-sm font-bold text-white rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 btn-hover-lift ${type === 'danger' ? 'bg-gradient-to-r from-rose-500 to-pink-600 shadow-rose-500/30' : 'bg-gradient-to-r from-indigo-600 to-blue-600 shadow-indigo-500/30'
                        }`}>
                        {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function PasswordModal({ onClose, currentCreds, onUpdate, isDarkMode, onNotify }) {
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
                                    onChange={e => setP({ ...p, [field]: e.target.value })}
                                />
                                <button type="button" onClick={() => setShow(s => ({ ...s, [field]: !s[field] }))} className={`absolute right-3 top-3 ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}>
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
                            if (p.cur !== currentCreds.password) return onNotify('Wrong current password', 'error');
                            if (p.new !== p.conf) return onNotify('Passwords do not match', 'error');
                            if (p.new.length < 6) return onNotify('Password too short', 'error');
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

export function BroadcastModal({ onClose, onSend, isDarkMode }) {
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
                                    className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all btn-hover-lift ${target === t.id
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
