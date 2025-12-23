# Nixi Language Support for Kate/KDevelop

Kate and KDevelop have built-in LSP support through the LSP Client plugin and can use Nixi Language Server with proper configuration.

## Installation

### Prerequisites

1. **Kate** (version 21.08+ recommended) or **KDevelop** (version 5.6+)
2. **Node.js 14+** (for running Nixi LSP server)
3. **LSP Client Plugin** (usually included by default)

### Method 1: Kate Configuration

1. **Open Kate Settings**:
   - Kate: `Settings` → `Configure Kate...` → `LSP Client`
   - KDevelop: `Settings` → `Configure KDevelop...` → `Language Support` → `LSP Client`

2. **Add Nixi Server**:
   - Click `Add Server...`
   - Select `Custom` server type
   - Use the configuration below

3. **Import Configuration**:
   ```bash
   # Copy config to Kate directory
   cp lsp/editor-configs/kate/nixi-lsp.json ~/.config/kate/lspclient/
   
   # Or for KDevelop
   cp lsp/editor-configs/kate/nixi-lsp.json ~/.config/kdevlspclient/
   ```

### Method 2: Manual Configuration

#### For Kate:

1. **Open Kate** → `Settings` → `Configure Kate...`
2. **Navigate** to `LSP Client` tab
3. **Click** `Add Server...`
4. **Configure** as follows:

**Server Name**: `nixi`
**Command**: `node`
**Arguments**: `/home/jadu/code/nixi/lsp/src/server.js`
**Root**: `"$HOME/code/nixi"`
**Language**: `nixi`
**File Types**: `*.nixi`
**Initialization Options**:
```json
{
  "nixi": {
    "diagnostics": { "enable": true },
    "completion": { "enable": true },
    "hover": { "enable": true }
  }
}
```

#### For KDevelop:

1. **Open KDevelop** → `Settings` → `Configure KDevelop...`
2. **Navigate** to `Language Support` → `LSP Client`
3. **Click** `Add Server...`
4. **Use same configuration** as above

## Configuration

### Complete JSON Configuration

Edit `~/.config/kate/lspclient/nixi-lsp.json` (for Kate) or `~/.config/kdevlspclient/nixi-lsp.json` (for KDevelop):

```json
{
  "servers": {
    "nixi": {
      "command": ["node", "/home/jadu/code/nixi/lsp/src/server.js"],
      "rootIndicators": [".git", ".nixi", "package.json", "nixi.config.json"],
      "initializationOptions": {
        "nixi": {
          "diagnostics": { "enable": true },
          "completion": { "enable": true },
          "hover": { "enable": true },
          "definition": { "enable": true },
          "references": { "enable": true },
          "formatting": { "enable": true }
        }
      },
      "settings": {
        "nixi": {
          "server": {
            "path": "/home/jadu/code/nixi/lsp/src/server.js",
            "debug": false,
            "trace": {
              "server": "off",
              "lsp": "messages"
            }
          },
          "completion": {
            "enable": true,
            "autoTrigger": true,
            "triggerCharacters": [" ", "<", "{", ".", ":", "(", "["],
            "maxItems": 50
          },
          "diagnostics": {
            "enable": true,
            "delay": 500,
            "autoDisplay": true,
            "displayInserter": true
          },
          "hover": {
            "enable": true,
            "showDocumentation": true
          },
          "definition": {
            "enable": true,
            "jumpToDefinition": true
          },
          "references": {
            "enable": true,
            "includeDeclaration": true
          },
          "formatting": {
            "enable": true,
            "formatOnSave": false,
            "formatOnType": false
          }
        }
      },
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### File Type Association

1. **Kate**: `Settings` → `Configure Kate...` → `File Open/Save`
2. **KDevelop**: `Settings` → `Configure KDevelop...` → `Language Support`

Add file type:
- **File Type**: `Nixi Source File`
- **Mime Type**: `text/x-nixi`
- **Patterns**: `*.nixi`
- **Editor**: `Normal Text`
- **Language**: `nixi`

### Syntax Highlighting

1. **Download syntax file**:
   ```bash
   mkdir -p ~/.local/share/org.kde.syntax-highlighting/syntax/
   cp vscode-extension/syntaxes/nixi.tmLanguage.json ~/.local/share/org.kde.syntax-highlighting/syntax/nixi.xml
   ```

2. **Create syntax definition** for Kate:
   ```xml
   <!-- ~/.local/share/org.kde.syntax-highlighting/syntax/nixi.xml -->
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE language SYSTEM "language.dtd">
   <language name="Nixi" version="1.0" kateversion="15.0" extensions="*.nixi" mimetype="text/x-nixi" author="Nixi Team" license="MIT">
     <highlighting>
       <contexts>
         <context name="Normal" attribute="Normal Text" lineEndContext="#stay">
           <!-- Keywords -->
           <keyword attribute="Keyword" String="let in if then else component style html css js script link meta head body title header footer main section article aside nav ul ol li table tr td th thead tbody img video audio canvas svg form label select option textarea iframe true false null" />
           
           <!-- Comments -->
           <RegExpr attribute="Comment" String="#.*$" />
           <RegExpr attribute="Comment" String="&lt;!--.*?--&gt;" />
           
           <!-- Strings -->
           <RegExpr attribute="String" String="&quot;[^&quot;]*&quot;" />
           <RegExpr attribute="String" String="'[^']*'" />
           
           <!-- Numbers -->
           <RegExpr attribute="Number" String="\b\d+(\.\d+)?\b" />
           
           <!-- HTML Tags -->
           <RegExpr attribute="Keyword" String="&lt;/?\w+.*?/?&gt;" />
         </context>
       </contexts>
       <itemDatas>
         <itemData name="Normal Text" defStyleNum="dsNormal" />
         <itemData name="Keyword" defStyleNum="dsKeyword" />
         <itemData name="Comment" defStyleNum="dsComment" />
         <itemData name="String" defStyleNum="dsString" />
         <itemData name="Number" defStyleNum="dsFloat" />
       </itemDatas>
     </highlighting>
     <general>
       <comments>
         <comment name="singleLine" start="#" />
         <comment name="multiLine" start="&lt;!--" end="--&gt;" />
       </comments>
       <keywords casesensitive="1" weakDeliminator="\t\\()[]{}<>,.;:\"'`">
         <keyword name="let" />
         <keyword name="in" />
         <keyword name="if" />
         <keyword name="then" />
         <keyword name="else" />
         <keyword name="component" />
         <keyword name="style" />
         <keyword name="html" />
         <keyword name="css" />
         <keyword name="js" />
         <keyword name="true" />
         <keyword name="false" />
         <keyword name="null" />
       </keywords>
     </general>
   </language>
   ```

## Features

Once configured, Kate/KDevelop provides:

### ✅ Core LSP Features
- **Syntax Highlighting** for all Nixi constructs
- **Code Completion** with `Ctrl+Space`
- **Hover Documentation** with `Ctrl+Hover` or `F1`
- **Goto Definition** with `F2` or `Ctrl+Click`
- **Find References** with `Ctrl+Shift+F`
- **Error Diagnostics** in gutter and problem panel
- **Rename Symbol** with `F6` or `Ctrl+R`
- **Code Formatting** (when implemented)

### ✅ Kate-Specific Features
- **Multiple Document Interface** with LSP support
- **Project Management** integration
- **Git Integration** through built-in plugins
- **Sessions** with LSP state preserved
- **Split Views** with synchronized LSP

### ✅ KDevelop-Specific Features
- **Project Build Integration**
- **Debug Integration**
- **Class Browser** for Nixi components
- **Refactoring Tools**
- **Code Analysis** with advanced features

## Key Bindings

### Default LSP Key Bindings (Kate)

| Key | Action |
|-----|--------|
| `Ctrl+Space` | Trigger completion |
| `Ctrl+Hover` / `F1` | Hover documentation |
| `F2` | Go to definition |
| `Ctrl+Click` | Go to definition |
| `Ctrl+Shift+F` | Find references |
| `F6` | Rename symbol |
| `Ctrl+Alt+R` | Rename symbol (alternative) |
| `Ctrl+I` | Go to implementation |
| `Ctrl+Shift+I` | Go to type definition |

### Default LSP Key Bindings (KDevelop)

| Key | Action |
|-----|--------|
| `Ctrl+Space` | Trigger completion |
| `F1` | Hover documentation |
| `F2` | Go to definition |
| `Ctrl+Click` | Go to definition |
| `Ctrl+Alt+F` | Find references |
| `F6` | Rename symbol |
| `Ctrl+Shift+R` | Rename symbol (alternative) |
| `Ctrl+Alt+I` | Go to implementation |
| `Alt+Left` | Go back |
| `Alt+Right` | Go forward |

### Custom Key Bindings

Add custom key bindings in `Settings` → `Configure Keyboard Shortcuts`:

**Kate**:
- `Code → Show Completion`: `Ctrl+J`
- `Code → Quick Documentation`: `Ctrl+K`
- `Code → Rename Symbol Under Cursor`: `Ctrl+R`

**KDevelop**:
- `Code → Completion`: `Ctrl+J`
- `Code → Quick Assist`: `Ctrl+K`
- `Code → Rename Symbol`: `Ctrl+R`

## Usage

### Working with Nixi Files

1. **Open `.nixi` files** - Kate/KDevelop should auto-detect
2. **Manual file type**: `Tools` → `Highlight Mode` → `Nixi` if not auto-detected
3. **Project setup**: Create project file for better LSP performance

### Code Editing Features

1. **Auto-completion**: Type `Ctrl+Space` or enable auto-popup
2. **Documentation**: Hover over symbols or press `F1`
3. **Navigation**: Click symbols with `Ctrl+Click` or use `F2`
4. **Error checking**: Errors appear in gutter and problem view

### Project Integration

**Kate**:
1. **Create project**: `Project` → `New Project...`
2. **Add files**: Include `.nixi` files
3. **Configure LSP**: Ensure project root is detected

**KDevelop**:
1. **Open/Import Project**: Supports Git, CMake, etc.
2. **Configure LSP**: `Settings` → `Language Support`
3. **Build Integration**: Configure build commands

## Troubleshooting

### LSP Not Starting

1. **Check LSP Client**: Ensure plugin is enabled
2. **Verify Node.js**: Check with `node --version`
3. **Check server path**: Update path in configuration
4. **Test manually**: Run `node /path/to/server.js`

### No Completion

1. **Check file type**: Verify `.nixi` is recognized as Nixi
2. **Restart LSP**: `LSP Client` → `Restart Server`
3. **Check settings**: Ensure completion is enabled
4. **Verify plugins**: Ensure LSP Client plugin is active

### Syntax Highlighting Issues

1. **Install syntax**: Ensure syntax file is in correct location
2. **Restart Kate/KDevelop**: Reload syntax definitions
3. **Check association**: Verify file type mapping
4. **Manual selection**: Force syntax highlighting mode

### Performance Issues

```json
{
  "settings": {
    "nixi": {
      "server": {
        "trace": { "server": "off", "lsp": "off" }
      },
      "completion": { "maxItems": 20 },
      "diagnostics": { "delay": 1000 }
    }
  }
}
```

### Debug Mode

```json
{
  "servers": {
    "nixi": {
      "command": ["node", "/path/to/server.js", "--debug"],
      "env": {
        "NODE_DEBUG": "lsp",
        "NODE_ENV": "development"
      }
    }
  }
}
```

## Advanced Configuration

### Multiple Workspaces

```json
{
  "servers": {
    "nixi-work": {
      "command": ["node", "$HOME/work/nixi/lsp/src/server.js"],
      "rootIndicators": ["work.config.json", ".git"]
    },
    "nixi-personal": {
      "command": ["node", "$HOME/personal/nixi/lsp/src/server.js"],
      "rootIndicators": ["personal.config.json", ".nixi"]
    }
  }
}
```

### Build Integration

**Kate**:
```json
{
  "buildTools": {
    "nixi": {
      "name": "Nixi Build",
      "executable": "nixi",
      "arguments": ["build", "--file", "%f"],
      "workingDirectory": "%d"
    }
  }
}
```

**KDevelop**:
1. **Project Settings** → `Build` → `Build Tools`
2. **Add Custom Tool**: Nixi build command
3. **Configure**: Build arguments and working directory

### Git Integration

**Kate**:
1. **Enable Git Plugin**: `Settings` → `Plugins` → `Git`
2. **Configure**: Set Git repository path
3. **LSP Integration**: Git status in LSP diagnostics

**KDevelop**:
1. **Git Integration**: Built-in support
2. **Configure**: Project settings → Git
3. **Features**: Blame, diff, commit integration