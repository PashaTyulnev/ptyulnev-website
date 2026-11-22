#!/bin/bash
set -e

npm run build
pm2 restart ptyulnev-webseite || PORT=3001 pm2 start .output/server/index.mjs --name ptyulnev-webseite
