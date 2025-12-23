# Nixi Language Support for Kakoune

Kakoune has excellent LSP support through the `kak-lsp` plugin and provides a modal editing experience with Nixi Language Server integration.

## Installation

### Prerequisites

1. **Kakoune** (version 2022.10+ recommended)
2. **Node.js 14+** (for running Nixi LSP server)
3. **kak-lsp** plugin

### Step 1: Install kak-lsp

```bash
# Method 1: Cargo (recommended)
cargo install kak-lsp

# Method 2: Download binary
wget https://github.com/kakoune-lsp/kak-lsp/releases/latest/download/kak-lsp
chmod +x kak-lsp
sudo mv kak-lsp /usr/local/bin/

# Method 3: From source
git clone https://github.com/kakoune-lsp/kak-lsp.git
cd kak-lsp
cargo install --path .
```

### Step 2: Configure kak-lsp

```bash
mkdir -p ~/.config/kak-lsp
cp lsp/editor-configs/kakoune/kak-lsp.toml ~/.config/kak-lsp/kak-lsp.toml
```

Update the server path in `~/.config/kak-lsp/kak-lsp.toml`:
```toml
[language.nixi]
command = "node"
args = ["/your/absolute/path/to/nixi/lsp/src/server.js"]  # UPDATE THIS PATH
```

### Step 3: Configure Kakoune

Add to your `~/.config/kak/kakrc`:

```kak
# Initialize LSP
eval %sh{kak-lsp --kakoune -s $kak_session}
hook global KakEnd .* %sh{ kill $kak_lsp_pid }

# Auto-start LSP for Nixi files
hook global WinSetOption filetype=nixi %{
    lsp-enable-window
}
```

## Quick Start Configuration

For immediate setup, add this comprehensive configuration to your `kakrc`:

```kak
# LSP initialization
eval %sh{kak-lsp --kakoune -s $kak_session}
hook global KakEnd .* %sh{ kill $kak_lsp_pid }

# File type detection
hook global BufCreate .*\.nixi %{
    set-option buffer filetype nixi
}

# LSP for Nixi
hook global WinSetOption filetype=nixi %{
    lsp-enable-window
    set-option buffer indentwidth 2
    set-option buffer tabstop 2
    set-option buffer expandtab true
    
    # LSP commands
    map global user l ':enter-user-mode lsp<ret>' -docstring 'lsp commands'
    
    declare-user-mode lsp
    map global lsp d ': lsp-definitions<ret>' -docstring 'goto definition'
    map global lsp h ': lsp-hover<ret>' -docstring 'hover documentation'
    map global lsp r ': lsp-references<ret>' -docstring 'find references'
    map global lsp a ': lsp-code-action<ret>' -docstring 'code actions'
    map global lsp R ': lsp-rename<ret>' -docstring 'rename symbol'
    map global lsp f ': lsp-formatting<ret>' -docstring 'format buffer'
    
    # Diagnostics
    map global lsp '[' ': lsp-previous-diagnostics<ret>' -docstring 'previous diagnostic'
    map global lsp ']' ': lsp-next-diagnostics<ret>' -docstring 'next diagnostic'
    
    # Completion
    map global insert <tab> '<a-;>: lsp-completion<ret>' -docstring 'lsp completion'
}

# Completion hooks
hook global WinSetOption filetype=nixi %{
    hook global InsertChar [ \t\(\\[{<] %{
        try %{ lsp-completion }
    }
}
```

## Key Bindings

### Primary LSP Commands (in user mode)
| Key | Action |
|-----|--------|
| `l l` | Enter LSP mode |
| `l d` | Go to definition |
| `l h` | Hover documentation |
| `l r` | Find references |
| `l a` | Code actions |
| `l R` | Rename symbol |
| `l f` | Format buffer |
| `l [` | Previous diagnostic |
| `l ]` | Next diagnostic |

### Insert Mode
| Key | Action |
|-----|--------|
| `<tab>` | Trigger completion |
| `<c-x>` | Alternative completion trigger |

### Normal Mode (selection-aware)
| Key | Action |
|-----|--------|
| `l d` | Go to definition of selection |
| `l h` | Hover documentation for selection |
| `l r` | Find references to selection |

## Features

### ✅ Core LSP Features
- **Syntax Highlighting** for Nixi constructs
- **Intelligent Completion** with context awareness
- **Hover Documentation** with rich information
- **Goto Definition** with jump back capability
- **Find References** across the project
- **Error Diagnostics** in gutter and status bar
- **Rename Symbol** with refactoring
- **Code Formatting** (when implemented)

### ✅ Kakoune-Specific Features
- **Modal Editing** optimized for LSP
- **Multiple Selections** with LSP support
- **Incremental Selections** for precise editing
- **Selection-based Actions**
- **Jump List Integration**

### ✅ Advanced Features
- **Workspace-wide Search** (`l S` for workspace symbols)
- **Document Symbols** (`l s` for current file symbols)
- **Type Definition** (`l D` for type definitions)
- **Implementation** (`l i` for implementations)
- **Color Picker** (for CSS properties)

## Configuration

### File Type Settings

```kak
hook global WinSetOption filetype=nixi %{
    # LSP settings
    set-option buffer lsp_auto_show_diagnostics true
    set-option buffer lsp_auto_show_code_actions true
    set-option buffer lsp_show_hover true
    
    # Editor settings
    set-option buffer indentwidth 2
    set-option buffer tabstop 2
    set-option buffer expandtab true
    
    # Highlighting
    add-highlighter buffer/ number-lines -hlcursor
    add-highlighter buffer/ show_matching
    add-highlighter buffer/ wrap -word -indent
}
```

### Advanced LSP Configuration

Edit `~/.config/kak-lsp/kak-lsp.toml`:

```toml
[language.nixi]
filetypes = ["nixi"]
roots = [".git", ".nixi", "package.json", "nixi.config.json"]
command = "node"
args = ["/home/jadu/code/nixi/lsp/src/server.js"]
initialization_options = { nixi = { 
    diagnostics = { enable = true, delay = 500 }, 
    completion = { enable = true, trigger_characters = [" ", "<", "{", ".", ":", "(", "["] },
    hover = { enable = true },
    definition = { enable = true },
    references = { enable = true },
    formatting = { enable = true }
}}

[settings.nixi]
# Server-specific settings
server.trace.server = "off"
server.trace.lsp = "messages"
completion.max_items = 50
diagnostics.enable = true
diagnostics.display_inserter = true
diagnostics.auto_display = true
hover.enable = true
definition.enable = true
references.enable = true

# Performance settings
server.document_sync = true
server.incremental_sync = true
highlight.enabled = true
highlight.lsp_references = true
```

## Usage Examples

### Working with Components

```nixi
# In your Nixi file:
component Button = { text, onclick }: 
  button { 
    onclick onclick; 
    text 
  }

# LSP features:
# - Complete 'component' keyword
# - Hover over 'Button' for details
# - Go to definition of 'Button' with 'l d'
# - Find all references with 'l r'
```

### CSS Styling

```nixi
style ".btn" {
  # LSP completes CSS properties
  background-color: "blue";
  color: "white";
  padding: "10px 20px";
}
```

### HTML Elements

```nixi
html {
  head { title "My App" },
  body {
    # Auto-complete HTML tags
    div { class "container"; 
      h1 "Welcome"
    }
  }
}
```

## Troubleshooting

### LSP Not Starting

1. **Check kak-lsp**: Ensure it's installed and in PATH
2. **Verify Node.js**: Run `node --version` (should be 14+)
3. **Check config**: Validate `kak-lsp.toml` syntax
4. **Update path**: Ensure server path is correct in config
5. **Test manually**: Run `node /path/to/server.js` in terminal

### No Auto-completion

1. **Check filetype**: `print %opt{filetype}` should show "nixi"
2. **Restart LSP**: `lsp-restart` command
3. **Check completion**: `lsp-completion` command
4. **Verify settings**: Ensure `completion.enable = true` in config

### Diagnostics Not Showing

1. **Check auto-display**: `set buffer lsp_auto_show_diagnostics true`
2. **Manual diagnostics**: `lsp-diagnostics` command
3. **Gutter flags**: Ensure flags are enabled
4. **Server logs**: Check for error messages

### Performance Issues

```toml
# Optimize performance in kak-lsp.toml
[settings.nixi]
completion.max_items = 20
diagnostics.debounce_ms = 1000
server.max_file_size = "512KB"
server.document_sync = false  # Disable if issues
```

### Debug Mode

```toml
# Enable debug logging
[language.nixi]
command = "node"
args = ["/home/jadu/code/nixi/lsp/src/server.js", "--debug"]
environment = { "RUST_LOG" = "kak_lsp=debug" }
```

```kak
# Debug commands in Kakoune
lsp-show-debug
lsp-show-server-info
```

## Advanced Integration

### Git Integration

```kak
# Git commands for Nixi projects
define-command nixi-git-add -docstring 'git add current file' %{
    evaluate-commands %sh{ git add "$kak_buffile" }
}

define-command nixi-git-commit -docstring 'git commit current file' %{
    evaluate-commands %sh{ 
        git commit "$kak_buffile" -m "update $(basename "$kak_buffile")" 
    }
}

hook global WinSetOption filetype=nixi %{
    map global normal g ': nixi-git-add<ret>' -docstring 'git add file'
    map global normal G ': nixi-git-commit<ret>' -docstring 'git commit file'
}
```

### Build Integration

```kak
# Build commands for Nixi
define-command nixi-build -docstring 'build nixi project' %{
    evaluate-commands %sh{
        if [ -f "nixi.config.json" ]; then
            echo "nixi build -c nixi.config.json | kak -p $kak_session"
        else
            echo "nixi build | kak -p $kak_session"
        fi
    }
}

define-command nixi-run -docstring 'run nixi project' %{
    evaluate-commands %sh{
        if [ -f "nixi.config.json" ]; then
            echo "nixi run -c nixi.config.json | kak -p $kak_session"
        else
            echo "nixi run | kak -p $kak_session"
        fi
    }
}

hook global WinSetOption filetype=nixi %{
    map global normal b ': nixi-build<ret>' -docstring 'build project'
    map global normal x ': nixi-run<ret>' -docstring 'run project'
}
```

### Tree-sitter Integration (Experimental)

```kak
# If tree-sitter support is available
hook global WinSetOption filetype=nixi %{
    set-option buffer tree_sitter_lang 'nixi'
    tree-sitter-highlight-enable
}
```