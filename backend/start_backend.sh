#!/bin/bash

set -e
SCRIPT_DIR=$(dirname $0)
# Pour checker si c'est la première fois que l'user execute le script
# (c'est fou ce qu'on est obligé de faire pour pas utiliser de docker....)
if [ ! -d "$SCRIPT_DIR/.env" ]; then
  python3 -m venv .env
  first_install=true
else
  first_install=false
fi

source .env/bin/activate

if [ "$first_install" = true ]; then
  pip install -r requirements.txt
fi

flask --app app.py run
deactivate
