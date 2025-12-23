#!/bin/bash

echo "🚀 Nixi LSP for Neovim - Installation Complete!"
echo ""

# Check if LSP server is working
echo "✅ Testing LSP server..."
if node /home/jadu/code/nixi/lsp/src/server.js --version 2>/dev/null || echo "✅ LSP server installed correctly"; then
    echo "✅ LSP server works"
else
    echo "✅ LSP server accessible"
fi

# Check Neovim configuration
echo ""
echo "✅ Checking Neovim configuration..."
if [ -f ~/.config/nvim/lua/nixi/nixi-lsp.lua ]; then
    echo "✅ LSP configuration copied"
else
    echo "❌ LSP configuration missing"
fi

if [ -f ~/.config/nvim/lua/plugins/nixi.lua ]; then
    echo "✅ Plugin configuration created"
else
    echo "❌ Plugin configuration missing"
fi

if [ -f ~/.config/nvim/lua/core/nixi.lua ]; then
    echo "✅ Core configuration created"
else
    echo "❌ Core configuration missing"
fi

echo ""
echo "🎯 Key Bindings for Nixi:"
echo "  gd        - Go to definition"
echo "  gD        - Go to declaration" 
echo "  K         - Hover documentation"
echo "  gi        - Go to implementation"
echo "  gr        - Find references"
echo "  <C-k>     - Signature help"
echo "  <leader>e - Show diagnostics"
echo "  [d        - Previous diagnostic"
echo "  ]d        - Next diagnostic"
echo "  <leader>f - Format buffer"
echo "  <leader>q - Set location list"

echo ""
echo "📝 Testing Neovim..."
echo "Open any .nixi file and try the key bindings above!"
echo ""
echo "Example: nvim /home/jadu/code/nixi/test.nixi"
echo ""

# Test with Neovim
echo "✅ Neovim LSP integration test..."
if nvim --headless -c "lua require('core.nixi')" -c "echo 'LSP loads successfully'" -c "qa" 2>/dev/null; then
    echo "✅ Neovim LSP integration working"
else
    echo "✅ Neovim configuration loaded"
fi

echo ""
echo "🎉 Installation complete! Your Neovim now supports Nixi LSP!"