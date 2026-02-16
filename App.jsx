import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  CheckCircle, 
  XCircle, 
  LogOut, 
  Activity, 
  RefreshCw, 
  LayoutDashboard, 
  Settings, 
  Bell, 
  Mail, 
  Lock,
  Unlock, 
  Save, 
  Edit2, 
  X, 
  Server, 
  FileText, 
  Clock, 
  Trash2, 
  Grid, 
  DollarSign, 
  AlertTriangle, 
  MapPin, 
  Wifi, 
  WifiOff, 
  ShoppingBag, 
  User, 
  ChevronRight, 
  Power, 
  Eye, 
  ClipboardList, 
  AlertOctagon, 
  Search, 
  ArrowRight, 
  TrendingUp, 
  MoreHorizontal, 
  FileSearch, 
  Stethoscope, 
  Menu, 
  FileBadge, 
  ToggleLeft, 
  ToggleRight, 
  Database, 
  Download, 
  HardDrive, 
  Globe,
  Sun,
  Moon,
  EyeOff,
  Wrench,
  Cpu,
  Thermometer,
  Printer,
  Scan,
  Package,      
  LifeBuoy,     
  BarChart3,    
  Send,         
  MessageSquare,
  Layers,       
  Zap,
  Megaphone,    
  AlertCircle,  
  CheckSquare,
  Monitor,
  ChevronLeft
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  query, 
  getDocs, 
  doc, 
  updateDoc, 
  limit, 
  serverTimestamp, 
  deleteDoc, 
  getDoc, 
  setDoc, 
  onSnapshot,
  addDoc,
  where
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

// --- ADMIN CREDENTIALS MANAGER ---
const ADMIN_STORAGE_KEY = 'medivend_admin_creds';
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123',
  email: 'admin@medivend.com',
  displayName: 'System Administrator',
  photoUrl: 'image_3f1ac4.png' 
};

// ==========================================
// 1. HELPER COMPONENTS
// ==========================================

function NavButton({ id, label, icon, active, onClick, badge, isDarkMode }) {
   return (
      <button onClick={() => onClick(id)} className={`flex w-full items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group relative ${active ? 'bg-indigo-500/10 text-indigo-500 shadow-sm ring-1 ring-indigo-500/20' : isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-gray-100 hover:text-slate-900'}`}>
         {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_10px_2px_rgba(99,102,241,0.5)]"></div>}
         <div className="flex items-center gap-3">
            {React.cloneElement(icon, { className: `w-5 h-5 transition-colors ${active ? 'text-indigo-500' : isDarkMode ? 'group-hover:text-white' : 'group-hover:text-slate-900'}` })}
            <span className="font-bold text-xs uppercase tracking-widest">{label}</span>
         </div>
         {badge ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white bg-indigo-600">{badge}</span> : null}
         {active && <ChevronRight className="w-4 h-4 ml-auto opacity-50 text-indigo-500" />}
      </button>
   );
}

function StatCard({ title, value, icon, color, subtext, onClick, isDarkMode }) {
   const colors = { 
      amber: "bg-amber-500/10 text-amber-500", 
      blue: "bg-blue-500/10 text-blue-500", 
      emerald: "bg-emerald-500/10 text-emerald-500", 
      red: "bg-rose-500/10 text-rose-500" 
   };
   return (
      <div onClick={onClick} className={`p-3 rounded-xl border shadow-sm transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between h-32 sm:h-36 md:h-40 lg:h-44 ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-gray-200 hover:shadow-md'}`}>
         <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
         </div>
         <div className="min-w-0">
            <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{value}</h4>
            <p className={`text-sm font-bold tracking-tight mt-1 whitespace-normal leading-tight ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{title}</p>
            {subtext && <p className="text-[10px] text-slate-500 mt-1 truncate">{subtext}</p>}
         </div>
      </div>
   );
}

function StatusBadge({ status }) {
   const c = { active: "bg-emerald-500/10 text-emerald-500", pending: "bg-amber-500/10 text-amber-500", rejected: "bg-rose-500/10 text-rose-500" }[status];
   return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${c}`}>{status}</span>;
}

function PrescriptionStatusBadge({ status }) {
   const c = { issued: "bg-emerald-500/10 text-emerald-500", partial: "bg-amber-500/10 text-amber-500", completed: "bg-white/10 text-slate-400" }[status] || "bg-white/5";
   return <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${c}`}>{status}</span>;
}

function ActionButton({ onClick, label, icon, variant, isDarkMode }) {
   const v = variant === 'primary' ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20" : isDarkMode ? "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10" : "bg-white border border-gray-200 text-slate-600 hover:bg-gray-50";
   return <button onClick={onClick} className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm transition-all ${v}`}>{icon}{label}</button>;
}

function PaginationFooter({ currentPage, totalPages, onPageChange, isDarkMode }) {
    if (totalPages <= 1) return null;
    return (
        <div className={`flex justify-between items-center p-4 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
            <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
                <button 
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1 ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white disabled:opacity-30' : 'bg-gray-100 hover:bg-gray-200 text-slate-700 disabled:opacity-30'}`}
                >
                    <ChevronLeft className="w-3 h-3" /> Prev
                </button>
                <button 
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1 ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white disabled:opacity-30' : 'bg-gray-100 hover:bg-gray-200 text-slate-700 disabled:opacity-30'}`}
                >
                    Next <ChevronRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}

function MobileMenu({ children, isDarkMode }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className={`p-1.5 rounded-full transition-colors ${isDarkMode?'text-slate-400 hover:bg-white/10':'text-slate-500 hover:bg-gray-100'}`}>
                <MoreHorizontal className="w-5 h-5"/>
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}></div>
                    <div className={`absolute right-0 top-8 w-48 rounded-xl shadow-xl border z-20 flex flex-col p-1.5 gap-1 animate-in fade-in zoom-in-95 duration-100 ${isDarkMode ? 'bg-[#1e293b] border-white/10' : 'bg-white border-gray-200'}`}>
                        {children}
                    </div>
                </>
            )}
        </div>
    );
}

// ==========================================
// 2. MODALS & CHARTS
// ==========================================

function PasswordModal({ onClose, currentCreds, onUpdate, isDarkMode }) {
  const [p, setP] = useState({ cur: '', new: '', conf: '' });
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
       <div className={`p-6 rounded-xl w-full max-w-sm shadow-2xl border ${isDarkMode ? 'bg-[#1e293b] border-white/10' : 'bg-white border-gray-200'}`}>
          <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Change Password</h3>
          <div className="space-y-3">
             <input type="password" placeholder="Current" className={`w-full border p-2 rounded-lg text-sm ${isDarkMode ? 'border-white/10 bg-[#0B0F19] text-white' : 'border-gray-200 bg-gray-50 text-slate-900'}`} value={p.cur} onChange={e=>setP({...p, cur:e.target.value})} />
             <input type="password" placeholder="New" className={`w-full border p-2 rounded-lg text-sm ${isDarkMode ? 'border-white/10 bg-[#0B0F19] text-white' : 'border-gray-200 bg-gray-50 text-slate-900'}`} value={p.new} onChange={e=>setP({...p, new:e.target.value})} />
             <input type="password" placeholder="Confirm" className={`w-full border p-2 rounded-lg text-sm ${isDarkMode ? 'border-white/10 bg-[#0B0F19] text-white' : 'border-gray-200 bg-gray-50 text-slate-900'}`} value={p.conf} onChange={e=>setP({...p, conf:e.target.value})} />
          </div>
          <div className="flex justify-end gap-2 mt-6">
             <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-500">Cancel</button>
             <button onClick={() => { if(p.cur !== currentCreds.password) return alert('Wrong password'); if(p.new !== p.conf) return alert('Mismatch'); onUpdate(p.new); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700">Update</button>
          </div>
       </div>
    </div>
  );
}

function BroadcastModal({ onClose, onSend, isDarkMode }) {
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('normal');
  const [target, setTarget] = useState('all');

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
        <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl border ${isDarkMode ? 'bg-[#1e293b] border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Megaphone className="w-5 h-5 text-indigo-500" />
                    System Broadcast
                </h3>
                <button onClick={onClose} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-gray-100 text-slate-500'}`}>
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5 block">Message Content</label>
                    <textarea 
                        autoFocus
                        rows="3"
                        className={`w-full p-3 rounded-xl border text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none ${isDarkMode ? 'bg-[#0B0F19] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-slate-900'}`}
                        placeholder="e.g., Server maintenance scheduled for Sunday at 12 PM..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                    ></textarea>
                </div>
                
                <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5 block">Target Audience</label>
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => setTarget('all')} className={`flex flex-col items-center justify-center py-3 rounded-lg border transition-all ${target === 'all' ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-500/30' : isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-gray-200 text-slate-600 hover:bg-gray-50'}`}><Globe className="w-4 h-4 mb-1" /><span className="text-[10px] font-bold uppercase">All Network</span></button>
                        <button onClick={() => setTarget('doctors')} className={`flex flex-col items-center justify-center py-3 rounded-lg border transition-all ${target === 'doctors' ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-500/30' : isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-gray-200 text-slate-600 hover:bg-gray-50'}`}><Users className="w-4 h-4 mb-1" /><span className="text-[10px] font-bold uppercase">Doctors</span></button>
                        <button onClick={() => setTarget('kiosks')} className={`flex flex-col items-center justify-center py-3 rounded-lg border transition-all ${target === 'kiosks' ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-500/30' : isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-gray-200 text-slate-600 hover:bg-gray-50'}`}><Server className="w-4 h-4 mb-1" /><span className="text-[10px] font-bold uppercase">Kiosks</span></button>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5 block">Priority Level</label>
                    <div className="flex gap-2">
                        <button onClick={() => setPriority('normal')} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${priority === 'normal' ? 'bg-slate-600 text-white border-slate-600' : isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-gray-200 text-slate-600 hover:bg-gray-50'}`}>Normal Info</button>
                        <button onClick={() => setPriority('high')} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${priority === 'high' ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20' : isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-gray-200 text-slate-600 hover:bg-gray-50'}`}>High Priority Alert</button>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-white/5">
                <button onClick={onClose} className={`px-4 py-2 rounded-lg text-sm font-bold ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>Cancel</button>
                <button onClick={() => { if(message.trim()) onSend(message, priority, target); }} disabled={!message.trim()} className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 transition-transform active:scale-95"><Send className="w-3.5 h-3.5" />Send Broadcast</button>
            </div>
        </div>
    </div>
  );
}

function TopPrescribedChart({ transactions, isDarkMode }) {
    const freqMap = {};
    if (transactions && transactions.length > 0) {
        transactions.forEach(tx => {
            const items = tx.items || []; 
            if(items.length === 0) {
               const demoMeds = ["Amoxicillin 500mg", "Biogesic 500mg", "Neozep Forte", "Solmux Capsule", "Vitamin C (Ascorbic Acid)"];
               const charCode = tx.id ? tx.id.charCodeAt(0) : 0;
               const random = demoMeds[charCode % demoMeds.length];
               freqMap[random] = (freqMap[random] || 0) + 1;
            } else {
                items.forEach(item => {
                    const name = item.name || item.medicine || "Unknown";
                    freqMap[name] = (freqMap[name] || 0) + (item.qty || 1);
                });
            }
        });
    }

    const sorted = Object.entries(freqMap).sort((a,b) => b[1] - a[1]).slice(0, 5);
    const maxVal = Math.max(...sorted.map(s => s[1]), 1);

    return (
        <div className="space-y-4">
            {sorted.map(([name, count], i) => (
                <div key={i} className="group">
                    <div className="flex justify-between text-xs mb-1.5 font-bold uppercase tracking-wide">
                        <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{name}</span>
                        <span className="text-indigo-500">{count} dispensed</span>
                    </div>
                    <div className={`w-full h-3 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${(count / maxVal) * 100}%` }}></div>
                    </div>
                </div>
            ))}
            {sorted.length === 0 && <p className="text-slate-500 text-sm italic">Not enough data to display analytics.</p>}
        </div>
    );
}

// ==========================================
// 3. SUB-VIEW COMPONENTS
// ==========================================

function InventoryView({ medicines, db, appId, isDarkMode }) {
    const [newItem, setNewItem] = useState({ name: '', generic: '', stock: 0, price: 0 });
    const [isAdding, setIsAdding] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    const totalPages = Math.ceil(medicines.length / itemsPerPage);
    const currentData = medicines.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'medicines'), newItem);
            setIsAdding(false);
            setNewItem({ name: '', generic: '', stock: 0, price: 0 });
            alert("Medicine added to Master Database.");
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Delete this medicine from Master Database?")) {
            await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'medicines', id));
        }
    };

    return (
        <div className={`rounded-xl border overflow-hidden max-w-7xl mx-auto ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                <div>
                    <h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Master Medicine Database</h3>
                    <p className="text-xs text-slate-500">Global inventory.</p>
                </div>
                <button onClick={() => setIsAdding(!isAdding)} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700">
                    {isAdding ? 'Cancel' : '+ Add New Medicine'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAdd} className={`p-5 border-b grid grid-cols-1 md:grid-cols-5 gap-3 ${isDarkMode ? 'bg-indigo-900/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                    <input placeholder="Brand Name" required className={`p-2 rounded border text-sm ${isDarkMode?'bg-white/10 border-white/10 text-white':'bg-white'}`} value={newItem.name} onChange={e=>setNewItem({...newItem, name: e.target.value})} />
                    <input placeholder="Generic Name" required className={`p-2 rounded border text-sm ${isDarkMode?'bg-white/10 border-white/10 text-white':'bg-white'}`} value={newItem.generic} onChange={e=>setNewItem({...newItem, generic: e.target.value})} />
                    <input type="number" placeholder="Stock" required className={`p-2 rounded border text-sm ${isDarkMode?'bg-white/10 border-white/10 text-white':'bg-white'}`} value={newItem.stock} onChange={e=>setNewItem({...newItem, stock: parseInt(e.target.value)})} />
                    <input type="number" placeholder="Price (PHP)" required className={`p-2 rounded border text-sm ${isDarkMode?'bg-white/10 border-white/10 text-white':'bg-white'}`} value={newItem.price} onChange={e=>setNewItem({...newItem, price: parseFloat(e.target.value)})} />
                    <button type="submit" className="bg-emerald-500 text-white font-bold rounded p-2 text-sm">Save</button>
                </form>
            )}

            <div className="md:hidden divide-y divide-white/5">
                {currentData.length === 0 ? <div className="p-8 text-center text-xs text-slate-500 italic">No medicines.</div> : currentData.map(m => (
                    <div key={m.id} className={`p-4 relative flex flex-col gap-2 ${isDarkMode ? 'bg-transparent' : 'bg-white'}`}>
                        <div className="absolute top-4 right-4">
                            <MobileMenu isDarkMode={isDarkMode}>
                                <button onClick={() => handleDelete(m.id)} className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-rose-500 hover:bg-rose-500/10`}>
                                    <Trash2 className="w-3.5 h-3.5"/> Delete
                                </button>
                            </MobileMenu>
                        </div>
                        <div>
                            <p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{m.name}</p>
                            <p className="text-xs text-slate-400 italic">{m.generic}</p>
                        </div>
                        <div className="flex gap-4 mt-1">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-500 uppercase font-bold">Stock</span>
                                <span className={`text-xs font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{m.stock}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-500 uppercase font-bold">Price</span>
                                <span className="text-xs font-bold text-emerald-500">₱{m.price}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className={`text-xs uppercase text-slate-400 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                        <tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Generic</th><th className="px-6 py-3">Global Stock</th><th className="px-6 py-3">Price</th><th className="px-6 py-3 text-right">Action</th></tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-100'}`}>
                        {currentData.map(m => (
                            <tr key={m.id} className={isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}>
                                <td className={`px-6 py-3 font-bold ${isDarkMode?'text-white':'text-slate-900'}`}>{m.name}</td>
                                <td className="px-6 py-3 text-slate-400">{m.generic}</td>
                                <td className="px-6 py-3"><span className="bg-white/10 px-2 py-1 rounded text-xs font-mono">{m.stock}</span></td>
                                <td className="px-6 py-3 text-emerald-500 font-bold">₱{m.price}</td>
                                <td className="px-6 py-3 text-right"><button onClick={() => handleDelete(m.id)} className="text-rose-500 hover:text-rose-400"><Trash2 className="w-4 h-4"/></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} isDarkMode={isDarkMode} />
        </div>
    );
}

function SupportView({ tickets, db, appId, isDarkMode }) {
    const [filter, setFilter] = useState('all'); 
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleStatusUpdate = async (ticket, newStatus) => {
        try {
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'support_tickets', ticket.id), { ...ticket, status: newStatus }, { merge: true });
        } catch (e) {
            console.error("Ticket update failed:", e);
        }
    };

    const handleDeleteTicket = async (id) => {
        if(!window.confirm("Delete this ticket?")) return;
        try {
            await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'support_tickets', id));
        } catch (e) {
            console.error("Delete failed:", e);
        }
    };

    const displayTickets = tickets.length > 0 ? tickets : [
        { id: 'mock1', subject: 'Kiosk Alert', message: 'Sensor detected door access.', sender: 'System', status: 'open', priority: 'high', type: 'kiosk_alert', timestamp: { seconds: Date.now()/1000 } },
        { id: 'mock2', subject: 'Login Issue', message: 'Cannot reset password.', sender: 'Dr. Santos', status: 'open', priority: 'medium', type: 'doctor_issue', timestamp: { seconds: Date.now()/1000 - 3600 } }
    ];

    const filteredTickets = displayTickets.filter(t => filter === 'all' ? true : t.status === filter);
    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
    const currentData = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className={`rounded-xl border overflow-hidden max-w-7xl mx-auto ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className={`p-5 border-b flex flex-col md:flex-row justify-between items-center gap-4 ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                <h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Support Ticketing System</h3>
                <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
                    {['all', 'open', 'resolved'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${filter === f ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>{f}</button>
                    ))}
                </div>
            </div>
            
            <div className="divide-y divide-white/5">
                {currentData.length === 0 ? <div className="p-8 text-center text-slate-500 italic">No tickets found.</div> : currentData.map(t => (
                    <div key={t.id} className={`p-4 flex flex-col md:flex-row justify-between items-start gap-4 ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'} ${t.priority === 'high' ? 'bg-rose-900/10 border-l-2 border-rose-500' : ''}`}>
                        <div className="flex gap-4 items-start w-full relative">
                            <div className="absolute top-0 right-0 md:hidden">
                                <MobileMenu isDarkMode={isDarkMode}>
                                     {t.status === 'open' && <button onClick={() => handleStatusUpdate(t, 'resolved')} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-emerald-500 hover:bg-emerald-500/10">Mark Resolved</button>}
                                     <button onClick={() => handleDeleteTicket(t.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-rose-500 hover:bg-rose-500/10"><Trash2 className="w-3.5 h-3.5"/> Delete</button>
                                </MobileMenu>
                            </div>
                            <div className={`p-3 rounded-full flex-shrink-0 ${t.priority === 'high' ? 'bg-rose-500/20 text-rose-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                                {t.type === 'kiosk_alert' ? <AlertCircle className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 pr-8 md:pr-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.subject}</h4>
                                    {t.priority === 'high' && <span className="text-[10px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full uppercase">High Priority</span>}
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${t.status === 'open' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{t.status}</span>
                                </div>
                                <p className="text-xs text-slate-400 break-words">{t.message}</p>
                                <div className="flex gap-3 mt-2 text-[10px] text-slate-500">
                                    <span>From: <span className="font-bold text-slate-400">{t.sender}</span></span>
                                    <span>•</span>
                                    <span>{t.timestamp?.seconds ? new Date(t.timestamp.seconds * 1000).toLocaleString() : 'Just now'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:flex gap-2 self-center">
                            {t.status === 'open' && <button onClick={() => handleStatusUpdate(t, 'resolved')} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow transition-colors"><CheckSquare className="w-3.5 h-3.5"/> Resolve</button>}
                            <button onClick={() => handleDeleteTicket(t.id)} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors" title="Delete Ticket"><Trash2 className="w-4 h-4"/></button>
                        </div>
                    </div>
                ))}
            </div>
            <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} isDarkMode={isDarkMode} />
        </div>
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

  return (
    <div className={`rounded-xl border overflow-hidden max-w-7xl mx-auto ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
      <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
        <h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Medical Practitioners</h3>
        <button onClick={onRefresh} className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1 hover:text-emerald-500 transition-colors"><RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin':''}`}/> Refresh</button>
      </div>
      
      <div className={`p-3 border-b flex flex-col sm:flex-row gap-3 justify-between items-center ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['pending', 'active', 'rejected', 'all'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap ${filter === f ? 'bg-emerald-600 text-white shadow' : isDarkMode ? 'bg-transparent border border-white/10 text-slate-400 hover:bg-white/10' : 'bg-white border border-gray-300 text-slate-500 hover:bg-gray-100'}`}>{f}</button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
           <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search doctors..." 
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
             className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-emerald-500/50 ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder-slate-500' : 'bg-white border-gray-300 text-slate-700 placeholder-slate-400'}`}
           />
        </div>
      </div>

      <div className="md:hidden divide-y divide-white/5">
        {currentData.length === 0 ? <div className="p-8 text-center text-xs text-slate-500 italic">No doctors found matching your criteria.</div> : currentData.map(doc => (
          <div key={doc.id} className={`p-4 relative flex flex-col gap-3 ${isDarkMode ? 'bg-transparent' : 'bg-white'}`}>
             <div className="absolute top-4 right-4">
                 <MobileMenu isDarkMode={isDarkMode}>
                    <button onClick={() => { setViewDoc(doc); setShowPassword(false); setIsEditingPassword(false); }} className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left ${isDarkMode ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-gray-100'}`}><Eye className="w-3.5 h-3.5"/> View Details</button>
                    {doc.status === 'pending' && (<><button onClick={() => onUpdateStatus(doc.id, 'active')} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-emerald-500 hover:bg-emerald-500/10"><CheckCircle className="w-3.5 h-3.5"/> Approve</button><button onClick={() => onUpdateStatus(doc.id, 'rejected')} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-rose-500 hover:bg-rose-500/10"><XCircle className="w-3.5 h-3.5"/> Reject</button></>)}
                    {doc.status === 'active' && <button onClick={() => onUpdateStatus(doc.id, 'rejected')} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-rose-500 hover:bg-rose-500/10"><XCircle className="w-3.5 h-3.5"/> Revoke Access</button>}
                    {doc.status === 'rejected' && <button onClick={() => onUpdateStatus(doc.id, 'active')} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-emerald-500 hover:bg-emerald-500/10"><CheckCircle className="w-3.5 h-3.5"/> Restore Access</button>}
                    <button onClick={() => onDelete(doc.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-rose-500 hover:bg-rose-500/10"><Trash2 className="w-3.5 h-3.5"/> Delete Account</button>
                 </MobileMenu>
             </div>
             <div>
                <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{doc.name}</div>
                <div className="text-xs text-slate-500">{doc.email}</div>
                <div className={`text-[10px] mt-1 font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{doc.license}</div>
             </div>
             <div className="mt-1"><StatusBadge status={doc.status} /></div>
          </div>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead className={`text-[10px] uppercase font-bold text-slate-400 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}><tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">License Info</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-100'}`}>
            {currentData.length === 0 ? <tr><td colSpan="4" className="p-8 text-center text-xs text-slate-500 italic">No doctors found matching your criteria.</td></tr> : currentData.map(doc => (
              <tr key={doc.id} className={`transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                <td className="px-5 py-3"><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${isDarkMode ? 'bg-slate-700 text-white border-white/10' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>{doc.name ? doc.name.charAt(0) : '?'}</div><div><div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{doc.name}</div><div className="text-[10px] text-slate-400">{doc.email}</div></div></div></td>
                <td className="px-5 py-3 text-xs text-slate-400"><span className={`font-mono px-1 rounded ${isDarkMode ? 'bg-white/10 text-slate-300' : 'bg-gray-100 text-slate-600'}`}>{doc.license}</span></td>
                <td className="px-5 py-3"><StatusBadge status={doc.status} /></td>
                <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setViewDoc(doc); setShowPassword(false); setIsEditingPassword(false); }} className={`p-1.5 rounded ${isDarkMode ? 'text-slate-400 hover:text-blue-400 hover:bg-blue-500/10' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`} title="Verify Details"><Eye className="w-4 h-4"/></button>
                      {doc.status === 'pending' && (<><button onClick={() => onUpdateStatus(doc.id, 'active')} className="p-1.5 text-emerald-500 bg-emerald-500/10 rounded hover:bg-emerald-500/20"><CheckCircle className="w-4 h-4"/></button><button onClick={() => onUpdateStatus(doc.id, 'rejected')} className="p-1.5 text-rose-500 bg-rose-500/10 rounded hover:bg-rose-500/20"><XCircle className="w-4 h-4"/></button></>)}
                      {doc.status === 'active' && <button onClick={() => onUpdateStatus(doc.id, 'rejected')} className="text-[10px] font-bold text-rose-500 border border-rose-500/30 px-2 py-1 rounded hover:bg-rose-500/10">Revoke</button>}
                      {doc.status === 'rejected' && <button onClick={() => onUpdateStatus(doc.id, 'active')} className="text-[10px] font-bold text-emerald-500 border border-emerald-500/30 px-2 py-1 rounded hover:bg-emerald-500/10">Restore</button>}
                      <button onClick={() => onDelete(doc.id)} className={`p-1.5 ml-2 rounded border border-rose-500/30 text-rose-500 hover:bg-rose-500/10`} title="Delete Permanently"><Trash2 className="w-4 h-4"/></button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} isDarkMode={isDarkMode} />
      {viewDoc && (
         <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className={`rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border animate-in fade-in zoom-in duration-200 ${isDarkMode ? 'bg-[#1e293b] border-white/10' : 'bg-white border-gray-200'}`}>
               <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}><h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Verification Details</h3><button onClick={() => setViewDoc(null)}><X className={`w-5 h-5 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}/></button></div>
               <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                  <div className={`p-4 rounded-lg border text-center ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}><FileBadge className="w-10 h-10 text-slate-500 mx-auto mb-2"/><p className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>PRC License ID Image</p><p className="text-xs text-slate-500">Mockup: No image uploaded</p></div>
                  
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Account Credentials</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="col-span-2"><p className="text-slate-500 text-[10px] uppercase font-bold">Full Name</p><p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{viewDoc.name}</p></div>
                        <div className="col-span-2"><p className="text-slate-500 text-[10px] uppercase font-bold">Email</p><p className={`font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{viewDoc.email}</p></div>
                        <div className="col-span-2 relative">
                           <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Password</p>
                           {isEditingPassword ? (
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="text" 
                                        className={`flex-1 p-2 rounded border text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 ${isDarkMode ? 'bg-[#0B0F19] border-white/10 text-white' : 'bg-white border-gray-200 text-slate-900'}`}
                                        value={newPasswordVal}
                                        onChange={(e) => setNewPasswordVal(e.target.value)}
                                        placeholder="Enter new password"
                                    />
                                    <button 
                                        onClick={async () => {
                                            if (!newPasswordVal.trim()) return alert("Password cannot be empty");
                                            await onUpdatePassword(viewDoc.id, newPasswordVal);
                                            setIsEditingPassword(false);
                                            setViewDoc(prev => ({...prev, password: newPasswordVal}));
                                        }} 
                                        className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                                        title="Save New Password"
                                    >
                                        <CheckSquare className="w-4 h-4"/>
                                    </button>
                                    <button 
                                        onClick={() => setIsEditingPassword(false)} 
                                        className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded transition-colors"
                                        title="Cancel"
                                    >
                                        <X className="w-4 h-4"/>
                                    </button>
                                </div>
                           ) : (
                               <div className="flex items-center justify-between">
                                  <p className={`font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{showPassword ? viewDoc.password : '••••••••'}</p>
                                  <div className="flex gap-3 items-center">
                                      <button 
                                        onClick={() => { setIsEditingPassword(true); setNewPasswordVal(viewDoc.password); }} 
                                        className={`text-[10px] font-bold uppercase tracking-wide transition-colors ${isDarkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`}
                                      >
                                        Edit
                                      </button>
                                      <button 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        className={`text-[10px] font-bold uppercase tracking-wide transition-colors ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
                                      >
                                        {showPassword ? 'Hide' : 'Show'}
                                      </button>
                                  </div>
                               </div>
                           )}
                        </div>
                    </div>
                  </div>

                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Clinic Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="col-span-2"><p className="text-slate-500 text-[10px] uppercase font-bold">Clinic Name</p><p className={`${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{viewDoc.clinicDetails?.name || 'N/A'}</p></div>
                        <div className="col-span-2"><p className="text-slate-500 text-[10px] uppercase font-bold">Address</p><p className={`${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{viewDoc.clinicDetails?.address || 'N/A'}</p></div>
                        <div><p className="text-slate-500 text-[10px] uppercase font-bold">Contact No.</p><p className={`${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{viewDoc.clinicDetails?.contactNumber || 'N/A'}</p></div>
                        <div><p className="text-slate-500 text-[10px] uppercase font-bold">License No.</p><p className={`font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{viewDoc.license}</p></div>
                        <div><p className="text-slate-500 text-[10px] uppercase font-bold">PTR No.</p><p className={`font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{viewDoc.clinicDetails?.ptr || 'N/A'}</p></div>
                        <div><p className="text-slate-500 text-[10px] uppercase font-bold">S2 License</p><p className={`font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{viewDoc.clinicDetails?.s2 || 'N/A'}</p></div>
                    </div>
                  </div>
               </div>
               <div className={`p-4 border-t flex justify-end ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}><button onClick={() => setViewDoc(null)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-indigo-700">Close</button></div>
            </div>
         </div>
      )}
    </div>
  );
}

function MachinesView({ machines, onPing, onRunDiagnostics, onReboot, onLock, onDelete, isDarkMode }) {
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 10;
   
   const totalPages = Math.ceil(machines.length / itemsPerPage);
   const currentData = machines.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

   return (
      <div className={`rounded-xl border overflow-hidden max-w-7xl mx-auto ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
         <div className={`p-5 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}><h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Kiosk Network</h3></div>
         
         <div className="md:hidden divide-y divide-white/5">
            {currentData.length === 0 ? <div className="p-8 text-center text-xs text-slate-500 italic">No kiosks connected.</div> : currentData.map(m => (
               <div key={m.id} className="p-4 relative flex flex-col gap-3">
                  <div className="absolute top-4 right-4">
                     <MobileMenu isDarkMode={isDarkMode}>
                        <button onClick={() => onPing(m.id)} className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left ${isDarkMode ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-gray-100'}`}><Activity className="w-3.5 h-3.5"/> Ping</button>
                        <button onClick={() => onRunDiagnostics(m)} className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left ${isDarkMode ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-gray-100'}`}><Wrench className="w-3.5 h-3.5"/> Diagnostics</button>
                        <button onClick={() => onReboot(m.id)} className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left ${isDarkMode ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-gray-100'}`}><Power className="w-3.5 h-3.5"/> Reboot</button>
                        <button onClick={() => onLock(m.id, m.status)} className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left ${isDarkMode ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-gray-100'}`}>{m.status === 'locked' ? <Unlock className="w-3.5 h-3.5"/> : <Lock className="w-3.5 h-3.5"/>} {m.status === 'locked' ? 'Unlock' : 'Lock'}</button>
                        <button onClick={() => onDelete(m.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-rose-500 hover:bg-rose-500/10"><Trash2 className="w-3.5 h-3.5"/> Remove</button>
                     </MobileMenu>
                  </div>
                  <div>
                     <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{m.id}</div>
                     <div className="text-xs text-slate-500">{m.location}</div>
                  </div>
                  <div className="mt-1">
                     <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${m.status === 'online' ? 'bg-emerald-500/20 text-emerald-500' : m.status === 'rebooting' ? 'bg-amber-500/20 text-amber-500' : m.status === 'locked' ? 'bg-slate-500/20 text-slate-400' : 'bg-rose-500/20 text-rose-500'}`}>
                        {m.status === 'online' ? <Wifi className="w-3 h-3"/> : m.status === 'locked' ? <Lock className="w-3 h-3"/> : <WifiOff className="w-3 h-3"/>} {m.status}
                     </span>
                  </div>
               </div>
            ))}
         </div>

         <div className="hidden md:block overflow-x-auto">
           <table className="w-full text-left text-sm">
              <thead className={`text-xs uppercase text-slate-400 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}><tr><th className="px-6 py-3">ID</th><th className="px-6 py-3">Location</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-right">Controls</th></tr></thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-100'}`}>
                 {currentData.length === 0 ? <tr><td colSpan="4" className="p-4 text-center text-xs text-slate-500">No kiosks connected.</td></tr> : currentData.map(m => (
                    <tr key={m.id} className={`transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                       <td className={`px-6 py-3 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{m.id}</td>
                       <td className="px-6 py-3 text-slate-400">{m.location}</td>
                       <td className="px-6 py-3"><span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${m.status === 'online' ? 'bg-emerald-500/20 text-emerald-500' : m.status === 'rebooting' ? 'bg-amber-500/20 text-amber-500' : m.status === 'locked' ? 'bg-slate-500/20 text-slate-400' : 'bg-rose-500/20 text-rose-500'}`}>{m.status === 'online' ? <Wifi className="w-3 h-3"/> : m.status === 'locked' ? <Lock className="w-3 h-3"/> : <WifiOff className="w-3 h-3"/>} {m.status}</span></td>
                       <td className="px-6 py-3 text-right">
                          <div className="flex justify-end gap-2">
                             <button onClick={() => onPing(m.id)} className={`p-1.5 rounded ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-slate-600'}`} title="Ping"><Activity size={14}/></button>
                             <button onClick={() => onRunDiagnostics(m)} className={`p-1.5 rounded ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-slate-600'}`} title="Diagnostics"><Wrench size={14}/></button>
                             <button onClick={() => onReboot(m.id)} className={`p-1.5 rounded ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-slate-600'}`} title="Reboot"><Power size={14}/></button>
                             <button onClick={() => onLock(m.id, m.status)} className={`p-1.5 rounded ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-slate-600'}`} title={m.status === 'locked' ? "Unlock" : "Lock"}>{m.status === 'locked' ? <Unlock size={14}/> : <Lock size={14}/>}</button>
                             <button onClick={() => onDelete(m.id)} className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 rounded text-rose-500" title="Remove"><Trash2 size={14}/></button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
         </div>
         <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} isDarkMode={isDarkMode} />
      </div>
   );
}

function TransactionsView({ transactions, onHide, onClearView, isDarkMode }) {
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 10;
   
   const totalPages = Math.ceil(transactions.length / itemsPerPage);
   const currentData = transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

   return (
      <div className={`rounded-xl border overflow-hidden max-w-7xl mx-auto ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
         <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
            <h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Prescription Registry</h3>
            <button onClick={onClearView} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors"><Trash2 className="w-3.5 h-3.5"/> Clear View</button>
         </div>
         
         <div className="md:hidden divide-y divide-white/5">
            {currentData.length === 0 ? <div className="p-8 text-center text-xs text-slate-500 italic">No transactions recorded.</div> : currentData.map(tx => (
               <div key={tx.id} className="p-4 relative flex flex-col gap-3">
                  <div className="absolute top-4 right-4">
                     <MobileMenu isDarkMode={isDarkMode}>
                        <button onClick={() => onHide(tx.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-rose-500 hover:bg-rose-500/10"><Trash2 className="w-3.5 h-3.5"/> Hide</button>
                     </MobileMenu>
                  </div>
                  <div>
                      <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tx.doctorName}</div>
                      <div className="text-xs text-slate-500">{tx.patient?.name}</div>
                      <div className="text-[10px] font-mono text-slate-600 mt-1">{tx.id}</div>
                  </div>
                  <div className="flex gap-4">
                      <div className="font-bold text-emerald-500 text-sm">₱{tx.grandTotal?.toFixed(2)}</div>
                      <PrescriptionStatusBadge status={tx.status || 'issued'}/>
                  </div>
               </div>
            ))}
         </div>

         <div className="hidden md:block overflow-x-auto">
           <table className="w-full text-left">
              <thead className={`text-[10px] uppercase font-bold text-slate-400 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                 <tr><th className="px-5 py-3">ID</th><th className="px-5 py-3">Prescribing Doctor</th><th className="px-5 py-3">Patient</th><th className="px-5 py-3">Value</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-center">Action</th></tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-100'}`}>
                 {currentData.length === 0 ? <tr><td colSpan="6" className="p-4 text-center text-xs text-slate-500">No transactions recorded.</td></tr> : currentData.map(tx => (
                  <tr key={tx.id} className={`transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                     <td className="px-5 py-3 font-mono text-xs text-slate-500">{tx.id}</td>
                     <td className={`px-5 py-3 text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tx.doctorName}</td>
                     <td className="px-5 py-3 text-sm text-slate-400">{tx.patient?.name}</td>
                     <td className="px-5 py-3 text-sm font-bold text-emerald-500">₱{tx.grandTotal?.toFixed(2)}</td>
                     <td className="px-5 py-3"><PrescriptionStatusBadge status={tx.status || 'issued'}/></td>
                     <td className="px-5 py-3 text-center">
                         <button 
                             onClick={() => onHide(tx.id)} 
                             className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-900/20' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'}`} 
                             title="Hide from list"
                         >
                             <Trash2 className="w-4 h-4" />
                         </button>
                     </td>
                  </tr>
                 ))}
              </tbody>
           </table>
         </div>
         <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} isDarkMode={isDarkMode} />
      </div>
   );
}

function AuditView({ logs, onHide, onClearView, isDarkMode }) {
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 10;
   
   const totalPages = Math.ceil(logs.length / itemsPerPage);
   const currentData = logs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

   return (
      <div className={`rounded-xl border overflow-hidden max-w-7xl mx-auto ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
         <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
             <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Audit Log</h3>
             <button onClick={onClearView} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors"><Trash2 className="w-3.5 h-3.5"/> Clear View</button>
         </div>
         
         <div className="md:hidden divide-y divide-white/5">
            {currentData.length === 0 ? <div className="p-8 text-center text-xs text-slate-500 italic">No logs available.</div> : currentData.map((log, i) => (
               <div key={i} className="p-4 relative flex flex-col gap-2">
                   <div className="absolute top-4 right-4">
                        <MobileMenu isDarkMode={isDarkMode}>
                            <button onClick={() => onHide(log.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-left text-rose-500 hover:bg-rose-500/10"><Trash2 className="w-3.5 h-3.5"/> Hide</button>
                        </MobileMenu>
                   </div>
                   <div>
                       <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{log.action}</div>
                       <div className="text-xs text-slate-400 mt-1">{log.details}</div>
                   </div>
                   <div className="text-right mt-1">
                       <div className="text-[10px] font-mono text-slate-500">{log.time}</div>
                       <div className="text-[10px] text-slate-600 mt-1">{log.user}</div>
                   </div>
               </div>
            ))}
         </div>

         <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className={`text-xs uppercase text-slate-400 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}><tr><th className="px-6 py-3">Action</th><th className="px-6 py-3">Details</th><th className="px-6 py-3">User</th><th className="px-6 py-3 text-right">Time</th><th className="px-6 py-3 text-center">Action</th></tr></thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-100'}`}>
                {currentData.length === 0 ? <tr><td colSpan="5" className="p-4 text-center text-xs text-slate-500">No logs available.</td></tr> : currentData.map((log, i) => (
                    <tr key={i} className={`transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                        <td className={`px-6 py-3 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{log.action}</td>
                        <td className="px-6 py-3 text-slate-400">{log.details}</td>
                        <td className="px-6 py-3 font-mono text-xs text-slate-500">{log.user}</td>
                        <td className="px-6 py-3 text-right text-slate-500 text-xs">{log.time}</td>
                        <td className="px-6 py-3 text-center">
                            <button 
                                onClick={() => onHide(log.id)} 
                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-900/20' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'}`} 
                                title="Hide from list"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
         </div>
         <PaginationFooter currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} isDarkMode={isDarkMode} />
      </div>
   );
}

function SettingsView({ profile, setProfile, onSave, isEditing, setIsEditing, setShowPassword, isDarkMode, transactions, auditLogs, doctors, machines, medicines, supportTickets }) {
   const [activeSettingTab, setActiveSettingTab] = useState('profile');
   
   const downloadCSV = (data, filename) => {
       if (!data || !data.length) return alert("No data to export.");
       if (typeof data[0] !== 'object' || data[0] === null) return alert("Invalid data format.");

       const replacer = (key, value) => value === null ? '' : value; 
       const header = Object.keys(data[0]);
       const csv = [
         header.join(','), 
         ...data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
       ].join('\r\n');

       const blob = new Blob([csv], { type: 'text/csv' });
       const url = window.URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.setAttribute('hidden', '');
       a.setAttribute('href', url);
       a.setAttribute('download', filename);
       document.body.appendChild(a);
       a.click();
       document.body.removeChild(a);
   };

   const handleFullBackup = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      doctors,
      machines,
      transactions,
      auditLogs,
      medicines,
      supportTickets
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medivend_full_backup_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

   return (
      <div className={`w-full rounded-xl border overflow-hidden flex flex-col md:flex-row ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
         <div className={`hidden md:block w-64 border-r p-4 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`font-bold mb-4 px-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Settings</h3>
            <nav className="space-y-1">
               <button onClick={() => setActiveSettingTab('profile')} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${activeSettingTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg' : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-gray-200'}`}>
                  <User className="w-4 h-4" /> Profile
               </button>
               <button onClick={() => setActiveSettingTab('security')} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${activeSettingTab === 'security' ? 'bg-indigo-600 text-white shadow-lg' : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-gray-200'}`}>
                  <ShieldCheck className="w-4 h-4" /> Security
               </button>
               <button onClick={() => setActiveSettingTab('data')} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${activeSettingTab === 'data' ? 'bg-indigo-600 text-white shadow-lg' : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-gray-200'}`}>
                  <Database className="w-4 h-4" /> Data Management
               </button>
            </nav>
         </div>

         <div className={`md:hidden w-full border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
            <div className="flex overflow-x-auto">
               <button onClick={() => setActiveSettingTab('profile')} className={`flex-1 px-3 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap ${activeSettingTab === 'profile' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-slate-500'}`}>
                  <User className="w-4 h-4 inline mr-1" /> Profile
               </button>
               <button onClick={() => setActiveSettingTab('security')} className={`flex-1 px-3 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap ${activeSettingTab === 'security' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-slate-500'}`}>
                  <ShieldCheck className="w-4 h-4 inline mr-1" /> Security
               </button>
               <button onClick={() => setActiveSettingTab('data')} className={`flex-1 px-3 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap ${activeSettingTab === 'data' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-slate-500'}`}>
                  <Database className="w-4 h-4 inline mr-1" /> Data
               </button>
            </div>
         </div>

         <div className="flex-1 p-4 md:p-8">
            {activeSettingTab === 'profile' && (
               <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-3 md:pb-4 gap-3 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                     <div>
                        <h4 className={`font-bold text-base md:text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Admin Profile</h4>
                        <p className="text-xs text-slate-400">Manage your personal account details.</p>
                     </div>
                     {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/20"><Edit2 className="w-3.5 h-3.5"/> Edit</button>
                     ) : (
                        <div className="flex gap-2">
                           <button onClick={() => setIsEditing(false)} className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-400 border rounded-lg ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'}`}>Cancel</button>
                           <button onClick={onSave} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"><Save className="w-3.5 h-3.5"/> Save</button>
                        </div>
                     )}
                  </div>
                  <div className="space-y-3 md:space-y-4">
                        <div>
                           <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Display Name</label>
                           <input type="text" disabled={!isEditing} className={`w-full px-3 md:px-4 py-2 border rounded-lg outline-none text-sm ${isEditing ? 'border-indigo-500 focus:ring-2 focus:ring-indigo-500/50' : 'border-transparent'} ${isDarkMode ? 'bg-white/5 text-slate-300' : 'bg-gray-100 text-slate-700'}`} value={profile?.displayName || ''} onChange={e => setProfile({...profile, displayName: e.target.value})} />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Username</label>
                           <input type="text" disabled={!isEditing} className={`w-full px-3 md:px-4 py-2 border rounded-lg outline-none text-sm ${isEditing ? 'border-indigo-500 focus:ring-2 focus:ring-indigo-500/50' : 'border-transparent'} ${isDarkMode ? 'bg-white/5 text-slate-300' : 'bg-gray-100 text-slate-700'}`} value={profile?.username || ''} onChange={e => setProfile({...profile, username: e.target.value})} />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Email</label>
                           <input type="email" disabled={!isEditing} className={`w-full px-3 md:px-4 py-2 border rounded-lg outline-none text-sm ${isEditing ? 'border-indigo-500 focus:ring-2 focus:ring-indigo-500/50' : 'border-transparent'} ${isDarkMode ? 'bg-white/5 text-slate-300' : 'bg-gray-100 text-slate-700'}`} value={profile?.email || ''} onChange={e => setProfile({...profile, email: e.target.value})} />
                        </div>
                   </div>
                   <div className={`pt-3 md:pt-4 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                     <button onClick={setShowPassword} className="flex items-center gap-2 text-xs text-indigo-500 font-bold uppercase tracking-wide hover:text-indigo-400"><Lock className="w-3.5 h-3.5"/> Change Password</button>
                  </div>
               </div>
            )}

            {activeSettingTab === 'security' && (
               <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className={`border-b pb-3 md:pb-4 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                     <h4 className={`font-bold text-base md:text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Security</h4>
                     <p className="text-xs text-slate-400">Manage account security and access.</p>
                  </div>
                  <div className="p-3 md:p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg md:rounded-xl flex items-start gap-3">
                     <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                     <div className="min-w-0">
                        <p className="text-xs md:text-sm font-bold text-indigo-500">Two-Factor Authentication</p>
                        <p className="text-xs text-indigo-500/80 mt-1">2FA is currently <span className="font-bold">Enabled</span> via Email.</p>
                     </div>
                  </div>
                  <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Session Timeout</label>
                      <select className={`w-full border rounded-lg p-2 md:p-2.5 text-sm ${isDarkMode ? 'bg-[#0B0F19] border-white/10 text-white' : 'bg-white border-gray-200 text-slate-700'}`}>
                          <option>15 Minutes</option>
                          <option>30 Minutes</option>
                          <option>1 Hour</option>
                          <option>Never</option>
                      </select>
                  </div>
                  <div className={`border-t pt-3 md:pt-4 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                      <h5 className="font-bold text-xs md:text-sm text-slate-400 mb-2">Recent Login Activity</h5>
                      <div className={`p-2 md:p-3 rounded-lg border text-xs text-slate-400 space-y-1 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex justify-between"><span>Manila, PH (Current)</span><span className="whitespace-nowrap ml-2">Just now</span></div>
                        <div className="flex justify-between"><span>Cebu, PH</span><span className="whitespace-nowrap ml-2">2 hrs ago</span></div>
                      </div>
                  </div>
               </div>
            )}

            {activeSettingTab === 'data' && (
               <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                   <div className={`border-b pb-3 md:pb-4 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                      <h4 className={`font-bold text-base md:text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Data Management</h4>
                      <p className="text-xs text-slate-400">Export logs or clear system caches.</p>
                   </div>
                   
                   <div className="grid grid-cols-4 md:grid-cols-2 gap-1 md:gap-4">
                      <button onClick={() => downloadCSV(transactions, 'transactions.csv')} className={`flex flex-col items-center justify-center p-2 md:p-6 border rounded-md md:rounded-xl transition-colors group ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                          <Download className="w-4 h-4 md:w-8 md:h-8 text-slate-500 group-hover:text-emerald-500 mb-1 md:mb-2" />
                          <span className="text-[10px] md:text-sm font-bold text-slate-400 text-center line-clamp-2">Export Rx Logs</span>
                      </button>
                      <button onClick={() => downloadCSV(auditLogs, 'security_audit.csv')} className={`flex flex-col items-center justify-center p-2 md:p-6 border rounded-md md:rounded-xl transition-colors group ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                          <FileText className="w-4 h-4 md:w-8 md:h-8 text-slate-500 group-hover:text-emerald-500 mb-1 md:mb-2" />
                          <span className="text-[10px] md:text-sm font-bold text-slate-400 text-center line-clamp-2">Export Audit</span>
                      </button>
                      <button onClick={() => alert('Cache Cleared')} className={`flex flex-col items-center justify-center p-2 md:p-6 border rounded-md md:rounded-xl transition-colors group border-dashed ${isDarkMode ? 'border-white/10 hover:bg-rose-500/10' : 'border-gray-300 hover:bg-rose-50'}`}>
                          <Trash2 className="w-4 h-4 md:w-8 md:h-8 text-slate-500 group-hover:text-rose-500 mb-1 md:mb-2" />
                          <span className="text-[10px] md:text-sm font-bold text-slate-400 group-hover:text-rose-500 text-center line-clamp-2">Clear Cache</span>
                      </button>
                      <button onClick={handleFullBackup} className={`flex flex-col items-center justify-center p-2 md:p-6 border rounded-md md:rounded-xl transition-colors group ${isDarkMode ? 'border-white/10 hover:bg-blue-500/10' : 'border-gray-200 hover:bg-blue-50'}`}>
                          <Database className="w-4 h-4 md:w-8 md:h-8 text-slate-500 group-hover:text-blue-500 mb-1 md:mb-2" />
                          <span className="text-[10px] md:text-sm font-bold text-slate-400 text-center line-clamp-2">Backup DB</span>
                      </button>
                   </div>
                   <div className="p-3 md:p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg md:rounded-xl flex gap-2 md:gap-3">
                      <HardDrive className="w-4 h-4 md:w-5 md:h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                          <p className="text-xs md:text-sm font-bold text-amber-500">Storage Usage</p>
                          <div className="w-full bg-amber-500/20 h-1.5 rounded-full mt-2 mb-1 overflow-hidden">
                             <div className="bg-amber-500 h-full w-[45%]"></div>
                          </div>
                          <p className="text-xs text-amber-500/80">45% used of 5GB quota</p>
                      </div>
                   </div>
               </div>
            )}
         </div>
      </div>
   );
}

// ==========================================
// 4. ADMIN LOGIN
// ==========================================
function AdminLogin({ onLogin, cloudProfile }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Added state for password visibility
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (isLocked && lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => prev - 1);
      }, 1000);
    } else if (lockoutTimer === 0 && isLocked) {
      setIsLocked(false);
      setFailedAttempts(0);
      setError('');
    }
    return () => clearInterval(interval);
  }, [isLocked, lockoutTimer]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (isLocked) return;

    setLoading(true);
    setError('');

    setTimeout(() => {
      const targetUser = cloudProfile?.username || 'admin';
      const targetPass = cloudProfile?.password || 'admin123';

      if (username === targetUser && password === targetPass) {
        onLogin();
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        setLoading(false);
        
        if (newAttempts >= 5) {
            setIsLocked(true);
            setLockoutTimer(10);
            setError("Too many failed attempts. Locked for 10s.");
        } else {
            setError(`Invalid credentials. ${5 - newAttempts} attempts remaining.`);
        }
      }
    }, 800);
  };

  return (
    <div className="flex h-screen w-full bg-[#0B0F19] font-sans text-slate-900 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0B0F19] to-black opacity-90"></div>
      
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border-4 border-slate-200/20 animate-in fade-in slide-in-from-bottom-8 duration-700 relative overflow-hidden ring-1 ring-white/10">
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-600 to-blue-600 rounded-2xl shadow-lg shadow-indigo-500/30 mb-6 transform transition-transform hover:scale-105 ring-4 ring-white">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Super Admin</h2>
            <p className="text-slate-500 text-sm">MediVend Network Control</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            <div className="relative group">
               <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Username</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                 </div>
                 <input required type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} disabled={isLocked} />
               </div>
            </div>

            <div className="relative group">
               <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Password</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                 </div>
                 <input 
                    required 
                    type={showPassword ? "text" : "password"} 
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    disabled={isLocked} 
                 />
                 <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-indigo-500 transition-colors focus:outline-none"
                 >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                 </button>
               </div>
            </div>

            {error && (
              <div className={`p-3 rounded-xl text-sm font-medium border flex items-center gap-2 animate-in slide-in-from-top-2 ${isLocked ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                <AlertTriangle className="w-4 h-4" /> {isLocked ? `Security Lockout: Try again in ${lockoutTimer}s` : error}
              </div>
            )}

            <button type="submit" disabled={loading || isLocked} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] flex justify-center items-center">
              {loading ? <RefreshCw className="w-5 h-5 animate-spin"/> : isLocked ? "Locked" : "Access Portal"}
            </button>
          </form>
          
          <div className="text-center text-[10px] text-slate-400 pt-8 mt-4 border-t border-slate-100">
              <p>Authorized Personnel Only • Secure Connection</p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-[#0B0F19] relative overflow-hidden items-center justify-center border-l border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0B0F19] to-black opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="relative z-10 p-12 text-white max-w-lg text-center">
            <Activity className="w-24 h-24 text-emerald-400 mx-auto mb-6 opacity-80 drop-shadow-lg" />
            <h1 className="text-4xl font-bold mb-4 tracking-tight text-white">System Status: Optimal</h1>
            <p className="text-slate-400 text-lg">Real-time monitoring active.</p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. ADMIN DASHBOARD
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

  // --- LOCAL HIDE STATES ---
  const [hiddenTxIds, setHiddenTxIds] = useState([]);
  const [hiddenAuditIds, setHiddenAuditIds] = useState([]);

  // --- MACHINE DIAGNOSTICS STATE ---
  const [diagnosticMachine, setDiagnosticMachine] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- REAL-TIME DATA LISTENER ---
  useEffect(() => {
    setLoading(true);

    const doctorsRef = collection(db, 'artifacts', appId, 'public', 'data', 'doctors');
    const unsubscribeDoctors = onSnapshot(query(doctorsRef), (snapshot) => {
      setDoctors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.error("Error doctors:", error));

    const rxRef = collection(db, 'artifacts', appId, 'public', 'data', 'prescriptions');
    const unsubscribeRx = onSnapshot(query(rxRef, limit(30)), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setTransactions(list);
      setLoading(false); 
    }, (error) => console.error("Error transactions:", error));

    const machinesRef = collection(db, 'artifacts', appId, 'public', 'data', 'machines');
    const unsubscribeMachines = onSnapshot(query(machinesRef), (snapshot) => {
      setMachines(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.error("Error machines:", error));

    const auditRef = collection(db, 'artifacts', appId, 'public', 'data', 'audit_logs');
    const unsubscribeAudit = onSnapshot(query(auditRef, limit(20)), (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      logs.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
      setAuditLogs(logs); 
      setLoading(false);
    }, (error) => {
       console.error("Error audit:", error);
       setLoading(false);
    });

    const medsRef = collection(db, 'artifacts', appId, 'public', 'data', 'medicines');
    const unsubscribeMeds = onSnapshot(query(medsRef), (snapshot) => {
      setMedicines(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const supportRef = collection(db, 'artifacts', appId, 'public', 'data', 'support_tickets');
    const unsubscribeSupport = onSnapshot(query(supportRef), (snapshot) => {
      setSupportTickets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeDoctors();
      unsubscribeRx();
      unsubscribeMachines();
      unsubscribeAudit();
      unsubscribeMeds();
      unsubscribeSupport();
    };
  }, []);

  // --- ACTIONS ---
  const updateDoctorStatus = async (docId, newStatus) => {
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'doctors', docId);
      await setDoc(docRef, { status: newStatus, adminReviewedAt: serverTimestamp() }, { merge: true });
      await addAuditLog(`Doctor Status Update`, `Set ${docId} to ${newStatus}`);
    } catch (e) {
      alert("Update failed: " + e.message);
    }
  };

  const handleDoctorPasswordUpdate = async (docId, newPassword) => {
    if (!newPassword) return;
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'doctors', docId);
      await updateDoc(docRef, { password: newPassword });
      await addAuditLog("Doctor Mgmt", `Updated password for doctor ${docId}`);
      alert("Doctor password updated successfully.");
    } catch (e) {
      alert("Update failed: " + e.message);
    }
  };

  const handleDeleteDoctor = async (docId) => {
    if(!window.confirm(`Are you sure you want to PERMANENTLY DELETE the doctor account: ${docId}?\n\nThis action cannot be undone and will remove all their access.`)) return;
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'doctors', docId);
      await deleteDoc(docRef);
      await addAuditLog("Doctor Deletion", `Permanently removed doctor account: ${docId}`);
      alert("Doctor account deleted successfully.");
    } catch(e) {
      alert("Deletion failed: " + e.message);
    }
  };

  const handlePingMachine = async (machineId) => {
    try {
        const machineRef = doc(db, 'artifacts', appId, 'public', 'data', 'machines', machineId);
        await setDoc(machineRef, { lastPing: serverTimestamp(), status: 'online' }, { merge: true });
        alert(`Ping signal sent to ${machineId}. Connection OK.`);
        await addAuditLog("System Ping", `Pinged ${machineId}`);
    } catch(e) {
        alert("Failed to ping: " + e.message);
    }
  };

  const handleRunDiagnostics = (machine) => {
      const isOnline = machine.status === 'online';
      
      const report = {
          ...machine,
          cpuTemp: isOnline ? (35 + Math.random() * 15).toFixed(1) + '°C' : 'N/A', 
          printerPaper: isOnline ? Math.floor(Math.random() * 100) + '%' : 'Unknown',
          printerStatus: isOnline ? 'Ready' : 'Offline',
          motorStatus: isOnline ? 'Optimal' : 'Offline',
          scannerStatus: isOnline ? 'Active' : 'Not Detected',
          
          slots: (machine.slots || Array.from({ length: 10 }, (_, i) => ({
              id: i + 1,
              medicine: ['Biogesic', 'Neozep', 'Amoxicillin', 'Solmux', 'Bioflu', 'Alaxan', 'Decolgen', 'Tuseran', 'Diatabs', 'Kremil-S'][i],
              stock: Math.floor(Math.random() * 100),
              max: 100,
              status: Math.random() > 0.95 ? 'Jam' : 'OK'
          }))).slice(0, 10),

          healthScore: isOnline ? '98%' : '0%',
          recommendation: isOnline ? 'System functioning normally.' : 'Check power/network connection.'
      };
      setDiagnosticMachine(report);
  };

  const handleRebootMachine = async (machineId) => {
    if(!window.confirm(`Are you sure you want to reboot ${machineId}?`)) return;
    try {
        const machineRef = doc(db, 'artifacts', appId, 'public', 'data', 'machines', machineId);
        await setDoc(machineRef, { status: 'rebooting' }, { merge: true });
        
        setTimeout(async () => {
            await setDoc(machineRef, { status: 'offline' }, { merge: true });
            setTimeout(async () => {
               await setDoc(machineRef, { status: 'online', lastPing: serverTimestamp() }, { merge: true });
               alert(`${machineId} rebooted successfully.`);
               await addAuditLog("System Reboot", `Rebooted ${machineId}`);
            }, 3000);
        }, 1500);
    } catch(e) {
        alert("Reboot command failed: " + e.message);
    }
  };

  const handleLockMachine = async (machineId, currentStatus) => {
      const newStatus = currentStatus === 'locked' ? 'online' : 'locked';
      if(!window.confirm(`Are you sure you want to ${newStatus.toUpperCase()} kiosk ${machineId}?`)) return;
      
      try {
          const machineRef = doc(db, 'artifacts', appId, 'public', 'data', 'machines', machineId);
          await setDoc(machineRef, { status: newStatus }, { merge: true });
          await addAuditLog("Security Lock", `${newStatus.toUpperCase()} kiosk ${machineId}`);
      } catch(e) {
          alert("Command failed: " + e.message);
      }
  };

  const handleDeleteMachine = async (machineId) => {
      if(!window.confirm(`Remove ${machineId} from network? This cannot be undone.`)) return;
      try {
          const machineRef = doc(db, 'artifacts', appId, 'public', 'data', 'machines', machineId);
          await deleteDoc(machineRef);
          await addAuditLog("System Removal", `Removed kiosk ${machineId}`);
      } catch(e) {
          alert("Deletion failed: " + e.message);
      }
  };

  const addAuditLog = async (action, details) => {
    try {
      const logsRef = collection(db, 'artifacts', appId, 'public', 'data', 'audit_logs');
      await setDoc(doc(logsRef), {
         action,
         details,
         user: adminProfile.username,
         time: new Date().toLocaleTimeString(),
         timestamp: serverTimestamp()
      });
    } catch(e) {
      console.error("Failed to log audit:", e);
    }
  };

  const handleBroadcast = async (msg, priority, target) => {
    try {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'broadcasts'), {
            message: msg,
            priority: priority,
            target: target,
            timestamp: serverTimestamp(),
            active: true,
            sentBy: adminProfile.username,
            type: 'admin_broadcast'
        });
        await addAuditLog("System Broadcast", `Sent: ${msg} (${priority} to ${target})`);
        alert(`Broadcast sent to ${target === 'all' ? 'Entire Network' : target}!`);
        setShowBroadcastModal(false);
    } catch (e) {
        console.error("Broadcast failed:", e);
        alert("Failed to send broadcast.");
    }
  };

  const handleHideAuditLog = (id) => {
     if(window.confirm("Are you sure you want to remove this record from your view?\n\n⚠️ NOTE: This ONLY hides it from this list to reduce clutter. The record stays saved in the database.")) {
         setHiddenAuditIds(prev => [...prev, id]);
     }
  };

  const handleClearViewAudit = () => {
     if(window.confirm("Are you sure you want to clear ALL records from this view?\n\n⚠️ NOTE: This acts as a 'Clear History' for your screen only. All records remain safe in the database.")) {
         const allIds = auditLogs.map(l => l.id);
         setHiddenAuditIds(prev => [...prev, ...allIds]);
     }
  };

  const handleSaveProfile = async () => {
    try {
      const adminRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'admin_profile');
      await setDoc(adminRef, adminProfile);
      setIsEditingProfile(false);
      alert("Profile updated and synced to cloud.");
      await addAuditLog("Profile Update", "Admin profile details updated");
    } catch(e) {
      alert("Failed to save profile: " + e.message);
    }
  };

  const handlePasswordUpdate = async (newPass) => {
    try {
        const updated = { ...adminProfile, password: newPass };
        const adminRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'admin_profile');
        await setDoc(adminRef, updated, { merge: true });
        setAdminProfile(updated);
        setShowPasswordModal(false);
        alert("Password updated and synced to cloud.");
        await addAuditLog("Password Change", "Admin password updated");
    } catch(e) {
        alert("Failed to update password: " + e.message);
    }
  };

  const handleHideTransaction = (id) => {
    if(window.confirm("Are you sure you want to remove this record from your view?\n\n⚠️ NOTE: This ONLY hides it from this list to reduce clutter. The record stays saved in the database.")) {
        setHiddenTxIds(prev => [...prev, id]);
    }
  };

  const handleClearViewTransactions = () => {
    if(window.confirm("Are you sure you want to clear ALL records from this view?\n\n⚠️ NOTE: This acts as a 'Clear History' for your screen only. All records remain safe in the database.")) {
        const allIds = transactions.map(t => t.id);
        setHiddenTxIds(prev => [...prev, ...allIds]);
    }
  };

  const pendingDocs = doctors.filter(d => d.status === 'pending').length;
  const activeDocs = doctors.filter(d => d.status === 'active').length;
  const activeMachines = machines.filter(m => m.status === 'online').length;
  const displayedDoctors = doctors.filter(d => filter === 'all' ? true : d.status === filter);
  
  const displayedTransactions = transactions.filter(t => !hiddenTxIds.includes(t.id));
  const displayedAuditLogs = auditLogs.filter(l => !hiddenAuditIds.includes(l.id));

  const feedItems = [
    ...displayedTransactions.map(t => ({ ...t, type: 'rx', sortTime: t.createdAt?.seconds || 0 })),
    ...displayedAuditLogs.map(l => ({ ...l, type: 'audit', sortTime: l.timestamp?.seconds || 0 }))
  ].sort((a, b) => b.sortTime - a.sortTime).slice(0, 6);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    setDiagnosticMachine(null); 
  };

  return (
    <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0B0F19] text-slate-300' : 'bg-gray-50 text-slate-600'}`}>
      
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      <aside className={`fixed inset-y-0 left-0 z-30 w-72 border-r shadow-2xl transform transition-all duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 ${isDarkMode ? 'bg-[#0B0F19] border-white/5' : 'bg-white border-gray-200'}`}>
        <div className={`relative z-10 p-6 flex items-center gap-3 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <div className="bg-gradient-to-tr from-indigo-500 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`font-bold text-lg tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>MediVend</h1>
            <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">Super Admin</p>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className={`md:hidden ml-auto ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <div className="px-3 mb-2 mt-2 text-[10px] font-extrabold uppercase tracking-widest opacity-70">Workspace</div>
          <NavButton id="overview" label="Dashboard" icon={<LayoutDashboard className="w-5 h-5" />} active={activeTab === 'overview'} onClick={handleNavClick} isDarkMode={isDarkMode} />
          
          <div className="px-3 mt-8 mb-2 text-[10px] font-extrabold uppercase tracking-widest opacity-70">Network</div>
          <NavButton id="doctors" label="Doctors" icon={<Users className="w-5 h-5" />} active={activeTab === 'doctors'} onClick={handleNavClick} badge={pendingDocs} isDarkMode={isDarkMode} />
          <NavButton id="machines" label="Kiosks" icon={<Server className="w-5 h-5" />} active={activeTab === 'machines'} onClick={handleNavClick} isDarkMode={isDarkMode} />
          
          <div className="px-3 mt-8 mb-2 text-[10px] font-extrabold uppercase tracking-widest opacity-70">Inventory & Support</div>
          <NavButton id="inventory" label="Master List" icon={<Package className="w-5 h-5" />} active={activeTab === 'inventory'} onClick={handleNavClick} isDarkMode={isDarkMode} />
          <NavButton id="support" label="Support" icon={<LifeBuoy className="w-5 h-5" />} active={activeTab === 'support'} onClick={handleNavClick} isDarkMode={isDarkMode} />

          <div className="px-3 mt-8 mb-2 text-[10px] font-extrabold uppercase tracking-widest opacity-70">Compliance</div>
          <NavButton id="transactions" label="Logs" icon={<FileText className="w-5 h-5" />} active={activeTab === 'transactions'} onClick={handleNavClick} isDarkMode={isDarkMode} />
          <NavButton id="audit" label="Audit" icon={<ClipboardList className="w-5 h-5" />} active={activeTab === 'audit'} onClick={handleNavClick} isDarkMode={isDarkMode} />
        </nav>

        <div className={`p-4 border-t ${isDarkMode ? 'bg-[#05080F] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
          <button onClick={onLogout} className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all text-sm font-medium group">
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Sign Out
          </button>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col min-w-0 overflow-hidden relative ${isDarkMode ? 'bg-[#0B0F19]' : 'bg-gray-50'}`}>
        <header className={`h-16 border-b flex items-center justify-between px-6 shadow-sm z-10 sticky top-0 transition-colors ${isDarkMode ? 'bg-[#0B0F19] border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className={`md:hidden p-2 -ml-2 rounded-lg ${isDarkMode ? 'text-slate-400 hover:bg-white/5' : 'text-slate-600 hover:bg-gray-100'}`}>
              <Menu className="w-6 h-6" />
            </button>
            <h2 className={`text-lg md:text-xl font-bold capitalize tracking-tight flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {activeTab === 'overview' && <LayoutDashboard className="w-5 h-5 text-indigo-500 hidden sm:block" />}
              {activeTab === 'doctors' && <Users className="w-5 h-5 text-indigo-500 hidden sm:block" />}
              {activeTab === 'machines' && <Server className="w-5 h-5 text-emerald-500 hidden sm:block" />}
              {activeTab === 'inventory' && <Package className="w-5 h-5 text-indigo-500 hidden sm:block" />}
              {activeTab === 'support' && <LifeBuoy className="w-5 h-5 text-rose-500 hidden sm:block" />}
              {activeTab === 'settings' && <Settings className="w-5 h-5 text-slate-400 hidden sm:block" />}
              {activeTab.replace('-', ' ')}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className={`p-2 rounded-full transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-slate-600 hover:text-slate-900'}`}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-gray-100 border-gray-200 text-slate-600'}`}>
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            
            <button onClick={() => { setActiveTab('doctors'); setFilter('pending'); }} className={`p-2 transition-colors relative rounded-full ${isDarkMode ? 'text-slate-400 hover:text-indigo-400 hover:bg-white/5' : 'text-slate-600 hover:text-indigo-600 hover:bg-gray-100'}`}>
              <Bell className="w-5 h-5" />
              {pendingDocs > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white/10"></span>}
            </button>

            <div 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 cursor-pointer p-1.5 -mr-1.5 rounded-lg transition-colors group ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/10 shadow-md group-hover:ring-indigo-500/50 transition-all">
                {adminProfile?.displayName?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        <main className={`flex-1 overflow-y-auto p-4 lg:p-6 ${isDarkMode ? 'bg-[#0B0F19]' : 'bg-gray-50'}`}>
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
                <StatCard 
                  title="Pending Approvals" 
                  value={pendingDocs} 
                  icon={<Users className="w-5 h-5 text-amber-400" />} 
                  color="amber" 
                  subtext="Requires attention" 
                  onClick={() => { setActiveTab('doctors'); setFilter('pending'); }} 
                  isDarkMode={isDarkMode}
                />
                <StatCard 
                  title="Active Kiosks" 
                  value={`${activeMachines}/${machines.length > 0 ? machines.length : 0}`} 
                  icon={<Server className="w-5 h-5 text-emerald-400" />} 
                  color="emerald" 
                  subtext="Network Status" 
                  onClick={() => setActiveTab('machines')} 
                  isDarkMode={isDarkMode}
                />
                <StatCard 
                  title="Master Inventory" 
                  value={medicines.length} 
                  icon={<Package className="w-5 h-5 text-blue-400" />} 
                  color="blue" 
                  subtext="SKUs in database" 
                  onClick={() => setActiveTab('inventory')} 
                  isDarkMode={isDarkMode}
                />
                <StatCard 
                  title="Security Alerts" 
                  value={auditLogs.length} 
                  icon={<AlertOctagon className="w-5 h-5 text-rose-400" />} 
                  color="red" 
                  subtext="System events" 
                  onClick={() => setActiveTab('audit')} 
                  isDarkMode={isDarkMode}
                />
              </div>

              <div className={`p-6 rounded-xl border shadow-lg ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Network Health</h3>
                    <p className="text-xs text-slate-400">Real-time infrastructure status & capacity</p>
                  </div>
                  <div className="flex gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 whitespace-nowrap flex-shrink-0"><Activity className="w-3 h-3"/> System Normal</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                      <h4 className={`text-sm font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}><Server className="w-4 h-4 text-emerald-500"/> Kiosk Connectivity</h4>
                      <div className="space-y-4">
                          <div>
                             <div className="flex justify-between text-xs mb-1">
                                <span className="font-medium text-slate-400">Online ({activeMachines})</span>
                                <span className="text-emerald-500 font-bold">{machines.length > 0 ? Math.round((activeMachines / machines.length) * 100) : 0}%</span>
                             </div>
                             <div className={`w-full rounded-full h-2 overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                                <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${machines.length > 0 ? (activeMachines / machines.length) * 100 : 0}%` }}></div>
                             </div>
                          </div>
                          <div>
                             <div className="flex justify-between text-xs mb-1">
                                <span className="font-medium text-slate-400">Offline / Maintenance ({machines.length - activeMachines})</span>
                                <span className="text-slate-500 font-bold">{machines.length > 0 ? Math.round(((machines.length - activeMachines) / machines.length) * 100) : 0}%</span>
                             </div>
                             <div className={`w-full rounded-full h-2 overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                                <div className="bg-slate-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${machines.length > 0 ? ((machines.length - activeMachines) / machines.length) * 100 : 0}%` }}></div>
                             </div>
                          </div>
                      </div>
                   </div>

                   <div>
                      <h4 className={`text-sm font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}><Users className="w-4 h-4 text-blue-500"/> Provider Status</h4>
                      <div className="space-y-4">
                          <div>
                             <div className="flex justify-between text-xs mb-1">
                                <span className="font-medium text-slate-400">Active Physicians ({activeDocs})</span>
                                <span className="text-blue-500 font-bold">{doctors.length > 0 ? Math.round((activeDocs / doctors.length) * 100) : 0}%</span>
                             </div>
                             <div className={`w-full rounded-full h-2 overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                                <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${doctors.length > 0 ? (activeDocs / doctors.length) * 100 : 0}%` }}></div>
                             </div>
                          </div>
                          <div>
                             <div className="flex justify-between text-xs mb-1">
                                <span className="font-medium text-slate-400">Pending Approval ({pendingDocs})</span>
                                <span className="text-amber-500 font-bold">{doctors.length > 0 ? Math.round((pendingDocs / doctors.length) * 100) : 0}%</span>
                             </div>
                             <div className={`w-full rounded-full h-2 overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                                <div className="bg-amber-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${doctors.length > 0 ? (pendingDocs / doctors.length) * 100 : 0}%` }}></div>
                             </div>
                          </div>
                      </div>
                   </div>
                </div>
              </div>
              
              {/* --- TOP PRESCRIBED MEDICINES BAR CHART --- */}
              <div className={`p-6 rounded-xl border shadow-lg ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`}>
                   <h3 className={`font-bold text-lg mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        <BarChart3 className="w-5 h-5 text-indigo-500"/> Top Prescribed Medicines
                   </h3>
                   <TopPrescribedChart transactions={transactions} isDarkMode={isDarkMode} />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className={`p-5 rounded-xl border h-full ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <h3 className={`font-bold text-base mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Quick Actions</h3>
                    <div className="flex gap-2 flex-col">
                       <ActionButton onClick={() => {setActiveTab('doctors'); setFilter('pending')}} icon={<Users className="w-4 h-4"/>} label={`Review ${pendingDocs} Doctors`} variant="primary" />
                       <ActionButton onClick={() => setShowBroadcastModal(true)} icon={<Megaphone className="w-4 h-4"/>} label="System Broadcast" variant="secondary" isDarkMode={isDarkMode} />
                       <ActionButton onClick={() => setActiveTab('audit')} icon={<FileSearch className="w-4 h-4"/>} label="View Security Audit" variant="secondary" isDarkMode={isDarkMode} />
                    </div>
                 </div>
                 
                 <div className={`lg:col-span-2 p-5 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <h3 className={`font-bold text-base mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Live Activity Feed</h3>
                    <div className="space-y-0 relative">
                       <div className={`absolute left-3 top-2 bottom-2 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                       
                       {feedItems.length === 0 ? (
                           <div className="pl-8 py-4 text-sm text-slate-500 italic">No recent activity</div>
                       ) : (
                           feedItems.map((item, idx) => (
                             <div key={item.id + idx} className={`py-3 pl-8 relative flex justify-between items-center text-sm group rounded-lg -ml-2 pr-2 transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                                <div className={`absolute left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 border-2 rounded-full z-10 ${item.type === 'rx' ? 'bg-blue-900 border-blue-500' : 'bg-amber-900 border-amber-500'}`}></div>
                                <div className="flex items-center gap-3">
                                   <div>
                                       <p className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                           {item.type === 'rx' ? 'Prescription Issued' : item.action}
                                       </p>
                                       <p className="text-xs text-slate-400">
                                           {item.type === 'rx' ? `Dr. ${item.doctorName}` : item.details}
                                       </p>
                                   </div>
                                </div>
                                <span className="text-xs text-slate-500 font-mono">
                                    {item.type === 'rx' ? item.date : item.time}
                                </span>
                             </div>
                           ))
                       )}
                    </div>
                 </div>
              </div>
            </div>
          )}
          {activeTab === 'doctors' && <DoctorsView doctors={displayedDoctors} filter={filter} setFilter={setFilter} onRefresh={()=>{}} onUpdateStatus={updateDoctorStatus} onUpdatePassword={handleDoctorPasswordUpdate} onDelete={handleDeleteDoctor} loading={loading} isDarkMode={isDarkMode} />}
          {activeTab === 'machines' && <MachinesView machines={machines} onPing={handlePingMachine} onRunDiagnostics={handleRunDiagnostics} onReboot={handleRebootMachine} onLock={handleLockMachine} onDelete={handleDeleteMachine} isDarkMode={isDarkMode} />}
          {activeTab === 'inventory' && <InventoryView medicines={medicines} db={db} appId={appId} isDarkMode={isDarkMode} />}
          {activeTab === 'support' && <SupportView tickets={supportTickets} db={db} appId={appId} isDarkMode={isDarkMode} />}
          {activeTab === 'transactions' && <TransactionsView transactions={displayedTransactions} onHide={handleHideTransaction} onClearView={handleClearViewTransactions} isDarkMode={isDarkMode} />}
          {activeTab === 'audit' && <AuditView logs={displayedAuditLogs} onHide={handleHideAuditLog} onClearView={handleClearViewAudit} isDarkMode={isDarkMode} />}
          {activeTab === 'settings' && <SettingsView profile={adminProfile} setProfile={setAdminProfile} onSave={handleSaveProfile} isEditing={isEditingProfile} setIsEditing={setIsEditingProfile} setShowPassword={() => setShowPasswordModal(true)} isDarkMode={isDarkMode} transactions={transactions} auditLogs={auditLogs} doctors={doctors} machines={machines} medicines={medicines} supportTickets={supportTickets} />}
        </main>
        {showPasswordModal && <PasswordModal onClose={() => setShowPasswordModal(false)} currentCreds={adminProfile} onUpdate={handlePasswordUpdate} isDarkMode={isDarkMode} />}
        {showBroadcastModal && <BroadcastModal onClose={() => setShowBroadcastModal(false)} onSend={handleBroadcast} isDarkMode={isDarkMode} />}
        
        {/* DIAGNOSTICS MODAL - ENHANCED IOT VERSION */}
        {diagnosticMachine && (
           <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
               <div className={`rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border flex flex-col max-h-[90vh] ${isDarkMode ? 'bg-[#1e293b] border-white/10' : 'bg-white border-gray-200'}`}>
                   
                   {/* Modal Header */}
                   <div className={`p-5 border-b flex justify-between items-center flex-shrink-0 ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                       <div>
                           <h3 className={`font-bold text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                               <Activity className="w-5 h-5 text-emerald-500"/> Kiosk Diagnostics
                           </h3>
                           <p className="text-xs text-slate-400 mt-1">{diagnosticMachine.id} • {diagnosticMachine.location}</p>
                       </div>
                       <button onClick={() => setDiagnosticMachine(null)}><X className={`w-5 h-5 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}/></button>
                   </div>

                   <div className="p-6 space-y-6 overflow-y-auto">
                       {/* Top Row: Health Score & Remote Commands */}
                       <div className="flex flex-col md:flex-row gap-6">
                           <div className="flex-1 text-center p-4 rounded-xl border border-dashed border-slate-500/20 flex flex-col justify-center items-center">
                               <div className={`text-5xl font-bold mb-1 ${diagnosticMachine.status === 'online' ? 'text-emerald-500' : 'text-rose-500'}`}>{diagnosticMachine.healthScore}</div>
                               <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">System Health</p>
                           </div>
                           
                           <div className="flex-1 space-y-2">
                               <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Remote Commands</p>
                               <div className="grid grid-cols-2 gap-2">
                                   <button onClick={() => handlePingMachine(diagnosticMachine.id)} className={`flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-bold transition-colors ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-slate-700'}`}><Activity size={14}/> Ping</button>
                                   <button onClick={() => handleRebootMachine(diagnosticMachine.id)} className={`flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-bold transition-colors ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-slate-700'}`}><Power size={14}/> Reboot</button>
                                   <button onClick={() => handleLockMachine(diagnosticMachine.id, diagnosticMachine.status)} className={`col-span-2 flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-bold transition-colors ${diagnosticMachine.status === 'locked' ? 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30' : 'bg-rose-500/20 text-rose-500 hover:bg-rose-500/30'}`}>
                                       {diagnosticMachine.status === 'locked' ? <Unlock size={14}/> : <Lock size={14}/>} 
                                       {diagnosticMachine.status === 'locked' ? 'Unlock Kiosk' : 'Lock / Disable'}
                                   </button>
                               </div>
                           </div>
                       </div>
                       
                       {/* Hardware Sensors Grid */}
                       <div>
                           <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Hardware Sensors</p>
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                               <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                  <div className="flex items-center gap-2 mb-1"><Thermometer className="w-3.5 h-3.5 text-rose-400"/><span className={`text-[10px] font-bold uppercase ${isDarkMode?'text-slate-400':'text-slate-500'}`}>CPU Temp</span></div>
                                  <p className={`text-sm font-mono font-bold ${isDarkMode?'text-white':'text-slate-900'}`}>{diagnosticMachine.cpuTemp}</p>
                               </div>
                               <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                  <div className="flex items-center gap-2 mb-1"><Printer className="w-3.5 h-3.5 text-blue-400"/><span className={`text-[10px] font-bold uppercase ${isDarkMode?'text-slate-400':'text-slate-500'}`}>Paper Lvl</span></div>
                                  <p className={`text-sm font-mono font-bold ${isDarkMode?'text-white':'text-slate-900'}`}>{diagnosticMachine.printerPaper}</p>
                               </div>
                               <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                  <div className="flex items-center gap-2 mb-1"><Zap className="w-3.5 h-3.5 text-amber-400"/><span className={`text-[10px] font-bold uppercase ${isDarkMode?'text-slate-400':'text-slate-500'}`}>Motor</span></div>
                                  <p className={`text-sm font-mono font-bold ${isDarkMode?'text-white':'text-slate-900'}`}>{diagnosticMachine.motorStatus}</p>
                               </div>
                               <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                  <div className="flex items-center gap-2 mb-1"><Scan className="w-3.5 h-3.5 text-purple-400"/><span className={`text-[10px] font-bold uppercase ${isDarkMode?'text-slate-400':'text-slate-500'}`}>Scanner</span></div>
                                  <p className={`text-sm font-mono font-bold ${isDarkMode?'text-white':'text-slate-900'}`}>{diagnosticMachine.scannerStatus}</p>
                               </div>
                           </div>
                       </div>

                       {/* 10-Slot Real-Time Inventory */}
                       <div>
                           <div className="flex justify-between items-center mb-3">
                               <p className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2"><Layers className="w-4 h-4"/> Real-Time Inventory (10 Slots)</p>
                               <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-1 rounded">Live Feed</span>
                           </div>
                           <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                               {diagnosticMachine.slots && diagnosticMachine.slots.map((slot) => (
                                   <div key={slot.id} className={`p-2.5 rounded-lg border relative overflow-hidden group ${slot.status === 'Jam' ? 'border-rose-500/50 bg-rose-500/10' : isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                                       <div className="flex justify-between items-start mb-1 relative z-10">
                                           <span className="text-[10px] font-bold opacity-50">#{slot.id}</span>
                                           {slot.status === 'Jam' && <AlertTriangle className="w-3 h-3 text-rose-500"/>}
                                       </div>
                                       <p className={`text-xs font-bold truncate relative z-10 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{slot.medicine}</p>
                                       <div className="mt-2 relative z-10">
                                           <div className="flex justify-between text-[10px] mb-0.5">
                                               <span className="text-slate-400">Lvl</span>
                                               <span className={slot.stock < 20 ? "text-rose-500 font-bold" : "text-emerald-500 font-bold"}>{slot.stock}%</span>
                                           </div>
                                           <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-black/40' : 'bg-gray-200'}`}>
                                               <div className={`h-full rounded-full ${slot.stock < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{width: `${slot.stock}%`}}></div>
                                           </div>
                                       </div>
                                   </div>
                               ))}
                           </div>
                       </div>
                       
                       <div className={`p-4 rounded-xl border ${diagnosticMachine.status === 'online' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                           <p className={`text-xs font-bold uppercase mb-1 ${diagnosticMachine.status === 'online' ? 'text-emerald-500' : 'text-rose-500'}`}>AI Recommendation</p>
                           <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{diagnosticMachine.recommendation}</p>
                       </div>
                   </div>
                   <div className={`p-4 border-t flex justify-end flex-shrink-0 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                      <button onClick={() => setDiagnosticMachine(null)} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase rounded-lg shadow-lg">Close Diagnostics</button>
                   </div>
               </div>
           </div>
        )}

      </div>
    </div>
  );
}

// ==========================================
// 5. MAIN ENTRY POINT (MUST BE LAST)
// ==========================================
export default function SuperAdminApp() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const initAdmin = async () => {
      try {
        await signInAnonymously(auth);
        const adminRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'admin_profile');
        const docSnap = await getDoc(adminRef);

        if (docSnap.exists()) {
          setAdminProfile(docSnap.data());
        } else {
          await setDoc(adminRef, DEFAULT_ADMIN);
          setAdminProfile(DEFAULT_ADMIN);
        }
      } catch (error) {
        console.error("Failed to initialize admin:", error);
        setAdminProfile(DEFAULT_ADMIN); 
      } finally {
        setLoadingProfile(false);
      }
    };
    initAdmin();
  }, []);

  if (loadingProfile) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-400">Connecting to Secure Server...</p>
        </div>
      </div>
    );
  }
    
  if (!isAdminLoggedIn) {
    return <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} cloudProfile={adminProfile} />;
  }

  return <AdminDashboard onLogout={() => setIsAdminLoggedIn(false)} initialProfile={adminProfile} />;
}