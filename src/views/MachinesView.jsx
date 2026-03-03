import React, { useState } from 'react';
import { Server, Activity, Wrench, Power, Lock, Unlock, Trash2, Wifi, RefreshCw, WifiOff } from 'lucide-react';
import { TableContainer, TableHeader, PaginationFooter } from '../components/UI';
import { MobileMenu } from '../components/Modals';

export function MachinesView({ machines, onPing, onRunDiagnostics, onReboot, onLock, onDelete, isDarkMode }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(machines.length / itemsPerPage);
    const currentData = machines.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const statusConfig = {
        online: { cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', icon: <Wifi className="w-3 h-3" />, dot: 'emerald' },
        rebooting: { cls: 'bg-amber-500/15 text-amber-400 border-amber-500/20', icon: <RefreshCw className="w-3 h-3 animate-spin" />, dot: 'amber' },
        locked: { cls: 'bg-slate-500/15 text-slate-400 border-slate-500/20', icon: <Lock className="w-3 h-3" />, dot: 'slate' },
        offline: { cls: 'bg-rose-500/15 text-rose-400 border-rose-500/20', icon: <WifiOff className="w-3 h-3" />, dot: 'rose' },
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
                                    <button onClick={() => onPing(m.id)} className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left rounded-xl ${isDarkMode ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-gray-100'}`}><Activity className="w-3.5 h-3.5" /> Ping</button>
                                    <button onClick={() => onRunDiagnostics(m)} className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left rounded-xl ${isDarkMode ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-gray-100'}`}><Wrench className="w-3.5 h-3.5" /> Diagnostics</button>
                                    <button onClick={() => onReboot(m.id)} className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left rounded-xl ${isDarkMode ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-gray-100'}`}><Power className="w-3.5 h-3.5" /> Reboot</button>
                                    <button onClick={() => onLock(m.id, m.status)} className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left rounded-xl ${isDarkMode ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-gray-100'}`}>{m.status === 'locked' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />} {m.status === 'locked' ? 'Unlock' : 'Lock'}</button>
                                    <button onClick={() => onDelete(m.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-rose-400 hover:bg-rose-500/10 rounded-xl"><Trash2 className="w-3.5 h-3.5" /> Remove</button>
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
                                                { action: () => onPing(m.id), icon: <Activity size={14} />, title: 'Ping' },
                                                { action: () => onRunDiagnostics(m), icon: <Wrench size={14} />, title: 'Diagnostics' },
                                                { action: () => onReboot(m.id), icon: <Power size={14} />, title: 'Reboot' },
                                                { action: () => onLock(m.id, m.status), icon: m.status === 'locked' ? <Unlock size={14} /> : <Lock size={14} />, title: m.status === 'locked' ? 'Unlock' : 'Lock' },
                                            ].map((btn, i) => (
                                                <button key={i} onClick={btn.action} title={btn.title}
                                                    className={`p-2 rounded-lg transition-all btn-hover-lift ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-slate-500 hover:text-slate-700'}`}>
                                                    {btn.icon}
                                                </button>
                                            ))}
                                            <button onClick={() => onDelete(m.id)} className="p-2 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg text-rose-400 btn-hover-lift ml-1"><Trash2 size={14} /></button>
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
