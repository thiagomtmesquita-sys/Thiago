
import React from 'react';
import { BRAND_INITIALS, BRAND_NAME } from '../constants';

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
      <div className="relative group">
        <h1 className="text-7xl font-serif font-bold tracking-widest text-gold leading-none transition-transform duration-500 group-hover:scale-105">
          {BRAND_INITIALS}
        </h1>
        <div className="h-px w-full bg-gold my-2 opacity-50"></div>
        <p className="text-sm font-light tracking-[0.5em] text-gold/80 uppercase">
          {BRAND_NAME.split(' ')[1]}
        </p>
      </div>
    </div>
  );
};

export default Logo;
