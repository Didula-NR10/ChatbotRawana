#!/usr/bin/env bash
# Runs the backend in development mode with auto-reload.
set -e
cd "$(dirname "$0")"
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
