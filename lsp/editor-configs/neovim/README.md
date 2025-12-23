# Nixi Language Support for Neovim

This directory contains configuration files for setting up Nixi LSP support in Neovim.

## Installation

### Prerequisites

1. **Neovim 0.5+** (for built-in LSP support)
2. **Node.js 14+** (for running the Nixi LSP server)
3. **nvim-lspconfig** (recommended)

### Quick Setup

1. **Install nvim-lspconfig** (using your favorite plugin manager):

**Using Packer:**
```lua
use {'neovim/nvim-lspconfig'}
```

**Using Vim-Plug:**
```vim
Plug 'neovim/nvim-lspconfig'
```

**Using lazy.nvim:**
```lua
{'neovim/nvim-lspconfig'}
```

2. **Copy the configuration:**
```bash
cp lsp/editor-configs/neovim/nixi-lsp.lua ~/.config/nvim/lua/nixi/
```

3. **Add to your init.lua:**
```lua
require('nixi.nixi-lsp')
```

### Alternative: Direct Setup

Add this to your `init.lua` (update the path as needed):

```lua
local lspconfig = require("lspconfig")
local nixi_path = vim.fn.expand("~/code/nixi/lsp/src/server.js") -- Update this path

lspconfig.nixi_lsp.setup {
  cmd = {"node", nixi_path},
  filetypes = {"nixi"},
  root_dir = function() return vim.fn.getcwd() end,
  on_attach = function(client, bufnr)
    -- Standard LSP key mappings
    local bufopts = { noremap=true, silent=true, buffer=bufnr }
    vim.keymap.set('n', 'gd', vim.lsp.buf.definition, bufopts)
    vim.keymap.set('n', 'K', vim.lsp.buf.hover, bufopts)
    vim.keymap.set('n', 'gr', vim.lsp.buf.references, bufopts)
    vim.keymap.set('n', '<leader>e', vim.diagnostic.open_float, bufopts)
    vim.keymap.set('n', '[d', vim.diagnostic.goto_prev, bufopts)
    vim.keymap.set('n', ']d', vim.diagnostic.goto_next, bufopts)
  end,
}
```

### File Type Detection

Ensure Neovim recognizes `.nixi` files by adding to your init.lua:

```lua
vim.api.nvim_create_autocmd({ "BufRead", "BufNewFile" }, {
  pattern = "*.nixi",
  command = "set filetype=nixi"
})
```

Or add to `~/.config/nvim/filetype.vim`:
```vim
augroup filetypedetect
  au! BufRead,BufNewFile *.nixi setfiletype nixi
augroup END
```

## Features

Once configured, you'll get:

- **Syntax highlighting** (if you have treesitter or syntax highlighting setup)
- **Code completion** with `<C-x><C-o>` or nvim-cmp
- **Hover documentation** with `K`
- **Goto definition** with `gd`
- **Find references** with `gr`
- **Error diagnostics** in the gutter and with `:lua vim.diagnostic.open_float()`
- **Code actions** (when implemented)

## Key Mappings

| Key | Action |
|-----|--------|
| `gd` | Go to definition |
| `gD` | Go to declaration |
| `gr` | Find references |
| `K` | Hover documentation |
| `[d` | Previous diagnostic |
| `]d` | Next diagnostic |
| `<leader>e` | Show diagnostic in float |

## Troubleshooting

1. **LSP not starting**: Check if Node.js is installed and the path to `server.js` is correct
2. **No autocompletion**: Ensure you have completion plugin like nvim-cmp
3. **Syntax not highlighting**: Install Nixi syntax highlighting or use treesitter
4. **Check LSP status**: Run `:LspInfo` to see active servers

### Debug Commands

```vim
:LspInfo          " Show active LSP servers
:LspLog           " Show LSP logs
:lua vim.lsp.get_active_clients() " List clients
:lua print(vim.inspect(vim.lsp.buf_get_clients(0))) " Debug buffer clients
```