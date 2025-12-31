
import React, { useState } from 'react';
import { generateContentIdea } from '../services/gemini';

interface CreatorHubProps {
  t: any;
}

const contentTypes = [
  "Vlog đời sống", "Cặp đôi", "Kể chuyện", "Chuyển hóa bản thân", "Mẹo/Kinh nghiệm",
  "Bóc tách sự thật", "Một ngày của tôi", "Hỏi đáp (Q&A)", "Review/Trải nghiệm", "Giáo dục tư duy",
  "Hài tình huống", "Phỏng vấn ngẫu nhiên", "Thử thách 7-30 ngày", "Hậu trường", "Lời khuyên đắt giá",
  "Bắt trend âm thanh", "Kể chuyện khách hàng", "Một phút thật lòng", "Quan điểm gây tranh luận", "Ước gì biết sớm hơn"
];

const CreatorHub: React.FC<CreatorHubProps> = ({ t }) => {
  const [niche, setNiche] = useState('');
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!niche) return;
    setLoading(true);
    try {
      const res = await generateContentIdea(niche, t.lang);
      setIdea(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-5 py-10 bg-white dark:bg-[#161b22]">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 self-start rounded-full bg-blue-500/10 px-3 py-1">
          <span className="material-symbols-outlined text-blue-500 text-sm">rocket_launch</span>
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{t.algoTitle}</span>
        </div>
        <h2 className="text-2xl font-bold">{t.creatorHub}</h2>
        <p className="text-sm text-gray-500">{t.authenticAlgo}</p>
      </div>

      <div className="grid grid-cols-4 gap-2 h-20">
        <div className="bg-blue-500 rounded-xl flex flex-col items-center justify-center text-white p-1">
          <span className="text-xs font-bold">60%</span>
          <span className="text-[8px] text-center uppercase leading-tight">{t.expert}</span>
        </div>
        <div className="bg-purple-500 rounded-xl flex flex-col items-center justify-center text-white p-1">
          <span className="text-xs font-bold">20%</span>
          <span className="text-[8px] text-center uppercase leading-tight">{t.story}</span>
        </div>
        <div className="bg-orange-500 rounded-xl flex flex-col items-center justify-center text-white p-1">
          <span className="text-xs font-bold">10%</span>
          <span className="text-[8px] text-center uppercase leading-tight">{t.value}</span>
        </div>
        <div className="bg-green-500 rounded-xl flex flex-col items-center justify-center text-white p-1">
          <span className="text-xs font-bold">10%</span>
          <span className="text-[8px] text-center uppercase leading-tight">{t.sales}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5 rounded-2xl border-2 border-blue-500/20 bg-blue-500/5">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t.nichePlaceholder}</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="flex-1 bg-white dark:bg-gray-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder={t.lang === 'vi' ? "Ví dụ: Tài chính, Nấu ăn, Du lịch..." : "e.g. Finance, Cooking, Travel..."}
            />
            <button 
              onClick={handleGenerate}
              disabled={loading || !niche}
              className="bg-blue-600 text-white px-4 rounded-xl disabled:opacity-50 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">{loading ? 'sync' : 'auto_awesome'}</span>
            </button>
          </div>
        </div>

        {idea && (
          <div className="flex flex-col gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-500/10 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start">
              <span className="bg-blue-500/10 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                {idea.strategyTag}
              </span>
              <span className="text-[10px] font-bold text-gray-400">#{idea.contentType}</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Câu Hook (3s đầu)</h4>
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">"{idea.hook}"</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Dàn ý nội dung</h4>
              <ul className="text-[12px] text-gray-600 dark:text-gray-300 list-disc pl-4 space-y-1">
                {idea.scriptOutline.map((point: string, idx: number) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.types20}</h3>
        <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
          {contentTypes.map((type, i) => (
            <div key={i} className="flex-shrink-0 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg text-[10px] font-bold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
              {type}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatorHub;
