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
 *   - icône flèche Jonathan `/brand/fleche-white.webp` (signature DA, refonte
 *     2026-05-21 — remplace l'ancien `+` qui rotate)
 *   - réponses MULTI-PARAGRAPHES via split sur `\n\n` (refonte 2026-05-21
 *     pour soutenir les Q3 longues de Morgan) ; chaque paragraphe garde son
 *     propre wave reveal mot par mot (index `--i` global cumulatif pour que
 *     la cascade soit continue d'un paragraphe à l'autre).
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

  // Split en paragraphes sur les `\n\n` (compatible textes Morgan multi-blocs).
  // L'index `--i` reste cumulatif d'un paragraphe à l'autre pour que le wave
  // reveal soit fluide (pas de reset entre paragraphes).
  const paragraphs = item.answer.split(/\n{2,}/).filter((p) => p.trim().length > 0);
  let wordCounter = 0;

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
        <img
          src="/brand/fleche-white.webp"
          alt=""
          aria-hidden="true"
          className={'faq-acc__icon' + (isOpen ? ' faq-acc__icon--open' : '')}
          width="32"
          height="32"
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={'faq-acc__collapse' + (isOpen ? ' faq-acc__collapse--open' : '')}
        style={{ height: `${height}px` }}
      >
        <div ref={panelRef} className="faq-acc__panel">
          {paragraphs.map((para, pi) => (
            <p key={pi} className="faq-acc__answer">
              {para.split(/(\s+)/).map((token, ti) => {
                if (/^\s+$/.test(token)) return token;
                const wi = wordCounter++;
                return (
                  <span
                    key={ti}
                    className="faq-acc__word"
                    style={{ ['--i' as never]: wi } as React.CSSProperties}
                  >
                    {token}
                  </span>
                );
              })}
            </p>
          ))}
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
