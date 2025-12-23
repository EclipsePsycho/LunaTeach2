
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserRole, Teacher, StudentPreferences } from './types';
import { db } from './services/database';
import { CommandPalette } from './components/CommandPalette';

import Landing from './pages/Landing';
import StudentOnboarding from './pages/StudentOnboarding';
import TeacherList from './pages/TeacherList';
import TeacherProfile from './pages/TeacherProfile';
import BookingFlow from './pages/BookingFlow';
import TeacherOnboarding from './pages/TeacherOnboarding';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [studentPrefs, setStudentPrefs] = useState<StudentPreferences | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useEffect(() => {
    // Initialize Database
    db.init();
    
    // Load Data
    const loadData = async () => {
      const allTeachers = await db.teachers.getAll();
      setTeachers(allTeachers);
      setStudentPrefs(db.students.getPrefs());
    };
    loadData();

    const savedRole = localStorage.getItem('lunateach_role');
    if (savedRole) setUserRole(savedRole as UserRole);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSetRole = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem('lunateach_role', role);
  };

  const handleCompleteStudent = (prefs: StudentPreferences) => {
    db.students.savePrefs(prefs);
    setStudentPrefs(prefs);
  };

  const handleAddTeacher = async (teacher: Partial<Teacher>) => {
    const newTeacher = await db.teachers.create(teacher);
    setTeachers(prev => [...prev, newTeacher]);
  };

  return (
    <HashRouter>
      <CommandPalette 
        isOpen={isPaletteOpen} 
        onClose={() => setIsPaletteOpen(false)} 
        teachers={teachers} 
      />
      <Routes>
        <Route path="/" element={<Landing onSetRole={handleSetRole} />} />
        <Route path="/student/onboarding" element={<StudentOnboarding onComplete={handleCompleteStudent} />} />
        <Route path="/teacher/onboarding" element={<TeacherOnboarding onComplete={handleAddTeacher} />} />
        <Route path="/teachers" element={<TeacherList teachers={teachers} prefs={studentPrefs} />} />
        <Route path="/teachers/:id" element={<TeacherProfile teachers={teachers} />} />
        <Route path="/book/:id" element={<BookingFlow teachers={teachers} />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/admin" element={<AdminPanel teachers={teachers} setTeachers={setTeachers} />} />
        <Route path="/login" element={<Login onSetRole={handleSetRole} />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
