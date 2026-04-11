@echo off
setx ANDROID_HOME "C:\Users\ADMIN\AppData\Local\Android\Sdk"
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin"
echo setup complete. Please restart your terminal/IDE to apply changes globally.
pause
