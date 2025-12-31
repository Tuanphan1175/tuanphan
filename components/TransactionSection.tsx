
import React, { useState, useMemo, useEffect } from 'react';
import { Transaction } from '../types';
import { getCoachInsight } from '../services/gemini';

interface TransactionSectionProps {
  t: any;
  viewMode: 'monthly' | 'yearly';
}

const STORAGE_KEY = 'ai_budget_transactions';
const INCOME_KEY = 'ai_budget_income';

const TransactionSection: React.FC<TransactionSectionProps> = ({ t, viewMode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', date: '2024-03-20', amount: 500000, category: 'food', notes: 'Ăn trưa cùng nhóm', type: 'expense', classification: 'need' },
      { id: '2', date: '2024-03-19', amount: 25000000, category: 'salary', notes: 'Lương hàng tháng', type: 'income', isRecurring: true, frequency: 'monthly', nextDueDate: '2024-04-19' },
      { id: '3', date: '2024-03-18', amount: 1200000, category: 'shopping', notes: 'Giày thể thao mới', type: 'expense', classification: 'want' },
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [loadingCoachId, setLoadingCoachId] = useState<string | null>(null);
  const [coachResult, setCoachResult] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);

  // New Transaction State
  const [newTx, setNewTx] = useState<Partial<Transaction>>({
    type: 'expense',
    category: 'food',
    classification: 'need',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    notes: ''
  });
  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // Dynamic Categories based on type
  const expenseCategories = [
    { id: 'food', label: t.food, icon: 'restaurant' },
    { id: 'shopping', label: t.shopping, icon: 'shopping_bag' },
    { id: 'housing', label: t.housing, icon: 'home' },
    { id: 'transport', label: t.transport, icon: 'directions_car' },
    { id: 'health', label: t.health, icon: 'medical_services' },
    { id: 'other', label: t.other, icon: 'more_horiz' },
  ];

  const incomeCategories = [
    { id: 'salary', label: t.salary, icon: 'payments' },
    { id: 'business', label: t.business, icon: 'storefront' },
    { id: 'investment', label: t.investment, icon: 'show_chart' },
    { id: 'gift', label: t.gift, icon: 'featured_seasonal_and_gifts' },
    { id: 'other', label: t.other, icon: 'more_horiz' },
  ];

  const currentCategoryList = newTx.type === 'expense' ? expenseCategories : incomeCategories;

  const formatMoney = (amount: number) => {
    return `${Math.abs(amount).toLocaleString(t.locale)} ${t.currencySymbol}`;
  };

  const handleProCoach = async (tx: Transaction) => {
    setLoadingCoachId(tx.id);
    setCoachResult(null);
    try {
      const incomeStr = localStorage.getItem(INCOME_KEY);
      const income = incomeStr ? Number(incomeStr) : 20000000;
      const res = await getCoachInsight({
        income,
        expenses: 0,
        reserves: 0,
        contextType: 'transaction',
        transactionData: tx
      });
      setCoachResult({ ...res, txId: tx.id });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCoachId(null);
    }
  };

  const handleAdd = () => {
    if (newTx.amount && newTx.amount > 0) {
      let finalCategory = newTx.category || 'other';
      if (finalCategory === 'other' && customCategory.trim()) {
        finalCategory = customCategory.trim();
      }

      const transaction: Transaction = {
        id: Date.now().toString(),
        date: newTx.date || new Date().toISOString().split('T')[0],
        amount: Number(newTx.amount),
        category: finalCategory,
        notes: newTx.notes || '',
        type: newTx.type as 'income' | 'expense',
        classification: newTx.type === 'expense' ? (newTx.classification || 'need') : undefined
      };
      setTransactions(prev => [transaction, ...prev]);
      setIsAdding(false);
      setNewTx({ type: 'expense', category: 'food', classification: 'need', date: new Date().toISOString().split('T')[0], amount: 0, notes: '' });
      setCustomCategory('');
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => tx.notes.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [transactions, searchQuery]);

  const totalIncome = filteredTransactions.filter(tx => tx.type === 'income').reduce((acc, tx) => acc + tx.amount, 0);
  const totalExpense = filteredTransactions.filter(tx => tx.type === 'expense').reduce((acc, tx) => acc + tx.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="flex flex-col gap-6 px-5 py-10 bg-gray-50 dark:bg-[#111621]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-2xl font-black tracking-tight">{t.transactions}</h2>
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">Nhật ký hành vi</span>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-xl active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-gray-400 text-xl">search</span>
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="block w-full pl-12 pr-4 py-4 border-none bg-white dark:bg-[#1c1f26] rounded-[1.25rem] text-sm shadow-sm font-bold"
        />
      </div>

      <div className="rounded-[1.5rem] bg-white dark:bg-[#1c1f26] p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Dòng tiền thuần</p>
        <h3 className={`text-2xl font-black ${balance >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-500'}`}>
          {formatMoney(balance)}
        </h3>
        <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-gray-50 dark:border-white/5">
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t.income}</p>
            <p className="text-sm font-black text-green-500">+{formatMoney(totalIncome)}</p>
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t.expense}</p>
            <p className="text-sm font-black text-red-500">-{formatMoney(totalExpense)}</p>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="rounded-[2.5rem] bg-[#0f141f] p-8 shadow-2xl border border-primary/20 animate-in zoom-in-95 duration-300">
          <div className="flex flex-col gap-6">
            {/* Type Toggle */}
            <div className="flex rounded-2xl bg-gray-800/50 p-1.5 border border-white/5">
              <button 
                onClick={() => { setNewTx({...newTx, type: 'expense', category: 'food'}); setCustomCategory(''); }} 
                className={`flex-1 py-3 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${newTx.type === 'expense' ? 'bg-gray-700 text-red-500 shadow-xl ring-1 ring-white/10' : 'text-gray-500'}`}
              >
                {t.expense}
              </button>
              <button 
                onClick={() => { setNewTx({...newTx, type: 'income', category: 'salary'}); setCustomCategory(''); }} 
                className={`flex-1 py-3 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${newTx.type === 'income' ? 'bg-gray-700 text-green-500 shadow-xl ring-1 ring-white/10' : 'text-gray-500'}`}
              >
                {t.income}
              </button>
            </div>

            {/* Category Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">{t.category}</label>
              <div className="relative">
                <select 
                  value={newTx.category} 
                  onChange={(e) => setNewTx({...newTx, category: e.target.value})} 
                  className="w-full bg-gray-800/40 border border-white/5 rounded-2xl p-4 text-sm font-bold appearance-none text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  {currentCategoryList.map(cat => <option key={cat.id} value={cat.id} className="bg-[#1c1f26]">{cat.label}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Custom Category Input (Conditional) */}
            {newTx.category === 'other' && (
              <div className="flex flex-col gap-2 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">{t.customCategory}</label>
                <input 
                  type="text" 
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder={t.customCategoryPlaceholder}
                  className="w-full bg-gray-800/40 border border-primary/30 rounded-2xl p-4 text-sm font-bold text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            )}

            {/* Amount & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">{t.amount}</label>
                <input 
                  type="number" 
                  value={newTx.amount || ''} 
                  onChange={(e) => setNewTx({...newTx, amount: Number(e.target.value)})} 
                  placeholder="0"
                  className="w-full bg-gray-800/40 border border-white/5 rounded-2xl p-4 text-sm font-black text-white focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">{t.date}</label>
                <input 
                  type="date" 
                  value={newTx.date} 
                  onChange={(e) => setNewTx({...newTx, date: e.target.value})} 
                  className="w-full bg-gray-800/40 border border-white/5 rounded-2xl p-4 text-sm font-bold text-white focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">{t.notes}</label>
              <textarea 
                value={newTx.notes} 
                onChange={(e) => setNewTx({...newTx, notes: e.target.value})} 
                placeholder="..."
                rows={2}
                className="w-full bg-gray-800/40 border border-white/5 rounded-2xl p-4 text-sm font-bold text-white focus:ring-2 focus:ring-primary transition-all resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setIsAdding(false)} 
                className="flex-1 py-4 text-xs font-black text-gray-400 uppercase tracking-[0.2em] hover:text-white transition-colors"
              >
                {t.cancel}
              </button>
              <button 
                onClick={handleAdd} 
                className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div className="flex flex-col gap-4">
        {filteredTransactions.map(tx => {
          // Combined categories for display matching
          const allCats = [...expenseCategories, ...incomeCategories];
          const cat = allCats.find(c => c.id === tx.category) || { label: tx.category, icon: 'category' };
          const isCoachOpen = coachResult && coachResult.txId === tx.id;
          
          return (
            <div key={tx.id} className="flex flex-col gap-4">
              <div className="flex items-center gap-4 rounded-[1.25rem] bg-white dark:bg-[#1c1f26] p-4 shadow-sm border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-all group">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] ${tx.type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  <span className="material-symbols-outlined">{cat.icon}</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-gray-900 dark:text-white truncate pr-2">{tx.notes || cat.label}</h4>
                    <span className={`text-xs font-black ${tx.type === 'income' ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatMoney(tx.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{cat.label}</span>
                    <button 
                      onClick={() => handleProCoach(tx)}
                      disabled={loadingCoachId === tx.id}
                      className="flex items-center gap-1.5 text-[9px] font-black text-primary uppercase tracking-widest"
                    >
                      {loadingCoachId === tx.id ? <span className="animate-spin material-symbols-outlined text-[12px]">sync</span> : <span className="material-symbols-outlined text-[12px]">analytics</span>}
                      Can thiệp AI
                    </button>
                  </div>
                </div>
              </div>

              {isCoachOpen && (
                <div className="mx-2 p-6 rounded-[2rem] bg-slate-900 text-white shadow-2xl animate-in zoom-in-95 duration-500 space-y-5 border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Can thiệp Core™</span>
                    <button onClick={() => setCoachResult(null)} className="text-white/40"><span className="material-symbols-outlined text-sm">close</span></button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-[9px] font-black text-white/40 uppercase mb-1">Nhận diện</h5>
                      <p className="text-sm font-bold leading-snug">{coachResult.factIdentification}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <h5 className="text-[9px] font-black text-red-400 uppercase mb-1">Cái giá & Tác động</h5>
                      <p className="text-xs text-white/80 leading-relaxed">{coachResult.priceToPay}</p>
                      <p className="text-[10px] text-white/50 italic mt-2">{coachResult.timeImpact}</p>
                    </div>
                    <div>
                      <h5 className="text-[9px] font-black text-green-400 uppercase mb-1">Điều chỉnh cụ thể</h5>
                      <p className="text-sm font-black leading-snug text-green-400">{coachResult.specificAdjustment}</p>
                    </div>
                    <div className="pt-3 border-t border-white/10">
                      <p className="text-base font-black italic">"{coachResult.accountabilityQuestion}"</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionSection;
