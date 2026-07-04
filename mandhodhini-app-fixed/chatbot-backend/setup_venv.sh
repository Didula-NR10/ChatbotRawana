#!/usr/bin/env bash
# Sets up a Python virtual environment and installs dependencies.
# Usage:  ./setup_venv.sh
set -e

cd "$(dirname "$0")"

if [ ! -d ".venv" ]; then
  echo "Creating virtual environment in .venv ..."
  python3 -m venv .venv
fi

echo "Activating virtual environment..."
source .venv/bin/activate

echo "Upgrading pip..."
pip install --upgrade pip

echo "Installing dependencies..."
pip install -r requirements.txt

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "Created .env from .env.example — edit it and add your GEMINI_API_KEY."
fi

echo ""
echo "Setup complete."
echo "Next steps:"
echo "  1. Edit .env and set GEMINI_API_KEY (get one free at https://aistudio.google.com/app/apikey)"
echo "  2. source .venv/bin/activate"
echo "  3. ./run.sh   (or: uvicorn app.main:app --reload)"
