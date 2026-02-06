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
  Globe
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

const saveAdminCreds = (creds) => {
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(creds));
};

// --- MOCK DATA ---
const MOCK_MACHINES = []; // Cleared mock data
// Removed MOCK_AUDIT_LOGS to ensure only real system actions are shown

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
      <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Connecting to Secure Server...</p>
        </div>
      </div>
    );
  }
  
  if (!isAdminLoggedIn) {
    return <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} cloudProfile={adminProfile} />;
  }

  return <AdminDashboard onLogout={() => setIsAdminLoggedIn(false)} initialProfile={adminProfile} />;
}

// --- 1. ADMIN LOGIN SCREEN ---
function AdminLogin({ onLogin, cloudProfile }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Lockout State
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Timer Effect
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
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans text-slate-900 overflow-hidden">
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center p-8 lg:p-12 relative z-10 bg-white">
        <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center justify-center p-3 bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/20 mb-6">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Super Admin</h2>
            <p className="mt-2 text-slate-500">MediVend Network Control</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Username</label>
              <div className="relative group">
                <User className="w-5 h-5 absolute left-3 top-3 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all shadow-sm" 
                  placeholder="Enter username" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  disabled={isLocked}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
              <div className="relative group">
                <Lock className="w-5 h-5 absolute left-3 top-3 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                <input 
                  type="password" 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all shadow-sm" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  disabled={isLocked}
                />
              </div>
            </div>
            {error && (
                <div className={`p-3 border rounded-lg text-xs font-medium flex items-center gap-2 ${isLocked ? 'bg-red-100 border-red-200 text-red-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                    <AlertTriangle className="w-4 h-4"/>
                    {isLocked ? `Security Lockout: Try again in ${lockoutTimer}s` : error}
                </div>
            )}
            <button 
                disabled={loading || isLocked} 
                className={`w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] flex justify-center items-center gap-2 ${isLocked ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'}`}
            >
               {loading ? <RefreshCw className="w-4 h-4 animate-spin"/> : isLocked ? "Locked" : "Access Portal"}
            </button>
          </form>
          <div className="text-center text-xs text-slate-400 pt-8 border-t border-slate-200">
             <p>Authorized Personnel Only • Secure Connection</p>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80"></div>
        <div className="relative z-10 p-12 text-white max-w-lg text-center">
           <Activity className="w-24 h-24 text-emerald-500 mx-auto mb-6 opacity-80" />
           <h1 className="text-4xl font-bold mb-4 tracking-tight">System Status: Optimal</h1>
           <p className="text-slate-400 text-lg">Real-time monitoring active.</p>
        </div>
      </div>
    </div>
  );
}

// --- 2. ADMIN DASHBOARD ---
function AdminDashboard({ onLogout, initialProfile }) {
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

  const handleStatClick = (targetTab, targetFilter) => {
    setActiveTab(targetTab);
    if(targetFilter) setFilter(targetFilter);
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      
      {/* MOBILE BACKDROP */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#0f172a] text-slate-400 border-r border-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800/50 mb-2">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-1.5 rounded-lg shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-wide">MediVend</h1>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Super Admin</p>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          <div className="px-3 mb-2 mt-2 text-[10px] uppercase font-bold tracking-wider text-slate-500">Workspace</div>
          <NavButton id="overview" label="Dashboard" icon={<LayoutDashboard className="w-4 h-4" />} active={activeTab === 'overview'} onClick={handleNavClick} />
          
          <div className="px-3 mt-6 mb-2 text-[10px] uppercase font-bold tracking-wider text-slate-600">Network</div>
          <NavButton id="doctors" label="Doctors" icon={<Users className="w-4 h-4" />} active={activeTab === 'doctors'} onClick={handleNavClick} badge={pendingDocs} />
          <NavButton id="machines" label="Kiosks" icon={<Server className="w-4 h-4" />} active={activeTab === 'machines'} onClick={handleNavClick} />
          
          <div className="px-3 mt-4 mb-2 text-[10px] uppercase font-bold tracking-wider text-slate-600">Compliance</div>
          <NavButton id="transactions" label="Logs" icon={<FileText className="w-4 h-4" />} active={activeTab === 'transactions'} onClick={handleNavClick} />
          <NavButton id="audit" label="Audit" icon={<ClipboardList className="w-4 h-4" />} active={activeTab === 'audit'} onClick={handleNavClick} />
        </nav>

        <div className="p-3 bg-slate-900 border-t border-slate-800">
          <button onClick={onLogout} className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all text-xs font-bold uppercase tracking-wide group">
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold text-slate-800 capitalize tracking-tight flex items-center gap-2">
              {activeTab === 'overview' && <LayoutDashboard className="w-5 h-5 text-slate-400 hidden sm:block" />}
              {activeTab.replace('-', ' ')}
            </h2>
          </div>
          <div className="flex items-center gap-5">
            <div className="hidden lg:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-600 border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            
            {/* NOTIFICATION BELL */}
            <button onClick={() => { setActiveTab('doctors'); setFilter('pending'); }} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors relative rounded-full hover:bg-slate-50">
              <Bell className="w-5 h-5" />
              {pendingDocs > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
            </button>
            
            {/* SETTINGS BUTTON (Using Logo) */}
            <button onClick={() => setActiveTab('settings')} className="h-9 w-9 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden shadow-md ring-2 ring-slate-100 hover:ring-emerald-100 transition-all active:scale-95">
              <UserAvatar src={adminProfile?.photoUrl || "image_3f1ac4.png"} alt="SA" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#f8fafc]">
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Stat Cards - Enhanced */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard 
                  title="Pending Approvals" 
                  value={pendingDocs} 
                  icon={<Users className="w-5 h-5 text-amber-600" />} 
                  color="amber" 
                  subtext="Requires attention" 
                  onClick={() => { setActiveTab('doctors'); setFilter('pending'); }} 
                />
                <StatCard 
                  title="Active Kiosks" 
                  value={`${activeMachines}/${machines.length > 0 ? machines.length : 0}`} 
                  icon={<Server className="w-5 h-5 text-emerald-600" />} 
                  color="emerald" 
                  subtext="Network Status" 
                  onClick={() => setActiveTab('machines')} 
                />
                {/* REPLACED TOTAL REVENUE WITH ACTIVE PHYSICIANS */}
                <StatCard 
                  title="Active Physicians" 
                  value={activeDocs} 
                  icon={<Stethoscope className="w-5 h-5 text-blue-600" />} 
                  color="blue" 
                  subtext="Verified prescribers" 
                  onClick={() => { setActiveTab('doctors'); setFilter('active'); }} 
                />
                <StatCard 
                  title="Security Alerts" 
                  value={auditLogs.length} 
                  icon={<AlertOctagon className="w-5 h-5 text-red-600" />} 
                  color="red" 
                  subtext="System events" 
                  onClick={() => setActiveTab('audit')} 
                />
              </div>

              {/* NETWORK HEALTH MONITORING */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">Network Health</h3>
                    <p className="text-xs text-slate-500">Real-time infrastructure status & capacity</p>
                  </div>
                  <div className="flex gap-2">
                     <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded"><Activity className="w-3 h-3"/> System Normal</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Kiosk Status */}
                   <div>
                      <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Server className="w-4 h-4"/> Kiosk Connectivity</h4>
                      <div className="space-y-4">
                         <div>
                            <div className="flex justify-between text-xs mb-1">
                               <span className="font-medium text-slate-600">Online ({activeMachines})</span>
                               <span className="text-emerald-600 font-bold">{machines.length > 0 ? Math.round((activeMachines / machines.length) * 100) : 0}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                               <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${machines.length > 0 ? (activeMachines / machines.length) * 100 : 0}%` }}></div>
                            </div>
                         </div>
                         <div>
                            <div className="flex justify-between text-xs mb-1">
                               <span className="font-medium text-slate-600">Offline / Maintenance ({machines.length - activeMachines})</span>
                               <span className="text-slate-400 font-bold">{machines.length > 0 ? Math.round(((machines.length - activeMachines) / machines.length) * 100) : 0}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                               <div className="bg-slate-400 h-2 rounded-full transition-all duration-1000" style={{ width: `${machines.length > 0 ? ((machines.length - activeMachines) / machines.length) * 100 : 0}%` }}></div>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Doctor Status */}
                   <div>
                      <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Users className="w-4 h-4"/> Provider Status</h4>
                      <div className="space-y-4">
                         <div>
                            <div className="flex justify-between text-xs mb-1">
                               <span className="font-medium text-slate-600">Active Physicians ({activeDocs})</span>
                               <span className="text-blue-600 font-bold">{doctors.length > 0 ? Math.round((activeDocs / doctors.length) * 100) : 0}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                               <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${doctors.length > 0 ? (activeDocs / doctors.length) * 100 : 0}%` }}></div>
                            </div>
                         </div>
                         <div>
                            <div className="flex justify-between text-xs mb-1">
                               <span className="font-medium text-slate-600">Pending Approval ({pendingDocs})</span>
                               <span className="text-amber-500 font-bold">{doctors.length > 0 ? Math.round((pendingDocs / doctors.length) * 100) : 0}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                               <div className="bg-amber-400 h-2 rounded-full transition-all duration-1000" style={{ width: `${doctors.length > 0 ? (pendingDocs / doctors.length) * 100 : 0}%` }}></div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Quick Actions */}
                 <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 h-full">
                    <h3 className="font-bold text-base text-slate-800 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                       <ActionButton onClick={() => {setActiveTab('doctors'); setFilter('pending')}} icon={<Users className="w-4 h-4"/>} label={`Review ${pendingDocs} Doctors`} variant="primary" />
                       <ActionButton onClick={() => setActiveTab('audit')} icon={<FileSearch className="w-4 h-4"/>} label="View Security Audit" variant="secondary" />
                    </div>
                 </div>
                 
                 {/* Activity Feed */}
                 <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-base text-slate-800 mb-4">Live Activity Feed</h3>
                    <div className="space-y-0 relative">
                       {/* Simple vertical line */}
                       <div className="absolute left-3 top-2 bottom-2 w-px bg-slate-100"></div>
                       
                       {transactions.length === 0 && auditLogs.length === 0 ? (
                           <div className="pl-8 py-4 text-sm text-slate-400 italic">No recent activity</div>
                       ) : (
                           <>
                           {transactions.slice(0, 3).map(tx => (
                              <div key={tx.id} className="py-3 pl-8 relative flex justify-between items-center text-sm group hover:bg-slate-50 rounded-lg -ml-2 pr-2 transition-colors">
                                 <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-100 border-2 border-blue-500 rounded-full z-10"></div>
                                 <div className="flex items-center gap-3">
                                    <div><p className="font-bold text-slate-800 text-xs">Prescription Issued</p><p className="text-xs text-slate-500">Dr. {tx.doctorName}</p></div>
                                 </div>
                                 <span className="text-xs text-slate-400 font-mono">{tx.date}</span>
                              </div>
                           ))}
                           {auditLogs.slice(0, 3).map((log, idx) => (
                              <div key={idx} className="py-3 pl-8 relative flex justify-between items-center text-sm group hover:bg-slate-50 rounded-lg -ml-2 pr-2 transition-colors">
                                 <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-100 border-2 border-amber-500 rounded-full z-10"></div>
                                 <div className="flex items-center gap-3"><div><p className="font-bold text-slate-800 text-xs">{log.action}</p><p className="text-xs text-slate-500">{log.details}</p></div></div>
                                 <span className="text-xs text-slate-400 font-mono">{log.time}</span>
                              </div>
                           ))}
                           </>
                       )}
                    </div>
                 </div>
              </div>
            </div>
          )}
          {activeTab === 'doctors' && <DoctorsView doctors={displayedDoctors} filter={filter} setFilter={setFilter} onRefresh={()=>{}} onUpdateStatus={updateDoctorStatus} loading={loading} />}
          {activeTab === 'machines' && <MachinesView machines={machines} onPing={handlePingMachine} onReboot={handleRebootMachine} onDelete={handleDeleteMachine} />}
          {activeTab === 'transactions' && <TransactionsView transactions={transactions} onClear={handleClearTransactions} />}
          {activeTab === 'audit' && <AuditView logs={auditLogs} onClear={handleClearAuditLogs} />}
          {activeTab === 'settings' && <SettingsView profile={adminProfile} setProfile={setAdminProfile} onSave={handleSaveProfile} isEditing={isEditingProfile} setIsEditing={setIsEditingProfile} setShowPassword={() => setShowPasswordModal(true)} />}
        </main>
        {showPasswordModal && <PasswordModal onClose={() => setShowPasswordModal(false)} currentCreds={adminProfile} onUpdate={handlePasswordUpdate} />}
      </div>
    </div>
  );
}

// --- SUB-VIEWS ---
function DoctorsView({ doctors, filter, setFilter, onRefresh, onUpdateStatus, loading }) {
  const [viewDoc, setViewDoc] = useState(null);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-7xl mx-auto">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-base text-slate-800">Medical Practitioners</h3>
        <button onClick={onRefresh} className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1 hover:text-emerald-600 transition-colors"><RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin':''}`}/> Refresh</button>
      </div>
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex gap-2 overflow-x-auto">
        {['pending', 'active', 'rejected', 'all'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${filter === f ? 'bg-emerald-600 text-white shadow' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'}`}>{f}</button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500"><tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">License Info</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {doctors.length === 0 ? <tr><td colSpan="4" className="p-4 text-center text-xs text-slate-400">No doctors found.</td></tr> : doctors.map(doc => (
              <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-500">{doc.name ? doc.name.charAt(0) : '?'}</div><div><div className="font-bold text-sm text-slate-800">{doc.name}</div><div className="text-[10px] text-slate-500">{doc.email}</div></div></div></td>
                <td className="px-5 py-3 text-xs text-slate-600"><span className="font-mono bg-slate-100 px-1 rounded">{doc.license}</span></td>
                <td className="px-5 py-3"><StatusBadge status={doc.status} /></td>
                <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setViewDoc(doc)} className="p-1.5 text-slate-400 hover:text-blue-600" title="Verify Details"><Eye className="w-4 h-4"/></button>
                      {doc.status === 'pending' && (<><button onClick={() => onUpdateStatus(doc.id, 'active')} className="p-1.5 text-emerald-600 bg-emerald-50 rounded hover:bg-emerald-100"><CheckCircle className="w-4 h-4"/></button><button onClick={() => onUpdateStatus(doc.id, 'rejected')} className="p-1.5 text-red-600 bg-red-50 rounded hover:bg-red-100"><XCircle className="w-4 h-4"/></button></>)}
                      {doc.status === 'active' && <button onClick={() => onUpdateStatus(doc.id, 'rejected')} className="text-[10px] font-bold text-red-600 border border-red-200 px-2 py-1 rounded hover:bg-red-50">Revoke</button>}
                      {doc.status === 'rejected' && <button onClick={() => onUpdateStatus(doc.id, 'active')} className="text-[10px] font-bold text-emerald-600 border border-emerald-200 px-2 py-1 rounded hover:bg-emerald-50">Restore</button>}
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {viewDoc && (
         <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
               <div className="p-5 border-b border-slate-100 flex justify-between items-center"><h3 className="font-bold text-base text-slate-800">Verification Details</h3><button onClick={() => setViewDoc(null)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600"/></button></div>
               <div className="p-6 space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center"><FileBadge className="w-10 h-10 text-slate-300 mx-auto mb-2"/><p className="text-sm font-bold text-slate-700">PRC License ID Image</p><p className="text-xs text-slate-400">Mockup: No image uploaded</p></div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                     <div><p className="text-slate-500 text-[10px] uppercase font-bold">Full Name</p><p className="font-semibold text-slate-800">{viewDoc.name}</p></div>
                     <div><p className="text-slate-500 text-[10px] uppercase font-bold">License No.</p><p className="font-mono text-slate-800">{viewDoc.license}</p></div>
                     <div><p className="text-slate-500 text-[10px] uppercase font-bold">Clinic</p><p className="text-slate-800">{viewDoc.clinicDetails?.name || 'N/A'}</p></div>
                     <div><p className="text-slate-500 text-[10px] uppercase font-bold">Contact</p><p className="text-slate-800">{viewDoc.clinicDetails?.contactNumber || 'N/A'}</p></div>
                  </div>
               </div>
               <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end"><button onClick={() => setViewDoc(null)} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-wide">Close</button></div>
            </div>
         </div>
      )}
    </div>
  );
}

function MachinesView({ machines, onPing, onReboot, onDelete }) {
   return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-7xl mx-auto">
         <div className="p-5 border-b border-slate-100"><h3 className="font-bold text-base text-slate-800">Kiosk Network</h3></div>
         <div className="overflow-x-auto">
           <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-6 py-3">ID</th><th className="px-6 py-3">Location</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-right">Controls</th></tr></thead>
              <tbody>
                 {machines.length === 0 ? <tr><td colSpan="4" className="p-4 text-center text-xs text-slate-400">No kiosks connected.</td></tr> : machines.map(m => (
                    <tr key={m.id} className="border-t hover:bg-slate-50">
                       <td className="px-6 py-3 font-bold">{m.id}</td>
                       <td className="px-6 py-3">{m.location}</td>
                       <td className="px-6 py-3"><span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${m.status === 'online' ? 'bg-emerald-100 text-emerald-700' : m.status === 'rebooting' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{m.status === 'online' ? <Wifi className="w-3 h-3"/> : <WifiOff className="w-3 h-3"/>} {m.status}</span></td>
                       <td className="px-6 py-3 text-right">
                          <div className="flex justify-end gap-2">
                             <button onClick={() => onPing(m.id)} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-600" title="Ping"><Activity size={14}/></button>
                             <button onClick={() => onReboot(m.id)} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-600" title="Reboot"><Power size={14}/></button>
                             <button onClick={() => onDelete(m.id)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded text-red-600" title="Remove"><Trash2 size={14}/></button>
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

function TransactionsView({ transactions, onClear }) {
   return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-7xl mx-auto">
         <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-base text-slate-800">Prescription Registry</h3>
            <button onClick={onClear} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors"><Trash2 className="w-3.5 h-3.5"/> Safe Cleanup</button>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                 <tr><th className="px-5 py-3">ID</th><th className="px-5 py-3">Prescribing Doctor</th><th className="px-5 py-3">Patient</th><th className="px-5 py-3">Value</th><th className="px-5 py-3">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {transactions.length === 0 ? <tr><td colSpan="5" className="p-4 text-center text-xs text-slate-400">No transactions recorded.</td></tr> : transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                     <td className="px-5 py-3 font-mono text-xs text-slate-500">{tx.id}</td>
                     <td className="px-5 py-3 text-sm font-semibold text-slate-800">{tx.doctorName}</td>
                     <td className="px-5 py-3 text-sm text-slate-600">{tx.patient?.name}</td>
                     <td className="px-5 py-3 text-sm font-bold text-slate-900">₱{tx.grandTotal?.toFixed(2)}</td>
                     <td className="px-5 py-3"><PrescriptionStatusBadge status={tx.status || 'issued'}/></td>
                  </tr>
                 ))}
              </tbody>
           </table>
         </div>
      </div>
   );
}

function AuditView({ logs, onClear }) {
   return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-7xl mx-auto">
         <div className="p-4 border-b flex justify-between items-center">
             <h3 className="font-bold">Audit Log</h3>
             <button onClick={onClear} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors"><Trash2 className="w-3.5 h-3.5"/> Clear Log</button>
         </div>
         <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-6 py-3">Action</th><th className="px-6 py-3">Details</th><th className="px-6 py-3">User</th><th className="px-6 py-3 text-right">Time</th></tr></thead>
            <tbody>
               {logs.length === 0 ? <tr><td colSpan="4" className="p-4 text-center text-xs text-slate-400">No logs available.</td></tr> : logs.map((log, i) => (
                  <tr key={i} className="border-t">
                     <td className="px-6 py-3 font-bold">{log.action}</td>
                     <td className="px-6 py-3 text-slate-600">{log.details}</td>
                     <td className="px-6 py-3 font-mono text-xs text-slate-500">{log.user}</td>
                     <td className="px-6 py-3 text-right text-slate-400 text-xs">{log.time}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

function SettingsView({ profile, setProfile, onSave, isEditing, setIsEditing, setShowPassword }) {
   const [activeSettingTab, setActiveSettingTab] = useState('profile');
   const [systemSettings, setSystemSettings] = useState({
      maintenanceMode: false,
      emailAlerts: true,
      smsAlerts: false,
      darkMode: false
   });

   const toggleSetting = (key) => {
      setSystemSettings(prev => ({ ...prev, [key]: !prev[key] }));
   };

   return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex">
         {/* Settings Sidebar */}
         <div className="w-64 bg-slate-50 border-r border-slate-200 p-4">
            <h3 className="font-bold text-slate-800 mb-4 px-2">Settings</h3>
            <nav className="space-y-1">
               <button onClick={() => setActiveSettingTab('profile')} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${activeSettingTab === 'profile' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  <User className="w-4 h-4" /> Profile
               </button>
               <button onClick={() => setActiveSettingTab('system')} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${activeSettingTab === 'system' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  <Server className="w-4 h-4" /> System
               </button>
               <button onClick={() => setActiveSettingTab('security')} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${activeSettingTab === 'security' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  <ShieldCheck className="w-4 h-4" /> Security
               </button>
               <button onClick={() => setActiveSettingTab('data')} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${activeSettingTab === 'data' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  <Database className="w-4 h-4" /> Data Management
               </button>
            </nav>
         </div>

         {/* Settings Content */}
         <div className="flex-1 p-8">
            {activeSettingTab === 'profile' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                     <div>
                        <h4 className="font-bold text-lg text-slate-900">Admin Profile</h4>
                        <p className="text-xs text-slate-500">Manage your personal account details.</p>
                     </div>
                     {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100"><Edit2 className="w-3.5 h-3.5"/> Edit</button>
                     ) : (
                        <div className="flex gap-2">
                           <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
                           <button onClick={onSave} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"><Save className="w-3.5 h-3.5"/> Save</button>
                        </div>
                     )}
                  </div>
                  <div className="space-y-4">
                        <div>
                           <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Display Name</label>
                           <input type="text" disabled={!isEditing} className={`w-full px-4 py-2 border rounded-lg outline-none text-sm ${isEditing ? 'border-emerald-300 focus:ring-2 focus:ring-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-500'}`} value={profile.displayName} onChange={e => setProfile({...profile, displayName: e.target.value})} />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Username</label>
                           <input type="text" disabled={!isEditing} className={`w-full px-4 py-2 border rounded-lg outline-none text-sm ${isEditing ? 'border-emerald-300 focus:ring-2 focus:ring-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-500'}`} value={profile.username} onChange={e => setProfile({...profile, username: e.target.value})} />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Email</label>
                           <input type="email" disabled={!isEditing} className={`w-full px-4 py-2 border rounded-lg outline-none text-sm ${isEditing ? 'border-emerald-300 focus:ring-2 focus:ring-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-500'}`} value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
                        </div>
                   </div>
                   <div className="pt-4 border-t border-slate-100">
                     <button onClick={setShowPassword} className="flex items-center gap-2 text-xs text-emerald-600 font-bold uppercase tracking-wide hover:text-emerald-800"><Lock className="w-3.5 h-3.5"/> Change Password</button>
                  </div>
               </div>
            )}

            {activeSettingTab === 'system' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="border-b border-slate-100 pb-4">
                     <h4 className="font-bold text-lg text-slate-900">System Preferences</h4>
                     <p className="text-xs text-slate-500">Global settings for the MediVend network.</p>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                        <div className="flex items-center gap-3">
                           <div className={`p-2 rounded-lg ${systemSettings.maintenanceMode ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}>
                              <Power className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="font-bold text-sm text-slate-800">Maintenance Mode</p>
                              <p className="text-xs text-slate-500">Disable all kiosks for updates</p>
                           </div>
                        </div>
                        <button onClick={() => toggleSetting('maintenanceMode')}>
                           {systemSettings.maintenanceMode ? <ToggleRight className="w-8 h-8 text-emerald-500" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
                        </button>
                     </div>

                     <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                              <Bell className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="font-bold text-sm text-slate-800">Email Alerts</p>
                              <p className="text-xs text-slate-500">Receive inventory notifications</p>
                           </div>
                        </div>
                        <button onClick={() => toggleSetting('emailAlerts')}>
                           {systemSettings.emailAlerts ? <ToggleRight className="w-8 h-8 text-emerald-500" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {activeSettingTab === 'security' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                   <div className="border-b border-slate-100 pb-4">
                      <h4 className="font-bold text-lg text-slate-900">Security</h4>
                      <p className="text-xs text-slate-500">Manage account security and access.</p>
                   </div>
                   <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                         <p className="text-sm font-bold text-blue-800">Two-Factor Authentication</p>
                         <p className="text-xs text-blue-600 mt-1">2FA is currently <span className="font-bold">Enabled</span> via Email.</p>
                      </div>
                   </div>
                   <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase">Session Timeout</label>
                       <select className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white">
                           <option>15 Minutes</option>
                           <option>30 Minutes</option>
                           <option>1 Hour</option>
                           <option>Never</option>
                       </select>
                   </div>
                   <div className="border-t border-slate-100 pt-4">
                      <h5 className="font-bold text-sm text-slate-800 mb-2">Recent Login Activity</h5>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-500">
                         <div className="flex justify-between mb-1"><span>Manila, PH (Current)</span><span>Just now</span></div>
                         <div className="flex justify-between"><span>Cebu, PH</span><span>2 hours ago</span></div>
                      </div>
                   </div>
                </div>
            )}

            {activeSettingTab === 'data' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                   <div className="border-b border-slate-100 pb-4">
                      <h4 className="font-bold text-lg text-slate-900">Data Management</h4>
                      <p className="text-xs text-slate-500">Export logs or clear system caches.</p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <button className="flex flex-col items-center justify-center p-6 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group">
                          <Download className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 mb-2" />
                          <span className="text-sm font-bold text-slate-700">Export Audit Logs</span>
                      </button>
                       <button className="flex flex-col items-center justify-center p-6 border border-slate-200 rounded-xl hover:bg-red-50 transition-colors group border-dashed">
                          <Trash2 className="w-8 h-8 text-slate-400 group-hover:text-red-600 mb-2" />
                          <span className="text-sm font-bold text-slate-700 group-hover:text-red-700">Clear System Cache</span>
                      </button>
                   </div>
                   <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
                      <HardDrive className="w-5 h-5 text-amber-600" />
                      <div>
                         <p className="text-sm font-bold text-amber-800">Storage Usage</p>
                         <div className="w-full bg-amber-200 h-1.5 rounded-full mt-2 mb-1 overflow-hidden">
                             <div className="bg-amber-500 h-full w-[45%]"></div>
                         </div>
                         <p className="text-xs text-amber-700">45% used of 5GB quota</p>
                      </div>
                   </div>
               </div>
            )}
         </div>
      </div>
   );
}

function PasswordModal({ onClose, currentCreds, onUpdate }) {
  const [p, setP] = useState({ cur: '', new: '', conf: '' });
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
       <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-2xl">
          <h3 className="font-bold text-lg mb-4 text-slate-800">Change Password</h3>
          <div className="space-y-3">
             <input type="password" placeholder="Current" className="w-full border p-2 rounded-lg text-sm" value={p.cur} onChange={e=>setP({...p, cur:e.target.value})} />
             <input type="password" placeholder="New" className="w-full border p-2 rounded-lg text-sm" value={p.new} onChange={e=>setP({...p, new:e.target.value})} />
             <input type="password" placeholder="Confirm" className="w-full border p-2 rounded-lg text-sm" value={p.conf} onChange={e=>setP({...p, conf:e.target.value})} />
          </div>
          <div className="flex justify-end gap-2 mt-6">
             <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
             <button onClick={() => { if(p.cur !== currentCreds.password) return alert('Wrong password'); if(p.new !== p.conf) return alert('Mismatch'); onUpdate(p.new); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold">Update</button>
          </div>
       </div>
    </div>
  );
}

// --- SHARED COMPONENTS ---
function UserAvatar({ src, alt }) {
   const [hasError, setHasError] = useState(false);
   if (hasError || !src) return <span className="text-white font-bold text-xs">{alt || 'SA'}</span>;
   return <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setHasError(true)} />;
}

function NavButton({ id, label, icon, active, onClick, badge, badgeColor }) {
   return (
      <button onClick={() => onClick(id)} className={`flex w-full items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group ${active ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
         <div className="flex items-center gap-3">{icon}<span className="font-medium text-sm">{label}</span></div>
         {badge ? <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${badgeColor || 'bg-emerald-500'}`}>{badge}</span> : null}
      </button>
   );
}

function NavHeader({ title }) { return <div className="px-4 mt-6 mb-2 text-[10px] uppercase font-bold tracking-wider text-slate-500">{title}</div>; }

function StatCard({ title, value, icon, color, subtext, trend, onClick }) {
   const colors = { amber: "bg-amber-100 text-amber-600", blue: "bg-blue-100 text-blue-600", emerald: "bg-emerald-100 text-emerald-600", indigo: "bg-indigo-100 text-indigo-600", red: "bg-red-100 text-red-600" };
   return (
      <div onClick={onClick} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
         <div className="flex justify-between items-start mb-3">
            <div className={`p-2.5 rounded-lg ${colors[color]}`}>{icon}</div>
            {trend && <span className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-1 rounded-full border border-slate-100">{trend}</span>}
         </div>
         <div><h4 className="text-2xl font-bold text-slate-800">{value}</h4><p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">{title}</p><p className="text-[10px] text-slate-400 mt-1">{subtext}</p></div>
      </div>
   );
}

function StatusBadge({ status }) {
   const c = { active: "bg-emerald-100 text-emerald-700", pending: "bg-amber-100 text-amber-700", rejected: "bg-red-100 text-red-700" }[status];
   return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${c}`}>{status}</span>;
}

function PrescriptionStatusBadge({ status }) {
   const c = { issued: "bg-emerald-100 text-emerald-700", partial: "bg-amber-100 text-amber-700", completed: "bg-slate-100 text-slate-500" }[status] || "bg-gray-100";
   return <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${c}`}>{status}</span>;
}

function ActionButton({ onClick, label, icon, variant }) {
   const v = variant === 'primary' ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50";
   return <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm transition-all ${v}`}>{icon}{label}</button>;
}