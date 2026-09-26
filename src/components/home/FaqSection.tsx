import { useState } from 'react';
import { Plus } from 'lucide-react';
import { FAQS } from '../../content/faq';
import './FaqSection.css';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      <span className="eyebrow-script">antes de venir</span>
      <h2>Preguntas frecuentes</h2>
      <div className="faq-list" style={{ marginTop: 22 }}>
        {FAQS.map((faq, index) => {
          const open = openIndex === index;
          return (
            <div className="faq-item" key={faq.question}>
              <button className="faq-item__question" onClick={() => setOpenIndex(open ? null : index)}>
                <span className="faq-item__question-text">{faq.question}</span>
                <span className={`faq-item__icon ${open ? 'faq-item__icon--open' : ''}`}>
                  <Plus size={17} />
                </span>
              </button>
              <div className={`faq-item__answer ${open ? 'faq-item__answer--open' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
