
import React from 'react';

export const COLORS = {
  bg: '#000000',
  rayBg: '#0C0C0C',
  border: '#1F1F1F',
  accent: '#FF6363',
  muted: '#8E8E8E',
  text: '#FFFFFF'
};

export const Logo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none drop-shadow-[0_0_12px_rgba(255,255,255,0.15)] ${className}`}
  >
    <defs>
      <linearGradient id="logo-silver-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="45%" stopColor="#D1D5DB" />
        <stop offset="100%" stopColor="#9CA3AF" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Refined paths to match the uploaded image: A sharp, stylized silver crescent with a central diagonal point */}
    <g filter="url(#glow)">
      {/* Left major curve (wing) */}
      <path 
        d="M26 71C26 71 34 50 48 38C40 45 34 56 34 65C34 68 32 70 26 71Z" 
        fill="url(#logo-silver-grad)"
      />
      {/* Central Sharp Arrow/Crescent Body */}
      <path 
        d="M26 71C35 63 45 52 73 26C65 35 55 48 41 68C48 60 62 55 68 55C60 62 50 71 41 68C34 70 26 71 26 71Z" 
        fill="url(#logo-silver-grad)"
      />
      {/* Right bottom wing detail */}
      <path 
        d="M41 68C55 64 68 55 68 55C68 55 60 70 41 68Z" 
        fill="url(#logo-silver-grad)"
        opacity="0.8"
      />
      {/* Top sharp arrow tip reinforcement */}
      <path 
        d="M73 26L58 41L65 35L73 26Z" 
        fill="url(#logo-silver-grad)"
      />
    </g>
  </svg>
);

export const MOCK_TEACHERS: any[] = [
  {
    id: 't1',
    name: 'سارا احمدی',
    photo: 'https://picsum.photos/seed/sara/200/200',
    specialties: ['مکالمه', 'سفر'],
    styles: ['مکالمه‌محور'],
    availability: ['صبح', 'عصر'],
    rate: 250000,
    userRating: 4.8,
    managementRating: 5,
    experienceYears: 6,
    philosophy: 'تمرکز بر اعتماد به نفس در مکالمه.',
    isVerified: true,
    status: 'approved'
  },
  {
    id: 't2',
    name: 'علی کریمی',
    photo: 'https://picsum.photos/seed/ali/200/200',
    specialties: ['تجاری', 'آکادمیک'],
    styles: ['ساختاریافته'],
    availability: ['بعدازظهر'],
    rate: 450000,
    userRating: 4.9,
    managementRating: 4,
    experienceYears: 10,
    philosophy: 'یادگیری سیستماتیک و دقیق.',
    isVerified: true,
    status: 'approved'
  }
];
