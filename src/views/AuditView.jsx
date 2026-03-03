import React, { useState } from 'react';
import { ClipboardList, Trash2 } from 'lucide-react';
import { TableContainer, TableHeader, PaginationFooter } from '../components/UI';
import { MobileMenu } from '../components/Modals';

export function AuditView({ logs, onHide, onClearView, isDarkMode }) {
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
                    <Trash2 className="w-3.5 h-3.5" /> Clear View
                </button>
            </div>

            <div className="md:hidden divide-y divide-white/5">
                {currentData.length === 0 ? (
                    <div className="p-10 text-center"><ClipboardList className="w-8 h-8 text-slate-600 mx-auto mb-2" /><p className="text-xs text-slate-500 italic">No audit logs</p></div>
                ) : currentData.map((log, i) => (
                    <div key={i} className={`p-4 relative flex flex-col gap-2 transition-colors ${isDarkMode ? 'hover:bg-white/3' : 'hover:bg-gray-50'}`}>
                        <div className="absolute top-4 right-4 z-20">
                            <MobileMenu isDarkMode={isDarkMode}><button onClick={() => onHide(log.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl"><Trash2 className="w-3.5 h-3.5" /> Hide</button></MobileMenu>
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
