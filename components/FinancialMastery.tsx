
import React, { useState, useMemo, useEffect } from 'react';

interface FinancialMasteryProps {
  t: any;
  viewMode: 'monthly' | 'yearly';
}

interface JarConfig {
  nec: number;
  edu: number;
  res: number;
  inv: number;
  play: number;
  give: number;
}

const STORAGE_KEY_INCOME = 'ai_budget_income';
const STORAGE_KEY_EXPENSES = 'ai_budget_expenses';
const STORAGE_KEY_JARS = 'ai_budget_jar_config';

const FinancialMastery: React.FC<FinancialMasteryProps> = ({ t, viewMode }) => {
  const [income, setIncome] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_INCOME);
    return saved ? Number(saved) : 20000000;
  });

  const [expenses, setExpenses] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EXPENSES);
    return saved ? Number(saved) : 15000000;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'jars' | 'pyramid' | 'principles'>('jars');
  
  const getDefaultConfig = (incomeVal: number): JarConfig => {
    const limitHigh = 500000000;
    const limitMid = 50000000;

    if (incomeVal >= limitHigh) {
      return { nec: 20, edu: 10, res: 10, inv: 50, play: 5, give: 5 };
    } else if (incomeVal >= limitMid) {
      return { nec: 40, edu: 10, res: 10, inv: 30, play: 5, give: 5 };
    }
    return { nec: 55, edu: 10, res: 10, inv: 15, play: 5, give: 5 };
  };

  const [customConfig, setCustomConfig] = useState<JarConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_JARS);
    if (saved) return JSON.parse(saved);
    return getDefaultConfig(income);
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_INCOME, income.toString());
  }, [income]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EXPENSES, expenses.toString());
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_JARS, JSON.stringify(customConfig));
  }, [customConfig]);

  // Only auto-update if not in manual edit mode
  useEffect(() => {
    if (!isEditing && !localStorage.getItem(STORAGE_KEY_JARS)) {
      setCustomConfig(getDefaultConfig(income));
    }
  }, [income, isEditing]);

  const formatMoney = (amount: number) => {
    const formatted = amount.toLocaleString('vi-VN');
    return `${formatted} VNĐ`;
  };

  const jarsData = useMemo(() => {
    return [
      { id: 'nec' as keyof JarConfig, label: t.necessities, pct: customConfig.nec, color: 'bg-purple-400' },
      { id: 'edu' as keyof JarConfig, label: t.education, pct: customConfig.edu, color: 'bg-blue-400' },
      { id: 'res' as keyof JarConfig, label: t.reserve, pct: customConfig.res, color: 'bg-orange-300' },
      { id: 'inv' as keyof JarConfig, label: t.investment, pct: customConfig.inv, color: 'bg-pink-400' },
      { id: 'play' as keyof JarConfig, label: t.play, pct: customConfig.play, color: 'bg-yellow-400' },
      { id: 'give' as keyof JarConfig, label: t.give, pct: customConfig.give, color: 'bg-green-400' },
    ];
  }, [customConfig, t]);

  const totalPercentage = (Object.values(customConfig) as number[]).reduce((a, b) => a + b, 0);
  const isValid = totalPercentage === 100;

  const handleJarChange = (id: keyof JarConfig, val: number) => {
    setCustomConfig(prev => ({ ...prev, [id]: val }));
  };

  const resetToDefault = () => {
    const defaultConfig = getDefaultConfig(income);
    setCustomConfig(defaultConfig);
    localStorage.removeItem(STORAGE_KEY_JARS);
  };

  const pyramidLevels = [
    { label: t.pyramidLevel7, color: 'bg-cyan-400', desc: 'Sống đủ đầy & Đóng góp' },
    { label: t.pyramidLevel6, color: 'bg-blue-500', desc: 'Dòng tiền thụ động > Chi phí' },
    { label: t.pyramidLevel5, color: 'bg-blue-600', desc: 'Tiền làm việc cho mình' },
    { label: t.pyramidLevel4, color: 'bg-blue-700', desc: 'Dự phòng 12-24 tháng + Tài sản' },
    { label: t.pyramidLevel3, color: 'bg-blue-800', desc: 'Dự phòng ≥ 6 tháng' },
    { label: t.pyramidLevel2, color: 'bg-blue-900', desc: 'Thu = Chi, Dự phòng < 1 tháng' },
    { label: t.pyramidLevel1, color: 'bg-orange-900', desc: 'Thu < Chi, Không dự phòng' },
  ];

  const goldenPrinciples = [
    "Chỉ mua thứ CẦN - Không mua thứ MUỐN",
    "Làm việc TRÊN chuẩn - Sống DƯỚI chuẩn",
    "Trả cho bản thân trước ngay khi tiền về",
    "Tách bạch tiền Cá nhân & Kinh doanh",
    "ROI cao nhất là đầu tư vào Bản thân",
    "Quỹ dự phòng là chiếc ô khi trời nắng",
    "Không bao giờ All-in vào 1 dự án",
    "Tái đầu tư lợi nhuận, không tiêu vào lãi",
    "Nợ tốt tạo ra tài sản, nợ xấu là nô lệ",
    "Xem 20 - Chọn 10 - Quyết 3 - Chốt 1",
    "Tiết kiệm ≠ Quản trị tài chính"
  ];

  const displayIncome = viewMode === 'yearly' ? income * 12 : income;
  const surplus = income - expenses;

  return (
    <div className="flex flex-col gap-8 px-5 py-10 bg-gray-50 dark:bg-[#0d1117]">
      {/* Header Principles */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-primary/10 border border-primary/20 p-3 rounded-xl flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-primary mb-1">trending_up</span>
          <span className="text-[10px] font-bold text-primary uppercase leading-tight">{t.workAboveStandard}</span>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-green-500 mb-1">south_east</span>
          <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase leading-tight">{t.liveBelowStandard}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button onClick={() => setActiveTab('jars')} className={`flex-1 pb-3 text-xs font-bold transition-all ${activeTab === 'jars' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>{t.jarsTitle}</button>
        <button onClick={() => setActiveTab('pyramid')} className={`flex-1 pb-3 text-xs font-bold transition-all ${activeTab === 'pyramid' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>{t.pyramidTitle}</button>
        <button onClick={() => setActiveTab('principles')} className={`flex-1 pb-3 text-xs font-bold transition-all ${activeTab === 'principles' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>{t.wisdom}</button>
      </div>

      {activeTab === 'jars' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500 italic">"{t.jarsDesc}"</p>
            <div className="flex gap-2">
              {isEditing && (
                <button onClick={resetToDefault} title={t.resetDefault} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">restart_alt</span>
                </button>
              )}
              <button onClick={() => setIsEditing(!isEditing)} title={t.customizeJars} className={`p-2 rounded-lg shadow-sm transition-colors ${isEditing ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-500'}`}>
                <span className="material-symbols-outlined text-sm">{isEditing ? 'done' : 'tune'}</span>
              </button>
            </div>
          </div>

          {/* Custom Income & Expense Input */}
          <div className="flex flex-col gap-4">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-4">
              {/* Income Row */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-500 text-lg">payments</span>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.incomeLabel}</label>
                  </div>
                  <input 
                    type="number" 
                    value={income} 
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-28 bg-gray-50 dark:bg-gray-900/50 border-none rounded-lg p-1 text-right text-sm font-black text-primary focus:ring-1 focus:ring-primary" 
                  />
                </div>
                <input type="range" min={0} max={200000000} step={1000000} value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
              </div>

              <div className="h-px bg-gray-100 dark:bg-gray-700 w-full"></div>

              {/* Expense Row */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-500 text-lg">shopping_cart</span>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.expenseLabel}</label>
                  </div>
                  <input 
                    type="number" 
                    value={expenses} 
                    onChange={(e) => setExpenses(Number(e.target.value))}
                    className="w-28 bg-gray-50 dark:bg-gray-900/50 border-none rounded-lg p-1 text-right text-sm font-black text-red-500 focus:ring-1 focus:ring-red-500" 
                  />
                </div>
                <input type="range" min={0} max={200000000} step={1000000} value={expenses} onChange={(e) => setExpenses(Number(e.target.value))} className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
              </div>
            </div>

            {/* Financial Status Summary */}
            <div className={`p-4 rounded-3xl flex items-center justify-between transition-all border ${surplus >= 0 ? 'bg-blue-500/5 border-blue-500/10' : 'bg-red-500/5 border-red-500/10'}`}>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.surplusLabel}</span>
                <span className={`text-lg font-black ${surplus >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatMoney(surplus)}
                </span>
              </div>
              <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${surplus >= 0 ? 'bg-blue-500 text-white' : 'bg-red-500 text-white shadow-lg shadow-red-500/30'}`}>
                <span className="material-symbols-outlined">{surplus >= 0 ? 'check_circle' : 'warning'}</span>
              </div>
            </div>
          </div>

          {isEditing && (
             <div className={`p-3 rounded-xl text-center text-[10px] font-bold uppercase tracking-widest animate-in slide-in-from-top-2 ${isValid ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                {t.totalPercentage}: {totalPercentage}% {!isValid && `(${t.invalidTotal})`}
             </div>
          )}

          {/* Jars Display */}
          <div className="grid grid-cols-2 gap-3">
            {jarsData.map((jar) => (
              <div key={jar.id} className="relative group flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="z-10 text-center w-full">
                  {isEditing ? (
                    <div className="flex flex-col items-center gap-1 mb-1">
                      <h4 className="text-[11px] font-bold">{jar.label}</h4>
                      <div className="flex items-center gap-1">
                        <input 
                          type="number" 
                          value={jar.pct} 
                          onChange={(e) => handleJarChange(jar.id, Number(e.target.value))}
                          className="w-12 bg-gray-50 dark:bg-gray-900 border-none rounded p-1 text-center text-xs font-bold focus:ring-1 focus:ring-primary" 
                        />
                        <span className="text-[10px] font-bold text-gray-400">%</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{jar.pct}%</p>
                      <h4 className="text-[11px] font-bold mb-1">{jar.label}</h4>
                    </>
                  )}
                  <p className="text-sm font-extrabold text-primary">{formatMoney(displayIncome * jar.pct / 100)}</p>
                </div>
                <div className={`absolute bottom-0 left-0 right-0 ${jar.color} opacity-10 transition-all duration-700`} style={{ height: `${jar.pct}%` }}></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'pyramid' && (
        <div className="flex flex-col gap-4 animate-in slide-in-from-right duration-300">
          <div className="flex flex-col items-center">
            {pyramidLevels.map((lvl, idx) => (
              <div key={idx} className={`${lvl.color} w-full flex items-center justify-between py-3 px-4 border-b border-white/10 relative group transition-all hover:scale-[1.02] cursor-pointer`} style={{ width: `${100 - (idx * 8)}%`, borderTopLeftRadius: idx === 0 ? '100% 100%' : '0', borderTopRightRadius: idx === 0 ? '100% 100%' : '0' }}>
                <span className="text-[9px] font-bold text-white uppercase drop-shadow-md">{lvl.label}</span>
                <span className="text-[8px] text-white/70 italic max-w-[50%] text-right">{lvl.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'principles' && (
        <div className="flex flex-col gap-3 animate-in slide-in-from-right duration-300">
          <h3 className="text-sm font-bold text-primary flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined">verified</span>
            {t.principles11}
          </h3>
          <div className="space-y-2">
            {goldenPrinciples.map((p, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">{i+1}</span>
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{p}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialMastery;
