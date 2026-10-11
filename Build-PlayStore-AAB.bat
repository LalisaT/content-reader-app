@echo off
setlocal enabledelayedexpansion
title TipPulse - 100% Free Play Store AAB and APK Builder
color 0B
echo ============================================================================
echo   TIPPULSE - 100%% FREE PLAY STORE .AAB ^& .APK BUILDER (NO APPFLOW CREDITS)
echo ============================================================================
echo.

cd /d "C:\Users\PC\.gemini\antigravity\scratch\content_reader_app"

:: If an earlier run saved "my-release-key.jks" as the keyAlias, clear it automatically
if exist "android\keystore.properties" (
    findstr /I "keyAlias=my-release-key.jks" "android\keystore.properties" >nul 2>&1
    if !errorlevel! equ 0 (
        del /F /Q "android\keystore.properties"
    )
)

:ASK_PASS
if not exist "android\keystore.properties" (
    echo [Step 1] Found your keystore: C:\Users\PC\Desktop\my-release-key.jks
    echo (You do NOT need to type the Key Alias - it will be detected automatically!)
    echo.
    set "KS_PASS="
    set /p KS_PASS="Enter your Keystore Password and press Enter: "
    if "!KS_PASS!"=="" goto ASK_PASS

    echo.
    echo Verifying password and auto-detecting Key Alias from my-release-key.jks...
    set "DETECTED_ALIAS="
    for /f "tokens=1 delims=," %%A in ('keytool -list -keystore "C:\Users\PC\Desktop\my-release-key.jks" -storepass "!KS_PASS!" ^| findstr /I "PrivateKeyEntry"') do (
        set "DETECTED_ALIAS=%%A"
    )

    if "!DETECTED_ALIAS!"=="" (
        echo.
        echo [!] Password did not match C:\Users\PC\Desktop\my-release-key.jks. Please try again!
        echo.
        goto ASK_PASS
    )

    echo [OK] Password verified! Auto-detected Key Alias: !DETECTED_ALIAS!
    (
        echo storeFile=C:/Users/PC/Desktop/my-release-key.jks
        echo storePassword=!KS_PASS!
        echo keyAlias=!DETECTED_ALIAS!
        echo keyPassword=!KS_PASS!
    ) > "android\keystore.properties"
    echo Saved signing configuration to android\keystore.properties!
    echo.
)

echo [Step 2] Building latest Web App bundle...
call npm.cmd run build
call npx.cmd cap copy android

echo.
echo [Step 3] Building Signed Google Play Store Bundle (.aab)...
cd /d "C:\Users\PC\.gemini\antigravity\scratch\content_reader_app\android"
call gradlew.bat bundleRelease -x lint -x lintVitalRelease

echo.
if exist "app\build\outputs\bundle\release\app-release.aab" (
    copy /Y "app\build\outputs\bundle\release\app-release.aab" "C:\Users\PC\Desktop\TipPulse-PlayStore-Release.aab" >nul
    echo ============================================================================
    echo   SUCCESS! Your Google Play Store .AAB is ready on your Desktop:
    echo   --^> C:\Users\PC\Desktop\TipPulse-PlayStore-Release.aab
    echo ============================================================================
) else (
    echo [!] Build did not produce app-release.aab. Check any error message above.
)

if exist "app\build\outputs\apk\release\app-release.apk" (
    copy /Y "app\build\outputs\apk\release\app-release.apk" "C:\Users\PC\Desktop\TipPulse-Release.apk" >nul
    echo   SUCCESS! Your installable .APK is also on your Desktop:
    echo   --^> C:\Users\PC\Desktop\TipPulse-Release.apk
)

echo.
pause
