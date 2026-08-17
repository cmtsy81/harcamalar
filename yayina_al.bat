@echo off
chcp 65001 > nul
echo ======================================================
echo   🚀 Harcamalar GitHub Sunucusuna Gonderiliyor...
echo ======================================================
echo.

git add data.json
git commit -m "Harcamalar güncellendi"
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ======================================================
    echo   [BASARILI] Veriler GitHub'a yuklendi!
    echo   Canli sitedeki herkes guncel harcamalari gorebilir.
    echo ======================================================
) else (
    echo.
    echo [BILGI] Eger commit edilecek yeni bir degisiklik yoksa
    echo veya internet baglantisi yoksa yukaridaki mesaji kontrol edin.
)

echo.
pause
