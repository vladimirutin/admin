import React from 'react';
import { BarChart3 } from 'lucide-react';

export function TopPrescribedChart({ transactions, isDarkMode }) {
    const freqMap = {};
    if (transactions?.length > 0) {
        transactions.forEach(tx => {
            (tx.items || []).forEach(item => {
                const name = item.name || item.medicine || "Unknown";
                const qty = Number(item.qty || item.quantity || 1);
                freqMap[name] = (freqMap[name] || 0) + qty;
            });
        });
    }

    const sorted = Object.entries(freqMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxVal = Math.max(...sorted.map(s => s[1]), 1);
    const colors = ['from-indigo-500 to-violet-500', 'from-blue-500 to-cyan-400', 'from-emerald-500 to-teal-400', 'from-amber-500 to-orange-400', 'from-rose-500 to-pink-400'];

    return (
        <div className="space-y-5">
            {sorted.map(([name, count], i) => (
                <div key={i}>
                    <div className="flex justify-between text-xs mb-2">
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${colors[i]} inline-block`}></span>
                            <span className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{name}</span>
                        </div>
                        <span className="font-mono font-bold text-indigo-400">{count}</span>
                    </div>
                    <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                        <div
                            className={`h-full bg-gradient-to-r ${colors[i]} rounded-full progress-bar shadow-sm`}
                            style={{ width: `${(count / maxVal) * 100}%` }}
                        ></div>
                    </div>
                </div>
            ))}
            {sorted.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 opacity-40">
                    <BarChart3 className="w-10 h-10 text-slate-500 mb-2" />
                    <p className="text-sm text-slate-500">No prescription data yet</p>
                </div>
            )}
        </div>
    );
}
