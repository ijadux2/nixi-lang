#!/bin/bash

# Vim installation script for Nixi language support
# This script installs Vim syntax highlighting, file detection, and indentation

set -e

echo "Installing Nixi support for Vim..."

# Create Vim directories if they don't exist
mkdir -p ~/.vim/syntax
mkdir -p ~/.vim/ftdetect  
mkdir -p ~/.vim/indent

# Copy Nixi Vim files
echo "Copying syntax highlighting file..."
cp vim/syntax/nixi.vim ~/.vim/syntax/

echo "Copying file detection file..."
cp vim/ftdetect/nixi.vim ~/.vim/ftdetect/

echo "Copying indentation file..."
cp vim/indent/nixi.vim ~/.vim/indent/

echo "✅ Vim support for Nixi installed successfully!"
echo ""
echo "To use:"
echo "1. Restart Vim or run :syntax on"
echo "2. Open any .nixi file to see syntax highlighting"
echo "3. The filetype will be automatically detected as 'nixi'"
echo ""
echo "Example: vim examples/simple-gui.nixi"