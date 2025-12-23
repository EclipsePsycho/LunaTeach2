
import React, { useState, useEffect } from 'react';
import { Layout, GlassCard } from '../components/Layout';
import { Teacher } from '../types';
import { db } from '../services/database';

interface AdminPanelProps {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ teachers, setTeachers }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'stats'>('pending');
  const [stats, setStats] = useState({ totalUsers: 0, totalRevenue: 0, totalSessions: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const users = JSON.parse(localStorage.getItem('lunateach_users') || '[]');
      const sessions = await db.sessions.getAll();
      const revenue = sessions.reduce((acc, curr) => acc + curr.amount, 0);
      
      setStats({
        totalUsers: users.length,
        totalRevenue: revenue,
        totalSessions: sessions.length
      });
    };
    loadStats();
  }, [teachers]);

  const updateRating = (id: string, rating: number) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, managementRating: rating } : t));
    // Persist to DB
    const current = JSON.parse(localStorage.getItem('lunateach_teachers') || '[]');
    const updated = current.map((t: any) => t.id === id ? { ...t, managementRating: rating } : t);
    localStorage.setItem('lunateach_teachers', JSON.stringify(updated));
  };

  const updateStatus = (id: string, status: 'approved' | 'rejected') => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    // Persist to DB
    const current = JSON.parse(localStorage.getItem('lunateach_teachers') || '[]');
    const updated = current.map((t: any) => t.id === id ? { ...t, status } : t);
    localStorage.setItem('lunateach_teachers', JSON.stringify(updated));
  };

  const filtered = teachers.filter(t => activeTab === 'pending' ? t.status === 'pending' : t.status === 'approved');

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 pt-12 space-y-8">
        <h1 className="text-3xl font-black tracking-tight text-premium">Super Admin Console</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
           <GlassCard className="text-center p-4">
              <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Total Platform Revenue</span>
              <p className="text-2xl font-black text-blue-400 mt-1">{stats.totalRevenue.toLocaleString()} IRR</p>
           </GlassCard>
           <GlassCard className="text-center p-4">
              <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Total Registered Users</span>
              <p className="text-2xl font-black text-white mt-1">{stats.totalUsers}</p>
           </GlassCard>
           <GlassCard className="text-center p-4">
              <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Total Booked Sessions</span>
              <p className="text-2xl font-black text-white mt-1">{stats.totalSessions}</p>
           </GlassCard>
        </div>

        <div className="flex gap-6 border-b border-white/10">
          <button 
            className={`pb-4 px-2 text-[10px] font-bold uppercase tracking-widest ${activeTab === 'pending' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-white/20'}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Approval ({teachers.filter(t => t.status === 'pending').length})
          </button>
          <button 
            className={`pb-4 px-2 text-[10px] font-bold uppercase tracking-widest ${activeTab === 'approved' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-white/20'}`}
            onClick={() => setActiveTab('approved')}
          >
            Approved Teachers ({teachers.filter(t => t.status === 'approved').length})
          </button>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-[#94A3B8] font-light italic">موردی برای نمایش وجود ندارد.</div>
          ) : (
            filtered.map(t => (
              <GlassCard key={t.id} className="flex flex-col md:flex-row items-center justify-between gap-6 border-white/[0.05]">
                 <div className="flex items-center gap-4">
                    <img src={t.photo} className="w-12 h-12 rounded-lg object-cover grayscale" />
                    <div className="text-right">
                       <p className="font-bold text-white">{t.name}</p>
                       <p className="text-[10px] text-white/30 uppercase tracking-widest">{t.experienceYears} Years Exp</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-6">
                    <div className="text-right">
                       <span className="block text-[8px] text-white/20 uppercase font-bold tracking-widest">LUNA Quality Rating</span>
                       <div className="flex gap-1 mt-1">
                          {[1,2,3,4,5].map(v => (
                            <button 
                              key={v} 
                              onClick={() => updateRating(t.id, v)}
                              className={`w-6 h-6 rounded flex items-center justify-center text-[10px] transition-all ${t.managementRating >= v ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/20 hover:bg-white/10'}`}
                            >
                              {v}
                            </button>
                          ))}
                       </div>
                    </div>
                    {activeTab === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(t.id, 'approved')} className="px-4 py-2 bg-green-500/10 text-green-400 text-[10px] font-bold rounded uppercase tracking-widest border border-green-500/20 hover:bg-green-500/20 transition-all">Approve</button>
                        <button onClick={() => updateStatus(t.id, 'rejected')} className="px-4 py-2 bg-red-500/10 text-red-400 text-[10px] font-bold rounded uppercase tracking-widest border border-red-500/20 hover:bg-red-500/20 transition-all">Reject</button>
                      </div>
                    )}
                 </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;
