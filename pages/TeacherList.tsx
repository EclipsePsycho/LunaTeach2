
import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, GlassCard, PrimaryButton } from '../components/Layout';
import { Teacher, StudentPreferences } from '../types';
import { rankTeachers } from '../utils/algorithm';
import { aiService } from '../services/ai';
import { Logo } from '../constants';

interface TeacherListProps {
  teachers: Teacher[];
  prefs: StudentPreferences | null;
}

const TeacherList: React.FC<TeacherListProps> = ({ teachers, prefs }) => {
  const navigate = useNavigate();
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [filter, setFilter] = useState({
    priceRange: 2000000,
    specialty: 'All'
  });

  const filteredAndRanked = useMemo(() => {
    let list = teachers.filter(t => t.status === 'approved');
    if (filter.specialty !== 'All') {
      list = list.filter(t => t.specialties.includes(filter.specialty as any));
    }
    list = list.filter(t => t.rate <= filter.priceRange);
    if (!prefs) return list;
    return rankTeachers(list, prefs);
  }, [teachers, prefs, filter]);

  useEffect(() => {
    if (prefs && filteredAndRanked.length > 0) {
      setLoadingInsight(true);
      aiService.getMatchingInsight(prefs, filteredAndRanked.slice(0, 3))
        .then(res => setAiInsight(res))
        .finally(() => setLoadingInsight(false));
    }
  }, [prefs]);

  const specialties = ['All', 'مکالمه', 'تجاری', 'IELTS', 'TOEFL', 'Business English'];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 pt-16">
        <header className="mb-12 animate-ray">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/[0.05] pb-10">
            <div className="space-y-2 text-right">
              <h1 className="text-4xl font-black tracking-tighter">جستجوی اساتید</h1>
              <p className="text-[#8E8E8E] text-sm max-w-xl">
                بر اساس هوش مصنوعی لوناتیک، این اساتید بیشترین تطبیق را با اهداف شما دارند.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 bg-[#0C0C0C] p-4 rounded-2xl border border-white/[0.05]">
              <div className="space-y-1.5 text-right">
                <span className="text-[10px] text-[#8E8E8E] uppercase font-bold tracking-widest block">تخصص</span>
                <select 
                  className="bg-transparent text-sm text-white/80 outline-none cursor-pointer"
                  value={filter.specialty}
                  onChange={(e) => setFilter({...filter, specialty: e.target.value})}
                >
                  {specialties.map(s => <option key={s} value={s} className="bg-[#0A0A0A]">{s}</option>)}
                </select>
              </div>
              <div className="w-px h-8 bg-white/10 hidden md:block"></div>
              <div className="space-y-1.5 flex-1 min-w-[200px] text-right">
                <div className="flex justify-between">
                   <span className="text-[10px] text-[#8E8E8E] uppercase font-bold tracking-widest block">حداکثر بودجه</span>
                   <span className="text-[10px] text-[#FF6363] mono">{(filter.priceRange/1000).toLocaleString()}k</span>
                </div>
                <input 
                  type="range" 
                  min="100000" 
                  max="2000000" 
                  step="50000"
                  className="w-full h-1 bg-white/5 rounded-full appearance-none accent-[#FF6363]"
                  value={filter.priceRange}
                  onChange={(e) => setFilter({...filter, priceRange: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </div>
        </header>

        {/* AI Insight Section */}
        {prefs && (
          <div className="mb-10 animate-ray" style={{ animationDelay: '0.1s' }}>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-[#FF6363]/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative raycast-card p-6 border-[#FF6363]/20 bg-[#0C0C0C] overflow-hidden">
                <div className="flex items-center gap-3 mb-4 flex-row-reverse">
                  <div className="p-2 bg-[#FF6363]/10 rounded-lg">
                    <Logo size={20} />
                  </div>
                  <h3 className="text-sm font-bold tracking-tight">تحلیل هوشمند Luna AI</h3>
                  <div className="px-2 py-0.5 bg-[#1A1A1A] rounded text-[8px] font-mono text-[#8E8E8E] border border-white/5 uppercase">Beta</div>
                </div>
                <div className="text-right">
                  {loadingInsight ? (
                    <div className="flex flex-col gap-2 items-end">
                      <div className="h-4 w-3/4 bg-white/5 animate-pulse rounded"></div>
                      <div className="h-4 w-1/2 bg-white/5 animate-pulse rounded"></div>
                    </div>
                  ) : (
                    <p className="text-sm text-[#8E8E8E] leading-relaxed italic">
                      {aiInsight}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredAndRanked.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="text-[#8E8E8E] text-6xl opacity-10">∅</div>
            <p className="text-[#8E8E8E] text-sm italic">مدرسی با این فیلترها یافت نشد.</p>
            <button onClick={() => setFilter({priceRange: 2000000, specialty: 'All'})} className="text-[#FF6363] text-sm hover:underline">حذف فیلترها</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndRanked.map((teacher, index) => (
              <GlassCard 
                key={teacher.id} 
                delay={`${index * 0.05}s`}
                className="group relative h-full flex flex-col border-white/5 hover:border-[#333] transition-all"
              >
                {index === 0 && prefs && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <span className="bg-[#FF6363] text-white text-[9px] font-bold px-3 py-1 rounded-full shadow-lg">بهترین پیشنهاد</span>
                  </div>
                )}
                <div className="flex items-start justify-between mb-8 flex-row-reverse">
                  <div className="flex items-center gap-4 flex-row-reverse">
                    <div className="relative">
                      <img src={teacher.photo} alt={teacher.name} className="w-16 h-16 rounded-xl object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" />
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-green-500 border-2 border-[#000] rounded-full"></div>
                    </div>
                    <div className="text-right">
                      <h3 className="text-lg font-bold">{teacher.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5 justify-end">
                        <span className="text-yellow-500 text-xs">★</span>
                        <span className="text-[10px] text-[#8E8E8E] font-bold">{teacher.userRating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="text-lg font-black tabular-nums">{ (teacher.rate / 1000).toLocaleString() }k</span>
                    <span className="block text-[8px] uppercase tracking-widest text-[#8E8E8E] font-bold">تومان</span>
                  </div>
                </div>

                <div className="flex-1 space-y-4 text-right">
                  <p className="text-sm text-[#8E8E8E] leading-relaxed font-light line-clamp-2 italic">
                    "{teacher.philosophy}"
                  </p>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {teacher.specialties.map(s => (
                      <span key={s} className="text-[8px] px-2 py-0.5 rounded bg-[#1A1A1A] text-[#8E8E8E] border border-white/5">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5">
                  <PrimaryButton variant="raycast" className="w-full" onClick={() => navigate(`/teachers/${teacher.id}`)}>
                    مشاهده پروفایل و رزرو
                  </PrimaryButton>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TeacherList;
