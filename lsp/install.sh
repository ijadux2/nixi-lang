#!/bin/bash

# Nixi LSP Installation Script

echo "Installing Nixi Language Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is required but not installed."
    echo "Please install Node.js 14+ and try again."
    exit 1
fi

# Change to script directory
cd "$(dirname "$0")" || exit 1

# Install dependencies
echo "Installing dependencies..."
npm install

# Create symlink for global access (optional)
if command -v sudo &> /dev/null; then
    echo "Creating global command 'nixi-lsp'..."
    sudo ln -sf "$(pwd)/src/server.js" /usr/local/bin/nixi-lsp
    sudo chmod +x /usr/local/bin/nixi-lsp
    echo "✓ 'nixi-lsp' command available globally"
else
    echo "Skip creating global command (no sudo available)"
fi

# Test installation
echo "Testing installation..."
if node test/test.js; then
    echo "✓ Nixi Language Server installed successfully!"
    echo ""
    echo "Usage:"
    echo "  Standalone: node src/server.js"
    echo "  Global:     nixi-lsp"
    echo ""
    echo "VSCode Extension:"
    echo "  Copy vscode-extension/ to your extensions directory"
else
    echo "✗ Installation failed!"
    exit 1
fi