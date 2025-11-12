#!/bin/bash

set -e

echo "Installing Nixi Programming Language on Linux..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js using one of these methods:"
    echo "  1. Download from https://nodejs.org/"
    echo "  2. Use package manager:"
    echo "     Ubuntu/Debian: sudo apt update && sudo apt install nodejs npm"
    echo "     Fedora: sudo dnf install nodejs npm"
    echo "     Arch: sudo pacman -S nodejs npm"
    echo "  3. Use nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "     then: nvm install node"
    echo
    echo "After installation, run this script again."
    exit 1
fi

echo "Node.js found: $(node --version)"
echo

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "ERROR: Git is not installed"
    echo "Please install Git using your package manager:"
    echo "  Ubuntu/Debian: sudo apt update && sudo apt install git"
    echo "  Fedora: sudo dnf install git"
    echo "  Arch: sudo pacman -S git"
    echo
    echo "After installation, run this script again."
    exit 1
fi

echo "Git found: $(git --version)"
echo

# Clone the repository if not already in nixi directory
if [[ "$(basename "$PWD")" != "nixi" ]]; then
    echo "Cloning Nixi repository..."
    git clone https://github.com/ijadux2/nixi.git
    cd nixi
else
    echo "Already in Nixi directory, skipping clone..."
fi

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

# Test the installation
echo "Testing installation..."
node src/cli.js config/ultra-simple.nixi || echo "WARNING: Test run failed, but installation may still be working"

echo
echo "========================================"
echo "Nixi installation completed successfully!"
echo
echo "To run Nixi programs:"
echo "  node src/cli.js examples/simple-gui.nixi"
echo
echo "To add Nixi to your PATH permanently, add this line to your ~/.bashrc or ~/.zshrc:"
echo "  export PATH=\"\$PATH:$(pwd)\""
echo
echo "Then reload your shell:"
echo "  source ~/.bashrc  # or source ~/.zshrc"
echo
echo "For editor support, see: neovim/README.md"
echo "========================================"