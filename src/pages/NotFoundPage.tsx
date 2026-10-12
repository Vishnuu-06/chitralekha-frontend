import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-5 animate-fade-in text-[#99aabb]">
      <div className="w-12 h-12 rounded-[3px] bg-[#1b2228] border border-[#2c3440] text-[#00e054] mx-auto flex items-center justify-center">
        <Compass className="w-6 h-6" />
      </div>
      <span className="text-xs uppercase tracking-widest font-bold text-[#8899aa] block">404 Error</span>
      <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase">Page Not Found</h1>
      <p className="text-sm text-[#8899aa] max-w-md mx-auto leading-relaxed">
        The catalog entry or page you requested could not be located in the Chitra Lekha ledger.
      </p>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-block px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#00e054] text-[#14181c] rounded-[3px] hover:bg-[#00c84b] transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};
