-- Nixi LSP configuration for Neovim
-- Add this to your init.lua or init.vim

-- Method 1: Using nvim-lspconfig (recommended)
if require("utils").check_lsp_config_status() then
  local lspconfig = require("lspconfig")
  local nixi_path = vim.fn.expand("~/code/nixi/lsp/src/server.js") -- Update this path

  lspconfig.nixi_lsp.setup {
    cmd = {"node", nixi_path},
    filetypes = {"nixi"},
    root_dir = function() return vim.fn.getcwd() end,
    settings = {
      nixi = {
        -- Add any Nixi-specific settings here
        diagnostics = {
          enable = true,
        },
        completion = {
          enable = true,
        },
      }
    },
    on_attach = function(client, bufnr)
      -- Standard LSP key mappings
      local bufopts = { noremap=true, silent=true, buffer=bufnr }
      vim.keymap.set('n', 'gD', vim.lsp.buf.declaration, bufopts)
      vim.keymap.set('n', 'gd', vim.lsp.buf.definition, bufopts)
      vim.keymap.set('n', 'K', vim.lsp.buf.hover, bufopts)
      vim.keymap.set('n', 'gi', vim.lsp.buf.implementation, bufopts)
      vim.keymap.set('n', '<C-k>', vim.lsp.buf.signature_help, bufopts)
      vim.keymap.set('n', '<leader>wa', vim.lsp.buf.add_workspace_folder, bufopts)
      vim.keymap.set('n', '<leader>wr', vim.lsp.buf.remove_workspace_folder, bufopts)
      vim.keymap.set('n', '<leader>wl', function()
        print(vim.inspect(vim.lsp.buf.list_workspace_folders()))
      end, bufopts)
      vim.keymap.set('n', '<leader>D', vim.lsp.buf.type_definition, bufopts)
      vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, bufopts)
      vim.keymap.set('n', 'gr', vim.lsp.buf.references, bufopts)
      vim.keymap.set('n', '<leader>e', vim.diagnostic.open_float, bufopts)
      vim.keymap.set('n', '[d', vim.diagnostic.goto_prev, bufopts)
      vim.keymap.set('n', ']d', vim.diagnostic.goto_next, bufopts)
      vim.keymap.set('n', '<leader>q', vim.diagnostic.setloclist, bufopts)
      vim.keymap.set('n', '<leader>f', function() vim.lsp.buf.format { async = true } end, bufopts)
    end,
    capabilities = require('cmp_nvim_lsp').default_capabilities(),
  }
end

-- Method 2: Manual LSP setup (if not using lspconfig)
vim.api.nvim_create_autocmd("FileType", {
  pattern = "nixi",
  callback = function()
    local nixi_path = vim.fn.expand("~/code/nixi/lsp/src/server.js") -- Update this path
    
    vim.lsp.start({
      name = "nixi-lsp",
      cmd = {"node", nixi_path},
      root_dir = vim.fn.getcwd(),
      on_attach = function(client, bufnr)
        -- Same key mappings as above
        local bufopts = { noremap=true, silent=true, buffer=bufnr }
        vim.keymap.set('n', 'gD', vim.lsp.buf.declaration, bufopts)
        vim.keymap.set('n', 'gd', vim.lsp.buf.definition, bufopts)
        vim.keymap.set('n', 'K', vim.lsp.buf.hover, bufopts)
        vim.keymap.set('n', 'gr', vim.lsp.buf.references, bufopts)
        vim.keymap.set('n', '<leader>e', vim.diagnostic.open_float, bufopts)
        vim.keymap.set('n', '[d', vim.diagnostic.goto_prev, bufopts)
        vim.keymap.set('n', ']d', vim.diagnostic.goto_next, bufopts)
      end,
    })
  end,
})

-- Method 3: Vim script version (for init.vim)
" Add this to your init.vim if using Vimscript
if has('nvim')
  augroup NixiLSP
    autocmd!
    autocmd FileType nixi lua require('lspconfig').nixi_lsp.setup{
      \ cmd = {"node", expand("~/code/nixi/lsp/src/server.js")},
      \ filetypes = {"nixi"},
      \ root_dir = function() return vim.fn.getcwd() end
      \ }
  augroup END
endif