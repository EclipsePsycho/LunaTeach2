
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, GlassCard, PrimaryButton } from '../components/Layout';
import { db } from '../services/database';
import { Session, Teacher } from '../types';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<(Session & { teacher?: Teacher })[]>([]);
  const walletBalance = db.wallet.getBalance();

  useEffect(() => {
    const loadDashboard = async () => {
      const allSessions = await db.sessions.getAll();
      const allTeachers = await db.teachers.getAll();
      
      const enriched = allSessions.map(s => ({
        ...s,
        teacher: allTeachers.find(t => t.id === s.teacherId)
      }));
      
      setSessions(enriched);
    };
    loadDashboard();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 lg:p-12 space-y-12 animate-ray">
        <header className="flex items-end justify-between border-b border-[#1F1F1F] pb-8">
          <div className="text-right">
            <h1 className="text-3xl font-bold">میز کار یادگیرنده</h1>
            <p className="text-[#8E8E8E] text-sm mt-1">مدیریت جلسات و اساتید برگزیده شما.</p>
          </div>
          <PrimaryButton variant="primary" onClick={() => navigate('/teachers')}>
            رزرو جلسه جدید <kbd className="ml-2">N</kbd>
          </PrimaryButton>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Wallet - Small Bento */}
          <GlassCard className="lg:col-span-1 flex flex-col justify-between border-white/5">
            <span className="text-[10px] font-bold text-[#8E8E8E] uppercase tracking-widest">موجودی کیف پول</span>
            <div className="mt-4">
              <span className="text-3xl font-bold mono">{walletBalance.toLocaleString()}</span>
              <span className="text-xs text-[#8E8E8E] mr-2">تومان</span>
            </div>
            <PrimaryButton className="w-full mt-6" variant="secondary">شارژ حساب</PrimaryButton>
          </GlassCard>

          {/* Activity Graph Placeholder - Large Bento */}
          <GlassCard className="lg:col-span-3 h-48 flex items-center justify-center border-dashed border-[#1F1F1F]">
            <p className="text-[#8E8E8E] text-sm italic">نمودار پیشرفت یادگیری به زودی فعال می‌شود.</p>
          </GlassCard>

          {/* Sessions - Wide Bento */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-lg font-bold">جلسات پیش رو</h3>
            <div className="grid grid-cols-1 gap-3">
              {sessions.length === 0 ? (
                <div className="raycast-card p-12 text-center border-dashed border-[#1F1F1F]">
                   <p className="text-[#8E8E8E] text-sm">هنوز جلسه‌ای رزرو نکرده‌اید.</p>
                   <button onClick={() => navigate('/teachers')} className="text-[#FF6363] text-xs mt-4 hover:underline">مشاهده اساتید برتر</button>
                </div>
              ) : (
                sessions.map(session => (
                  <div key={session.id} className="raycast-card p-4 flex items-center justify-between hover:bg-[#111] transition-colors">
                    <div className="flex items-center gap-4">
                      <img src={session.teacher?.photo} className="w-10 h-10 rounded-lg object-cover grayscale-[0.3]" />
                      <div className="text-right">
                        <p className="font-bold text-sm">{session.teacher?.name}</p>
                        <p className="text-xs text-[#8E8E8E] mono">{session.dateTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] mono text-[#8E8E8E] px-2 py-1 bg-white/5 rounded">{session.status}</span>
                      <PrimaryButton variant="secondary" className="text-xs">ورود به کلاس</PrimaryButton>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
