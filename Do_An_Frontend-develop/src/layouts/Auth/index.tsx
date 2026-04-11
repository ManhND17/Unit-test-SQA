import React from 'react';

interface IAuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: IAuthLayoutProps) {
  return (
    <div className="flex h-screen bg-white">
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `url('/images/hospital-signin.jpg')`,
        }}
      >
        <div className="h-full w-full bg-blue-900/30 flex items-center justify-center">
          <div className="text-center p-8 bg-white/80 rounded-lg shadow-lg max-w-md">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">
              Bệnh viện Bắc Hưng
            </h1>
            <p className="text-gray-700">
              Chăm sóc sức khỏe chất lượng cao, uy tín và tận tâm
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">{children}</div>
    </div>
  );
}
