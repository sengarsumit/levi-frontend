@echo off
REM Step 1: Signup
echo === SIGNUP ===
curl -s -X POST http://localhost:8080/auth/signup -H "Content-Type: application/json" -d "{\"name\":\"Test User\",\"email\":\"testapi@test.com\",\"password\":\"password123\"}"
echo.
echo.

REM Step 2: Login to get token
echo === LOGIN ===
curl -s -X POST http://localhost:8080/auth/login -H "Content-Type: application/json" -d "{\"email\":\"testapi@test.com\",\"password\":\"password123\"}" > login_response.json
type login_response.json
echo.
echo.

REM Step 3: Get organizations (no tenant header)
echo === GET ORGANIZATIONS ===
for /f "tokens=2 delims=:," %%a in ('findstr "token" login_response.json') do set TOKEN=%%~a
echo Using token: %TOKEN%
curl -s http://localhost:8080/organization -H "Authorization: Bearer %TOKEN%"
echo.
