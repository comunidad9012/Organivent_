#!/bin/bash

# -------------------------------- CONFIGURACIÓN -------------------------------- #
SUBDIRBACK="backend"
SUBDIRFRON="frontend"
REMOTE_NAME_BACK="backend"
REMOTE_NAME_FRONT="frontend"
# -------------------------------------------------------------------------------- #

echo "👉 Ingrese el nombre de la rama remota desde la cual traer las actualizaciones:"
read REMOTE_BRANCH

# Función para verificar si ya hay commits de subtree
has_subtree_history() {
  git log --grep="git-subtree-dir: $1" | grep -q "$1"
}

# BACKEND
echo "🔄 Haciendo pull del subárbol BACKEND desde $REMOTE_NAME_BACK/$REMOTE_BRANCH..."
if ! has_subtree_history "$SUBDIRBACK"; then
  echo "⚠️  No se encontró historial de subtree para '$SUBDIRBACK'. Agregando..."
  git subtree add --prefix=$SUBDIRBACK $REMOTE_NAME_BACK $REMOTE_BRANCH --squash
else
  git subtree pull --prefix=$SUBDIRBACK $REMOTE_NAME_BACK $REMOTE_BRANCH --squash
fi
echo "✅ Pull del backend completado."

# FRONTEND
echo "🔄 Haciendo pull del subárbol FRONTEND desde $REMOTE_NAME_FRONT/$REMOTE_BRANCH..."
if ! has_subtree_history "$SUBDIRFRON"; then
  echo "⚠️  No se encontró historial de subtree para '$SUBDIRFRON'. Agregando..."
  git subtree add --prefix=$SUBDIRFRON $REMOTE_NAME_FRONT $REMOTE_BRANCH --squash
else
  git subtree pull --prefix=$SUBDIRFRON $REMOTE_NAME_FRONT $REMOTE_BRANCH --squash
fi
echo "✅ Pull del frontend completado."

echo "🎉 Pull de ambos subárboles finalizado correctamente."
