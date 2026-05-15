/*
 * ArchitecturesAccordion — 4 lignes accordéon de la page /studio.
 *
 * Pourquoi un island React (cf. CLAUDE.md §4) : pattern HTML5 <details>
 * natif ne permet pas le single-open (fermer les autres) sans JS.
 *
 * Animation v8 2026-05-15 — fluidité max (retour Morgan « encore plus
 * fluide, plus rapide ») : on mesure la hauteur réelle du panneau via
 * ref + useLayoutEffect, et on anime `height` (et pas max-height) entre
 * 0 et la hauteur exacte. Conséquence : la transition couvre 100% du
 * mouvement visible, plus de "temps mort" comme avec max-height: 60rem.
 *
 * Hydratation client:visible — section en bas de page, hors LCP.
 */
import { useLayoutEffect, useRef, useState } from 'react';

interface Architecture {
  titre: string;
  description: string;
}

interface Props {
  items: Architecture[];
}

interface RowProps {
  arch: Architecture;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionRow({ arch, index, isOpen, onToggle }: RowProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  // Hauteur cible mesurée pour la transition. 0 quand fermé.
  const [height, setHeight] = useState<number>(0);

  useLayoutEffect(() => {
    if (!panelRef.current) return;
    if (isOpen) {
      // Hauteur naturelle du contenu (incluant padding) → cible.
      setHeight(panelRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  const panelId = `arch-panel-${index}`;
  const buttonId = `arch-button-${index}`;

  return (
    <li className="studio-architectures__item">
      <button
        id={buttonId}
        type="button"
        className="studio-architectures__summary"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="studio-architectures__title">{arch.titre}</span>
        <span
          className={
            'studio-architectures__icon' + (isOpen ? ' studio-architectures__icon--open' : '')
          }
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={
          'studio-architectures__collapse' + (isOpen ? ' studio-architectures__collapse--open' : '')
        }
        style={{ height: `${height}px` }}
      >
        <div ref={panelRef} className="studio-architectures__panel">
          {/* Wave reveal : chaque mot a une custom property --i pour
              staggerer le delay d'apparition via CSS pur. */}
          <p className="studio-architectures__text">
            {arch.description.split(/(\s+)/).map((token, wi) => {
              if (/^\s+$/.test(token)) return token;
              return (
                <span
                  key={wi}
                  className="studio-architectures__word"
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

export default function ArchitecturesAccordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number>(-1);

  return (
    <ul className="studio-architectures__list">
      {items.map((arch, i) => (
        <AccordionRow
          key={arch.titre}
          arch={arch}
          index={i}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
        />
      ))}
    </ul>
  );
}
