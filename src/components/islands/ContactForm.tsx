/*
 * ContactForm — formulaire de contact qualifié (island React).
 *
 * Justification client (CLAUDE.md §4) : interactivité requise.
 *   - Validation live + états (idle/submitting/success/error)
 *   - Intégration <Turnstile> (widget React @marsidev/react-turnstile)
 *   - Appel `actions.contact()` via le client Astro Actions
 *
 * Style : sobre, designbyad-like. Labels font-mono uppercase tracking large,
 * inputs minimal en bordure basse, focus visible. Aligné sur la palette
 * cream/ink du site.
 */

import { useEffect, useRef, useState } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { actions, isInputError } from 'astro:actions';
import { contactSchema, TYPOLOGIE_LABELS, type TypologieContact } from '@/actions';

type FormState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

interface FormValues {
  nom: string;
  email: string;
  telephone: string;
  typologie: TypologieContact | '';
  zone: string;
  message: string;
}

const INITIAL: FormValues = {
  nom: '',
  email: '',
  telephone: '',
  typologie: '',
  zone: '',
  message: '',
};

const TYPOLOGIE_KEYS = Object.keys(TYPOLOGIE_LABELS) as TypologieContact[];

const labelClass =
  'block font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-ink)]/60';

const inputBaseClass =
  'mt-3 block w-full border-0 border-b border-[var(--color-ink)]/25 bg-transparent pb-2 ' +
  'font-[family-name:var(--font-heading)] text-[length:var(--text-lg)] text-[var(--color-ink)] ' +
  'placeholder:text-[var(--color-ink)]/30 ' +
  'focus:border-[var(--color-ink)] focus:outline-none focus:ring-0 ' +
  'aria-[invalid=true]:border-[var(--color-laterite)]';

const errorMessageClass =
  'mt-2 font-mono text-[11px] tracking-[0.04em] text-[var(--color-laterite)]';

const SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined;

export default function ContactForm(): React.JSX.Element {
  const [values, setValues] = useState<FormValues>(INITIAL);
  // turnstileToken n'est pas dans FormValues (géré séparément via `token`)
  // mais ses erreurs sont mappées comme champ pour la cohérence UI.
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof FormValues | 'turnstileToken', string>>
  >({});
  const [token, setToken] = useState<string>('');
  const [state, setState] = useState<FormState>({ kind: 'idle' });
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const successRef = useRef<HTMLDivElement | null>(null);

  // Focus le bloc succès quand on bascule en success (a11y).
  useEffect(() => {
    if (state.kind === 'success') successRef.current?.focus();
  }, [state.kind]);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]): void {
    setValues((v) => ({ ...v, [key]: value }));
    if (fieldErrors[key]) setFieldErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validateClient(): boolean {
    const parsed = contactSchema.safeParse({
      nom: values.nom,
      email: values.email,
      telephone: values.telephone || undefined,
      typologie: values.typologie || undefined,
      zone: values.zone || undefined,
      message: values.message,
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
        message:
          'Merci de patienter quelques secondes — la vérification anti-spam est en cours de chargement.',
      });
      return;
    }

    setState({ kind: 'submitting' });

    const { data, error } = await actions.contact({
      nom: values.nom,
      email: values.email,
      telephone: values.telephone || undefined,
      typologie: values.typologie as TypologieContact,
      zone: values.zone || undefined,
      message: values.message,
      turnstileToken: token,
    });

    if (error) {
      // ActionError côté serveur — affiche message FR.
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
      // Reset Turnstile : un token n'est utilisable qu'une fois.
      turnstileRef.current?.reset();
      setToken('');
      return;
    }

    if (data?.ok) {
      setState({ kind: 'success' });
      setValues(INITIAL);
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
        className="border border-[var(--color-ink)]/15 bg-[var(--color-ink)]/[0.03] p-10 outline-none"
      >
        <p className="font-mono text-[11px] tracking-[0.22em] text-[var(--color-ink)]/60 uppercase">
          Message reçu
        </p>
        <p className="mt-4 font-[family-name:var(--font-heading)] text-[length:var(--text-2xl)] leading-snug text-[var(--color-ink)]">
          Merci, votre demande nous est parvenue.
        </p>
        <p className="mt-4 max-w-prose text-sm leading-relaxed text-[var(--color-ink)]/70">
          {/* [À FOURNIR PAR JONATHAN : message de confirmation + délai de réponse engagé] */}
          Nous revenons vers vous sous quelques jours ouvrés pour engager l'appel de qualification.
        </p>
        <button
          type="button"
          onClick={() => setState({ kind: 'idle' })}
          className="mt-8 font-mono text-[11px] tracking-[0.22em] text-[var(--color-ink)] uppercase underline underline-offset-4 hover:text-[var(--color-laterite)]"
        >
          Envoyer un nouveau message
        </button>
      </div>
    );
  }

  const submitting = state.kind === 'submitting';

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-10"
      aria-busy={submitting || undefined}
    >
      {/* Nom */}
      <div>
        <label htmlFor="cf-nom" className={labelClass}>
          Nom complet
        </label>
        <input
          id="cf-nom"
          name="nom"
          type="text"
          autoComplete="name"
          required
          value={values.nom}
          onChange={(e) => update('nom', e.target.value)}
          aria-invalid={Boolean(fieldErrors.nom) || undefined}
          aria-describedby={fieldErrors.nom ? 'cf-nom-err' : undefined}
          className={inputBaseClass}
          disabled={submitting}
        />
        {fieldErrors.nom && (
          <p id="cf-nom-err" className={errorMessageClass}>
            {fieldErrors.nom}
          </p>
        )}
      </div>

      {/* Email + Téléphone */}
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <label htmlFor="cf-email" className={labelClass}>
            Email
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={(e) => update('email', e.target.value)}
            aria-invalid={Boolean(fieldErrors.email) || undefined}
            aria-describedby={fieldErrors.email ? 'cf-email-err' : undefined}
            className={inputBaseClass}
            disabled={submitting}
          />
          {fieldErrors.email && (
            <p id="cf-email-err" className={errorMessageClass}>
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="cf-tel" className={labelClass}>
            Téléphone <span className="normal-case opacity-50">(facultatif)</span>
          </label>
          <input
            id="cf-tel"
            name="telephone"
            type="tel"
            autoComplete="tel"
            value={values.telephone}
            onChange={(e) => update('telephone', e.target.value)}
            aria-invalid={Boolean(fieldErrors.telephone) || undefined}
            aria-describedby={fieldErrors.telephone ? 'cf-tel-err' : undefined}
            className={inputBaseClass}
            disabled={submitting}
          />
          {fieldErrors.telephone && (
            <p id="cf-tel-err" className={errorMessageClass}>
              {fieldErrors.telephone}
            </p>
          )}
        </div>
      </div>

      {/* Typologie + Zone */}
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <label htmlFor="cf-typo" className={labelClass}>
            Typologie de projet
          </label>
          <select
            id="cf-typo"
            name="typologie"
            required
            value={values.typologie}
            onChange={(e) => update('typologie', e.target.value as TypologieContact)}
            aria-invalid={Boolean(fieldErrors.typologie) || undefined}
            aria-describedby={fieldErrors.typologie ? 'cf-typo-err' : undefined}
            className={inputBaseClass}
            disabled={submitting}
          >
            <option value="" disabled>
              Choisir une typologie…
            </option>
            {TYPOLOGIE_KEYS.map((key) => (
              <option key={key} value={key}>
                {TYPOLOGIE_LABELS[key]}
              </option>
            ))}
          </select>
          {fieldErrors.typologie && (
            <p id="cf-typo-err" className={errorMessageClass}>
              {fieldErrors.typologie}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="cf-zone" className={labelClass}>
            Zone géographique <span className="normal-case opacity-50">(facultatif)</span>
          </label>
          <input
            id="cf-zone"
            name="zone"
            type="text"
            placeholder="Brive, Bordeaux, Limoges…"
            value={values.zone}
            onChange={(e) => update('zone', e.target.value)}
            aria-invalid={Boolean(fieldErrors.zone) || undefined}
            aria-describedby={fieldErrors.zone ? 'cf-zone-err' : undefined}
            className={inputBaseClass}
            disabled={submitting}
          />
          {fieldErrors.zone && (
            <p id="cf-zone-err" className={errorMessageClass}>
              {fieldErrors.zone}
            </p>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="cf-msg" className={labelClass}>
          Votre projet
        </label>
        <textarea
          id="cf-msg"
          name="message"
          required
          rows={6}
          value={values.message}
          onChange={(e) => update('message', e.target.value)}
          aria-invalid={Boolean(fieldErrors.message) || undefined}
          aria-describedby={fieldErrors.message ? 'cf-msg-err' : 'cf-msg-help'}
          className={`${inputBaseClass} resize-y leading-relaxed`}
          disabled={submitting}
          maxLength={5000}
        />
        <p
          id="cf-msg-help"
          className="mt-2 font-mono text-[11px] tracking-[0.04em] text-[var(--color-ink)]/45"
        >
          Lieu, surface approximative, échéance, contraintes connues. {values.message.length} / 5
          000
        </p>
        {fieldErrors.message && (
          <p id="cf-msg-err" className={errorMessageClass}>
            {fieldErrors.message}
          </p>
        )}
      </div>

      {/* Turnstile */}
      {SITE_KEY ? (
        <div>
          <Turnstile
            ref={turnstileRef}
            siteKey={SITE_KEY}
            options={{ theme: 'light', size: 'flexible' }}
            onSuccess={(t) => setToken(t)}
            onExpire={() => setToken('')}
            onError={() => setToken('')}
          />
          {fieldErrors.turnstileToken && (
            <p className={errorMessageClass}>{fieldErrors.turnstileToken}</p>
          )}
        </div>
      ) : (
        <p className={errorMessageClass}>
          Vérification anti-spam non configurée. Merci de nous contacter par téléphone.
        </p>
      )}

      {/* Erreur globale */}
      {state.kind === 'error' && (
        <div
          role="alert"
          className="border-l-2 border-[var(--color-laterite)] bg-[var(--color-laterite)]/5 px-5 py-4 text-sm text-[var(--color-ink)]"
        >
          {state.message}
        </div>
      )}

      <div className="flex flex-col items-start gap-4 pt-4">
        <button
          type="submit"
          disabled={submitting || !SITE_KEY}
          className="group inline-flex items-center gap-3 border-b border-[var(--color-ink)] pb-1 font-[family-name:var(--font-heading)] text-[length:var(--text-lg)] text-[var(--color-ink)] transition-colors hover:text-[var(--color-laterite)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>{submitting ? 'Envoi en cours…' : 'Envoyer ma demande'}</span>
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </button>
        <p className="font-mono text-[10px] tracking-[0.22em] text-[var(--color-ink)]/45 uppercase">
          Vos données ne sont utilisées que pour répondre à votre demande.
        </p>
      </div>
    </form>
  );
}
