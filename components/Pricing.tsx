
import React, { useState } from 'react';

const Pricing: React.FC<{ t: any }> = ({ t }) => {
  const [isYearly, setIsYearly] = useState(false);

  const formatMoney = (amount: number) => {
    const formatted = amount.toLocaleString(t.locale);
    return t.currencyPos === 'prefix' 
      ? `${t.currencySymbol}${formatted}` 
      : `${formatted} ${t.currencySymbol}`;
  };

  const proPrice = t.locale === 'vi-VN' 
    ? (isYearly ? 150000 : 200000) 
    : (isYearly ? 7.5 : 9);

  return (
    <div className="flex flex-col gap-8 px-5 py-12 mb-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t.pricingTitle}</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{t.pricingDesc}</p>
        <div className="mt-6 inline-flex rounded-lg bg-gray-100 dark:bg-[#1c1f26] p-1 border border-gray-200 dark:border-gray-800">
          <button 
            onClick={() => setIsYearly(false)}
            className={`rounded-md px-4 py-1.5 text-sm font-bold transition-all ${!isYearly ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
            {t.monthly}
          </button>
          <button 
            onClick={() => setIsYearly(true)}
            className={`rounded-md px-4 py-1.5 text-sm font-bold transition-all ${isYearly ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
            {t.yearly}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {/* Free Plan */}
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161b22] p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold">{t.freePlan}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.freePlanDesc}</p>
            </div>
            <p className="text-xl font-bold">{formatMoney(0)}</p>
          </div>
          <ul className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-500 text-lg">check</span>
              {t.lang === 'vi' ? 'Theo dõi cơ bản' : 'Basic Tracking'}
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-500 text-lg">check</span>
              {t.lang === 'vi' ? 'Liên kết 1 tài khoản' : '1 Linked Account'}
            </li>
          </ul>
          <button className="mt-2 w-full rounded-lg bg-gray-100 dark:bg-gray-800 py-3 text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {t.getStarted}
          </button>
        </div>
        
        {/* Pro Plan */}
        <div className="relative flex flex-col gap-4 rounded-xl border-2 border-primary bg-white dark:bg-[#1c1f26] p-6 shadow-xl shadow-primary/10">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-3 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
            {t.popular}
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold">{t.proPlan}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.proPlanDesc}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">{formatMoney(proPrice)}</p>
              <p className="text-[10px] text-gray-500">/{t.lang === 'vi' ? 'tháng' : 'month'}</p>
            </div>
          </div>
          <ul className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
              {t.lang === 'vi' ? 'Thông tin & Dự báo từ AI' : 'AI Insights & Forecasts'}
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
              {t.lang === 'vi' ? 'Không giới hạn tài khoản' : 'Unlimited Accounts'}
            </li>
          </ul>
          <button className="mt-2 w-full rounded-lg bg-primary py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:bg-blue-600 transition-colors">
            {t.startTrial}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
