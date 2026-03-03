import React, { useState } from 'react';
import { User, ShieldCheck, Database, Edit2, Save, Lock, Download, Trash2, HardDrive } from 'lucide-react';
import { PulseDot } from '../components/UI';

export function SettingsView({ profile, setProfile, onSave, isEditing, setIsEditing, setShowPassword, isDarkMode, transactions, auditLogs, doctors, machines, medicines, supportTickets, onNotify }) {
    const [activeSettingTab, setActiveSettingTab] = useState('profile');

    const downloadCSV = (data, filename) => {
        if (!data?.length) return onNotify("No data to export", "error");
        const header = Object.keys(data[0]);
        const csv = [header.join(','), ...data.map(row => header.map(f => JSON.stringify(row[f] ?? '')).join(','))].join('\r\n');
        const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: filename, hidden: true });
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
    };

    const handleFullBackup = () => {
        const backup = { timestamp: new Date().toISOString(), doctors, machines, transactions, auditLogs, medicines, supportTickets };
        const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })), download: `medivend_backup_${Date.now()}.json`, hidden: true });
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
    };

    const settingTabs = [
        { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
        { id: 'security', label: 'Security', icon: <ShieldCheck className="w-4 h-4" /> },
        { id: 'data', label: 'Data', icon: <Database className="w-4 h-4" /> },
    ];

    return (
        <div className={`w-full max-w-4xl mx-auto rounded-2xl border overflow-hidden flex flex-col md:flex-row animate-slide-up ${isDarkMode ? 'bg-[#0d1424] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className={`hidden md:block md:w-56 border-r p-4 flex-shrink-0 ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <p className={`font-display font-bold text-xs uppercase tracking-widest mb-4 px-3 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Settings</p>
                <nav className="space-y-1">
                    {settingTabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveSettingTab(tab.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all btn-hover-lift ${activeSettingTab === tab.id
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                    : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-gray-100'
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

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
                                    <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={() => setIsEditing(false)} className={`px-3 py-2 text-xs font-bold rounded-xl border btn-hover-lift ${isDarkMode ? 'text-slate-400 border-white/10 hover:bg-white/5' : 'text-slate-600 border-gray-200 hover:bg-gray-100'}`}>Cancel</button>
                                    <button onClick={onSave} className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20 btn-hover-lift">
                                        <Save className="w-3.5 h-3.5" /> Save
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
                                        onChange={e => setProfile({ ...profile, [field.key]: e.target.value })}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className={`pt-5 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                            <button onClick={setShowPassword} className="flex items-center gap-2 text-xs text-indigo-400 font-bold hover:text-indigo-300 transition-colors btn-hover-lift">
                                <Lock className="w-3.5 h-3.5" /> Change Password
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
                                    className={`flex flex-col items-center justify-center p-5 border rounded-2xl transition-all group btn-hover-lift ${item.dashed ? 'border-dashed' : ''
                                        } ${isDarkMode ? `border-white/10 hover:bg-${item.color}-500/5 hover:border-${item.color}-500/20` : `border-gray-200 hover:bg-${item.color}-50 hover:border-${item.color}-200`}`}
                                >
                                    <div className={`text-slate-500 group-hover:text-${item.color}-500 transition-colors mb-2`}>{item.icon}</div>
                                    <span className={`text-xs font-bold text-slate-400 group-hover:text-${item.color}-500 transition-colors text-center`}>{item.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className={`p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl`}>
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-sm font-bold text-amber-400 flex items-center gap-2"><HardDrive className="w-4 h-4" /> Storage</p>
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
