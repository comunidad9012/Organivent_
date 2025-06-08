#!/bin/bash

#git subtree add --prefix=backend backend prueba_script_pull --squash
#git subtree add --prefix=frontend frontend prueba_script_pull --squash


# -------------------------------- MODO DE USO -----------------------------------#
# 1. Guardá este script como `pull_ramas_remotas.sh` en la raíz del proyecto (donde está .git).
# 2. Dale permisos de ejecución: chmod +x pull_subtrees.sh
# 3. Ejecutalo: ./pull_subtrees.sh
# --------------------------------------------------------------------------------#

#--------------------------------- CONFIGURACION ---------------------------------#
# Subdirectorios
SUBDIRBACK="backend"
SUBDIRFRON="frontend"

# Remotos
REMOTE_NAME_BACK="backend"
REMOTE_NAME_FRONT="frontend"
# --------------------------------------------------------------------------------#

# Preguntar rama remota
echo "👉 Ingrese el nombre de la rama remota desde la cual traer las actualizaciones:"
read REMOTE_BRANCH

# # Preguntar si se quiere squash
# echo "¿Querés usar '--squash' para agrupar los commits remotos en uno solo? (s/n):"
# read USE_SQUASH

# if [[ "$USE_SQUASH" == "s" || "$USE_SQUASH" == "S" ]]; then
#   SQUASH="--squash"
# else
#   SQUASH=""
# fi

# Pull del backend
echo "🔄 Haciendo pull del subárbol BACKEND desde $REMOTE_NAME_BACK/$REMOTE_BRANCH..."
git subtree pull --prefix=$SUBDIRBACK $REMOTE_NAME_BACK $REMOTE_BRANCH --squash

echo "✅ Pull del backend completado."

# Pull del frontend
echo "🔄 Haciendo pull del subárbol FRONTEND desde $REMOTE_NAME_FRONT/$REMOTE_BRANCH..."
git subtree pull --prefix=$SUBDIRFRON $REMOTE_NAME_FRONT $REMOTE_BRANCH --squash

echo "✅ Pull del frontend completado."

echo "🎉 Pull de ambos subárboles finalizado correctamente."
