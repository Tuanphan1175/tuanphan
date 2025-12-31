
import React from 'react';

const Features: React.FC<{ t: any }> = ({ t }) => {
  const features = [
    {
      icon: 'category',
      color: 'blue',
      title: t.feature1Title,
      description: t.feature1Desc
    },
    {
      icon: 'notifications_active',
      color: 'orange',
      title: t.feature2Title,
      description: t.feature2Desc
    },
    {
      icon: 'lightbulb',
      color: 'purple',
      title: t.feature3Title,
      description: t.feature3Desc
    }
  ];

  return (
    <div className="flex flex-col gap-8 px-5 py-10 bg-white dark:bg-[#161b22]">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold leading-tight">{t.aiAdvantage}</h2>
        <p className="text-gray-500 dark:text-gray-400">{t.aiAdvantageDesc}</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {features.map((f, i) => (
          <div key={i} className="flex gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1c1f26] p-5">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-${f.color}-500/10 text-${f.color}-500`}>
              <span className="material-symbols-outlined">{f.icon}</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
