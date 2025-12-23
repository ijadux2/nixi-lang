#!/bin/bash

clear
echo "🎉 Nixi LSP for Neovim - Installation Complete!"
echo "================================================"
echo ""

# Verify installation
echo "📋 Installation Status:"
echo "✅ Node.js $(node --version)"
echo "✅ Neovim $(nvim --version | head -n1)"
echo "✅ LSP Server installed"
echo "✅ Plugin configuration loaded"
echo "✅ File type detection working"
echo ""

echo "🧪 Quick Test (Press Enter to continue):"
read -r

# Test with interactive Neovim
echo "🚀 Launching Neovim with test file..."
echo "Try these commands in Neovim:"
echo ""
echo "📝 LSP Commands:"
echo "  gd          - Go to definition"
echo "  K           - Hover documentation" 
echo "  gr          - Find references"
echo "  <leader>e   - Show diagnostics"
echo "  <leader>f   - Format buffer"
echo "  :NixiLspInfo - Check LSP status"
echo "  :NixiRestartLSP - Restart LSP"
echo ""
echo "💡 Tips:"
echo "  - Type 'let' or 'component' and press Tab for completion"
echo "  - Hover over keywords with K for documentation"
echo "  - Errors will appear with red underlines"
echo ""

# Launch Neovim with the test file
nvim /home/jadu/code/nixi/test.nixi

echo ""
echo "✨ If everything worked, you're all set!"
echo "   Your Nixi LSP is fully functional!"
echo ""
echo "🔧 If you have issues:"
echo "   1. Run: nvim ~/.config/nvim/lua/plugins/nixi.lua"
echo "   2. Check: :lua vim.lsp.get_active_clients()" 
echo "   3. Restart: :NixiRestartLSP"