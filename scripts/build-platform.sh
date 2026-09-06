#!/usr/bin/env bash
set -euo pipefail

if [[ "${VERCEL:-}" == "1" ]]; then
  exec npm run build:vercel
fi

exec npm run build:sites
