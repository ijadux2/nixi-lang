# Nixi Language Support for Cursor Editor

Cursor has built-in LSP support and can use the Nixi Language Server with minimal configuration.

## Installation

### Method 1: Cursor Extension (Recommended)

1. **Install Cursor** (if not already installed)
2. **Add Nixi support** via Cursor's extension system:
   - Open Cursor
   - Go to Settings → Extensions
   - Click "Install Extension from File"
   - Select the `nixi-lsp.json` file

### Method 2: Manual Configuration

1. **Copy configuration file** to Cursor's extensions directory:
   ```bash
   mkdir -p ~/.cursor/extensions/nixi-language-support
   cp lsp/editor-configs/cursor/nixi-lsp.json ~/.cursor/extensions/nixi-language-support/
   ```

2. **Restart Cursor** to load the extension

### Method 3: Workspace Configuration

1. **Create or edit `.cursor/settings.json`** in your project:
   ```json
   {
     "language_servers": {
       "nixi": {
         "command": "node",
         "args": ["/home/jadu/code/nixi/lsp/src/server.js"],
         "filetypes": ["nixi"],
         "settings": {
           "nixi": {
             "diagnostics": { "enable": true },
             "completion": { "enable": true }
           }
         }
       }
     },
     "files.associations": {
       "*.nixi": "nixi"
     }
   }
   ```

## Configuration

### User Settings

Add this to your Cursor user settings (Preferences → Settings):

```json
{
  "nixi.server.path": "/home/jadu/code/nixi/lsp/src/server.js",
  "nixi.debug": false,
  "nixi.completion.enable": true,
  "nixi.diagnostics.enable": true
}
```

### Workspace Settings

Create `.cursor/settings.json` in your project:

```json
{
  "language_servers": {
    "nixi": {
      "command": "node",
      "args": ["${workspaceFolder}/lsp/src/server.js"],
      "filetypes": ["nixi"],
      "root_patterns": [".git", ".nixi"],
      "settings": {
        "nixi": {
          "completion": {
            "enable": true,
            "trigger_characters": [" ", "<", "{", ".", ":", "(", "["]
          }
        }
      }
    }
  }
}
```

## Features in Cursor

Once configured, you'll have:

### ✅ LSP Features
- **IntelliSense** with auto-completion for Nixi keywords
- **Syntax Highlighting** for all Nixi constructs
- **Error Highlighting** with real-time diagnostics
- **Hover Information** for language constructs
- **Go to Definition** (Ctrl/Cmd + Click)
- **Find References** (Shift + F12)
- **Code Formatting** (when implemented)

### ✅ Cursor-Specific Features
- **AI Integration** with Nixi code understanding
- **Cursor Chat** for Nixi-related questions
- **Inline Documentation** with AI explanations
- **Code Actions** and refactoring suggestions
- **Tab Completion** with context awareness

### ✅ Snippets

Use these built-in snippets:
- `comp` → Component definition
- `let` → Let expression
- `if` → If-then-else
- `html` → HTML structure
- `div` → Div element
- `style` → Style definition

## Usage

### File Handling
1. **Open `.nixi` files** - Cursor will automatically detect the file type
2. **Create new `.nixi` files** - Use the Nixi file template
3. **Syntax highlighting** works immediately

### Code Features
1. **Auto-completion**: Triggered automatically or with Ctrl/Cmd + Space
2. **Hover documentation**: Hover over symbols with mouse
3. **Error checking**: Real-time as you type
4. **Navigation**: Ctrl/Cmd + Click to jump to definitions

### AI Integration
Ask Cursor questions about Nixi code:
- "Explain this component"
- "How do I add CSS styling?"
- "Convert this to a component"

## Troubleshooting

### LSP Not Starting
1. **Check Node.js**: Ensure Node.js 14+ is installed
2. **Verify path**: Update the server path in settings
3. **Check permissions**: Ensure the server file is executable

### No Completion
1. **Check file type**: Ensure `.nixi` files are recognized
2. **Restart Cursor**: Reload the editor
3. **Check settings**: Verify completion is enabled

### Debug Mode
Enable debug logging:
```json
{
  "nixi.debug": true
}
```

Then check Console → Developer Tools for LSP logs.

### Manual LSP Start
If automatic detection fails, you can manually start the LSP:
1. Open Command Palette (Ctrl/Cmd + Shift + P)
2. Type "Nixi: Restart Language Server"
3. Check for any error messages

## Advanced Configuration

### Custom Server Path
If you installed Nixi in a different location:
```json
{
  "nixi.server.path": "/custom/path/to/lsp/src/server.js"
}
```

### Multiple Workspace Support
For monorepos with multiple Nixi projects:
```json
{
  "language_servers": {
    "nixi": {
      "root_patterns": ["package.json", ".nixi", "nixi.config.json"],
      "workspace_diagnostics": true
    }
  }
}
```

### Performance Optimization
```json
{
  "nixi": {
    "max_file_size": "1MB",
    "timeout": 5000,
    "trace.server": "off"
  }
}
```