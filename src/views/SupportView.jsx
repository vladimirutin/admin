import React, { useState } from 'react';
import { LifeBuoy, AlertCircle, MessageSquare, Trash2, CheckSquare } from 'lucide-react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { TableContainer, TableHeader } from '../components/UI'; // Assuming we exported these wrapper components
import { ConfirmationModal, MobileMenu } from '../components/Modals';
import { PaginationFooter } from '../components/UI';

export function SupportView({ tickets, db, appId, isDarkMode, onNotify }) {
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
        try { await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'support_tickets', deleteId)); } catch (e) { }
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
                                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all flex items-center gap-1.5 ${filter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'
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
                        <div key={t.id} className={`p-4 md:p-5 flex flex-col md:flex-row justify-between items-start gap-4 transition-colors ${isDarkMode ? 'hover:bg-white/3' : 'hover:bg-gray-50'
                            } ${t.priority === 'high' ? (isDarkMode ? 'border-l-2 border-rose-500' : 'border-l-2 border-rose-400 bg-rose-50/50') : ''}`}>
                            <div className="flex gap-4 items-start w-full relative">
                                <div className="absolute top-0 right-0 md:hidden z-20">
                                    <MobileMenu isDarkMode={isDarkMode}>
                                        {t.status === 'open' && <button onClick={() => handleStatusUpdate(t, 'in_progress')} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-indigo-400 hover:bg-indigo-500/10 rounded-xl">In Progress</button>}
                                        {t.status !== 'resolved' && <button onClick={() => handleStatusUpdate(t, 'resolved')} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-emerald-400 hover:bg-emerald-500/10 rounded-xl">Resolve</button>}
                                        <button onClick={() => setDeleteId(t.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-rose-400 hover:bg-rose-500/10 rounded-xl"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                                    </MobileMenu>
                                </div>
                                <div className={`p-3 rounded-xl flex-shrink-0 ${t.priority === 'high' ? 'bg-rose-500/15 text-rose-400' : isDarkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-500'}`}>
                                    {t.type === 'kiosk_alert' ? <AlertCircle className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 pr-10 md:pr-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.subject}</h4>
                                        {t.priority === 'high' && <span className="text-[9px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full">HIGH</span>}
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${t.status === 'open' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
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
                                        <CheckSquare className="w-3.5 h-3.5" /> Resolve
                                    </button>
                                )}
                                <button onClick={() => setDeleteId(t.id)} className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all btn-hover-lift">
                                    <Trash2 className="w-4 h-4" />
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
