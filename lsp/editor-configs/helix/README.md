# Nixi Language Support for Helix Editor

Helix has built-in LSP support and can use the Nixi Language Server with a simple configuration.

## Installation

### Prerequisites

1. **Helix editor** (version 22.03+)
2. **Node.js 14+** (for running Nixi LSP server)
3. **Nixi Language Server** installed

### Quick Setup

1. **Copy configuration file**:
   ```bash
   mkdir -p ~/.config/helix/languages
   cp lsp/editor-configs/helix/languages.toml ~/.config/helix/languages.toml
   ```

2. **Update the server path** in `~/.config/helix/languages.toml`:
   ```toml
   [language-server.nixi]
   command = "node"
   args = ["/your/absolute/path/to/nixi/lsp/src/server.js"]  # UPDATE THIS PATH
   ```

3. **Restart Helix** to load the configuration

### Manual Configuration

If you prefer to edit manually, add this to your `~/.config/helix/languages.toml`:

```toml
[language-server.nixi]
command = "node"
args = ["/home/jadu/code/nixi/lsp/src/server.js"]

[[language]]
name = "nixi"
scope = "source.nixi"
injection-regex = "nixi"
file-types = ["nixi"]
roots = [".git", ".nixi", "package.json"]
language-servers = ["nixi"]
comment-token = "#"
indent = { tab-width = 2, unit = "  " }
```

## Features

Once configured, Helix provides:

### ✅ Core LSP Features
- **Syntax Highlighting** for all Nixi constructs
- **Code Completion** with `<C-x>`
- **Hover Documentation** with `<C-k>`
- **Goto Definition** with `<C-g>d`
- **Goto Reference** with `<C-g>r`
- **Error Diagnostics** shown in gutter and status line
- **Signature Help** for function calls

### ✅ Helix-Specific Features
- **Multiple Selections** with LSP support
- **Modal Editing** with LSP integration
- **Tree-sitter** syntax highlighting (when available)
- **Inline Errors** and warnings
- **Auto-formatting** (when implemented)

## Key Bindings

Helix uses modal key bindings. Here are the LSP-related commands:

### Normal Mode
| Key | Action |
|-----|--------|
| `<C-x>` | Trigger completion |
| `<C-k>` | Hover documentation |
| `<C-g>d` | Go to definition |
| `<C-g>D` | Go to declaration |
| `<C-g>r` | Find references |
| `<C-g>y` | Go to type definition |
| `<Space>l` | Show LSP commands |

### LSP Commands
Enter `<Space>l` to see available LSP commands:
- `<Space>l c` - Code actions
- `<Space>l d` - Diagnostics
- `<Space>l f` - Format
- `<Space>l r` - Rename symbol
- `<Space>l s` - Document symbols

## Configuration Options

### Advanced Configuration

You can customize the Nixi LSP behavior:

```toml
[language-server.nixi]
command = "node"
args = ["/home/jadu/code/nixi/lsp/src/server.js"]

[language-server.nixi.config]
nixi = { 
  diagnostics = { enable = true }, 
  completion = { 
    enable = true,
    trigger_characters = [" ", "<", "{", ".", ":", "(", "["]
  },
  hover = { enable = true },
  definition = { enable = true }
}

[[language]]
name = "nixi"
scope = "source.nixi"
injection-regex = "nixi"
file-types = ["nixi"]
roots = [".git", ".nixi", "package.json"]
language-servers = ["nixi"]
comment-token = "#"
indent = { tab-width = 2, unit = "  " }
formatter = { command = "nixi-fmt" }  # When implemented

# Auto-pairs for Helix
[language.auto-pairs]
'(' = ')'
'{' = '}'
'[' = ']'
'"' = '"'
"'" = "'"
'<' = '>'
```

### Workspace-Specific Configuration

Create `.helix/languages.toml` in your project:

```toml
[language-server.nixi]
command = "node"
args = ["${workspace}/lsp/src/server.js"]

[[language]]
name = "nixi"
language-servers = ["nixi"]
roots = ["nixi.config.json", ".git"]
```

## Usage

### Opening Nixi Files

1. **Open `.nixi` files** - Helix automatically detects file type
2. **Manual file type**: `:set language nixi` if not auto-detected

### Code Editing Features

1. **Auto-completion**: Type `<C-x>` to trigger
2. **Documentation**: Hover over symbol and press `<C-k>`
3. **Navigation**: Use `<C-g>d` to go to definitions
4. **Error checking**: Errors appear in gutter and status line

### Status Line Information

Helix shows:
- **LSP server status** in status line
- **Error count** when diagnostics are present
- **Current language** and indentation

## Troubleshooting

### LSP Not Starting

1. **Check Helix version**: Ensure you're using 22.03+
2. **Verify Node.js**: Make sure Node.js 14+ is installed
3. **Check file path**: Update the server path in `languages.toml`
4. **Test manually**: Run `node /path/to/server.js --version` if supported

### No Completion

1. **Check file type**: `:set language?` to verify file is recognized
2. **Restart LSP**: `<Space>l r` to restart LSP server
3. **Check configuration**: Verify `languages.toml` syntax

### Syntax Highlighting Issues

1. **Tree-sitter**: Install tree-sitter for Nixi if available
2. **Fallback**: Helix uses regex-based highlighting if tree-sitter unavailable

### Debug Mode

Enable debug logging:

```toml
[language-server.nixi]
command = "node"
args = ["/home/jadu/code/nixi/lsp/src/server.js", "--debug"]
environment = { "RUST_LOG" = "helix_lsp=debug" }
```

### Manual LSP Management

```bash
# Check LSP status
hx --health nixi

# Restart LSP in Helix
<Space>l r

# Show LSP logs
<Space>l l
```

## Advanced Usage

### Multiple Language Servers

If you use multiple LSP servers with Nixi:

```toml
[language-server.nixi]
command = "node"
args = ["/path/to/nixi/lsp/src/server.js"]

[language-server.nixi-typescript]
command = "typescript-language-server"
args = ["--stdio"]

[[language]]
name = "nixi"
language-servers = ["nixi", "nixi-typescript"]
```

### Custom Build Commands

```toml
[[language]]
name = "nixi"
language-servers = ["nixi"]

# Build configuration
[language.build]
command = "nixi"
args = ["build", "--file", "{file}"]
```

### Formatting

When a formatter is available:

```toml
[[language]]
name = "nixi"
language-servers = ["nixi"]
formatter = { command = "nixi-fmt", args = [] }
auto-format = true
```