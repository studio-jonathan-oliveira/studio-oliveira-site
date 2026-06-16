import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      '.astro/**',
      '.vercel/**',
      'node_modules/**',
      'sanity/**',
      'public/scrollframes/**',
    ],
  },
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ['src/**/*.{jsx,tsx}'],
    plugins: { 'jsx-a11y': jsxA11y },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      // Sanity client = server-only (token API). Importer @/lib/sanity dans une
      // island React l'embarquerait dans le bundle navigateur — fuite du token
      // et code GROQ inutile côté client. Charger les données depuis l'Astro
      // parent et passer en props.
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/lib/sanity',
              message:
                "Le client Sanity est server-only. Charger les données dans un composant .astro et passer en props à l'island.",
            },
          ],
          patterns: ['@/lib/sanity/*', '../**/lib/sanity', '../**/lib/sanity/*'],
        },
      ],
    },
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'warn',
    },
  },
);
