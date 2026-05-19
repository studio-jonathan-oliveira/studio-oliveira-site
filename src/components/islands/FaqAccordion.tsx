/*
 * FaqAccordion — accordéon FAQ partagé pour toutes les pages.
 *
 * Pattern animation identique à `ArchitecturesAccordion` de /studio
 * (retour Morgan 2026-05-19 « j'aimerai que tu applique la même animation
 * de dépliage / repliage dans les questions FAQ »).
 *
 * Mécanique :
 *   - height JS-measured via `useLayoutEffect` + `scrollHeight` (au lieu de
 *     max-height fixe ou native <details>), pour que la transition couvre
 *     100 % du mouvement visible
 *   - single-open : ouvrir une question ferme la précédente
 *   - close 0.26s cubic-bezier ease-in-out, open 0.32s spring-out tendu
 *   - icône + qui rotate 45° → ×
 *   - wave reveal mot par mot : chaque mot a `--i` (index) sur lequel le
 *     CSS calcule le `transition-delay` pour staggerer l'apparition
 *     (« le texte apparaît petit à petit » comme dans /studio)
 *   - accessibilité aria-expanded + aria-controls + role="region"
 *
 * Hydratation `client:visible` — FAQ toujours en bas de page, hors LCP.
 */
import { useLayoutEffect, useRef, useState } from 'react';

export interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  items: ReadonlyArray<FaqItem>;
}

interface RowProps {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqRow({ item, index, isOpen, onToggle }: RowProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number>(0);

  useLayoutEffect(() => {
    if (!panelRef.current) return;
    if (isOpen) {
      setHeight(panelRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <li className="faq-acc__item">
      <button
        id={buttonId}
        type="button"
        className="faq-acc__summary"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="faq-acc__question">{item.question}</span>
        <span
          className={'faq-acc__icon' + (isOpen ? ' faq-acc__icon--open' : '')}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={'faq-acc__collapse' + (isOpen ? ' faq-acc__collapse--open' : '')}
        style={{ height: `${height}px` }}
      >
        <div ref={panelRef} className="faq-acc__panel">
          {/* Wave reveal : chaque mot a une custom property --i pour
              staggerer le delay d'apparition via CSS pur (pattern
              /studio ArchitecturesAccordion). */}
          <p className="faq-acc__answer">
            {item.answer.split(/(\s+)/).map((token, wi) => {
              if (/^\s+$/.test(token)) return token;
              return (
                <span
                  key={wi}
                  className="faq-acc__word"
                  style={{ ['--i' as never]: wi } as React.CSSProperties}
                >
                  {token}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </li>
  );
}

export default function FaqAccordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number>(-1);

  return (
    <ul className="faq-acc__list">
      {items.map((item, i) => (
        <FaqRow
          key={item.question}
          item={item}
          index={i}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
        />
      ))}
    </ul>
  );
}
