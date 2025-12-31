
import React from 'react';

interface HeaderProps {
  t: any;
}

const Header: React.FC<HeaderProps> = ({ t }) => {
  return (
    <div className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2">
        <div className="text-primary flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <span className="material-symbols-outlined text-xl">pie_chart</span>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-tight">{t.appName}</h2>
      </div>
      <div className="flex items-center justify-end">
        <button className="text-gray-500 dark:text-gray-400 text-sm font-bold hover:text-primary transition-colors">{t.signIn}</button>
      </div>
    </div>
  );
};

export default Header;
