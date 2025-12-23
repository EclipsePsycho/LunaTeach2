
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Logo, PrimaryButton } from '../components/Layout';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Layout showNav={false}>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-8">
        <Logo size={80} />
        <h1 className="text-5xl font-bold">۴۰۴</h1>
        <p className="text-xl text-[#94A3B8]">صفحه مورد نظر یافت نشد.</p>
        <PrimaryButton variant="outline" onClick={() => navigate('/')}>بازگشت به خانه</PrimaryButton>
      </div>
    </Layout>
  );
};

export default NotFound;
