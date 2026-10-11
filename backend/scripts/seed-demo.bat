
@echo off
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d eduflow -v ON_ERROR_STOP=1 -f "%~dp0..\src\main\resources\db\demo-data.sql"

if errorlevel 1 (
    echo Demo data seeding failed.
    exit /b 1
)

echo Demo data seeding completed.
pause
