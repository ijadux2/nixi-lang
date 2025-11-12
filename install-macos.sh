#!/bin/bash

set -e

echo "Installing Nixi Programming Language on macOS..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js using one of these methods:"
    echo "  1. Download from https://nodejs.org/"
    echo "  2. Use Homebrew: brew install node"
    echo "  3. Use nvm: nvm install node"
    echo
    echo "After installation, run this script again."
    exit 1
fi

echo "Node.js found: $(node --version)"
echo

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "ERROR: Git is not installed"
    echo "Please install Git using one of these methods:"
    echo "  1. Download from https://git-scm.com/"
    echo "  2. Use Homebrew: brew install git"
    echo "  3. Use Xcode Command Line Tools: xcode-select --install"
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
echo "To add Nixi to your PATH permanently, add this line to your ~/.zshrc or ~/.bash_profile:"
echo "  export PATH=\"\$PATH:$(pwd)\""
echo
echo "Then reload your shell:"
echo "  source ~/.zshrc  # or source ~/.bash_profile"
echo
echo "For editor support, see: neovim/README.md"
echo "========================================"