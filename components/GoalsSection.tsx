
import React, { useState, useEffect } from 'react';
import { FinancialGoal } from '../types';
import { getGoalStrategy } from '../services/gemini';

interface GoalsSectionProps {
  t: any;
}

const STORAGE_KEY = 'ai_budget_goals';
const INCOME_KEY = 'ai_budget_income';

const GoalsSection: React.FC<GoalsSectionProps> = ({ t }) => {
  const isVN = t.locale === 'vi-VN';
  
  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    
    return [
      { 
        id: '1', 
        title: t.lang === 'vi' ? 'Mua nhà' : 'Buy a House', 
        targetAmount: isVN ? 2000000000 : 100000, 
        currentAmount: isVN ? 500000000 : 25000, 
        deadline: '2026-12-31', 
        type: 'saving',
        reminderDays: 30
      },
      { 
        id: '2', 
        title: t.lang === 'vi' ? 'Trả nợ thẻ tín dụng' : 'Clear Credit Card', 
        targetAmount: isVN ? 50000000 : 2000, 
        currentAmount: isVN ? 10000000 : 500, 
        deadline: '2024-09-01', 
        type: 'debt',
        reminderDays: 7
      }
    ];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [loadingGoalId, setLoadingGoalId] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<any>(null);

  const [newGoal, setNewGoal] = useState<Partial<FinancialGoal>>({
    title: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: new Date().toISOString().split('T')[0],
    type: 'saving',
    reminderDays: 0
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  const formatMoney = (amount: number) => {
    const formatted = amount.toLocaleString(t.locale);
    return t.currencyPos === 'prefix' 
      ? `${t.currencySymbol}${formatted}` 
      : `${formatted} ${t.currencySymbol}`;
  };

  const updateGoalProgress = (id: string, newAmount: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, currentAmount: newAmount } : g));
  };

  const handleAdd = () => {
    if (newGoal.title && newGoal.targetAmount && newGoal.targetAmount > 0) {
      const goal: FinancialGoal = {
        id: Date.now().toString(),
        title: newGoal.title,
        targetAmount: Number(newGoal.targetAmount),
        currentAmount: Number(newGoal.currentAmount) || 0,
        deadline: newGoal.deadline || '',
        type: newGoal.type as 'saving' | 'debt',
        reminderDays: Number(newGoal.reminderDays) || 0
      };
      setGoals(prev => [...prev, goal]);
      setIsAdding(false);
      setNewGoal({ title: '', targetAmount: 0, currentAmount: 0, deadline: new Date().toISOString().split('T')[0], type: 'saving', reminderDays: 0 });
    }
  };

  const handleDelete = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    if (strategy && strategy.goalId === id) {
      setStrategy(null);
    }
  };

  const handleGetStrategy = async (goal: FinancialGoal) => {
    setLoadingGoalId(goal.id);
    setStrategy(null);
    
    const storedIncome = localStorage.getItem(INCOME_KEY);
    const income = storedIncome ? Number(storedIncome) : 0;
    const estimatedSavings = income * 0.2;

    try {
      const res = await getGoalStrategy(goal, { income, savings: estimatedSavings }, t.lang);
      setStrategy({ ...res, goalId: goal.id });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingGoalId(null);
    }
  };

  const isNearingDeadline = (deadline: string, reminderDays: number) => {
    if (!reminderDays || reminderDays <= 0) return false;
    const today = new Date();
    const targetDate = new Date(deadline);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= reminderDays;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'safe': return 'text-green-500 bg-green-500/10';
      case 'challenging': return 'text-orange-500 bg-orange-500/10';
      case 'atRisk': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="flex flex-col gap-6 px-5 py-10 bg-white dark:bg-[#0d1117]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">{t.financialGoals}</h2>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Kỷ luật & Mục tiêu</span>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      {isAdding && (
        <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-6 border-2 border-primary animate-in zoom-in-95 duration-200">
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.goalTitle}</label>
              <input 
                type="text" 
                placeholder={t.goalTitle}
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                className="w-full mt-1 bg-white dark:bg-gray-900 border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.targetAmount}</label>
                <input 
                  type="number" 
                  placeholder="0"
                  value={newGoal.targetAmount || ''}
                  onChange={(e) => setNewGoal({...newGoal, targetAmount: Number(e.target.value)})}
                  className="w-full mt-1 bg-white dark:bg-gray-900 border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.deadline}</label>
                <input 
                  type="date" 
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  className="w-full mt-1 bg-white dark:bg-gray-900 border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.reminderLabel}</label>
              <input 
                type="number" 
                placeholder="0"
                value={newGoal.reminderDays || ''}
                onChange={(e) => setNewGoal({...newGoal, reminderDays: Number(e.target.value)})}
                className="w-full mt-1 bg-white dark:bg-gray-900 border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-3 text-sm font-bold text-gray-500">{t.cancel}</button>
              <button onClick={handleAdd} className="flex-1 py-3 text-sm font-bold bg-primary text-white rounded-xl shadow-lg active:scale-95 transition-transform">{t.save}</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {goals.map(goal => {
          const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
          const isSaving = goal.type === 'saving';
          const hasStrategy = strategy && strategy.goalId === goal.id;
          const barColorClass = isSaving ? 'from-blue-600 to-cyan-400' : 'from-red-600 to-orange-400';
          const glowColorClass = isSaving ? 'shadow-blue-500/30' : 'shadow-red-500/30';
          const nearing = isNearingDeadline(goal.deadline, goal.reminderDays || 0);
          
          return (
            <div key={goal.id} className={`flex flex-col gap-5 rounded-3xl bg-gray-50 dark:bg-gray-800/40 p-6 border border-gray-100 dark:border-gray-800 relative group transition-all hover:border-primary/30 hover:shadow-xl ${nearing ? 'ring-2 ring-amber-500 animate-pulse' : ''}`}>
              {nearing && (
                <div className="absolute -top-3 left-4 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1 z-10">
                   <span className="material-symbols-outlined text-[12px]">notifications_active</span>
                   {t.reminderActive}
                </div>
              )}
              
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-extrabold text-gray-900 dark:text-white leading-tight">{goal.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
                      <span className="material-symbols-outlined text-[12px]">event</span>
                      {goal.deadline}
                    </span>
                    {hasStrategy && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shadow-sm ${getStatusColor(strategy.feasibilityStatus)}`}>
                        {t[strategy.feasibilityStatus]}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-sm ${isSaving ? 'bg-blue-500/10 text-blue-600' : 'bg-red-500/10 text-red-600'}`}>
                    {isSaving ? t.saving : t.debt}
                  </span>
                  <button 
                    onClick={() => handleDelete(goal.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title={t.delete}
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>

              {/* Enhanced Visual Progress Bar */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{t.currentProgress}</span>
                      <span className="text-sm font-extrabold text-gray-900 dark:text-white">{formatMoney(goal.currentAmount)}</span>
                   </div>
                   <div className="text-right flex flex-col items-end">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{t.targetAmount}</span>
                      <span className="text-xs font-bold text-gray-500">{formatMoney(goal.targetAmount)}</span>
                   </div>
                </div>
                
                <div className="relative h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full p-1 overflow-hidden shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${barColorClass} shadow-lg ${glowColorClass}`} 
                    style={{ width: `${progress}%` }}
                  >
                    {progress > 10 && (
                      <div className="h-full w-full relative flex items-center justify-end pr-2">
                         <div className="h-1 w-1 bg-white/40 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-1">
                   <span className={`text-sm font-black ${isSaving ? 'text-blue-500' : 'text-red-500'}`}>{progress.toFixed(1)}%</span>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Quick Update</span>
                      <input 
                        type="range" 
                        min="0" 
                        max={goal.targetAmount} 
                        value={goal.currentAmount}
                        onChange={(e) => updateGoalProgress(goal.id, Number(e.target.value))}
                        className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                   </div>
                </div>
              </div>

              {!hasStrategy && (
                <button 
                  onClick={() => handleGetStrategy(goal)}
                  disabled={loadingGoalId === goal.id}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-primary/20 bg-primary/5 text-primary text-xs font-black transition-all hover:bg-primary/10 hover:border-primary/40 active:scale-95 shadow-sm"
                >
                  {loadingGoalId === goal.id ? (
                    <span className="animate-spin material-symbols-outlined text-sm">sync</span>
                  ) : (
                    <span className="material-symbols-outlined text-sm">query_stats</span>
                  )}
                  {t.getStrategy}
                </button>
              )}

              {hasStrategy && (
                <div className="flex flex-col gap-4 p-6 rounded-3xl bg-white dark:bg-gray-800 border border-primary/10 shadow-2xl animate-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
                    <div className="flex flex-col">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.monthlyTargetGoal}</h4>
                      <p className="text-base font-black text-primary">{strategy.monthlyTarget}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.linkedJar}</h4>
                      <p className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-tight bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-lg">{strategy.linkedJar}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <h5 className="text-[10px] font-black text-primary uppercase flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]">visibility</span> {t.truth}
                      </h5>
                      <p className="text-xs font-semibold leading-relaxed text-gray-700 dark:text-gray-300">{strategy.truthIdentification}</p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <h5 className="text-[10px] font-black text-orange-500 uppercase flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]">priority_high</span> {t.price}
                      </h5>
                      <p className="text-xs text-gray-500 leading-relaxed italic border-l-2 border-orange-200 dark:border-orange-800/40 pl-3">{strategy.priceToPay}</p>
                    </div>

                    <div className="flex flex-col gap-2 bg-green-500/5 p-4 rounded-2xl border border-green-500/10">
                      <h5 className="text-[10px] font-black text-green-600 uppercase flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]">task_alt</span> {t.action}
                      </h5>
                      <p className="text-xs font-extrabold text-gray-800 dark:text-gray-100 leading-relaxed">{strategy.specificAdjustment}</p>
                    </div>

                    <div className="flex flex-col gap-1.5 pt-3 border-t border-gray-100 dark:border-gray-700 text-center bg-gray-50 dark:bg-gray-900/20 p-4 rounded-2xl">
                      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                         {t.question}
                      </h5>
                      <p className="text-sm font-black text-gray-900 dark:text-white">"{strategy.accountabilityQuestion}"</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setStrategy(null)}
                    className="mt-2 text-[10px] font-black text-gray-400 uppercase hover:text-primary transition-all p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Đóng phân tích
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalsSection;
