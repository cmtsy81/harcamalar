@echo off
chcp 65001 > nul
echo ======================================================
echo   🌴 Tatil Harcama Takip Sistemi Baslatiliyor...
echo ======================================================
echo.

where node >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Node.js bulundu. Node.js sunucusu baslatiliyor...
    start http://localhost:3000/admin.html
    node server.js
    goto end
)

where python >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Python bulundu. Python sunucusu baslatiliyor...
    start http://localhost:3000/admin.html
    python server.py
    goto end
)

echo [HATA] Ne Node.js ne de Python bulunamadi!
echo Lutfen admin.html dosyasini tarayicinizda acin.
pause

:end
