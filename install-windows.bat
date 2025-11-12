@echo off
echo Installing Nixi Programming Language on Windows...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo After installation, restart your command prompt and run this script again.
    pause
    exit /b 1
)

echo Node.js found: 
node --version
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/
    echo After installation, restart your command prompt and run this script again.
    pause
    exit /b 1
)

echo Git found:
git --version
echo.

REM Clone the repository if not already in nixi directory
if not "%cd:~-5%"=="nixi" (
    echo Cloning Nixi repository...
    git clone https://github.com/ijadux2/nixi.git
    if %errorlevel% neq 0 (
        echo ERROR: Failed to clone repository
        pause
        exit /b 1
    )
    cd nixi
) else (
    echo Already in Nixi directory, skipping clone...
)

REM Install dependencies
echo Installing Node.js dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

REM Test the installation
echo Testing installation...
node src/cli.js config/ultra-simple.nixi
if %errorlevel% neq 0 (
    echo WARNING: Test run failed, but installation may still be working
)

echo.
echo ========================================
echo Nixi installation completed successfully!
echo.
echo To run Nixi programs:
echo   node src/cli.js examples/simple-gui.nixi
echo.
echo To add Nixi to your PATH permanently:
echo   1. Open System Properties ^> Environment Variables
echo   2. Add the current directory to your PATH
echo   3. Or run: setx PATH "%PATH%;%cd%"
echo.
echo For editor support, see: neovim\README.md
echo ========================================
pause