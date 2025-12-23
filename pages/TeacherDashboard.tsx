
import React from 'react';
import { Layout, GlassCard, PrimaryButton } from '../components/Layout';

const TeacherDashboard: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 lg:p-12 space-y-12 animate-ray">
        <header className="flex items-end justify-between border-b border-[#1F1F1F] pb-8">
          <div className="text-right">
            <h1 className="text-3xl font-bold">پنل مدیریت مدرس</h1>
            <p className="text-[#8E8E8E] text-sm mt-1">مدیریت درآمد، جلسات و دانش‌آموزان برگزیده.</p>
          </div>
          <PrimaryButton variant="primary">ویرایش پروفایل <kbd className="ml-2">E</kbd></PrimaryButton>
        </header>

        {/* Bento Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <GlassCard className="text-right border-white/5">
             <span className="text-[10px] text-[#8E8E8E] uppercase font-bold tracking-widest">درآمد کل</span>
             <div className="mt-4">
                <p className="text-3xl font-bold mono">۱۲,۴۰۰,۰۰۰</p>
                <p className="text-[10px] text-[#8E8E8E] mt-1">تومان (خالص)</p>
             </div>
           </GlassCard>
           
           <GlassCard className="text-right border-white/5">
             <span className="text-[10px] text-[#8E8E8E] uppercase font-bold tracking-widest">جلسات این هفته</span>
             <div className="mt-4">
                <p className="text-3xl font-bold mono">۸</p>
                <p className="text-[10px] text-[#8E8E8E] mt-1">+۲ مورد نسبت به هفته قبل</p>
             </div>
           </GlassCard>

           <GlassCard className="text-right border-white/5">
             <span className="text-[10px] text-[#8E8E8E] uppercase font-bold tracking-widest">دانش‌آموزان</span>
             <div className="mt-4">
                <p className="text-3xl font-bold mono">۱۲</p>
                <p className="text-[10px] text-[#8E8E8E] mt-1">فعال در ماه جاری</p>
             </div>
           </GlassCard>

           <GlassCard className="text-right border-white/5">
             <span className="text-[10px] text-[#8E8E8E] uppercase font-bold tracking-widest">امتیاز کیفی</span>
             <div className="mt-4">
                <p className="text-3xl font-bold text-[#FFB800] mono">۴.۸</p>
                <p className="text-[10px] text-[#8E8E8E] mt-1">بر اساس ۲۴ نظر</p>
             </div>
           </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Requests */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold">درخواست‌های رزرو در انتظار</h3>
            <GlassCard className="border-dashed border-[#1F1F1F] p-0 overflow-hidden">
               <div className="p-4 flex items-center justify-between hover:bg-[#111] transition-colors border-b border-[#1F1F1F]">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center font-bold text-xs">ر.م</div>
                     <div className="text-right">
                        <p className="font-bold text-sm text-white">رضا محمدی</p>
                        <p className="text-[10px] text-[#8E8E8E]">شنبه ۱۷ مهر • ساعت ۱۰:۰۰</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button className="text-[10px] px-4 py-1.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all">تأیید</button>
                     <button className="text-[10px] px-4 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all">رد</button>
                  </div>
               </div>
            </GlassCard>
          </div>

          {/* Right Column: Mini Calendar or Info */}
          <GlassCard className="lg:col-span-1 bg-[#0C0C0C] flex flex-col justify-center items-center text-center p-8 border-white/5">
            <div className="w-12 h-12 rounded-xl bg-[#FF6363]/10 text-[#FF6363] flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <h4 className="font-bold text-sm">تقویم در دسترس بودن</h4>
            <p className="text-[10px] text-[#8E8E8E] mt-2 leading-relaxed">زمان‌های باز خود را مدیریت کنید تا دانش‌آموزان بتوانند جلسات را رزرو کنند.</p>
            <PrimaryButton className="w-full mt-6" variant="secondary">مدیریت تقویم</PrimaryButton>
          </GlassCard>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
