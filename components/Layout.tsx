
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, COLORS } from '../constants';
import { UserRole } from '../types';

export { Logo };

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showNav = true }) => {
  const navigate = useNavigate();
  const savedRole = localStorage.getItem('lunateach_role') as UserRole | null;

  const handleAccountClick = () => {
    if (!savedRole) {
      navigate('/login');
      return;
    }
    if (savedRole === UserRole.STUDENT) navigate('/student/dashboard');
    else if (savedRole === UserRole.TEACHER) navigate('/teacher/dashboard');
    else if (savedRole === UserRole.ADMIN) navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col" dir="rtl">
      {showNav && (
        <nav className="fixed top-0 w-full z-50 border-b border-[#1F1F1F] bg-black/80 backdrop-blur-md h-14 flex items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/')}>
            <Logo size={28} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold tracking-tight">LunaTeach</span>
          </div>
          
          <div className="flex items-center gap-6 text-[12px] font-medium text-[#8E8E8E]">
             <button 
              className="hover:text-white transition-colors flex items-center gap-2" 
              onClick={() => navigate('/teachers')}
             >
               <span>جستجو</span>
               <kbd className="hidden md:inline-block">⌘S</kbd>
             </button>
             
             <button 
              className="hover:text-white transition-colors"
              onClick={handleAccountClick}
             >
               {savedRole ? 'میز کار' : 'ورود'}
             </button>

             <div 
              className="flex items-center gap-2 px-3 py-1 bg-[#1F1F1F] rounded-md border border-[#333] cursor-pointer hover:bg-[#262626] transition-colors"
              onClick={() => {
                const event = new KeyboardEvent('keydown', {
                  key: 'k',
                  metaKey: true,
                  ctrlKey: true
                });
                window.dispatchEvent(event);
              }}
             >
               <span className="text-[10px]">Command</span>
               <kbd>⌘K</kbd>
             </div>
          </div>
        </nav>
      )}
      <main className={`flex-1 ${showNav ? 'pt-14' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export const GlassCard: React.FC<{ children: React.ReactNode, className?: string, delay?: string }> = ({ children, className = "", delay = "0s" }) => (
  <div 
    className={`raycast-card p-6 animate-ray ${className}`}
    style={{ animationDelay: delay }}
  >
    {children}
  </div>
);

export const PrimaryButton: React.FC<{ 
  children: React.ReactNode, 
  onClick?: () => void, 
  className?: string, 
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'raycast',
  disabled?: boolean
}> = ({ children, onClick, className = "", variant = 'secondary', disabled }) => {
  const base = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-30 inline-flex items-center justify-center gap-2";
  
  let styles = "";
  switch(variant) {
    case 'accent':
      styles = "bg-[#FF6363] text-white hover:bg-[#FF4D4D] shadow-[0_2px_10px_rgba(255,99,99,0.2)]";
      break;
    case 'primary':
      styles = "bg-white text-black hover:bg-[#E5E5E5]";
      break;
    case 'outline':
      styles = "bg-transparent text-white border border-white/10 hover:bg-white/5";
      break;
    case 'raycast':
      styles = "bg-[#1F1F1F] text-white border border-[#333] hover:bg-[#262626] shadow-[0_4px_12px_rgba(0,0,0,0.5)]";
      break;
    case 'secondary':
    default:
      styles = "bg-[#1F1F1F] text-white border border-[#333] hover:bg-[#262626]";
  }
  
  return (
    <button 
      onClick={onClick} 
      className={`${base} ${styles} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
