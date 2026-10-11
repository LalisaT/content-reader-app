@echo off
title TipPulse - Free Local Play Store AAB & APK Builder (No Ionic Appflow Needed)
color 0B
echo ============================================================================
echo   TIPPULSE - 100%% FREE PLAY STORE .AAB ^& .APK BUILDER (NO APPFLOW CREDITS)
echo ============================================================================
echo.

cd /d "C:\Users\PC\.gemini\antigravity\scratch\content_reader_app"

if not exist "android\keystore.properties" (
    echo [Step 1] Setting up your Android Signing Keystore once...
    echo Found keystore on Desktop: C:\Users\PC\Desktop\my-release-key.jks
    echo.
    set /p KS_ALIAS="Enter your Key Alias (default: key0 or alias_name, press Enter for key0): "
    if "%KS_ALIAS%"=="" set KS_ALIAS=key0
    set /p KS_PASS="Enter your Keystore Password: "
    (
        echo storeFile=C:/Users/PC/Desktop/my-release-key.jks
        echo storePassword=%KS_PASS%
        echo keyAlias=%KS_ALIAS%
        echo keyPassword=%KS_PASS%
    ) > "android\keystore.properties"
    echo Saved signing configuration to android\keystore.properties!
    echo.
)

echo [Step 2] Building latest Web App bundle...
call npm.cmd run build
call npx.cmd cap copy android

echo.
echo [Step 3] Building Signed Google Play Store Bundle (.aab) and (.apk)...
cd /d "C:\Users\PC\.gemini\antigravity\scratch\content_reader_app\android"
call gradlew.bat bundleRelease assembleRelease

echo.
if exist "app\build\outputs\bundle\release\app-release.aab" (
    copy /Y "app\build\outputs\bundle\release\app-release.aab" "C:\Users\PC\Desktop\TipPulse-PlayStore-Release.aab" >nul
    echo ============================================================================
    echo   SUCCESS! Your Google Play Store .AAB is ready on your Desktop:
    echo   --^> C:\Users\PC\Desktop\TipPulse-PlayStore-Release.aab
    echo ============================================================================
) else (
    echo [!] Build finished with warnings or check password in android\keystore.properties.
)

if exist "app\build\outputs\apk\release\app-release.apk" (
    copy /Y "app\build\outputs\apk\release\app-release.apk" "C:\Users\PC\Desktop\TipPulse-Release.apk" >nul
    echo   SUCCESS! Your installable .APK is also on your Desktop:
    echo   --^> C:\Users\PC\Desktop\TipPulse-Release.apk
)

echo.
pause
