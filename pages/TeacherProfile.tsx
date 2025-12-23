
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, GlassCard, PrimaryButton } from '../components/Layout';
import { Teacher } from '../types';
import { db } from '../services/database';
import { aiService } from '../services/ai';

interface TeacherProfileProps {
  teachers: Teacher[];
}

const MOCK_REVIEWS = [
  { id: 1, user: "امیرحسین", rating: 5, date: "۱۴۰۲/۰۷/۱۲", text: "بسیار صبور و حرفه‌ای. لهجه ایشون فوق‌العاده است." },
  { id: 2, user: "مریم ر.", rating: 4, date: "۱۴۰۲/۰۶/۳۰", text: "تمرکز خوبی روی گرامر دارن، ولی کاش کمی زمان مکالمه آزاد بیشتر بود." },
  { id: 3, user: "کیان", rating: 5, date: "۱۴۰۲/۰۶/۱۵", text: "بهترین مدرسی که تا حالا داشتم. منابع آموزشی‌شون کاملاً بروز هست." }
];

const TeacherProfile: React.FC<TeacherProfileProps> = ({ teachers }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const teacher = teachers.find(t => t.id === id);
  const [activeTab, setActiveTab] = useState<'about' | 'reviews' | 'roadmap'>('about');
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);

  const studentPrefs = db.students.getPrefs();

  if (!teacher) return <div className="p-20 text-center text-[#8E8E8E]">Mentor not found</div>;

  const handleGenerateRoadmap = async () => {
    if (!studentPrefs) return;
    setGeneratingRoadmap(true);
    const plan = await aiService.generateRoadmap(studentPrefs, teacher);
    setRoadmap(plan);
    setGeneratingRoadmap(false);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 pt-16 animate-ray">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            <header className="flex flex-col md:flex-row-reverse gap-8 items-start pb-10 border-b border-white/5">
              <div className="relative">
                <img src={teacher.photo} className="w-40 h-40 rounded-3xl object-cover grayscale-[0.2] border border-white/10 shadow-2xl" />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#0A0A0A] border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-[#FF6363]">
                  ONLINE
                </div>
              </div>
              <div className="flex-1 space-y-4 text-right">
                <div className="flex items-center justify-end gap-3">
                  {teacher.isVerified && <span className="bg-[#FF6363]/10 text-[#FF6363] text-[10px] font-bold px-3 py-1 rounded-full border border-[#FF6363]/20">مدرس برگزیده</span>}
                  <h1 className="text-4xl font-black tracking-tight">{teacher.name}</h1>
                </div>
                <p className="text-[#8E8E8E] max-w-xl mr-auto font-light italic leading-relaxed text-xl">
                  "{teacher.philosophy}"
                </p>
                <div className="flex justify-end gap-4 pt-4">
                  <div className="text-center px-6 py-3 bg-[#0C0C0C] rounded-2xl border border-white/5">
                    <span className="block text-[10px] text-[#8E8E8E] font-bold uppercase mb-1">سابقه</span>
                    <span className="text-white font-bold">{teacher.experienceYears} سال</span>
                  </div>
                  <div className="text-center px-6 py-3 bg-[#0C0C0C] rounded-2xl border border-white/5">
                    <span className="block text-[10px] text-[#8E8E8E] font-bold uppercase mb-1">رضایت</span>
                    <span className="text-yellow-500 font-bold">★ {teacher.userRating}</span>
                  </div>
                </div>
              </div>
            </header>

            <div className="space-y-8">
              <div className="flex gap-8 border-b border-white/5 flex-row-reverse">
                {['about', 'roadmap', 'reviews'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'text-white border-b-2 border-[#FF6363]' : 'text-[#8E8E8E] hover:text-white'}`}
                  >
                    {tab === 'about' ? 'درباره مدرس' : tab === 'roadmap' ? 'نقشه راه' : 'نظرات'}
                  </button>
                ))}
              </div>

              {activeTab === 'about' && (
                <div className="space-y-6 animate-ray text-right">
                  <p className="text-[#8E8E8E] leading-relaxed text-lg font-light">
                    من به عنوان یک مدرس با بیش از {teacher.experienceYears} سال سابقه، تمرکزم را بر روی آموزش کاربردی زبان گذاشته‌ام. معتقدم زبان فراتر از کتاب است و باید در دل موقعیت‌های واقعی یاد گرفته شود.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div className="p-6 rounded-2xl bg-[#0C0C0C] border border-white/5">
                      <h4 className="text-[#8E8E8E] text-[10px] font-bold uppercase mb-3">تخصص‌ها</h4>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {teacher.specialties.map(s => <span key={s} className="px-3 py-1 bg-[#1A1A1A] text-[#8E8E8E] text-xs rounded-lg border border-white/5">{s}</span>)}
                      </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-[#0C0C0C] border border-white/5">
                      <h4 className="text-[#8E8E8E] text-[10px] font-bold uppercase mb-3">سبک تدریس</h4>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {teacher.styles.map(s => <span key={s} className="px-3 py-1 bg-[#1A1A1A] text-[#8E8E8E] text-xs rounded-lg border border-white/5">{s}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'roadmap' && (
                <div className="space-y-6 animate-ray text-right">
                  {roadmap.length === 0 ? (
                    <div className="raycast-card p-12 text-center border-dashed flex flex-col items-center gap-6">
                      <div className="space-y-2">
                        <h4 className="text-xl font-bold">نقشه راه شخصی‌سازی شده شما</h4>
                        <p className="text-sm text-[#8E8E8E]">یک برنامه یادگیری هوشمند بر اساس اهداف شما و متد این استاد ایجاد کنید.</p>
                      </div>
                      <PrimaryButton 
                        variant="accent" 
                        onClick={handleGenerateRoadmap}
                        disabled={generatingRoadmap || !studentPrefs}
                      >
                        {generatingRoadmap ? 'در حال تولید برنامه...' : 'تولید نقشه راه با هوش مصنوعی'}
                      </PrimaryButton>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {roadmap.map((item, idx) => (
                        <div key={idx} className="raycast-card p-6 border-white/5 hover:border-[#333] transition-all animate-ray" style={{ animationDelay: `${idx * 0.1}s` }}>
                          <div className="flex justify-between items-start flex-row-reverse mb-2">
                            <span className="text-[10px] font-mono text-[#FF6363] uppercase">Week {item.week}</span>
                            <h4 className="font-bold text-lg">{item.focus}</h4>
                          </div>
                          <p className="text-sm text-[#8E8E8E] mt-2">خروجی مورد انتظار: {item.outcome}</p>
                        </div>
                      ))}
                      <button 
                        onClick={handleGenerateRoadmap}
                        className="text-[10px] text-[#8E8E8E] hover:text-[#FF6363] transition-colors mt-4 block mr-auto"
                      >
                        ← بازسازی مجدد برنامه
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4 animate-ray">
                  {MOCK_REVIEWS.map(rev => (
                    <div key={rev.id} className="p-6 rounded-2xl bg-[#0C0C0C] border border-white/5 text-right">
                      <div className="flex justify-between items-center mb-4 flex-row-reverse">
                        <span className="text-[10px] text-[#8E8E8E] font-mono">{rev.date}</span>
                        <div className="flex items-center gap-3 flex-row-reverse">
                          <span className="font-bold">{rev.user}</span>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => <span key={i} className={`text-[10px] ${i < rev.rating ? 'text-yellow-500' : 'text-white/10'}`}>★</span>)}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-[#8E8E8E] leading-relaxed">{rev.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="sticky top-24 border-white/10 bg-[#050505] text-right">
              <div className="space-y-8">
                <div>
                  <span className="text-[10px] text-[#8E8E8E] uppercase font-bold tracking-widest">هزینه هر جلسه ۶۰ دقیقه‌ای</span>
                  <div className="text-4xl font-black tabular-nums mt-1">
                    {teacher.rate.toLocaleString()} <span className="text-sm font-light text-[#8E8E8E]">تومان</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <PrimaryButton variant="raycast" className="w-full py-5 text-lg font-bold" onClick={() => navigate(`/book/${teacher.id}`)}>
                    رزرو جلسه آزمایشی
                  </PrimaryButton>
                  <PrimaryButton variant="outline" className="w-full py-5 font-bold">
                    ارسال پیام مستقیم
                  </PrimaryButton>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-5">
                  <div className="flex justify-between items-center text-[11px] uppercase tracking-widest flex-row-reverse">
                    <span className="text-[#8E8E8E]">وضعیت</span>
                    <span className="text-green-400 font-bold">Available Now</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] uppercase tracking-widest flex-row-reverse">
                    <span className="text-[#8E8E8E]">زبان اصلی</span>
                    <span className="text-white font-bold">English (Native)</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherProfile;
