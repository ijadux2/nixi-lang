#!/bin/bash

# Nixi Quick Install Script
# This script downloads and runs the appropriate installer for your platform

set -e

echo "🚀 Nixi Programming Language - Quick Installer"
echo "=============================================="

# Detect operating system
OS="$(uname -s)"
case "$OS" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    CYGWIN*)    MACHINE=Cygwin;;
    MINGW*)     MACHINE=MinGW;;
    MSYS*)      MACHINE=MSYS;;
    *)          MACHINE="UNKNOWN:$OS"
esac

echo "Detected OS: $MACHINE"

# Download and run appropriate installer
case "$MACHINE" in
    Linux)
        echo "🐧 Downloading Linux installer..."
        curl -fsSL https://raw.githubusercontent.com/ijadux2/nixi/main/install-linux.sh | bash
        ;;
    Mac)
        echo "🍎 Downloading macOS installer..."
        curl -fsSL https://raw.githubusercontent.com/ijadux2/nixi/main/install-macos.sh | bash
        ;;
    Cygwin|MinGW|MSYS)
        echo "🪟 Downloading Windows installer..."
        if command -v powershell &> /dev/null; then
            powershell -Command "iwr -outf install-windows.bat https://raw.githubusercontent.com/ijadux2/nixi/main/install-windows.bat; ./install-windows.bat"
        elif command -v curl &> /dev/null; then
            curl -o install-windows.bat https://raw.githubusercontent.com/ijadux2/nixi/main/install-windows.bat
            ./install-windows.bat
        else
            echo "❌ Please install curl or PowerShell to continue"
            exit 1
        fi
        ;;
    *)
        echo "❌ Unsupported operating system: $MACHINE"
        echo "Please visit https://github.com/ijadux2/nixi for manual installation instructions"
        exit 1
        ;;
esac

echo "✅ Installation completed!"
echo "📖 For usage examples, see: https://github.com/ijadux2/nixi"