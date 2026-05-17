Write-Host "=================================" -ForegroundColor Red
Write-Host "      STARTING DRACULA MVP       " -ForegroundColor Red
Write-Host "=================================" -ForegroundColor Red
Write-Host ""
Write-Host "Dashboard will be available at: http://localhost:3000" -ForegroundColor White
Write-Host ""

# Use concurrently to run both processes in the same terminal window
npx concurrently -c "cyan,green" -n "BACKEND,FRONTEND" "cd backend && .\venv\Scripts\python.exe -m uvicorn main:app --reload" "cd frontend && npm run dev"

