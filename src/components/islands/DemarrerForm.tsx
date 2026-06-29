/*
 * DemarrerForm — formulaire de qualification (island React) pour
 * /demarrer-un-projet.
 *
 * Justification client (CLAUDE.md §4) : interactivité requise.
 *   - Validation live + états (idle/submitting/success/error)
 *   - Upload fichiers multi (PDF/JPG/PNG) → conversion base64 client
 *     puis envoi via Astro Actions + Resend attachments
 *   - Intégration <Turnstile>
 *
 * Style : trame Jonathan 2026-05-22. Inputs underline-only cream sur
 * fond rouge plein, labels UPPERCASE Bold, bouton ENVOYER ↗ lien
 * underline aligné droite.
 *
 * Champs (verbatim trame) :
 *   - NOM COMPLET (full)
 *   - EMAIL | TELEPHONE
 *   - LOCALISATION | SURFACE
 *   - BUDGET TRAVAUX | PERIODE TRAVAUX SOUHAITE
 *   - JOINDRE DES DOCUMENTS (PDF, JPG, PNG)
 *   - ENVOYER ↗
 */

import { useEffect, useRef, useState } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { actions, isInputError } from 'astro:actions';
import {
  demarrerSchema,
  SURFACE_OPTIONS,
  BUDGET_OPTIONS,
  PERIODE_OPTIONS,
  MAX_FILES,
  MAX_FILE_BYTES,
  MAX_TOTAL_BYTES,
  ACCEPTED_MIME,
  type SurfaceKey,
  type BudgetKey,
  type PeriodeKey,
} from '@/actions';

type FormState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

interface FormValues {
  nom: string;
  email: string;
  telephone: string;
  localisation: string;
  surface: SurfaceKey | '';
  budget: BudgetKey | '';
  periode: PeriodeKey | '';
}

interface AttachedFile {
  filename: string;
  size: number;
  type: string;
  base64: string;
}

const INITIAL: FormValues = {
  nom: '',
  email: '',
  telephone: '',
  localisation: '',
  surface: '',
  budget: '',
  periode: '',
};

const SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined;

// Casse normale (1re lettre maj) — plus d'uppercase (Morgan 2026-06-05).
const labelClass =
  'block font-[family-name:var(--font-heading)] text-[15px] md:text-[16px] font-bold tracking-[0.01em] text-[var(--color-cream)]';

// Inputs : underline cream uniquement, fond transparent (le bloc rouge porte
// le fond). Forçage Bold strict (grammaire 200/700) ET pour éviter la
// fragilité d'ExtraLight sub-pixel sur rouge plein saturé.
// Erreur signalée par bordure cream épaissie (border-b-2) — éviter ink/noir
// sur rouge qui ne passe pas WCAG AA (~3.9:1).
const inputClass =
  // Liseret BAS + DROIT arrondi au coin bas-droite (retour Jonathan 2026-06-16 :
  // « les liserets du formulaire en arrondi à droite comme les menus déroulés »).
  'mt-2 block w-full border-0 border-r border-b border-[color-mix(in_oklab,var(--color-cream)_55%,transparent)] rounded-br-[clamp(12px,1.8vw,20px)] bg-transparent px-0 pt-1 pb-2 ' +
  // Valeur saisie/sélectionnée en EXTRA-LIGHT (retour Jonathan 2026-06-16 :
  // « le texte dans les cases en extra light, pas en gras, pour garder les
  // titres des déroulés en évidence »). Les labels restent en gras.
  'font-[family-name:var(--font-heading)] text-[length:var(--text-base)] font-extralight text-[var(--color-cream)] ' +
  'placeholder:font-extralight placeholder:text-[color-mix(in_oklab,var(--color-cream)_75%,transparent)] ' +
  'focus:border-[var(--color-cream)] focus:outline-none focus:ring-0 ' +
  'aria-[invalid=true]:border-b-2 aria-[invalid=true]:border-[var(--color-cream)]';

const selectClass = inputClass + ' appearance-none cursor-pointer';

// Message d'erreur en pastille INK (fond noir) avec texte cream : contraste
// largement ≥ 7:1 (AAA). Évite cream/ink direct sur rouge plein.
const errorClass =
  'mt-2 inline-block bg-[var(--color-cream)] px-2.5 py-1 font-[family-name:var(--font-heading)] text-[12px] font-bold tracking-[0.01em] text-[var(--color-ink)]';

// Style des <option> du dropdown : le navigateur les rend selon ses propres
// styles, pas l'inline `bg-transparent text-cream` du `<select>`. Sans forcer
// fond/couleur, les options apparaissent illisibles (cream sur cream).
// Inter Bold (retour Jonathan 2026-05-22 : "écritures en inter gras, fond
// blanc ou noir à voir" — choix cream pour rester lisible sur le rouge).
// Options : texte MAUVE sur fond NOIR + liseret entre choix (Morgan 2026-06-05).
// NB : le liseret <option> n'est rendu que par certains navigateurs (Firefox) —
// best-effort, le natif <select> ne permet pas un séparateur garanti.
const optionStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-ink)',
  color: 'var(--color-cream)',
  fontFamily: 'var(--font-heading), sans-serif',
  fontWeight: 200,
  padding: '0.5rem 0.75rem',
  borderBottom: '1px solid color-mix(in oklab, var(--color-cream) 45%, transparent)',
};

function bytesHuman(n: number): string {
  if (n < 1024) return `${n} o`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} ko`;
  return `${(n / 1024 / 1024).toFixed(1)} Mo`;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // strip "data:<mime>;base64," prefix
      const idx = result.indexOf(',');
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
}

export default function DemarrerForm(): React.JSX.Element {
  const [values, setValues] = useState<FormValues>(INITIAL);
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [fileError, setFileError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [token, setToken] = useState<string>('');
  const [state, setState] = useState<FormState>({ kind: 'idle' });
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const successRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (state.kind === 'success') successRef.current?.focus();
  }, [state.kind]);

  // NB : le magnétique du bouton ENVOYER est géré par un <script> Astro dans
  // DemarrerRedBlock.astro (ciblant [data-magnetic-cta]), PAS ici — il tourne au
  // chargement indépendamment de l'hydratation de cette island (Morgan
  // 2026-06-08 : le magnétique React « ne bougeait pas » → suspicion d'hydratation).

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]): void {
    setValues((v) => ({ ...v, [key]: value }));
    if (fieldErrors[key]) setFieldErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleFiles(list: FileList | null): Promise<void> {
    setFileError('');
    if (!list || list.length === 0) return;

    const incoming = Array.from(list);
    if (files.length + incoming.length > MAX_FILES) {
      setFileError(`5 fichiers maximum (${files.length} déjà attachés).`);
      return;
    }

    for (const f of incoming) {
      if (
        !(ACCEPTED_MIME as readonly string[]).includes(f.type) &&
        !/\.(pdf|jpe?g|png)$/i.test(f.name)
      ) {
        setFileError(`Format refusé : ${f.name} (PDF, JPG ou PNG uniquement).`);
        return;
      }
      if (f.size > MAX_FILE_BYTES) {
        setFileError(`${f.name} trop volumineux (max ${bytesHuman(MAX_FILE_BYTES)}).`);
        return;
      }
    }

    const totalAfter =
      files.reduce((a, f) => a + f.size, 0) + incoming.reduce((a, f) => a + f.size, 0);
    if (totalAfter > MAX_TOTAL_BYTES) {
      setFileError(`Poids total trop élevé (max ${bytesHuman(MAX_TOTAL_BYTES)}).`);
      return;
    }

    try {
      const encoded: AttachedFile[] = await Promise.all(
        incoming.map(async (f) => ({
          filename: f.name,
          size: f.size,
          type: f.type || 'application/octet-stream',
          base64: await fileToBase64(f),
        })),
      );
      setFiles((prev) => [...prev, ...encoded]);
    } catch {
      setFileError('Impossible de lire le fichier — réessayez.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function removeFile(index: number): void {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError('');
  }

  function validateClient(): boolean {
    const parsed = demarrerSchema.safeParse({
      nom: values.nom,
      email: values.email,
      telephone: values.telephone || undefined,
      localisation: values.localisation,
      surface: values.surface,
      budget: values.budget || undefined,
      periode: values.periode || undefined,
      documents: files.map((f) => ({
        filename: f.filename,
        size: f.size,
        type: f.type,
        base64: f.base64,
      })),
      turnstileToken: token || 'PENDING',
    });
    if (parsed.success) {
      setFieldErrors({});
      return true;
    }
    const next: Partial<Record<keyof FormValues, string>> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0];
      if (typeof k === 'string' && k in INITIAL) {
        next[k as keyof FormValues] = issue.message;
      }
    }
    setFieldErrors(next);
    return false;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (state.kind === 'submitting') return;
    if (!validateClient()) return;
    if (!token) {
      setState({
        kind: 'error',
        message: 'Vérification anti-spam en cours — patientez quelques secondes.',
      });
      return;
    }

    setState({ kind: 'submitting' });

    const { data, error } = await actions.demarrer({
      nom: values.nom,
      email: values.email,
      telephone: values.telephone || undefined,
      localisation: values.localisation,
      surface: values.surface as SurfaceKey,
      budget: values.budget as BudgetKey,
      periode: values.periode as PeriodeKey,
      documents: files,
      turnstileToken: token,
    });

    if (error) {
      if (isInputError(error)) {
        const fields = error.fields as Partial<Record<keyof FormValues, string[]>>;
        const next: Partial<Record<keyof FormValues, string>> = {};
        (Object.keys(fields) as Array<keyof FormValues>).forEach((k) => {
          const arr = fields[k];
          if (arr && arr[0]) next[k] = arr[0];
        });
        setFieldErrors(next);
        setState({ kind: 'error', message: 'Merci de corriger les champs signalés.' });
      } else {
        setState({ kind: 'error', message: error.message || 'Une erreur est survenue.' });
      }
      turnstileRef.current?.reset();
      setToken('');
      return;
    }

    if (data?.ok) {
      setState({ kind: 'success' });
      setValues(INITIAL);
      setFiles([]);
      setFieldErrors({});
      turnstileRef.current?.reset();
      setToken('');
    }
  }

  if (state.kind === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="border border-[color-mix(in_oklab,var(--color-cream)_45%,transparent)] p-10 outline-none"
      >
        <p className="font-[family-name:var(--font-heading)] text-[12px] font-bold tracking-[0.18em] text-[var(--color-cream)] uppercase">
          Demande envoyée
        </p>
        <p className="mt-4 font-[family-name:var(--font-heading)] text-[length:var(--text-2xl)] leading-snug font-extralight text-[var(--color-cream)]">
          Merci, le studio revient vers vous pour engager l'appel de qualification.
        </p>
        <button
          type="button"
          onClick={() => setState({ kind: 'idle' })}
          className="mt-8 font-[family-name:var(--font-heading)] text-[12px] font-bold tracking-[0.18em] text-[var(--color-cream)] uppercase underline underline-offset-4 hover:opacity-80"
        >
          Envoyer une nouvelle demande
        </button>
      </div>
    );
  }

  const submitting = state.kind === 'submitting';

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={submitting || undefined}>
      <div className="space-y-8 md:space-y-10">
        {/* NOM COMPLET — full width */}
        <div>
          <label htmlFor="df-nom" className={labelClass}>
            Nom complet
          </label>
          <input
            id="df-nom"
            name="nom"
            type="text"
            autoComplete="name"
            required
            value={values.nom}
            onChange={(e) => update('nom', e.target.value)}
            aria-invalid={Boolean(fieldErrors.nom) || undefined}
            aria-describedby={fieldErrors.nom ? 'df-nom-err' : undefined}
            className={inputClass}
            disabled={submitting}
          />
          {fieldErrors.nom && (
            <p id="df-nom-err" className={errorClass}>
              {fieldErrors.nom}
            </p>
          )}
        </div>

        {/* EMAIL | TELEPHONE */}
        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          <div>
            <label htmlFor="df-email" className={labelClass}>
              Email
            </label>
            <input
              id="df-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={values.email}
              onChange={(e) => update('email', e.target.value)}
              aria-invalid={Boolean(fieldErrors.email) || undefined}
              aria-describedby={fieldErrors.email ? 'df-email-err' : undefined}
              className={inputClass}
              disabled={submitting}
            />
            {fieldErrors.email && (
              <p id="df-email-err" className={errorClass}>
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="df-tel" className={labelClass}>
              Téléphone
            </label>
            <input
              id="df-tel"
              name="telephone"
              type="tel"
              autoComplete="tel"
              value={values.telephone}
              onChange={(e) => update('telephone', e.target.value)}
              aria-invalid={Boolean(fieldErrors.telephone) || undefined}
              aria-describedby={fieldErrors.telephone ? 'df-tel-err' : undefined}
              className={inputClass}
              disabled={submitting}
            />
            {fieldErrors.telephone && (
              <p id="df-tel-err" className={errorClass}>
                {fieldErrors.telephone}
              </p>
            )}
          </div>
        </div>

        {/* LOCALISATION | SURFACE */}
        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          <div>
            <label htmlFor="df-loc" className={labelClass}>
              Localisation
            </label>
            <input
              id="df-loc"
              name="localisation"
              type="text"
              required
              placeholder="Ville, code postal"
              value={values.localisation}
              onChange={(e) => update('localisation', e.target.value)}
              aria-invalid={Boolean(fieldErrors.localisation) || undefined}
              aria-describedby={fieldErrors.localisation ? 'df-loc-err' : undefined}
              className={inputClass}
              disabled={submitting}
            />
            {fieldErrors.localisation && (
              <p id="df-loc-err" className={errorClass}>
                {fieldErrors.localisation}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="df-surf" className={labelClass}>
              Surface
            </label>
            <select
              id="df-surf"
              name="surface"
              required
              value={values.surface}
              onChange={(e) => update('surface', e.target.value as SurfaceKey)}
              aria-invalid={Boolean(fieldErrors.surface) || undefined}
              aria-describedby={fieldErrors.surface ? 'df-surf-err' : undefined}
              className={selectClass}
              disabled={submitting}
            >
              <option value="" disabled style={optionStyle}>
                Sélectionner une surface…
              </option>
              {SURFACE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} style={optionStyle}>
                  {opt.label}
                </option>
              ))}
            </select>
            {fieldErrors.surface && (
              <p id="df-surf-err" className={errorClass}>
                {fieldErrors.surface}
              </p>
            )}
          </div>
        </div>

        {/* BUDGET TRAVAUX | PERIODE TRAVAUX SOUHAITE */}
        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          <div>
            <label htmlFor="df-budget" className={labelClass}>
              Budget travaux
            </label>
            <select
              id="df-budget"
              name="budget"
              required
              value={values.budget}
              onChange={(e) => update('budget', e.target.value as BudgetKey)}
              aria-invalid={Boolean(fieldErrors.budget) || undefined}
              aria-describedby={fieldErrors.budget ? 'df-budget-err' : undefined}
              className={selectClass}
              disabled={submitting}
            >
              <option value="" disabled style={optionStyle}>
                Sélectionner une fourchette…
              </option>
              {BUDGET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} style={optionStyle}>
                  {opt.label}
                </option>
              ))}
            </select>
            {fieldErrors.budget && (
              <p id="df-budget-err" className={errorClass}>
                {fieldErrors.budget}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="df-periode" className={labelClass}>
              Période travaux souhaitée
            </label>
            <select
              id="df-periode"
              name="periode"
              required
              value={values.periode}
              onChange={(e) => update('periode', e.target.value as PeriodeKey)}
              aria-invalid={Boolean(fieldErrors.periode) || undefined}
              aria-describedby={fieldErrors.periode ? 'df-periode-err' : undefined}
              className={selectClass}
              disabled={submitting}
            >
              <option value="" disabled style={optionStyle}>
                Sélectionner une échéance…
              </option>
              {PERIODE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} style={optionStyle}>
                  {opt.label}
                </option>
              ))}
            </select>
            {fieldErrors.periode && (
              <p id="df-periode-err" className={errorClass}>
                {fieldErrors.periode}
              </p>
            )}
          </div>
        </div>

        {/* JOINDRE DES DOCUMENTS — input file natif déclenché par un <label>
            cliquable (plus fiable que `.click()` programmatique, jamais bloqué
            par le navigateur, accessible nativement clavier + AT). */}
        <div>
          <p className={labelClass}>
            Joindre des documents{' '}
            <span className="opacity-75">(PDF, JPG, PNG — max 3 Mo au total)</span>
          </p>
          <input
            ref={fileInputRef}
            id="df-files"
            name="documents"
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            onChange={(e) => void handleFiles(e.target.files)}
            className="sr-only"
            disabled={submitting || files.length >= MAX_FILES}
          />
          <div className="mt-2 flex flex-col gap-3 border-b border-[color-mix(in_oklab,var(--color-cream)_55%,transparent)] pt-1 pb-2">
            <label
              htmlFor="df-files"
              aria-disabled={submitting || files.length >= MAX_FILES || undefined}
              className="cursor-pointer self-start font-[family-name:var(--font-heading)] text-[length:var(--text-base)] font-bold text-[var(--color-cream)] underline underline-offset-4 hover:opacity-85 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            >
              {files.length === 0
                ? 'Sélectionner des fichiers'
                : `Ajouter (${files.length}/${MAX_FILES})`}
            </label>
            {files.length > 0 && (
              <ul className="flex flex-col gap-2">
                {files.map((f, i) => (
                  <li
                    key={`${f.filename}-${i}`}
                    className="flex items-center justify-between gap-4 font-[family-name:var(--font-heading)] text-[13px] font-normal text-[var(--color-cream)]"
                  >
                    <span className="truncate">
                      {f.filename} <span className="opacity-60">({bytesHuman(f.size)})</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="shrink-0 text-[11px] font-bold tracking-[0.12em] text-[var(--color-cream)] uppercase underline underline-offset-4 hover:opacity-70"
                      aria-label={`Retirer ${f.filename}`}
                    >
                      Retirer
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {fileError && <p className={errorClass}>{fileError}</p>}
        </div>

        {/* Turnstile — mode interaction-only : widget invisible par défaut,
            n'apparaît que si Cloudflare détecte un comportement suspect.
            Sans clé publique configurée, on dégrade proprement (message + bouton
            désactivé) au lieu de bloquer silencieusement sur « vérification en
            cours » — alignement sur ContactForm (audit go-live 2026-06-29). */}
        {SITE_KEY ? (
          <Turnstile
            ref={turnstileRef}
            siteKey={SITE_KEY}
            options={{ theme: 'dark', size: 'flexible', appearance: 'interaction-only' }}
            onSuccess={(t) => setToken(t)}
            onExpire={() => setToken('')}
            onError={() => setToken('')}
          />
        ) : (
          <p className={errorClass}>
            Vérification anti-spam non configurée. Merci de nous contacter par téléphone au 06 61 08
            84 44.
          </p>
        )}

        {/* Erreur globale — pastille ink/cream pour contraste WCAG AAA sur rouge. */}
        {state.kind === 'error' && (
          <div
            role="alert"
            className="bg-[var(--color-cream)] px-5 py-4 font-[family-name:var(--font-heading)] text-sm font-bold text-[var(--color-ink)]"
          >
            {state.message}
          </div>
        )}

        {/* ENVOYER AU STUDIO — pill NOIR, texte crème, magnétique (trame).
            Flèche retirée sitewide (Morgan 2026-06-05). */}
        <div className="flex justify-center pt-6">
          <button
            data-magnetic-cta
            type="submit"
            disabled={submitting || !SITE_KEY}
            className="group inline-flex items-center gap-3 rounded-[14px] border border-[var(--color-cream)] bg-[var(--color-cream)] px-8 py-4 font-[family-name:var(--font-heading)] text-[15px] font-bold tracking-[0.04em] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] disabled:cursor-not-allowed"
          >
            <span>{submitting ? 'Envoi en cours…' : 'Envoyer au studio'}</span>
          </button>
        </div>

        {/* Information RGPD au point de collecte (art. 13). */}
        <p className="text-center font-[family-name:var(--font-heading)] text-[12px] font-normal text-[var(--color-cream)]/55">
          En envoyant ce formulaire, vous acceptez le traitement de vos données pour répondre à
          votre demande.{' '}
          <a
            href="/confidentialite"
            className="underline underline-offset-2 hover:text-[var(--color-cream)]/80"
          >
            Politique de confidentialité
          </a>
          .
        </p>
      </div>
    </form>
  );
}
