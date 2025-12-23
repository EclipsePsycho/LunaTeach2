
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Teacher } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, teachers }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(query.toLowerCase()) || 
    t.specialties.some(s => s.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 5);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-2xl bg-[#0A0A0A] border border-white/[0.08] rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden animate-reveal relative z-10">
        <div className="p-4 border-b border-white/[0.05] flex items-center gap-4">
          <svg className="w-5 h-5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            autoFocus
            className="w-full bg-transparent text-lg outline-none text-white placeholder:text-white/20 font-light"
            placeholder="Search teachers, commands, or documentation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="px-2 py-1 rounded bg-white/[0.05] text-[10px] text-white/40 font-mono">ESC</div>
        </div>
        
        <div className="p-2 max-h-[60vh] overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">Suggested Mentors</div>
          {filteredTeachers.map(t => (
            <button 
              key={t.id}
              onClick={() => { navigate(`/teachers/${t.id}`); onClose(); }}
              className="w-full text-right flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.05] group transition-all"
            >
              <div className="flex items-center gap-3">
                <img src={t.photo} className="w-8 h-8 rounded-lg object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all" />
                <span className="text-sm text-white/80">{t.name}</span>
              </div>
              <span className="text-[10px] text-white/20 group-hover:text-white/60 transition-colors">View Profile</span>
            </button>
          ))}

          <div className="mt-4 px-3 py-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">Quick Actions</div>
          <button onClick={() => { navigate('/student/dashboard'); onClose(); }} className="w-full text-right flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.05] group">
            <span className="text-sm text-white/80">Go to Dashboard</span>
            <span className="text-[10px] text-white/20">⌘D</span>
          </button>
          <button onClick={() => { navigate('/teachers'); onClose(); }} className="w-full text-right flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.05] group">
            <span className="text-sm text-white/80">Explore All Teachers</span>
            <span className="text-[10px] text-white/20">⌘E</span>
          </button>
        </div>
        
        <div className="p-3 bg-white/[0.02] border-t border-white/[0.05] flex items-center justify-between text-[10px] text-white/20">
          <div className="flex gap-4">
            <span><b className="text-white/40">↑↓</b> Navigate</span>
            <span><b className="text-white/40">↵</b> Select</span>
          </div>
          <span>LUNATEACH Intelligence v1.0</span>
        </div>
      </div>
    </div>
  );
};
