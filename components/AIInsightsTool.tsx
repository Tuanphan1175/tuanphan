
import React, { useState, useEffect } from 'react';
import { getCoachInsight } from '../services/gemini';

interface AIInsightsToolProps {
  onClose: () => void;
  t: any;
}

const STORAGE_KEY_INCOME = 'ai_budget_income';
const STORAGE_KEY_EXPENSES = 'ai_budget_expenses';

const AIInsightsTool: React.FC<AIInsightsToolProps> = ({ onClose, t }) => {
  const [activeMode, setActiveMode] = useState<'premium' | 'recognition'>('premium');
  
  const [formData, setFormData] = useState({ 
    income: 20000000, 
    expenses: 15000000,
    reserves: 10000000,
    goal: 'Đạt được tự do tài chính' 
  });

  useEffect(() => {
    const savedIncome = localStorage.getItem(STORAGE_KEY_INCOME);
    const savedExpenses = localStorage.getItem(STORAGE_KEY_EXPENSES);
    if (savedIncome || savedExpenses) {
      setFormData(prev => ({
        ...prev,
        income: savedIncome ? Number(savedIncome) : prev.income,
        expenses: savedExpenses ? Number(savedExpenses) : prev.expenses
      }));
    }
  }, []);

  const [insight, setInsight] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pyramidLevels = [
    { id: 1, label: t.pyramidLevel1, color: 'bg-orange-950' },
    { id: 2, label: t.pyramidLevel2, color: 'bg-slate-800' },
    { id: 3, label: t.pyramidLevel3, color: 'bg-slate-700' },
    { id: 4, label: t.pyramidLevel4, color: 'bg-blue-900' },
    { id: 5, label: t.pyramidLevel5, color: 'bg-blue-800' },
    { id: 6, label: t.pyramidLevel6, color: 'bg-blue-700' },
    { id: 7, label: t.pyramidLevel7, color: 'bg-cyan-600' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const result = await getCoachInsight({
        ...formData,
        contextType: activeMode === 'premium' ? 'general' : 'recognition'
      });
      setInsight(result);
    } catch (err) {
      setError("Engine™ Core đang bận xử lý dòng thời gian. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#0f141f] rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500 flex flex-col max-h-[92vh] border border-white/5">
        
        {/* Header */}
        <div className="flex items-center justify-between p-7 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 shrink-0">
          <div className="flex flex-col">
            <h3 className="text-xl font-extrabold flex items-center gap-2 tracking-tight">
              <span className="material-symbols-outlined text-primary">analytics</span>
              AI Coach Engine™
            </h3>
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">Dẫn dắt sự trưởng thành</span>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-all">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-7 overflow-y-auto hide-scrollbar">
          {!insight ? (
            <div className="flex flex-col gap-8">
              <div className="flex rounded-2xl bg-gray-100 dark:bg-white/5 p-1.5">
                <button 
                  onClick={() => setActiveMode('recognition')}
                  className={`flex-1 py-3 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${activeMode === 'recognition' ? 'bg-white dark:bg-gray-700 text-primary shadow-xl ring-1 ring-black/5' : 'text-gray-400'}`}
                >
                  Nhận diện
                </button>
                <button 
                  onClick={() => setActiveMode('premium')}
                  className={`flex-1 py-3 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${activeMode === 'premium' ? 'bg-white dark:bg-gray-700 text-primary shadow-xl ring-1 ring-black/5' : 'text-gray-400'}`}
                >
                  Cố vấn Core
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl">
                  <p className="text-xs leading-relaxed italic font-bold text-primary/80 text-center">
                    {activeMode === 'premium' 
                      ? "\"Kỷ luật là cái giá của tự do. Sự thật là bước đầu của trưởng thành.\""
                      : "\"Chúng tôi giúp bạn soi chiếu bản chất tài chính một cách trung lập.\""}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t.incomeLabel}</label>
                    <input type="number" value={formData.income} onChange={(e) => setFormData(p => ({ ...p, income: Number(e.target.value) }))} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary text-sm font-bold" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t.expenseLabel}</label>
                    <input type="number" value={formData.expenses} onChange={(e) => setFormData(p => ({ ...p, expenses: Number(e.target.value) }))} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary text-sm font-bold" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t.reservesLabel}</label>
                  <input type="number" value={formData.reserves} onChange={(e) => setFormData(p => ({ ...p, reserves: Number(e.target.value) }))} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary text-sm font-bold" />
                </div>

                {activeMode === 'premium' && (
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{t.goalLabel}</label>
                    <input type="text" value={formData.goal} onChange={(e) => setFormData(p => ({ ...p, goal: e.target.value }))} className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary text-sm font-bold" />
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary py-5 rounded-2xl font-black text-white shadow-2xl shadow-primary/30 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-3 mt-4 text-sm tracking-widest"
                >
                  {isLoading ? (
                    <><span className="animate-spin material-symbols-outlined text-lg">sync</span> ĐANG PHÂN TÍCH CORE™</>
                  ) : (
                    <><span className="material-symbols-outlined text-lg">bolt</span> KÍCH HOẠT ENGINE™</>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right duration-700 pb-10">
              
              {/* Pyramid Level & Financial Longevity */}
              <div className="flex flex-col gap-4 bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vị thế tháp tài chính</span>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Tầng {insight.currentLevel}/7</span>
                </div>
                <div className="flex h-4 gap-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full p-1 overflow-hidden">
                  {pyramidLevels.map((lvl) => (
                    <div key={lvl.id} className={`flex-1 rounded-full transition-all duration-1000 ${lvl.id <= insight.currentLevel ? lvl.color : 'bg-transparent'}`}></div>
                  ))}
                </div>
                <div className="flex justify-between items-center px-1">
                   <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">{pyramidLevels[insight.currentLevel - 1].label}</h4>
                   <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full">
                      <span className="material-symbols-outlined text-primary text-[14px]">hourglass_empty</span>
                      <span className="text-[10px] font-black text-primary uppercase">{insight.financialLongevity}</span>
                   </div>
                </div>
              </div>

              {/* 5-Step Structure */}
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black border-4 border-slate-100 dark:border-slate-800">01</div>
                    <div className="flex-1 w-0.5 bg-gray-100 dark:bg-white/10"></div>
                  </div>
                  <div className="flex-1 pb-2">
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Nhận diện sự thật</h5>
                    <p className="text-base font-bold text-gray-900 dark:text-white leading-snug">{insight.factIdentification}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black border-4 border-blue-100 dark:border-blue-900/50">02</div>
                    <div className="flex-1 w-0.5 bg-gray-100 dark:bg-white/10"></div>
                  </div>
                  <div className="flex-1 pb-2">
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Tác động thời gian</h5>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed italic">"{insight.timeImpact}"</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black border-4 border-red-100 dark:border-red-900/50">03</div>
                    <div className="flex-1 w-0.5 bg-gray-100 dark:bg-white/10"></div>
                  </div>
                  <div className="flex-1 pb-2">
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Cái giá phải trả</h5>
                    <p className="text-sm font-bold text-red-600 dark:text-red-400 leading-relaxed">{insight.priceToPay}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px] font-black border-4 border-green-100 dark:border-green-900/50">04</div>
                    <div className="flex-1 w-0.5 bg-gray-100 dark:bg-white/10"></div>
                  </div>
                  <div className="flex-1 pb-2">
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Điều chỉnh cụ thể</h5>
                    <p className="text-sm font-extrabold text-gray-800 dark:text-gray-100 bg-green-500/5 p-4 rounded-2xl border border-green-500/10 shadow-sm">{insight.specificAdjustment}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-black border-4 border-primary/20">05</div>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Câu hỏi trách nhiệm</h5>
                    <p className="text-lg font-black text-gray-900 dark:text-white leading-tight tracking-tight">"{insight.accountabilityQuestion}"</p>
                  </div>
                </div>
              </div>

              {insight.healthWarning && (
                <div className="bg-orange-500/10 border border-orange-500/20 p-5 rounded-3xl flex items-start gap-4">
                  <span className="material-symbols-outlined text-orange-500">health_and_safety</span>
                  <p className="text-xs font-bold text-orange-700 dark:text-orange-400 leading-relaxed">{insight.healthWarning}</p>
                </div>
              )}

              <button 
                onClick={() => setInsight(null)}
                className="w-full bg-gray-900 dark:bg-white py-5 rounded-2xl font-black text-white dark:text-gray-900 transition-all text-xs tracking-widest uppercase hover:scale-[1.02] active:scale-95 shadow-xl"
              >
                Cập nhật & Phản chiếu lại
              </button>
            </div>
          )}
          {error && (
             <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
                <p className="text-red-500 text-sm font-bold">{error}</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInsightsTool;
