@echo off
chcp 65001 >nul 2>&1
title TruthBeacon — Fake News Detector

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║       TruthBeacon — Fake News Detector       ║
echo  ╚══════════════════════════════════════════════╝
echo.

:: ── Check Node.js ──────────────────────────────────────────────
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js is not installed or not in PATH.
    echo.
    echo  Install Node.js LTS from: https://nodejs.org
    echo  Then restart this script.
    echo.
    pause
    exit /b 1
)

for /f "tokens=1 delims=." %%i in ('node -v') do set NODE_VER=%%i
echo  [OK] Node.js detected (%NODE_VER%)

:: ── Check npm ──────────────────────────────────────────────────
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] npm is not installed.
    echo  Install Node.js LTS from: https://nodejs.org
    pause
    exit /b 1
)

:: ── Install dependencies if needed ─────────────────────────────
if not exist "node_modules" (
    echo  [..] Installing dependencies (first run)...
    call npm install
    if %errorlevel% neq 0 (
        echo  [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
    echo  [OK] Dependencies installed.
) else (
    echo  [OK] Dependencies found.
)

:: ── Check .env file ────────────────────────────────────────────
if not exist ".env" (
    if exist ".env.example" (
        echo  [..] Creating .env from .env.example...
        copy .env.example .env >nul 2>&1
        echo  [OK] .env created. Add your API keys before analyzing.
    ) else (
        echo  [!!] No .env file found. Create one with your API keys.
    )
)

:: ── Show API key status ────────────────────────────────────────
echo.
echo  ── API Key Status ──────────────────────────────────────
findstr /C:"GEMINI_API_KEY=" .env >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=2 delims==" %%a in ('findstr /C:"GEMINI_API_KEY=" .env') do (
        if "%%a"=="" (
            echo    Gemini API Key:  NOT SET (required for analysis)
        ) else (
            echo    Gemini API Key:  Configured
        )
    )
) else (
    echo    Gemini API Key:  NOT SET (required for analysis)
)
echo.
echo    Get a free Gemini key at:
echo    https://aistudio.google.com/apikey
echo.
echo    Tip: You can still try Demo Mode without API keys.
echo  ─────────────────────────────────────────────────────────
echo.

:: ── Start the dev server ──────────────────────────────────────
echo  [..] Starting TruthBeacon on http://localhost:5173 ...
echo  (Press Ctrl+C to stop the server)
echo.

start "" "http://localhost:5173"
call npm start
