
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, GlassCard, PrimaryButton } from '../components/Layout';
import { LearningGoal, TeachingStyle, Availability, Teacher, UserRole } from '../types';
import { db } from '../services/database';

interface TeacherOnboardingProps {
  onComplete: (teacher: Partial<Teacher>) => void;
}

const TeacherOnboarding: React.FC<TeacherOnboardingProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    selectedSubjects: [] as LearningGoal[],
    teachingStyle: null as TeachingStyle | null,
    selectedDays: [] as Availability[],
    rate: '',
    philosophy: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const totalSteps = 8;

  const handleComplete = () => {
    // 1. Register Auth Account
    const success = db.auth.register({
      email: formData.email,
      password: formData.password,
      role: UserRole.TEACHER
    });

    if (!success) {
      alert("این ایمیل قبلاً ثبت شده است.");
      return;
    }

    // 2. Register Teacher Profile
    const teacherData: Partial<Teacher> = {
      name: formData.name || 'استاد جدید',
      photo: `https://picsum.photos/seed/${formData.phone}/200/200`,
      specialties: formData.selectedSubjects,
      styles: formData.teachingStyle ? [formData.teachingStyle] : [],
      availability: formData.selectedDays,
      rate: parseInt(formData.rate),
      experienceYears: 5,
      philosophy: formData.philosophy,
    };
    
    onComplete(teacherData);
    alert("تبریک! پروفایل شما با موفقیت ثبت شد.\nبه دلیل استانداردهای بالای لوناتیک، پروفایل شما پس از بررسی توسط تیم نظارت (تا ۴۸ ساعت آینده) فعال خواهد شد.\nدر این مدت می‌توانید از امکانات داشبورد استفاده کنید.");
    navigate('/teacher/dashboard');
  };

  const isStepValid = () => {
    switch(step) {
      case 1: return formData.bio.length > 50 && formData.name.length > 3;
      case 2: return formData.selectedSubjects.length > 0;
      case 3: return formData.teachingStyle !== null;
      case 4: return formData.selectedDays.length > 0;
      case 5: return formData.rate.length > 0 && parseInt(formData.rate) >= 100000;
      case 6: return formData.philosophy.length > 20;
      case 7: return true; 
      case 8: return formData.email.includes('@') && formData.phone.length >= 11 && formData.password.length >= 6 && formData.password === formData.confirmPassword;
      default: return false;
    }
  };

  const toggleSubject = (subject: LearningGoal) => {
    setFormData(prev => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(subject) 
        ? prev.selectedSubjects.filter(s => s !== subject) 
        : [...prev.selectedSubjects, subject]
    }));
  };

  const toggleDay = (day: Availability) => {
    setFormData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day) 
        ? prev.selectedDays.filter(d => d !== day) 
        : [...prev.selectedDays, day]
    }));
  };

  const renderStep = () => {
    switch(step) {
      case 1: return (
        <div className="space-y-6 animate-reveal text-right">
          <h2 className="text-2xl font-bold">نام و سوابق تحصیلی</h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Full Name</label>
              <input 
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500"
                placeholder="نام و نام خانوادگی خود را وارد کنید"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Professional Bio</label>
              <textarea 
                className="w-full h-32 bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-blue-500 transition-all" 
                placeholder="خلاصه‌ای از سوابق خود بنویسید (حداقل ۵۰ کاراکتر)"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
            </div>
          </div>
        </div>
      );
      case 2: return (
        <div className="space-y-6 animate-reveal">
          <h2 className="text-2xl font-bold">موضوعات تدریس</h2>
          <div className="flex flex-wrap gap-3">
            {Object.values(LearningGoal).map(goal => (
              <button 
                key={goal} 
                onClick={() => toggleSubject(goal)}
                className={`px-4 py-2 rounded-lg border transition-all ${formData.selectedSubjects.includes(goal) ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-white/10 hover:border-white/20 text-white/60'}`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      );
      case 3: return (
        <div className="space-y-6 animate-reveal">
          <h2 className="text-2xl font-bold">سبک تدریس شما</h2>
          <div className="grid grid-cols-1 gap-3">
            {Object.values(TeachingStyle).map(style => (
              <button 
                key={style}
                onClick={() => setFormData({...formData, teachingStyle: style})}
                className={`p-4 border rounded-xl text-right transition-all ${formData.teachingStyle === style ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-white/10 hover:bg-white/5 text-white/60'}`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      );
      case 4: return (
        <div className="space-y-6 animate-reveal">
          <h2 className="text-2xl font-bold">زمان‌های در دسترس</h2>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(Availability).map(d => (
              <button 
                key={d} 
                onClick={() => toggleDay(d)}
                className={`p-3 border rounded-xl transition-all ${formData.selectedDays.includes(d) ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-white/10 hover:bg-white/5 text-white/60'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      );
      case 5: return (
        <div className="space-y-6 animate-reveal">
          <h2 className="text-2xl font-bold">تعیین نرخ جلسات</h2>
          <div className="flex flex-col items-center gap-4">
            <input 
              type="number" 
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-xl font-bold text-center" 
              placeholder="مثلاً: ۲۵۰۰۰۰"
              value={formData.rate}
              onChange={(e) => setFormData({...formData, rate: e.target.value})}
            />
            <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">تومان / ساعت</span>
          </div>
        </div>
      );
      case 6: return (
        <div className="space-y-6 animate-reveal text-right">
          <h2 className="text-2xl font-bold">فلسفه تدریس</h2>
          <textarea 
            className="w-full h-40 bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-blue-500 transition-all" 
            placeholder="چه چیزی کلاس شما را متمایز می‌کند؟"
            value={formData.philosophy}
            onChange={(e) => setFormData({...formData, philosophy: e.target.value})}
          />
        </div>
      );
      case 7: return (
        <div className="space-y-6 animate-reveal">
          <h2 className="text-2xl font-bold">بارگذاری مدارک</h2>
          <div className="p-12 border-2 border-dashed border-white/10 rounded-3xl text-center space-y-4 hover:border-white/20 transition-all cursor-pointer">
             <div className="text-4xl text-white/20">↑</div>
             <p className="text-sm text-white/40 leading-relaxed">فایل مدارک را اینجا رها کنید</p>
          </div>
        </div>
      );
      case 8: return (
        <div className="space-y-6 animate-reveal">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">تنظیمات حساب کاربری</h2>
            <p className="text-white/40 text-xs">اطلاعات ورود و تماس خود را وارد کنید.</p>
          </div>
          <div className="space-y-4 text-right">
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="email" 
                placeholder="ایمیل حرفه‌ای"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-white outline-none"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <input 
                type="tel" 
                placeholder="شماره موبایل"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-white outline-none"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="password" 
                placeholder="رمز عبور"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
              <input 
                type="password" 
                placeholder="تکرار رمز عبور"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <Layout showNav={false}>
      <div className="max-w-2xl mx-auto min-h-screen flex flex-col justify-center p-6">
        <div className="mb-8 flex items-center justify-between px-2">
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Phase: {step} of {totalSteps}</span>
          <div className="flex gap-1">
            {[...Array(totalSteps)].map((_, i) => (
              <div key={i} className={`h-1 w-4 rounded-full transition-all duration-500 ${i + 1 <= step ? 'bg-purple-500' : 'bg-white/5'}`} />
            ))}
          </div>
        </div>
        <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-10 min-h-[480px] flex flex-col">
            {renderStep()}
          </div>
          <div className="p-4 bg-white/[0.02] border-t border-white/[0.05] flex gap-4">
            <PrimaryButton 
              className="flex-1" 
              onClick={() => step < totalSteps ? setStep(step + 1) : handleComplete()}
              disabled={!isStepValid()}
            >
              {step === totalSteps ? 'ارسال درخواست نهایی' : 'مرحله بعد'}
            </PrimaryButton>
            {step > 1 && <PrimaryButton variant="outline" onClick={() => setStep(step-1)}>قبلی</PrimaryButton>}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherOnboarding;
