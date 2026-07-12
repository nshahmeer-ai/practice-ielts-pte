@echo off
echo Starting Practice IELTS & PTE...
echo Please wait a moment while the local server starts...

cd web

:: Start the Next.js development server in a new window
start cmd /k "npm run dev"

:: Wait a few seconds to let the server start before opening the browser
timeout /t 6 /nobreak > nul

:: Open the browser to the local Next.js app
start msedge "http://localhost:3000" || start chrome "http://localhost:3000" || start "" "http://localhost:3000"
exit
