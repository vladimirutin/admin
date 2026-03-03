import React, { useState } from 'react';
import { Search, X, Package, Trash2 } from 'lucide-react';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { TableContainer, TableHeader } from '../components/UI';
import { ConfirmationModal, MobileMenu } from '../components/Modals';
import { PaginationFooter } from '../components/UI';

export function InventoryView({ medicines, db, appId, isDarkMode, onNotify }) {
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
                                onChange={e => setNewItem({ ...newItem, [i === 0 ? 'name' : 'generic']: e.target.value })} />
                        ))}
                        <input type="number" placeholder="Stock Qty" required
                            className={`p-3 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-mono ${isDarkMode ? 'bg-black/20 border-white/10 text-white placeholder-slate-600' : 'bg-white border-gray-200 text-slate-900'}`}
                            value={newItem.stock} onChange={e => setNewItem({ ...newItem, stock: parseInt(e.target.value) })} />
                        <input type="number" placeholder="Price (PHP)" required
                            className={`p-3 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-mono ${isDarkMode ? 'bg-black/20 border-white/10 text-white placeholder-slate-600' : 'bg-white border-gray-200 text-slate-900'}`}
                            value={newItem.price} onChange={e => setNewItem({ ...newItem, price: parseFloat(e.target.value) })} />
                        <button type="submit" className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-xl p-3 text-xs hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/20 btn-hover-lift">Save to DB</button>
                    </form>
                )}

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
                                        <Trash2 className="w-3.5 h-3.5" /> Remove
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
                                            <Trash2 className="w-4 h-4" />
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
