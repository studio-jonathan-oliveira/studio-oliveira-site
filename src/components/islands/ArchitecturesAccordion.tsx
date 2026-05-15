/*
 * ArchitecturesAccordion — 4 lignes accordéon de la page /studio.
 *
 * Pourquoi un island React (cf. CLAUDE.md §4) : pattern HTML5 <details>
 * natif ne permet pas le single-open (fermer les autres) sans JS. Ici on
 * contrôle l'index ouvert via useState. Animation height en CSS pur via
 * grid-template-rows 0fr → 1fr (pas de useMeasure, pas de reflow JS).
 *
 * Hydratation client:visible — la section est en bas de page, pas
 * d'urgence à hydrater avant le LCP.
 */
import { useState } from 'react';

interface Architecture {
  titre: string;
  description: string;
}

interface Props {
  items: Architecture[];
}

export default function ArchitecturesAccordion({ items }: Props) {
  // Single-open (validation Morgan). -1 = toutes fermées au chargement.
  const [openIndex, setOpenIndex] = useState<number>(-1);

  return (
    <ul className="studio-architectures__list">
      {items.map((arch, i) => {
        const isOpen = openIndex === i;
        const panelId = `arch-panel-${i}`;
        const buttonId = `arch-button-${i}`;
        return (
          <li key={arch.titre} className="studio-architectures__item">
            <button
              id={buttonId}
              type="button"
              className="studio-architectures__summary"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
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
                'studio-architectures__collapse' +
                (isOpen ? ' studio-architectures__collapse--open' : '')
              }
            >
              <div className="studio-architectures__panel">
                <p>{arch.description}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
