import React from 'react';
import LoginCard from './LoginCard';

interface LoginFormProps {}

const LoginForm: React.FC<LoginFormProps> = () => {
  return (
    <div className="card overflow-visible shadow-2xl compact bg-base-100 min-h-screen flex items-center justify-center transition-all duration-500 ease-in-out">
      <LoginCard />
    </div>
  );
};

export default LoginForm;
