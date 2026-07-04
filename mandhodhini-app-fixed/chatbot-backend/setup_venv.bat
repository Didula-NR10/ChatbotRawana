@echo off
REM Sets up a Python virtual environment and installs dependencies on Windows.
cd /d "%~dp0"

if not exist ".venv" (
    echo Creating virtual environment in .venv ...
    python -m venv .venv
)

call .venv\Scripts\activate.bat

echo Upgrading pip...
pip install --upgrade pip

echo Installing dependencies...
pip install -r requirements.txt

if not exist ".env" (
    copy .env.example .env
    echo Created .env from .env.example -- edit it and add your GEMINI_API_KEY.
)

echo.
echo Setup complete.
echo Next steps:
echo   1. Edit .env and set GEMINI_API_KEY
echo   2. .venv\Scripts\activate.bat
echo   3. uvicorn app.main:app --reload
