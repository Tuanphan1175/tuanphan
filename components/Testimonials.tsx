
import React from 'react';

const Testimonials: React.FC<{ t: any }> = ({ t }) => {
  const testimonials = [
    {
      name: 'Sarah J.',
      img: 'https://picsum.photos/seed/sarah/100/100',
      text: t.lang === 'vi' ? '"Ứng dụng duy nhất thực sự giúp tôi tiết kiệm mua nhà. Gợi ý từ AI cực kỳ chính xác."' : '"The only app that actually helped me save for a house. The AI suggestions are spot on."',
      rating: 5
    },
    {
      name: 'Mike T.',
      img: 'https://picsum.photos/seed/mike/100/100',
      text: t.lang === 'vi' ? '"Cuối cùng cũng có một ứng dụng quản lý không giống như đang làm việc với bảng tính."' : '"Finally, a budget tracker that doesn\'t feel like a spreadsheet job. Love the auto-sorting."',
      rating: 5
    }
  ];

  return (
    <div className="flex flex-col gap-6 py-10 bg-white dark:bg-[#161b22]">
      <div className="px-5">
        <h2 className="text-2xl font-bold leading-tight">{t.testimonialsTitle}</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto px-5 pb-6 hide-scrollbar snap-x snap-mandatory">
        {testimonials.map((testi, i) => (
          <div key={i} className="flex min-w-[280px] snap-center flex-col gap-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1c1f26] p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${testi.img}")` }}></div>
              <div>
                <p className="text-sm font-bold">{testi.name}</p>
                <div className="flex gap-0.5 text-yellow-400">
                  {[...Array(5)].map((_, idx) => (
                    <span key={idx} className={`material-symbols-outlined text-[16px] ${idx < testi.rating ? 'fill-current' : ''}`}>star</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{testi.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
