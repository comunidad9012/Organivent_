#!/bin/bash

# -------------------------------- CONFIGURACIÓN -------------------------------- #
SUBDIRBACK="backend"
SUBDIRFRON="frontend"
REMOTE_NAME_BACK="backend"
REMOTE_NAME_FRONT="frontend"
REMOTE_URL_BACK="https://github.com/comunidad9012/Organivent-Backend.git"
REMOTE_URL_FRONT="https://github.com/comunidad9012/Organivent-Front.git"
# -------------------------------------------------------------------------------- #

echo "👉 Ingrese el nombre de la rama remota desde la cual traer las actualizaciones:"
read REMOTE_BRANCH

# Función para agregar el subárbol si no existe
check_and_add_subtree() {
  local subdir=$1
  local remote_name=$2
  local remote_url=$3
  local branch=$4

  if [ ! -d "$subdir" ]; then
    echo "📦 El directorio '$subdir' no existe. Se agregará con git subtree add..."
    git subtree add --prefix="$subdir" "$remote_url" "$branch" --squash
  else
    # Verificar si tiene historial de subtree
    if ! git log --grep="git-subtree-dir: $subdir" | grep -q "$subdir"; then
      echo "⚠️  '$subdir' existe pero no fue agregado con git subtree. Se agregará ahora..."
      git subtree add --prefix="$subdir" "$remote_url" "$branch" --squash
    fi
  fi
}

# ---------------------- BACKEND ----------------------
echo "🔄 Verificando backend..."
check_and_add_subtree "$SUBDIRBACK" "$REMOTE_NAME_BACK" "$REMOTE_URL_BACK" "$REMOTE_BRANCH"

echo "🔄 Haciendo pull del subárbol BACKEND desde $REMOTE_NAME_BACK/$REMOTE_BRANCH..."
git subtree pull --prefix=$SUBDIRBACK $REMOTE_NAME_BACK $REMOTE_BRANCH --squash
echo "✅ Pull del backend completado."

# ---------------------- FRONTEND ----------------------
echo "🔄 Verificando frontend..."
check_and_add_subtree "$SUBDIRFRON" "$REMOTE_NAME_FRONT" "$REMOTE_URL_FRONT" "$REMOTE_BRANCH"

echo "🔄 Haciendo pull del subárbol FRONTEND desde $REMOTE_NAME_FRONT/$REMOTE_BRANCH..."
git subtree pull --prefix=$SUBDIRFRON $REMOTE_NAME_FRONT $REMOTE_BRANCH --squash
echo "✅ Pull del frontend completado."

echo "🎉 Pull de ambos subárboles finalizado correctamente."
