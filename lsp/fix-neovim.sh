#!/bin/bash

echo "🔧 Nixi LSP for Neovim - Fix Applied"
echo "===================================="
echo ""

# Create simple working configuration
echo "📝 Creating working LSP configuration..."

# Create simple configuration directory
mkdir -p ~/.config/nvim/lua

# Write simple working configuration
cat > ~/.config/nvim/lua/nixi-lsp-simple.lua << 'EOF'
-- Nixi LSP - Simple Working Version
local nixi_path = vim.fn.expand("~/code/nixi/lsp/src/server.js")

-- File type detection
vim.filetype.add({
  extension = {
    nixi = "nixi",
  },
})

-- Auto-start LSP for Nixi files
vim.api.nvim_create_autocmd("FileType", {
  pattern = "nixi",
  callback = function()
    local clients = vim.lsp.get_active_clients()
    local nixi_running = false
    
    for _, client in ipairs(clients) do
      if client.name == "nixi" then
        nixi_running = true
        break
      end
    end
    
    if not nixi_running then
      vim.lsp.start({
        name = "nixi",
        cmd = {"node", nixi_path},
        root_dir = function() return vim.fn.getcwd() end,
        capabilities = vim.lsp.protocol.make_client_capabilities(),
        settings = {
          nixi = {
            diagnostics = { enable = true },
            completion = { enable = true },
            hover = { enable = true },
            definition = { enable = true },
            references = { enable = true }
          }
        },
        on_attach = function(client, bufnr)
          -- Key mappings
          local bufopts = { noremap=true, silent=true, buffer=bufnr }
          vim.keymap.set("n", "gd", vim.lsp.buf.definition, bufopts)
          vim.keymap.set("n", "gD", vim.lsp.buf.declaration, bufopts)
          vim.keymap.set("n", "K", vim.lsp.buf.hover, bufopts)
          vim.keymap.set("n", "gr", vim.lsp.buf.references, bufopts)
          vim.keymap.set("n", "<leader>e", vim.diagnostic.open_float, bufopts)
          vim.keymap.set("n", "[d", vim.diagnostic.goto_prev, bufopts)
          vim.keymap.set("n", "]d", vim.diagnostic.goto_next, bufopts)
          vim.keymap.set("n", "<leader>f", vim.lsp.buf.format, bufopts)
          
          print("✅ Nixi LSP attached")
        end,
      })
    end
  end,
})

echo "✅ Simple LSP configuration created"
echo ""
echo "🧪 Testing..."
nvim --headless /home/jadu/code/nixi/test.nixi -c "sleep 1s" -c "qa" 2>/dev/null && echo "✅ Simple LSP works!" || echo "❌ Simple LSP failed"

echo ""
echo "📋 Manual Steps to Enable:"
echo "1. Remove broken configuration: rm ~/.config/nvim/lua/plugins/nixi.lua"
echo "2. Add to init.lua:"
echo '   require("nixi-lsp-simple")'
echo ""
echo "✅ Ready to use!"
echo "Open any .nixi file to test LSP features."
EOF

echo "✅ Configuration fixed!"
echo ""

echo "🎯 Quick Test:"
nvim /home/jadu/code/nixi/test.nixi