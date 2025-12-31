
import React from 'react';

const Hero: React.FC<{ t: any }> = ({ t }) => {
  return (
    <div className="relative flex flex-col px-5 pt-8 pb-12 gap-8">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="flex flex-col gap-4 text-left z-10">
        <div className="inline-flex items-center gap-2 self-start rounded-full bg-primary/10 px-3 py-1">
          <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
          <span className="text-xs font-bold text-primary uppercase tracking-wide">{t.heroBadge}</span>
        </div>
        <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight">
          {t.heroTitle} <span className="text-primary">{t.heroTitleHighlight}</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
          {t.heroDescription}
        </p>
        <div className="flex flex-col gap-3 mt-2">
          <button className="flex w-full cursor-pointer items-center justify-center rounded-xl h-12 bg-primary text-white text-base font-bold shadow-lg shadow-primary/25 active:scale-95 transition-all">
            {t.startFree}
          </button>
          <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-500 text-xs">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span>{t.bankSecurity}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
