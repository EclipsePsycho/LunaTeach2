
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, GlassCard, PrimaryButton } from '../components/Layout';
import { LearningGoal, EnglishLevel, TeachingStyle, Availability, StudentPreferences, UserRole } from '../types';
import { db } from '../services/database';

interface OnboardingProps {
  onComplete: (prefs: StudentPreferences) => void;
}

const PLACEMENT_QUESTIONS = [
  {
    q: "Select the correct sentence:",
    options: ["She go to school.", "She goes to school.", "She going to school."],
    answer: "She goes to school.",
    level: EnglishLevel.BEGINNER
  },
  {
    q: "If it rains, we ___ at home.",
    options: ["stay", "will stay", "would stay"],
    answer: "will stay",
    level: EnglishLevel.INTERMEDIATE
  },
  {
    q: "By the time he arrived, the meeting ___.",
    options: ["finished", "had finished", "has finished"],
    answer: "had finished",
    level: EnglishLevel.INTERMEDIATE
  },
  {
    q: "I wish I ___ more time to travel.",
    options: ["have", "had", "would have"],
    answer: "had",
    level: EnglishLevel.ADVANCED
  },
  {
    q: "Choose the synonym for 'Ephemeral':",
    options: ["Permanent", "Short-lived", "Beautiful"],
    answer: "Short-lived",
    level: EnglishLevel.ADVANCED
  }
];

const StudentOnboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState<Partial<StudentPreferences>>({
    availability: [],
    level: undefined
  });
  const [authData, setAuthData] = useState({ email: '', phone: '', password: '', confirmPassword: '' });
  
  const [showPlacement, setShowPlacement] = useState(false);
  const [testIndex, setTestIndex] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);

  const totalSteps = 7;

  const isStepValid = () => {
    switch(step) {
      case 1: return !!prefs.goal;
      case 2: return !!prefs.level;
      case 3: return !!prefs.style;
      case 4: return (prefs.availability || []).length > 0;
      case 5: return !!prefs.budget;
      case 6: return !!prefs.urgency;
      case 7: return authData.email.includes('@') && authData.phone.length >= 11 && authData.password.length >= 6 && authData.password === authData.confirmPassword;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const success = db.auth.register({
        email: authData.email,
        password: authData.password,
        role: UserRole.STUDENT
      });

      if (!success) {
        alert("این ایمیل قبلاً ثبت شده است.");
        return;
      }

      onComplete(prefs as StudentPreferences);
      navigate('/teachers');
    }
  };

  const updatePrefs = (key: keyof StudentPreferences, value: any) => {
    setPrefs(prev => ({ ...prev, [key]: value }));
    if (key === 'level' && value === 'IDK') {
      setShowPlacement(true);
    }
  };

  const handlePlacementAnswer = (selected: string) => {
    if (selected === PLACEMENT_QUESTIONS[testIndex].answer) {
      setTestScore(prev => prev + 1);
    }
    
    if (testIndex < PLACEMENT_QUESTIONS.length - 1) {
      setTestIndex(prev => prev + 1);
    } else {
      let finalLevel = EnglishLevel.BEGINNER;
      const score = testScore + (selected === PLACEMENT_QUESTIONS[testIndex].answer ? 1 : 0);
      
      if (score >= 4) finalLevel = EnglishLevel.ADVANCED;
      else if (score >= 2) finalLevel = EnglishLevel.INTERMEDIATE;
      
      setPrefs(prev => ({ ...prev, level: finalLevel }));
      setTestCompleted(true);
      setTimeout(() => setShowPlacement(false), 2000);
    }
  };

  const OptionBtn: React.FC<{ label: string, active: boolean, onClick: () => void }> = ({ label, active, onClick }) => (
    <button 
      onClick={onClick}
      className={`w-full text-right px-6 py-4 rounded-xl border transition-all duration-300 ${active ? 'border-blue-500 bg-blue-500/10 text-white shadow-lg' : 'bg-transparent border-white/[0.05] hover:bg-white/[0.03] text-white/60 opacity-60 hover:opacity-100'}`}
    >
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  const renderPlacementTest = () => {
    if (testCompleted) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 h-full animate-reveal">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h2 className="text-xl font-bold">تحلیل سطح انجام شد</h2>
          <p className="text-white/40">سطح پیشنهادی لوناتیک: <span className="text-blue-400 font-bold">{prefs.level}</span></p>
        </div>
      );
    }

    const currentQ = PLACEMENT_QUESTIONS[testIndex];
    return (
      <div className="space-y-8 animate-reveal">
        <div className="space-y-2 text-left">
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Question {testIndex + 1} of {PLACEMENT_QUESTIONS.length}</span>
          <h2 className="text-xl font-bold text-white leading-relaxed" dir="ltr">{currentQ.q}</h2>
        </div>
        <div className="grid grid-cols-1 gap-3" dir="ltr">
          {currentQ.options.map(opt => (
            <button 
              key={opt} 
              onClick={() => handlePlacementAnswer(opt)}
              className="w-full text-left px-6 py-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all hover:border-white/20"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderStep = () => {
    if (showPlacement) return renderPlacementTest();

    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-reveal">
            <h2 className="text-xl font-bold text-white/90">هدف شما از یادگیری چیست؟</h2>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(LearningGoal).map(goal => (
                <OptionBtn key={goal} label={goal} active={prefs.goal === goal} onClick={() => updatePrefs('goal', goal)} />
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-reveal">
            <h2 className="text-xl font-bold text-white/90">سطح فعلی زبان شما چیست؟</h2>
            <div className="grid grid-cols-1 gap-2">
              {[...Object.values(EnglishLevel)].map(level => (
                <OptionBtn key={level} label={level} active={prefs.level === level} onClick={() => updatePrefs('level', level)} />
              ))}
              {/* Fix: Type cast prefs.level to avoid comparison error with 'IDK' string */}
              <OptionBtn label="نمی‌دانم (شروع آزمون تعیین سطح)" active={(prefs.level as any) === 'IDK'} onClick={() => updatePrefs('level', 'IDK')} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-reveal">
            <h2 className="text-xl font-bold text-white/90">چه سبک تدریسی را می‌پسندید؟</h2>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(TeachingStyle).map(style => (
                <OptionBtn key={style} label={style} active={prefs.style === style} onClick={() => updatePrefs('style', style)} />
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-reveal">
            <h2 className="text-xl font-bold text-white/90">زمان‌های در دسترس شما کدامند؟</h2>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(Availability).map(time => (
                <OptionBtn 
                  key={time} 
                  label={time} 
                  active={prefs.availability?.includes(time) || false} 
                  onClick={() => {
                    const current = prefs.availability || [];
                    const next = current.includes(time) ? current.filter(t => t !== time) : [...current, time];
                    updatePrefs('availability', next);
                  }} 
                />
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-8 animate-reveal">
            <h2 className="text-xl font-bold text-white/90">بودجه هر جلسه (به تومان)</h2>
            <div className="flex flex-col items-center gap-6">
              <input 
                type="range" 
                min="100000" 
                max="2000000" 
                step="50000"
                value={prefs.budget || 500000}
                onChange={(e) => updatePrefs('budget', parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/[0.05] rounded-full appearance-none cursor-pointer accent-blue-500"
              />
              <div className="text-4xl font-bold tabular-nums text-white">
                {(prefs.budget || 500000).toLocaleString()} <span className="text-sm font-light text-white/20">IRR</span>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6 animate-reveal">
            <h2 className="text-xl font-bold text-white/90">میزان فوریت یادگیری</h2>
            <div className="grid grid-cols-1 gap-2">
              {['عادی - تفریحی', 'متوسط - برای آینده', 'فوری - مهاجرت یا کار'].map(u => (
                <OptionBtn key={u} label={u} active={prefs.urgency === u} onClick={() => updatePrefs('urgency', u)} />
              ))}
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6 animate-reveal">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">ایجاد حساب کاربری</h2>
              <p className="text-white/40 text-xs">اطلاعات خود را برای ثبت‌نام نهایی وارد کنید.</p>
            </div>
            <div className="space-y-4 text-right">
              <div className="space-y-1">
                <label className="text-[10px] text-white/20 font-bold uppercase tracking-widest mr-1">Email</label>
                <input 
                  type="email" 
                  placeholder="ایمیل شما"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                  value={authData.email}
                  onChange={e => setAuthData({...authData, email: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-white/20 font-bold uppercase tracking-widest mr-1">Mobile</label>
                <input 
                  type="tel" 
                  placeholder="شماره موبایل"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                  value={authData.phone}
                  onChange={e => setAuthData({...authData, phone: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-white/20 font-bold uppercase tracking-widest mr-1">Password</label>
                  <input 
                    type="password" 
                    placeholder="رمز عبور"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                    value={authData.password}
                    onChange={e => setAuthData({...authData, password: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-white/20 font-bold uppercase tracking-widest mr-1">Confirm</label>
                  <input 
                    type="password" 
                    placeholder="تکرار رمز"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                    value={authData.confirmPassword}
                    onChange={e => setAuthData({...authData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <Layout showNav={false}>
      <div className="max-w-xl mx-auto min-h-screen flex flex-col justify-center p-6">
        <div className="mb-6 flex items-center justify-between px-2">
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Step {step} of {totalSteps}</span>
          <div className="flex gap-1">
            {[...Array(totalSteps)].map((_, i) => (
              <div key={i} className={`h-1 w-4 rounded-full transition-all duration-500 ${i + 1 <= step ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-white/5'}`} />
            ))}
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-8 min-h-[460px]">
            {renderStep()}
          </div>
          <div className="p-4 bg-white/[0.02] border-t border-white/[0.05] flex gap-3">
            {!showPlacement && (
              <>
                <PrimaryButton 
                  className="flex-1"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                >
                  {step === totalSteps ? 'تکمیل ثبت‌نام' : 'مرحله بعد'}
                </PrimaryButton>
                {step > 1 && (
                  <PrimaryButton variant="outline" className="px-4" onClick={() => setStep(step - 1)}>
                    قبلی
                  </PrimaryButton>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentOnboarding;
