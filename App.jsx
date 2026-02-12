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
  Moon
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
  onSnapshot
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

const getAdminCreds = () => {
  const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_ADMIN;
};

// --- MAIN SUPER ADMIN COMPONENT ---
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

// --- 1. ADMIN LOGIN SCREEN (Dark Theme - Fixed for Branding) ---
function AdminLogin({ onLogin, cloudProfile }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
                  <input required type="password" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} disabled={isLocked} />
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

// --- 2. ADMIN DASHBOARD (Adaptive Theme) ---
function AdminDashboard({ onLogout, initialProfile }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); 
  const [doctors, setDoctors] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [machines, setMachines] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [adminProfile, setAdminProfile] = useState(initialProfile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false); 
    }, (error) => console.error("Error transactions:", error));

    const machinesRef = collection(db, 'artifacts', appId, 'public', 'data', 'machines');
    const unsubscribeMachines = onSnapshot(query(machinesRef), (snapshot) => {
      setMachines(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.error("Error machines:", error));

    const auditRef = collection(db, 'artifacts', appId, 'public', 'data', 'audit_logs');
    const unsubscribeAudit = onSnapshot(query(auditRef, limit(20)), (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAuditLogs(logs); 
      setLoading(false);
    }, (error) => {
       console.error("Error audit:", error);
       setLoading(false);
    });

    return () => {
      unsubscribeDoctors();
      unsubscribeRx();
      unsubscribeMachines();
      unsubscribeAudit();
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

  const handleClearAuditLogs = async () => {
    if (auditLogs.length === 0) {
      alert("No audit logs to clear.");
      return;
    }
    if(window.confirm(`Permanently delete ${auditLogs.length} audit records?`)) {
      setLoading(true);
      try {
        await Promise.all(auditLogs.map(log => 
          deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'audit_logs', log.id))
        ));
        alert("Audit logs cleared.");
      } catch (e) {
        console.error("Error clearing audit logs:", e);
      }
      setLoading(false);
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

  const handleClearTransactions = async () => {
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    if (completedTransactions.length === 0) {
      alert("No completed transactions to clear.");
      return;
    }
    if(window.confirm(`Delete ${completedTransactions.length} completed records?`)) {
      setLoading(true);
      try {
        await Promise.all(completedTransactions.map(t => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'prescriptions', t.id))));
        alert("Cleanup successful.");
        await addAuditLog("Data Cleanup", `Cleared ${completedTransactions.length} completed transactions`);
      } catch (e) {
        console.error("Error clearing logs:", e);
      }
      setLoading(false);
    }
  };

  const pendingDocs = doctors.filter(d => d.status === 'pending').length;
  const activeDocs = doctors.filter(d => d.status === 'active').length;
  const activeMachines = machines.filter(m => m.status === 'online').length;
  const displayedDoctors = doctors.filter(d => filter === 'all' ? true : d.status === filter);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0B0F19] text-slate-300' : 'bg-gray-50 text-slate-600'}`}>
      
      {/* MOBILE BACKDROP */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* SIDEBAR */}
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
          
          <div className="px-3 mt-8 mb-2 text-[10px] font-extrabold uppercase tracking-widest opacity-70">Compliance</div>
          <NavButton id="transactions" label="Logs" icon={<FileText className="w-5 h-5" />} active={activeTab === 'transactions'} onClick={handleNavClick} isDarkMode={isDarkMode} />
          <NavButton id="audit" label="Audit" icon={<ClipboardList className="w-5 h-5" />} active={activeTab === 'audit'} onClick={handleNavClick} isDarkMode={isDarkMode} />
        </nav>

        {/* Sidebar Footer with ONLY Sign Out */}
        <div className={`p-4 border-t ${isDarkMode ? 'bg-[#05080F] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
          <button onClick={onLogout} className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all text-sm font-medium group">
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
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

            {/* Profile in Header */}
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
              {/* Stat Cards - Adaptive */}
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
                  title="Active Physicians" 
                  value={activeDocs} 
                  icon={<Stethoscope className="w-5 h-5 text-blue-400" />} 
                  color="blue" 
                  subtext="Verified prescribers" 
                  onClick={() => { setActiveTab('doctors'); setFilter('active'); }} 
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

              {/* NETWORK HEALTH MONITORING */}
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
                   {/* Kiosk Status */}
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

                   {/* Doctor Status */}
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
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Quick Actions */}
                 <div className={`p-5 rounded-xl border h-full ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <h3 className={`font-bold text-base mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Quick Actions</h3>
                    <div className="flex gap-2 md:flex-col">
                       <div className="flex-1"><ActionButton onClick={() => {setActiveTab('doctors'); setFilter('pending')}} icon={<Users className="w-4 h-4"/>} label={`Review ${pendingDocs} Doctors`} variant="primary" /></div>
                       <div className="flex-1"><ActionButton onClick={() => setActiveTab('audit')} icon={<FileSearch className="w-4 h-4"/>} label="View Security Audit" variant="secondary" isDarkMode={isDarkMode} /></div>
                    </div>
                 </div>
                 
                 {/* Activity Feed */}
                 <div className={`lg:col-span-2 p-5 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <h3 className={`font-bold text-base mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Live Activity Feed</h3>
                    <div className="space-y-0 relative">
                       {/* Simple vertical line */}
                       <div className={`absolute left-3 top-2 bottom-2 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                       
                       {transactions.length === 0 && auditLogs.length === 0 ? (
                           <div className="pl-8 py-4 text-sm text-slate-500 italic">No recent activity</div>
                       ) : (
                           <>
                           {transactions.slice(0, 3).map(tx => (
                              <div key={tx.id} className={`py-3 pl-8 relative flex justify-between items-center text-sm group rounded-lg -ml-2 pr-2 transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                                 <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-900 border-2 border-blue-500 rounded-full z-10"></div>
                                 <div className="flex items-center gap-3">
                                    <div><p className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Prescription Issued</p><p className="text-xs text-slate-400">Dr. {tx.doctorName}</p></div>
                                 </div>
                                 <span className="text-xs text-slate-500 font-mono">{tx.date}</span>
                              </div>
                           ))}
                           {auditLogs.slice(0, 3).map((log, idx) => (
                              <div key={idx} className={`py-3 pl-8 relative flex justify-between items-center text-sm group rounded-lg -ml-2 pr-2 transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                                 <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-900 border-2 border-amber-500 rounded-full z-10"></div>
                                 <div className="flex items-center gap-3"><div><p className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{log.action}</p><p className="text-xs text-slate-400">{log.details}</p></div></div>
                                 <span className="text-xs text-slate-500 font-mono">{log.time}</span>
                              </div>
                           ))}
                           </>
                       )}
                    </div>
                 </div>
              </div>
            </div>
          )}
          {activeTab === 'doctors' && <DoctorsView doctors={displayedDoctors} filter={filter} setFilter={setFilter} onRefresh={()=>{}} onUpdateStatus={updateDoctorStatus} loading={loading} isDarkMode={isDarkMode} />}
          {activeTab === 'machines' && <MachinesView machines={machines} onPing={handlePingMachine} onReboot={handleRebootMachine} onDelete={handleDeleteMachine} isDarkMode={isDarkMode} />}
          {activeTab === 'transactions' && <TransactionsView transactions={transactions} onClear={handleClearTransactions} isDarkMode={isDarkMode} />}
          {activeTab === 'audit' && <AuditView logs={auditLogs} onClear={handleClearAuditLogs} isDarkMode={isDarkMode} />}
          {activeTab === 'settings' && <SettingsView profile={adminProfile} setProfile={setAdminProfile} onSave={handleSaveProfile} isEditing={isEditingProfile} setIsEditing={setIsEditingProfile} setShowPassword={() => setShowPasswordModal(true)} isDarkMode={isDarkMode} />}
        </main>
        {showPasswordModal && <PasswordModal onClose={() => setShowPasswordModal(false)} currentCreds={adminProfile} onUpdate={handlePasswordUpdate} isDarkMode={isDarkMode} />}
      </div>
    </div>
  );
}

// --- SUB-VIEWS (Adaptive Theme) ---
function DoctorsView({ doctors, filter, setFilter, onRefresh, onUpdateStatus, loading, isDarkMode }) {
  const [viewDoc, setViewDoc] = useState(null);
  return (
    <div className={`rounded-xl border overflow-hidden max-w-7xl mx-auto ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
      <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
        <h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Medical Practitioners</h3>
        <button onClick={onRefresh} className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1 hover:text-emerald-500 transition-colors"><RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin':''}`}/> Refresh</button>
      </div>
      <div className={`p-3 border-b flex gap-2 overflow-x-auto ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
        {['pending', 'active', 'rejected', 'all'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${filter === f ? 'bg-emerald-600 text-white shadow' : isDarkMode ? 'bg-transparent border border-white/10 text-slate-400 hover:bg-white/10' : 'bg-white border border-gray-300 text-slate-500 hover:bg-gray-100'}`}>{f}</button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className={`text-[10px] uppercase font-bold text-slate-400 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}><tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">License Info</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-100'}`}>
            {doctors.length === 0 ? <tr><td colSpan="4" className="p-4 text-center text-xs text-slate-500">No doctors found.</td></tr> : doctors.map(doc => (
              <tr key={doc.id} className={`transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                <td className="px-5 py-3"><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${isDarkMode ? 'bg-slate-700 text-white border-white/10' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>{doc.name ? doc.name.charAt(0) : '?'}</div><div><div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{doc.name}</div><div className="text-[10px] text-slate-400">{doc.email}</div></div></div></td>
                <td className="px-5 py-3 text-xs text-slate-400"><span className={`font-mono px-1 rounded ${isDarkMode ? 'bg-white/10 text-slate-300' : 'bg-gray-100 text-slate-600'}`}>{doc.license}</span></td>
                <td className="px-5 py-3"><StatusBadge status={doc.status} /></td>
                <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setViewDoc(doc)} className={`p-1.5 rounded ${isDarkMode ? 'text-slate-400 hover:text-blue-400 hover:bg-blue-500/10' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`} title="Verify Details"><Eye className="w-4 h-4"/></button>
                      {doc.status === 'pending' && (<><button onClick={() => onUpdateStatus(doc.id, 'active')} className="p-1.5 text-emerald-500 bg-emerald-500/10 rounded hover:bg-emerald-500/20"><CheckCircle className="w-4 h-4"/></button><button onClick={() => onUpdateStatus(doc.id, 'rejected')} className="p-1.5 text-rose-500 bg-rose-500/10 rounded hover:bg-rose-500/20"><XCircle className="w-4 h-4"/></button></>)}
                      {doc.status === 'active' && <button onClick={() => onUpdateStatus(doc.id, 'rejected')} className="text-[10px] font-bold text-rose-500 border border-rose-500/30 px-2 py-1 rounded hover:bg-rose-500/10">Revoke</button>}
                      {doc.status === 'rejected' && <button onClick={() => onUpdateStatus(doc.id, 'active')} className="text-[10px] font-bold text-emerald-500 border border-emerald-500/30 px-2 py-1 rounded hover:bg-emerald-500/10">Restore</button>}
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {viewDoc && (
         <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className={`rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border animate-in fade-in zoom-in duration-200 ${isDarkMode ? 'bg-[#1e293b] border-white/10' : 'bg-white border-gray-200'}`}>
               <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}><h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Verification Details</h3><button onClick={() => setViewDoc(null)}><X className={`w-5 h-5 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}/></button></div>
               <div className="p-6 space-y-4">
                  <div className={`p-4 rounded-lg border text-center ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}><FileBadge className="w-10 h-10 text-slate-500 mx-auto mb-2"/><p className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>PRC License ID Image</p><p className="text-xs text-slate-500">Mockup: No image uploaded</p></div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><p className="text-slate-500 text-[10px] uppercase font-bold">Full Name</p><p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{viewDoc.name}</p></div>
                      <div><p className="text-slate-500 text-[10px] uppercase font-bold">License No.</p><p className={`font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{viewDoc.license}</p></div>
                      <div><p className="text-slate-500 text-[10px] uppercase font-bold">Clinic</p><p className={`${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{viewDoc.clinicDetails?.name || 'N/A'}</p></div>
                      <div><p className="text-slate-500 text-[10px] uppercase font-bold">Contact</p><p className={`${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{viewDoc.clinicDetails?.contactNumber || 'N/A'}</p></div>
                  </div>
               </div>
               <div className={`p-4 border-t flex justify-end ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}><button onClick={() => setViewDoc(null)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-indigo-700">Close</button></div>
            </div>
         </div>
      )}
    </div>
  );
}

function MachinesView({ machines, onPing, onReboot, onDelete, isDarkMode }) {
   return (
      <div className={`rounded-xl border overflow-hidden max-w-7xl mx-auto ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
         <div className={`p-5 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}><h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Kiosk Network</h3></div>
         <div className="overflow-x-auto">
           <table className="w-full text-left text-sm">
              <thead className={`text-xs uppercase text-slate-400 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}><tr><th className="px-6 py-3">ID</th><th className="px-6 py-3">Location</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-right">Controls</th></tr></thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-100'}`}>
                 {machines.length === 0 ? <tr><td colSpan="4" className="p-4 text-center text-xs text-slate-500">No kiosks connected.</td></tr> : machines.map(m => (
                    <tr key={m.id} className={`transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                       <td className={`px-6 py-3 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{m.id}</td>
                       <td className="px-6 py-3 text-slate-400">{m.location}</td>
                       <td className="px-6 py-3"><span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${m.status === 'online' ? 'bg-emerald-500/20 text-emerald-500' : m.status === 'rebooting' ? 'bg-amber-500/20 text-amber-500' : 'bg-rose-500/20 text-rose-500'}`}>{m.status === 'online' ? <Wifi className="w-3 h-3"/> : <WifiOff className="w-3 h-3"/>} {m.status}</span></td>
                       <td className="px-6 py-3 text-right">
                          <div className="flex justify-end gap-2">
                             <button onClick={() => onPing(m.id)} className={`p-1.5 rounded ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-slate-600'}`} title="Ping"><Activity size={14}/></button>
                             <button onClick={() => onReboot(m.id)} className={`p-1.5 rounded ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-slate-600'}`} title="Reboot"><Power size={14}/></button>
                             <button onClick={() => onDelete(m.id)} className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 rounded text-rose-500" title="Remove"><Trash2 size={14}/></button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
         </div>
      </div>
   );
}

function TransactionsView({ transactions, onClear, isDarkMode }) {
   return (
      <div className={`rounded-xl border overflow-hidden max-w-7xl mx-auto ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
         <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
            <h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Prescription Registry</h3>
            <button onClick={onClear} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors"><Trash2 className="w-3.5 h-3.5"/> Safe Cleanup</button>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className={`text-[10px] uppercase font-bold text-slate-400 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                 <tr><th className="px-5 py-3">ID</th><th className="px-5 py-3">Prescribing Doctor</th><th className="px-5 py-3">Patient</th><th className="px-5 py-3">Value</th><th className="px-5 py-3">Status</th></tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-100'}`}>
                 {transactions.length === 0 ? <tr><td colSpan="5" className="p-4 text-center text-xs text-slate-500">No transactions recorded.</td></tr> : transactions.map(tx => (
                  <tr key={tx.id} className={`transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                     <td className="px-5 py-3 font-mono text-xs text-slate-500">{tx.id}</td>
                     <td className={`px-5 py-3 text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tx.doctorName}</td>
                     <td className="px-5 py-3 text-sm text-slate-400">{tx.patient?.name}</td>
                     <td className="px-5 py-3 text-sm font-bold text-emerald-500">₱{tx.grandTotal?.toFixed(2)}</td>
                     <td className="px-5 py-3"><PrescriptionStatusBadge status={tx.status || 'issued'}/></td>
                  </tr>
                 ))}
              </tbody>
           </table>
         </div>
      </div>
   );
}

function AuditView({ logs, onClear, isDarkMode }) {
   return (
      <div className={`rounded-xl border overflow-hidden max-w-7xl mx-auto ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
         <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
             <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Audit Log</h3>
             <button onClick={onClear} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors"><Trash2 className="w-3.5 h-3.5"/> Clear Log</button>
         </div>
         <table className="w-full text-left text-sm">
            <thead className={`text-xs uppercase text-slate-400 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}><tr><th className="px-6 py-3">Action</th><th className="px-6 py-3">Details</th><th className="px-6 py-3">User</th><th className="px-6 py-3 text-right">Time</th></tr></thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-100'}`}>
               {logs.length === 0 ? <tr><td colSpan="4" className="p-4 text-center text-xs text-slate-500">No logs available.</td></tr> : logs.map((log, i) => (
                  <tr key={i} className={`transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                     <td className={`px-6 py-3 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{log.action}</td>
                     <td className="px-6 py-3 text-slate-400">{log.details}</td>
                     <td className="px-6 py-3 font-mono text-xs text-slate-500">{log.user}</td>
                     <td className="px-6 py-3 text-right text-slate-500 text-xs">{log.time}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

function SettingsView({ profile, setProfile, onSave, isEditing, setIsEditing, setShowPassword, isDarkMode }) {
   const [activeSettingTab, setActiveSettingTab] = useState('profile');
   
   return (
      <div className={`w-full rounded-xl border overflow-hidden flex flex-col md:flex-row ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
         {/* Settings Sidebar */}
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

         {/* Mobile Tabs */}
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

         {/* Settings Content */}
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
                           <input type="text" disabled={!isEditing} className={`w-full px-3 md:px-4 py-2 border rounded-lg outline-none text-sm ${isEditing ? 'border-indigo-500 focus:ring-2 focus:ring-indigo-500/50' : 'border-transparent'} ${isDarkMode ? 'bg-white/5 text-slate-300' : 'bg-gray-100 text-slate-700'}`} value={profile.displayName} onChange={e => setProfile({...profile, displayName: e.target.value})} />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Username</label>
                           <input type="text" disabled={!isEditing} className={`w-full px-3 md:px-4 py-2 border rounded-lg outline-none text-sm ${isEditing ? 'border-indigo-500 focus:ring-2 focus:ring-indigo-500/50' : 'border-transparent'} ${isDarkMode ? 'bg-white/5 text-slate-300' : 'bg-gray-100 text-slate-700'}`} value={profile.username} onChange={e => setProfile({...profile, username: e.target.value})} />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Email</label>
                           <input type="email" disabled={!isEditing} className={`w-full px-3 md:px-4 py-2 border rounded-lg outline-none text-sm ${isEditing ? 'border-indigo-500 focus:ring-2 focus:ring-indigo-500/50' : 'border-transparent'} ${isDarkMode ? 'bg-white/5 text-slate-300' : 'bg-gray-100 text-slate-700'}`} value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
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
                      <button onClick={() => alert('Exporting...')} className={`flex flex-col items-center justify-center p-2 md:p-6 border rounded-md md:rounded-xl transition-colors group ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                          <Download className="w-4 h-4 md:w-8 md:h-8 text-slate-500 group-hover:text-emerald-500 mb-1 md:mb-2" />
                          <span className="text-[10px] md:text-sm font-bold text-slate-400 text-center line-clamp-2">Export Logs</span>
                      </button>
                      <button onClick={() => alert('Cache Cleared')} className={`flex flex-col items-center justify-center p-2 md:p-6 border rounded-md md:rounded-xl transition-colors group border-dashed ${isDarkMode ? 'border-white/10 hover:bg-rose-500/10' : 'border-gray-300 hover:bg-rose-50'}`}>
                          <Trash2 className="w-4 h-4 md:w-8 md:h-8 text-slate-500 group-hover:text-rose-500 mb-1 md:mb-2" />
                          <span className="text-[10px] md:text-sm font-bold text-slate-400 group-hover:text-rose-500 text-center line-clamp-2">Clear Cache</span>
                      </button>
                      <button onClick={() => alert('Backing up...')} className={`flex flex-col items-center justify-center p-2 md:p-6 border rounded-md md:rounded-xl transition-colors group ${isDarkMode ? 'border-white/10 hover:bg-blue-500/10' : 'border-gray-200 hover:bg-blue-50'}`}>
                          <Database className="w-4 h-4 md:w-8 md:h-8 text-slate-500 group-hover:text-blue-500 mb-1 md:mb-2" />
                          <span className="text-[10px] md:text-sm font-bold text-slate-400 text-center line-clamp-2">Backup DB</span>
                      </button>
                      <button onClick={() => alert('Storage: 45%')} className={`flex flex-col items-center justify-center p-2 md:p-6 border rounded-md md:rounded-xl transition-colors group ${isDarkMode ? 'border-white/10 hover:bg-purple-500/10' : 'border-gray-200 hover:bg-purple-50'}`}>
                          <HardDrive className="w-4 h-4 md:w-8 md:h-8 text-slate-500 group-hover:text-purple-500 mb-1 md:mb-2" />
                          <span className="text-[10px] md:text-sm font-bold text-slate-400 text-center line-clamp-2">Storage</span>
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

// --- SHARED COMPONENTS (Adaptive Theme) ---
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