/*
 * Enregistre le hook de stub d'images (asset-stub-hooks.mjs) via module.register.
 * Chargé en `--import` APRÈS tsx : ordre inverse d'exécution des hooks `resolve`
 * → le stub court-circuite les `.png/.webp` avant que tsx ne les voie.
 */
import { register } from 'node:module';

register('./asset-stub-hooks.mjs', import.meta.url);
