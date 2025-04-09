
import React from 'react';
import { cn } from '@/lib/utils';

const Header = ({ className }: { className?: string }) => {
  return (
    <header className={cn("w-full py-6 px-4 md:px-8", className)}>
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold">
            <span className="gradient-heading">Presentify.AI</span>
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
