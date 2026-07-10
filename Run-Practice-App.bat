@echo off
echo Starting Practice IELTS & PTE...
start msedge --app="file:///%~dp0index.html" || start chrome --app="file:///%~dp0index.html" || start "" "%~dp0index.html"
exit
