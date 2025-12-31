
import React from 'react';

const DashboardPreview: React.FC<{ t: any }> = ({ t }) => {
  return (
    <div className="px-5 pb-12 z-10">
      <div className="relative mt-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1c1f26] p-2 shadow-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none"></div>
        <div className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-xl" style={{ backgroundImage: `url("https://picsum.photos/seed/dashboard/800/600")` }}>
          <div className="absolute top-4 left-4 flex flex-col gap-1">
            <div className="h-4 w-24 bg-gray-200/50 dark:bg-gray-700/50 rounded-full animate-pulse"></div>
            <div className="h-2 w-16 bg-gray-200/30 dark:bg-gray-700/30 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="absolute bottom-6 left-4 right-4 bg-white dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-lg transform translate-y-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">{t.monthlySavings}</span>
            <span className="text-green-500 text-xs font-bold">+12%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[75%] rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
