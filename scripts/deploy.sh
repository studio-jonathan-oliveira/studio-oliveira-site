#!/usr/bin/env bash
# Déclenche un déploiement Vercel depuis la machine, via Deploy Hook.
#
# Utile quand on ne peut pas déployer autrement : le projet appartient à
# l'équipe OLIVEIRA, et Vercel refuse les déploiements dont l'auteur du commit
# n'est pas membre de l'équipe. Le Deploy Hook appartient au projet, pas à un
# utilisateur — il n'est donc pas soumis à ce contrôle.
#
# Mise en place — une seule fois :
#   1. Jonathan crée le hook : Vercel → projet → Settings → Git → Deploy Hooks.
#   2. Stocker l'URL localement, hors du dépôt :
#        echo 'export VERCEL_DEPLOY_HOOK_URL="https://api.vercel.com/..."' \
#          >> ~/.zshrc && source ~/.zshrc
#
# Usage :
#   ./scripts/deploy.sh            déclenche le déploiement
#   ./scripts/deploy.sh --verify   déclenche, puis attend et vérifie la mise en ligne

set -euo pipefail

SITE="https://www.studiojonathanoliveira.fr"

if [ -z "${VERCEL_DEPLOY_HOOK_URL:-}" ]; then
  echo "Erreur : VERCEL_DEPLOY_HOOK_URL n'est pas défini." >&2
  echo "Voir la procédure en tête de ce script." >&2
  exit 1
fi

echo "→ Déclenchement du déploiement…"
if ! curl -sS --fail-with-body -X POST "$VERCEL_DEPLOY_HOOK_URL"; then
  echo >&2
  echo "Échec : Vercel a refusé le déclenchement. L'URL du hook est-elle toujours valide ?" >&2
  exit 1
fi
echo
echo "→ Déploiement lancé. Vercel construit en arrière-plan (compter 1 à 3 minutes)."

if [ "${1:-}" != "--verify" ]; then
  echo "  Relancer avec --verify pour attendre la mise en ligne."
  exit 0
fi

# Témoin de mise en ligne : le sitemap doit être annoncé sur le bon domaine.
# C'était précisément le bug corrigé — robots.txt pointait vers l'ancien
# domaine Wix, qui ne résout plus.
echo "→ Attente de la mise en ligne…"
for i in $(seq 1 20); do
  sleep 20
  if curl -sS --max-time 20 "$SITE/robots.txt" 2>/dev/null \
       | grep -qi "^Sitemap: $SITE"; then
    echo "✓ En ligne — le sitemap est annoncé sur le bon domaine ($((i * 20))s)."
    exit 0
  fi
  echo "  … toujours l'ancienne version ($((i * 20))s)"
done

echo "⚠ Toujours pas en ligne après ~7 min. Vérifier l'onglet Deployments sur Vercel." >&2
exit 1
