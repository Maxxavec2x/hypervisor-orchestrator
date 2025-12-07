#!/bin/bash

set -e
SCRIPT_DIR=$(dirname $0)

#Création du dossier pour contenir les iso locaux avant upload :
mkdir -p "$SCRIPT_DIR/isos"

# Pour checker si c'est la première fois que l'user execute le script
# (c'est fou ce qu'on est obligé de faire pour pas utiliser de docker....)
if [ ! -d "$SCRIPT_DIR/.venv" ]; then
  python3 -m venv $SCRIPT_DIR/.venv
  first_install=true
else
  first_install=false
fi

source $SCRIPT_DIR/.venv/bin/activate

if [ "$first_install" = true ]; then
  pip install -r $SCRIPT_DIR/requirements.txt
fi

flask --app $SCRIPT_DIR/app.py run
deactivate
