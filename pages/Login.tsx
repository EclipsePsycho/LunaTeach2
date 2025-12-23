
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, GlassCard, PrimaryButton, Logo } from '../components/Layout';
import { UserRole } from '../types';
import { db } from '../services/database';

interface LoginProps {
  onSetRole: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onSetRole }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = db.auth.login(email, password);
    
    if (user) {
      onSetRole(user.role);
      if (user.role === UserRole.ADMIN) {
        navigate('/admin');
      } else if (user.role === UserRole.STUDENT) {
        navigate('/student/dashboard');
      } else {
        navigate('/teacher/dashboard');
      }
    } else {
      setError('ایمیل یا رمز عبور اشتباه است.');
    }
  };

  return (
    <Layout showNav={false}>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        <button 
          onClick={() => navigate('/')}
          className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors text-[10px] uppercase tracking-widest font-bold flex items-center gap-2"
        >
          بازگشت به خانه <span>→</span>
        </button>

        <GlassCard className="w-full max-w-md p-10 border-white/[0.08] shadow-[0_0_80px_rgba(0,0,0,0.5)]">
          <div className="text-center space-y-4 mb-10">
            <Logo size={60} className="mx-auto text-white" />
            <h2 className="text-2xl font-bold text-white">ورود به حساب کاربری</h2>
            <p className="text-white/30 text-xs">Admin: admin@luna.com / superadminpass</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2 text-right">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1">Email</label>
              <input 
                type="email" 
                placeholder="info@luna.com"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-white outline-none focus:border-blue-500 transition-all text-left" 
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2 text-right">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] text-blue-500/50 hover:text-blue-500 cursor-pointer transition-colors">فراموشی رمز عبور؟</span>
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Password</label>
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-white outline-none focus:border-blue-500 transition-all text-left" 
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-400 text-[10px] text-center">{error}</p>}

            <PrimaryButton variant="raycast" className="w-full py-4 mt-4 font-bold">
              تایید و ورود
            </PrimaryButton>
          </form>

          <div className="mt-10 pt-6 border-t border-white/[0.05] text-center">
            <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">
              حساب کاربری ندارید؟ <span className="text-blue-400 cursor-pointer hover:text-blue-300 transition-colors" onClick={() => navigate('/')}>ثبت‌نام کنید</span>
            </p>
          </div>
        </GlassCard>
      </div>
    </Layout>
  );
};

export default Login;
