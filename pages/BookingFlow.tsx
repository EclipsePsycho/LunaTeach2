
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, GlassCard, PrimaryButton } from '../components/Layout';
import { Teacher, BookingStatus } from '../types';
import { db } from '../services/database';

interface BookingFlowProps {
  teachers: Teacher[];
}

const BookingFlow: React.FC<BookingFlowProps> = ({ teachers }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const teacher = teachers.find(t => t.id === id);
  const [step, setStep] = useState(1);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  if (!teacher) return <div className="p-20 text-center">مدرس یافت نشد</div>;

  const handleConfirmBooking = async () => {
    // 1. Create DB session
    await db.sessions.create({
      teacherId: teacher.id,
      studentId: 'current_student', // Simple ID for demo
      dateTime: selectedTime || '',
      status: BookingStatus.PENDING,
      amount: teacher.rate
    });

    // 2. Deduct from wallet
    db.wallet.spend(teacher.rate);

    // 3. Move to success screen
    setStep(3);
  };

  const handleComplete = () => {
    navigate('/student/dashboard');
  };

  const walletBalance = db.wallet.getBalance();
  const canAfford = walletBalance >= teacher.rate;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 pt-12">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold mb-2">رزرو جلسه با {teacher.name}</h1>
          <p className="text-[#94A3B8]">مراحل زیر را برای نهایی کردن جلسه دنبال کنید.</p>
        </div>

        <GlassCard>
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">انتخاب زمان جلسه</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['شنبه ساعت ۱۰', 'شنبه ساعت ۱۷', 'دوشنبه ساعت ۹', 'سه‌شنبه ساعت ۱۴', 'چهارشنبه ساعت ۱۱'].map(time => (
                  <button 
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-xl border text-sm transition-all ${selectedTime === time ? 'border-[#3B82F6] bg-blue-500/10' : 'border-white/10 hover:bg-white/5'}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              <PrimaryButton className="w-full mt-8" onClick={() => setStep(2)} disabled={!selectedTime}>مرحله بعد: پرداخت</PrimaryButton>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${canAfford ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {canAfford ? 'موجودی کافی' : 'موجودی ناکافی'}
                  </span>
                  <span className="text-xs text-white/40">کیف پول: {walletBalance.toLocaleString()} تومان</span>
                </div>
                <h3 className="text-lg font-bold mb-4">خلاصه رزرو</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">مدرس:</span>
                    <span>{teacher.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">زمان:</span>
                    <span>{selectedTime}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-white/10">
                    <span className="text-[#94A3B8]">مبلغ جلسه آزمایشی:</span>
                    <span className="font-bold text-gradient">{teacher.rate.toLocaleString()} تومان</span>
                  </div>
                </div>
              </div>

              {!canAfford && (
                <div className="p-4 bg-red-500/10 rounded-xl text-red-400 text-xs border border-red-500/20 text-center">
                  موجودی کیف پول شما کافی نیست. ابتدا حساب خود را شارژ کنید.
                </div>
              )}

              <div className="flex gap-4">
                <PrimaryButton 
                  className="flex-1" 
                  onClick={handleConfirmBooking}
                  disabled={!canAfford}
                >
                  تأیید و پرداخت از کیف پول
                </PrimaryButton>
                <PrimaryButton variant="outline" onClick={() => setStep(1)}>بازگشت</PrimaryButton>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              </div>
              <h2 className="text-2xl font-bold text-white">درخواست با موفقیت ثبت شد</h2>
              <p className="text-[#94A3B8] max-w-sm mx-auto">
                مدرس به زودی درخواست شما را بررسی و تأیید خواهد کرد. جزئیات در داشبورد شما قابل مشاهده است.
              </p>
              <PrimaryButton onClick={handleComplete}>رفتن به داشبورد</PrimaryButton>
            </div>
          )}
        </GlassCard>
      </div>
    </Layout>
  );
};

export default BookingFlow;
