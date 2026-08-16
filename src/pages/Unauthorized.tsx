import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-react';

export const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#111827] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold tracking-widest text-red-400 uppercase">Error 401</span>
        <h1 className="text-2xl font-serif font-bold text-white mt-2 mb-3">Unauthorized Access</h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          You do not have administrative permissions to view this sanctuary console page. Please log in with an authorized account.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-medium text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Website
          </Link>
          <Link
            to="/admin-login"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#2CB5A0] hover:bg-[#259b89] text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
          >
            <Lock className="w-4 h-4" />
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
