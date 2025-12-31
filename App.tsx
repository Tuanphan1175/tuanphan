
import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import GrowthChartSection from './components/GrowthChartSection';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AIInsightsTool from './components/AIInsightsTool';
import TransactionSection from './components/TransactionSection';
import FinancialMastery from './components/FinancialMastery';
import GoalsSection from './components/GoalsSection';
import { t } from './translations';

const App: React.FC = () => {
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className={`relative flex h-auto w-full flex-col overflow-hidden max-w-md mx-auto shadow-2xl min-h-screen bg-background-light dark:bg-background-dark lang-vi`}>
      <Header t={t} />
      
      <main className="flex flex-col">
        {/* View Toggle */}
        <div className="flex justify-center px-5 pt-4">
          <div className="inline-flex rounded-xl bg-gray-200/50 dark:bg-gray-800 p-1 border border-gray-200 dark:border-gray-700 w-full">
            <button 
              onClick={() => setViewMode('monthly')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold transition-all ${viewMode === 'monthly' ? 'bg-white dark:bg-gray-700 text-primary shadow-sm ring-1 ring-black/5' : 'text-gray-500'}`}
            >
              <span className="material-symbols-outlined text-sm">calendar_month</span>
              {t.monthly}
            </button>
            <button 
              onClick={() => setViewMode('yearly')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold transition-all ${viewMode === 'yearly' ? 'bg-white dark:bg-gray-700 text-primary shadow-sm ring-1 ring-black/5' : 'text-gray-500'}`}
            >
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              {t.yearly}
            </button>
          </div>
        </div>

        <Hero t={t} />
        
        {/* Financial Mastery Section */}
        <FinancialMastery t={t} viewMode={viewMode} />

        {/* Financial Goals Section */}
        <GoalsSection t={t} />

        {/* Financial Management Section */}
        <TransactionSection t={t} viewMode={viewMode} />

        <Features t={t} />
        
        {/* Interactive AI Element */}
        <div className="px-5 py-6">
          <button 
            onClick={() => setIsInsightsOpen(true)}
            className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95"
          >
            <span className="material-symbols-outlined">auto_awesome</span>
            {t.aiAdviceBtn}
          </button>
        </div>

        <GrowthChartSection t={t} />
        <Testimonials t={t} />
        <Pricing t={t} />
        <FAQ t={t} />
      </main>

      <Footer t={t} />

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-5 z-50 md:hidden">
        <button 
          onClick={() => setIsInsightsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/40 transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined text-2xl">auto_awesome</span>
        </button>
      </div>

      {/* AI Modal */}
      {isInsightsOpen && (
        <AIInsightsTool t={t} onClose={() => setIsInsightsOpen(false)} />
      )}
    </div>
  );
};

export default App;
