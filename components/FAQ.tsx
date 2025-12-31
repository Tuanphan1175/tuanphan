
import React from 'react';

const FAQ: React.FC<{ t: any }> = ({ t }) => {
  const faqs = t.lang === 'vi' ? [
    {
      q: 'Dữ liệu ngân hàng của tôi có an toàn không?',
      a: 'Chắc chắn rồi. Chúng tôi sử dụng mã hóa 256-bit chuẩn ngân hàng cho tất cả việc truyền tải và lưu trữ dữ liệu. Chúng tôi không bao giờ lưu trữ thông tin đăng nhập ngân hàng của bạn.'
    },
    {
      q: 'Phân loại bằng AI hoạt động thế nào?',
      a: 'Các thuật toán máy học nâng cao của chúng tôi phân tích mô tả giao dịch để tự động gán danh mục. Nó học hỏi từ các chỉnh sửa thủ công của bạn theo thời gian.'
    }
  ] : [
    {
      q: 'Is my banking data secure?',
      a: 'Absolutely. We use bank-level 256-bit encryption for all data transmission and storage. We never store your bank login credentials.'
    },
    {
      q: 'How does the AI categorization work?',
      a: 'Our advanced machine learning algorithms analyze transaction descriptions and merchant codes to automatically assign categories. It learns from your manual corrections over time.'
    }
  ];

  return (
    <div className="flex flex-col gap-8 px-5 py-12 bg-white dark:bg-[#161b22] mb-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold leading-tight">{t.faqTitle}</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{t.faqDesc}</p>
      </div>
      <div className="flex flex-col gap-4">
        {faqs.map((faq, i) => (
          <details key={i} className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1c1f26] overflow-hidden transition-all duration-300">
            <summary className="flex cursor-pointer items-center justify-between p-5 font-bold text-gray-900 dark:text-white transition-colors hover:text-primary focus:outline-none">
              <span>{faq.q}</span>
              <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180">expand_more</span>
            </summary>
            <div className="px-5 pb-5 pt-0 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>{faq.a}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
