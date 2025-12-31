
import React from 'react';
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Q1', value: 1200 },
  { name: 'Q2', value: 1600 },
  { name: 'Q3', value: 1400 },
  { name: 'Q4', value: 2450 },
];

const GrowthChartSection: React.FC<{ t: any }> = ({ t }) => {
  const isVN = t.locale === 'vi-VN';
  const amount = isVN ? 55000000 : 2450;
  
  const formatMoney = (val: number) => {
    const formatted = val.toLocaleString(t.locale);
    return t.currencyPos === 'prefix' 
      ? `${t.currencySymbol}${formatted}` 
      : `${formatted} ${t.currencySymbol}`;
  };

  return (
    <div className="flex flex-col gap-6 px-5 py-10 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>
      <div className="flex flex-col gap-1 relative z-10">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.avgSavings}</p>
        <div className="flex items-baseline gap-3">
          <h3 className="text-2xl font-bold tracking-tight">+{formatMoney(amount)}</h3>
          <div className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-green-600 dark:text-green-400 text-sm font-bold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            15%
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1">{t.year1Projected}</p>
      </div>
      
      <div className="h-40 w-full relative z-10 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#195de6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#195de6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1f2937', color: 'white' }}
              itemStyle={{ color: '#195de6' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#195de6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorVal)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GrowthChartSection;
