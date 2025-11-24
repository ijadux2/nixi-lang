# Vim Support for Nixi

This directory contains Vim configuration files for Nixi language support.

## Installation

### Option 1: Manual Installation

Copy the files to your Vim runtime directory:

```bash
# Create directories if they don't exist
mkdir -p ~/.vim/syntax ~/.vim/ftdetect ~/.vim/indent

# Copy Nixi files
cp vim/syntax/nixi.vim ~/.vim/syntax/
cp vim/ftdetect/nixi.vim ~/.vim/ftdetect/
cp vim/indent/nixi.vim ~/.vim/indent/
```

### Option 2: Using a Plugin Manager

If you use a plugin manager like vim-plug, you can add this repository:

```vim
Plug 'ijadux2/nixi', {'rtp': 'vim/'}
```

## Features

- **Syntax Highlighting**: Full syntax highlighting for Nixi keywords, built-in functions, components, and operators
- **File Detection**: Automatic detection of `.nixi` files
- **Smart Indentation**: Context-aware indentation for let blocks, components, styles, and HTML structures

### Highlighted Elements

- **Keywords**: `let`, `in`, `if`, `then`, `else`, `component`, `style`, `true`, `false`, `null`
- **Built-in Functions**: `echo`, `ls`, `cd`, `pwd`, `add`, `multiply`, `divide`, `concat`, `toString`, `length`, `map`, `div`, `span`, `button`, `input`, `h1`, `h2`, `h3`, `p`, `a`, `renderHTML`, `saveHTML`, `addStyle`, `js`, `eval`, `querySelector`, `addEventListener`
- **Components**: Component definitions and calls
- **Strings**: Double and single quoted strings
- **JavaScript Blocks**: `js "..."` blocks
- **HTML Blocks**: `html { ... }` blocks
- **Comments**: `#` comments
- **Numbers**: Integers and floating point numbers

### Indentation Rules

- Indent after opening braces `{` and brackets `[`
- Indent after `let` keyword
- Indent after component definitions `component X = {`
- Indent after style definitions `style "selector" {`
- Indent after HTML blocks `html {`
- Dedent for closing braces `}` and brackets `]`
- Dedent for `in`, `then`, and `else` keywords

## Usage

Once installed, Vim will automatically recognize `.nixi` files and provide syntax highlighting and smart indentation. You can also manually set the filetype:

```vim
:set filetype=nixi
```

## Testing

To test the installation:

1. Open a `.nixi` file: `vim example.nixi`
2. Verify syntax highlighting is working
3. Test indentation by typing code with blocks and components

## Troubleshooting

If syntax highlighting doesn't work:

1. Ensure the files are in the correct directories
2. Restart Vim
3. Check that the filetype is detected: `:set filetype?`
4. Manually set the filetype: `:set filetype=nixi`

If indentation doesn't work:

1. Check that the indent file is loaded: `echo exists('GetNixiIndent')`
2. Verify indent settings: `:set indentexpr?`