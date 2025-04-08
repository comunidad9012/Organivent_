#!/bin/bash

# Este script se encarga de dividir un proyecto en dos subárboles y subirlos a ramas remotas en GitHub.

# -------------------------------- MODO DE USO -----------------------------------#

# 1. Configurar los repositorios remotos (podés ver cuáles tenes con: git remote -v) (añadis un repo con: git remote add <nombre> <url>)
# 2. Mover este script a la raíz del proyecto (donde está el .git)
# 3. Hacer ejecutable el script con el comando: chmod +x push_a_ramas_remotas_libreria.sh
#    (si no tenes permisos para hacerlo, ejecuta el comando con sudo)
# 4. Ejecutar el script desde la raíz del proyecto (donde está el .git) con el comando: ./push_a_ramas_remotas_libreria.sh
# 5. El script te pedirá el nombre de la rama remota a la que queres hacer push (main o la que estés usando en el momento)

#--------------------------------- CONFIGURACION ---------------------------------#

# Nombre del subdirectorio
SUBDIRBACK="backend"
SUBDIRFRON="frontend"
# Nombre de la branch temporal que se crea para el subtree
BRANCH_NAME_BACK="backend-branch"
BRANCH_NAME_FRONT="frontend-branch"
# Nombre remoto definido en tu git (podés cambiarlo si lo llamaste distinto)
REMOTE_NAME_BACK="backend"
REMOTE_NAME_FRONT="frontend"

#----------------------------------------------------------------------------------#


# Eliminar las ramas temporales anteriores de ambos.
echo "Eliminando rama temporal anterior'$BRANCH_NAME_FRONT'..."
git branch -D $BRANCH_NAME_FRONT
echo "Listo."

echo "Eliminando rama temporal anterior'$BRANCH_NAME_BACK'..."
git branch -D $BRANCH_NAME_BACK
echo "Listo."


# Hacer los subtree
echo "Dividiendo el proyecto en subárbol de '$SUBDIRFRON'..."
git subtree split -P $SUBDIRFRON -b $BRANCH_NAME_FRONT
echo "Subtree del front creado con éxito."

echo "Dividiendo el proyecto en subárbol de '$SUBDIRBACK'..."
git subtree split -P $SUBDIRBACK -b $BRANCH_NAME_BACK
echo "Subtree del back creado con éxito."


# Nombre de la rama destino en el repo remoto (main o la que estemos usando en el momento)
echo "Por favor, ingrese el nombre de la rama para ser subida al repo remoto en GitHub. GUARDA CON ESTO"
read REMOTE_BRANCH


# Hacer los push 
echo "Haciendo push a $REMOTE_NAME_FRONT/$REMOTE_BRANCH..."
git push $REMOTE_NAME_FRONT $BRANCH_NAME_FRONT:$REMOTE_BRANCH
echo "Push en front realizado con éxito."

echo "Haciendo push a $REMOTE_NAME_BACK/$REMOTE_BRANCH..."
git push $REMOTE_NAME_BACK $BRANCH_NAME_BACK:$REMOTE_BRANCH
echo "Push en front realizado con éxito."



echo "✅ Push completado correctamente, que tengas buen día!."

