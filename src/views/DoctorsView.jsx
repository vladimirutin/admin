import React, { useState } from 'react';
import { Search, Eye, CheckCircle, XCircle, Trash2, FileBadge, CheckSquare, X, RefreshCw, Users, ZoomIn, ExternalLink } from 'lucide-react';
import { TableContainer, TableHeader, StatusBadge, PaginationFooter } from '../components/UI';
import { ConfirmationModal, MobileMenu } from '../components/Modals';

export function DoctorsView({ doctors, filter, setFilter, onRefresh, onUpdateStatus, onUpdatePassword, onDelete, loading, isDarkMode }) {
    const [viewDoc, setViewDoc] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [newPasswordVal, setNewPasswordVal] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showLicenseFullscreen, setShowLicenseFullscreen] = useState(false);
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
                            <h3 className={`font-display font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Healthcare Professionals</h3>
                            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{doctors.length} registered professionals</p>
                        </div>
                        <button onClick={onRefresh} className={`p-2 rounded-lg transition-all btn-hover-lift ${isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-emerald-400' : 'text-slate-400 hover:bg-gray-100 hover:text-emerald-600'}`}>
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className={`flex p-1 rounded-xl gap-1 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                            {filterBtns.map(f => (
                                <button key={f} onClick={() => setFilter(f)}
                                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all whitespace-nowrap ${filter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                                        }`}
                                >{f}</button>
                            ))}
                        </div>
                        <div className="relative flex-1 max-w-xs">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                            <input type="text" placeholder="Search professionals..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                className={`w-full pl-8 pr-3 py-2 rounded-xl text-xs border outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder-slate-600' : 'bg-white border-gray-200 text-slate-700 placeholder-slate-400'}`} />
                        </div>
                    </div>
                </div>

                {/* Mobile */}
                <div className="md:hidden divide-y divide-white/5">
                    {currentData.length === 0 ? (
                        <div className="p-10 text-center"><Users className="w-8 h-8 text-slate-600 mx-auto mb-2" /><p className="text-xs text-slate-500 italic">No professionals found</p></div>
                    ) : currentData.map(doc => (
                        <div key={doc.id} className={`p-4 relative flex flex-col gap-3 transition-colors ${isDarkMode ? 'hover:bg-white/3' : 'hover:bg-gray-50'}`}>
                            <div className="absolute top-4 right-4 z-20">
                                <MobileMenu isDarkMode={isDarkMode}>
                                    <button onClick={() => { setViewDoc(doc); setShowPassword(false); setIsEditingPassword(false); }} className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left rounded-xl ${isDarkMode ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-gray-100'}`}><Eye className="w-3.5 h-3.5" /> View</button>
                                    {doc.status === 'pending' && (<><button onClick={() => onUpdateStatus(doc.id, 'active')} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-emerald-400 hover:bg-emerald-500/10 rounded-xl"><CheckCircle className="w-3.5 h-3.5" /> Approve</button><button onClick={() => onUpdateStatus(doc.id, 'rejected')} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-rose-400 hover:bg-rose-500/10 rounded-xl"><XCircle className="w-3.5 h-3.5" /> Reject</button></>)}
                                    {doc.status === 'active' && <button onClick={() => onUpdateStatus(doc.id, 'rejected')} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-rose-400 hover:bg-rose-500/10 rounded-xl"><XCircle className="w-3.5 h-3.5" /> Revoke</button>}
                                    {doc.status === 'rejected' && <button onClick={() => onUpdateStatus(doc.id, 'active')} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-emerald-400 hover:bg-emerald-500/10 rounded-xl"><CheckCircle className="w-3.5 h-3.5" /> Restore</button>}
                                    <button onClick={() => onDelete(doc.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-rose-400 hover:bg-rose-500/10 rounded-xl"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
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
                            <tr><th className="px-6 py-4">Professional</th><th className="px-6 py-4">License</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Profession</th><th className="px-6 py-4 text-right">Actions</th></tr>
                        </TableHeader>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-50'}`}>
                            {currentData.length === 0 ? (
                                <tr><td colSpan="5" className="p-10 text-center text-xs text-slate-500 italic">No professionals found</td></tr>
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
                                    <td className="px-6 py-4">
                                        {doc.type === 'pharmacist' ? (
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded inline-flex items-center gap-1.5">Pharmacist</span>
                                        ) : (
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-1 rounded inline-flex items-center gap-1.5">Doctor</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1.5">
                                            <button onClick={() => { setViewDoc(doc); setShowPassword(false); setIsEditingPassword(false); }} className={`p-2 rounded-lg transition-all btn-hover-lift ${isDarkMode ? 'text-slate-500 hover:text-blue-400 hover:bg-blue-500/10' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`} title="View"><Eye className="w-4 h-4" /></button>
                                            {doc.status === 'pending' && (<><button onClick={() => onUpdateStatus(doc.id, 'active')} className="p-2 text-emerald-400 bg-emerald-500/10 rounded-lg hover:bg-emerald-500/20 btn-hover-lift"><CheckCircle className="w-4 h-4" /></button><button onClick={() => onUpdateStatus(doc.id, 'rejected')} className="p-2 text-rose-400 bg-rose-500/10 rounded-lg hover:bg-rose-500/20 btn-hover-lift"><XCircle className="w-4 h-4" /></button></>)}
                                            {doc.status === 'active' && <button onClick={() => onUpdateStatus(doc.id, 'rejected')} className="text-[10px] font-bold text-rose-400 border border-rose-500/30 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 btn-hover-lift">Revoke</button>}
                                            {doc.status === 'rejected' && <button onClick={() => onUpdateStatus(doc.id, 'active')} className="text-[10px] font-bold text-emerald-400 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg hover:bg-emerald-500/10 btn-hover-lift">Restore</button>}
                                            <button onClick={() => onDelete(doc.id)} className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all btn-hover-lift ml-1"><Trash2 className="w-4 h-4" /></button>
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
                            <button onClick={() => setViewDoc(null)} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-gray-100 text-slate-500'}`}><X className="w-5 h-5" /></button>
                        </div>
                            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            {/* PRC License ID Image */}
                            <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                                {viewDoc.licenseImage ? (
                                    <div className="relative group cursor-pointer" onClick={() => setShowLicenseFullscreen(true)}>
                                        <img src={viewDoc.licenseImage} alt="PRC License ID" className="w-full h-48 object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white text-xs font-bold">
                                                <ZoomIn className="w-4 h-4" /> Click to view full size
                                            </div>
                                        </div>
                                        <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-[9px] font-bold flex items-center gap-1 ${isDarkMode ? 'bg-emerald-500/90 text-white' : 'bg-emerald-500 text-white'}`}>
                                            <FileBadge className="w-3 h-3" /> PRC License ID
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 text-center">
                                        <FileBadge className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                                        <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>PRC License ID</p>
                                        <p className="text-xs text-slate-500">No image uploaded</p>
                                    </div>
                                )}
                            </div>

                            {[
                                {
                                    label: 'Account Credentials', fields: [
                                        { label: 'Full Name', value: viewDoc.name, span: 2 },
                                        { label: 'Email', value: viewDoc.email, mono: true, span: 2 },
                                        { label: 'Password', isPassword: true },
                                    ]
                                },
                                {
                                    label: 'Clinic Information', fields: [
                                        { label: 'Clinic Name', value: viewDoc.clinicDetails?.name || 'N/A', span: 2 },
                                        { label: 'Address', value: viewDoc.clinicDetails?.address || 'N/A', span: 2 },
                                        { label: 'Contact', value: viewDoc.clinicDetails?.contactNumber || 'N/A' },
                                        { label: 'License No', value: viewDoc.license, mono: true },
                                        { label: 'PTR No', value: viewDoc.clinicDetails?.ptr || 'N/A', mono: true },
                                        { label: 'S2 License', value: viewDoc.clinicDetails?.s2 || 'N/A', mono: true },
                                    ]
                                },
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
                                                            <button onClick={async () => { if (!newPasswordVal.trim()) return; await onUpdatePassword(viewDoc.id, newPasswordVal); setIsEditingPassword(false); setViewDoc(prev => ({ ...prev, password: newPasswordVal })); }} className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg btn-hover-lift"><CheckSquare className="w-4 h-4" /></button>
                                                            <button onClick={() => setIsEditingPassword(false)} className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg btn-hover-lift"><X className="w-4 h-4" /></button>
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

            {/* Fullscreen License Image Viewer */}
            {showLicenseFullscreen && viewDoc?.licenseImage && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 cursor-pointer" onClick={() => setShowLicenseFullscreen(false)}>
                    <div className="relative max-w-3xl w-full animate-scale-in" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowLicenseFullscreen(false)} className="absolute -top-12 right-0 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all">
                            <X className="w-5 h-5" />
                        </button>
                        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            <img src={viewDoc.licenseImage} alt="PRC License ID - Full View" className="w-full max-h-[80vh] object-contain bg-black" />
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-3 text-slate-400 text-xs">
                            <FileBadge className="w-3.5 h-3.5" />
                            <span className="font-bold">PRC License ID — {viewDoc.name}</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
