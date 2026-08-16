import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 text-[#1A1A1A]">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-gray-100 shadow-xl text-center">
        <div className="w-16 h-16 bg-[#2CB5A0]/10 text-[#2CB5A0] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>
        <span className="text-xs font-bold tracking-widest text-[#2CB5A0] uppercase">Error 404</span>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mt-2 mb-3">Page Not Found</h1>
        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          The requested page or sanctuary experience could not be located. It may have been moved or renamed.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl font-medium text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#1A1A1A] hover:bg-[#2CB5A0] text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
