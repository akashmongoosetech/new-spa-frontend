import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Shield } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans antialiased">
      {/* Top Bar */}
      <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group text-gray-300 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 text-[#2CB5A0] group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-semibold uppercase tracking-wider">Back to Sanctuary</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
          <Shield className="w-4 h-4 text-[#2CB5A0]" />
          <span>Encrypted Portal</span>
        </div>
      </div>

      {/* Center Auth Content */}
      <div className="w-full max-w-md mx-auto my-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-tr from-[#2CB5A0] to-[#C7A36A] p-0.5 shadow-xl shadow-[#2CB5A0]/10 mb-4">
            <div className="w-full h-full bg-[#0F172A] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-[#2CB5A0]" />
            </div>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-wide">AURA LUXE SPA</h1>
          <p className="text-xs font-medium text-gray-400 tracking-widest uppercase mt-1">Management Console</p>
        </div>

        <Outlet />
      </div>

      {/* Bottom Footer */}
      <div className="text-center text-xs text-gray-500 py-4 border-t border-gray-800/50">
        &copy; {new Date().getFullYear()} Aura Luxe Spa & Wellness. Confidential System Access.
      </div>
    </div>
  );
};

export default AuthLayout;
