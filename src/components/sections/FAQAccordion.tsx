"use client";

import { useState } from "react";
import { faqs } from "@/data/home";

export function FAQAccordion() {
  const [expanded, setExpanded] = useState<boolean[]>(() => faqs.map(() => true));

  return (
    <div className="flex w-full flex-col gap-3">
      {faqs.map((faq, index) => (
        <div key={faq.question} data-faq-item className="rounded-xl border border-line bg-white p-5">
          <h3>
            <button
              type="button"
              id={`faq-question-${index}`}
              aria-expanded={expanded[index]}
              aria-controls={`faq-answer-${index}`}
              onClick={() => setExpanded((current) => current.map((open, item) => item === index ? !open : open))}
              className="flex w-full items-start justify-between gap-4 text-left text-sm leading-[1.5] font-extrabold text-ink"
            >
              {faq.question}
              <span aria-hidden="true" className="faq-symbol relative flex size-[18px] shrink-0 items-center justify-center text-primary" data-open={expanded[index]}><span className="absolute h-px w-[10px] bg-current" /><span className="faq-symbol-vertical absolute h-px w-[10px] bg-current" /></span>
            </button>
          </h3>
          <div id={`faq-answer-${index}`} aria-labelledby={`faq-question-${index}`} aria-hidden={!expanded[index]} inert={!expanded[index]} className="faq-panel grid" data-open={expanded[index]}>
            <div className="min-h-0 overflow-hidden"><p className="pt-3 text-[13px] leading-[1.65] text-muted">{faq.answer}</p></div>
          </div>
        </div>
      ))}
    </div>
  );
}
