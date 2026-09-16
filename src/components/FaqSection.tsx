import React, { useState } from 'react';
import { FAQS } from '../data/mockData';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs-section" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1e3a8a] text-xs font-bold mb-2 border border-blue-200">
            <HelpCircle className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Everything you need to know about booking verified appointments on Practo.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                id={`faq-item-${idx}`}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? 'border-blue-300 bg-blue-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-blue-200'
                }`}
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    {faq.question}
                  </span>
                  <div className={`w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-[#1e3a8a] shrink-0 transition-transform ${
                    isOpen ? 'rotate-180 bg-blue-100 text-[#1e3a8a]' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-blue-100/60 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support helper */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Still have questions or facing difficulties with a booking?</span>
          <a
            href="tel:18004257228"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#0284c7] text-white font-bold hover:from-[#172554] hover:to-[#0369a1] transition-colors shadow-sm"
          >
            Call Support 1800-425-7228
          </a>
        </div>

      </div>
    </section>
  );
};
