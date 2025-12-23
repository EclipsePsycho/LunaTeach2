
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, PrimaryButton } from '../components/Layout';
import { Logo } from '../constants';
import { UserRole } from '../types';

interface LandingProps {
  onSetRole: (role: UserRole) => void;
}

const Landing: React.FC<LandingProps> = ({ onSetRole }) => {
  const navigate = useNavigate();
  const [view, setView] = useState<'welcome' | 'signup-choice'>('welcome');

  const handleRoleSelection = (role: UserRole) => {
    onSetRole(role);
    if (role === UserRole.STUDENT) {
      navigate('/student/onboarding');
    } else {
      navigate('/teacher/onboarding');
    }
  };

  return (
    <Layout showNav={false}>
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 raycast-bg -z-10"></div>
        
        <div className="w-full max-w-4xl flex flex-col items-center text-center space-y-8 animate-ray">
          {view === 'welcome' ? (
            <>
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-white/5 blur-3xl scale-150 rounded-full opacity-30"></div>
                <Logo size={120} className="relative z-10" />
              </div>
              
              <div className="space-y-8">
                <div className="space-y-2">
                  <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-white leading-none">
                    LunaTeach
                  </h1>
                  <p className="text-2xl lg:text-4xl font-bold text-white tracking-tight mt-4">
                    تسلط بر انگلیسی، ساده و هوشمند.
                  </p>
                </div>
                
                <p className="text-lg lg:text-xl text-[#8E8E8E] max-w-2xl mx-auto font-medium leading-relaxed">
                  یادگیری زبان برای آدم‌هایی که وقتشان ارزش دارد
                </p>
              </div>

              <div className="flex items-center gap-4 mt-8 flex-row-reverse">
                <PrimaryButton 
                  variant="accent" 
                  className="px-10 py-4 text-base rounded-xl"
                  onClick={() => setView('signup-choice')}
                >
                  به ما بپیوندید
                </PrimaryButton>
                <PrimaryButton 
                  variant="secondary" 
                  className="px-10 py-4 text-base rounded-xl bg-[#1a1a1a]"
                  onClick={() => navigate('/login')}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-[#2a2a2a] rounded border border-white/5 text-[10px] font-mono text-[#8E8E8E]">
                      <span>⌘</span>
                      <span>L</span>
                    </div>
                    <span>ورود</span>
                  </div>
                </PrimaryButton>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-24">
                {[
                  { title: "متخصصان بومی", desc: "اساتید دست‌چین شده با تجربه واقعی در دنیای بین‌الملل." },
                  { title: "تطبیق هوشمند", desc: "الگوریتم ما در چند ثانیه بهترین مدرس را برای شما پیدا می‌کند." },
                  { title: "رابط کاربری مدرن", desc: "تجربه‌ای در تراز جهانی، طراحی شده برای عصر مدرن." }
                ].map((f, i) => (
                  <div key={i} className="raycast-card p-6 text-center group hover:border-[#333] transition-all">
                    <h3 className="font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-sm text-[#8E8E8E] leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="w-full max-w-2xl space-y-12 animate-ray">
              <div className="text-center space-y-4">
                <button 
                  onClick={() => setView('welcome')}
                  className="text-[#8E8E8E] hover:text-white transition-colors text-xs uppercase tracking-widest font-bold"
                >
                  ← بازگشت
                </button>
                <h2 className="text-4xl font-bold">مسیر خود را انتخاب کنید</h2>
                <p className="text-[#8E8E8E]">برای شروع فرآیند عضویت، نقش خود را انتخاب نمایید.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  onClick={() => handleRoleSelection(UserRole.STUDENT)}
                  className="raycast-card p-8 cursor-pointer hover:bg-[#111] transition-all text-right group border-white/5"
                >
                  <div className="text-[#FF6363] mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/></svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">یادگیرنده هستم</h3>
                  <p className="text-sm text-[#8E8E8E]">دسترسی به اساتید تراز اول و نقشه‌های راه شخصی‌سازی شده.</p>
                </div>

                <div 
                  onClick={() => handleRoleSelection(UserRole.TEACHER)}
                  className="raycast-card p-8 cursor-pointer hover:bg-[#111] transition-all text-right group border-white/5"
                >
                  <div className="text-[#8E8E8E] mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" transform="scale(-1, 1) translate(-24, 0)"/></svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">مدرس هستم</h3>
                  <p className="text-sm text-[#8E8E8E]">برند حرفه‌ای خود را بسازید و یادگیرندگان برگزیده را مدیریت کنید.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Landing;
