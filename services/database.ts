
import { Teacher, StudentPreferences, Session, UserRole } from '../types';
import { MOCK_TEACHERS } from '../constants';

const KEYS = {
  TEACHERS: 'lunateach_teachers',
  SESSIONS: 'lunateach_sessions',
  STUDENT_PREFS: 'lunateach_student_prefs',
  WALLET_BALANCE: 'lunateach_wallet',
  USERS: 'lunateach_users'
};

export const db = {
  init: () => {
    if (!localStorage.getItem(KEYS.TEACHERS)) {
      localStorage.setItem(KEYS.TEACHERS, JSON.stringify(MOCK_TEACHERS));
    }
    if (!localStorage.getItem(KEYS.WALLET_BALANCE)) {
      localStorage.setItem(KEYS.WALLET_BALANCE, '1250000');
    }
    if (!localStorage.getItem(KEYS.SESSIONS)) {
      localStorage.setItem(KEYS.SESSIONS, JSON.stringify([]));
    }
    // Seed Super Admin
    if (!localStorage.getItem(KEYS.USERS)) {
      const adminUser = {
        email: 'admin@luna.com',
        password: 'superadminpass',
        role: UserRole.ADMIN,
        id: 'admin_1'
      };
      localStorage.setItem(KEYS.USERS, JSON.stringify([adminUser]));
    }
  },

  auth: {
    login: (email: string, pass: string) => {
      const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
      const user = users.find((u: any) => u.email === email && u.password === pass);
      return user || null;
    },
    register: (userData: any) => {
      const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
      if (users.find((u: any) => u.email === userData.email)) return false;
      users.push({ ...userData, id: `u_${Date.now()}` });
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      return true;
    }
  },

  teachers: {
    getAll: async (): Promise<Teacher[]> => {
      const data = localStorage.getItem(KEYS.TEACHERS);
      return data ? JSON.parse(data) : [];
    },
    create: async (teacher: Partial<Teacher>) => {
      const teachers = await db.teachers.getAll();
      const newTeacher = {
        ...teacher,
        id: `t_${Date.now()}`,
        userRating: 0,
        managementRating: 0,
        isVerified: false,
        status: 'pending',
      } as Teacher;
      teachers.push(newTeacher);
      localStorage.setItem(KEYS.TEACHERS, JSON.stringify(teachers));
      return newTeacher;
    }
  },

  students: {
    getPrefs: (): StudentPreferences | null => {
      const data = localStorage.getItem(KEYS.STUDENT_PREFS);
      return data ? JSON.parse(data) : null;
    },
    savePrefs: (prefs: StudentPreferences) => {
      localStorage.setItem(KEYS.STUDENT_PREFS, JSON.stringify(prefs));
    }
  },

  wallet: {
    getBalance: (): number => {
      return parseInt(localStorage.getItem(KEYS.WALLET_BALANCE) || '0');
    },
    spend: (amount: number) => {
      const current = db.wallet.getBalance();
      localStorage.setItem(KEYS.WALLET_BALANCE, (current - amount).toString());
    }
  },

  sessions: {
    getAll: async (): Promise<Session[]> => {
      const data = localStorage.getItem(KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    },
    create: async (session: Omit<Session, 'id'>) => {
      const sessions = await db.sessions.getAll();
      const newSession = { ...session, id: `s_${Date.now()}` };
      sessions.push(newSession);
      localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
      return newSession;
    }
  }
};
