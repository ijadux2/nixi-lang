# Nixi Compiler Usage Guide

## Overview

The Nixi compiler is a powerful tool that compiles Nixi code to JavaScript and executes it. It provides multiple modes of operation including direct execution, compilation output, and interactive REPL.

## Basic Usage

### 1. Running Nixi Files

```bash
# Run a Nixi file directly
nixi examples/simple-gui.nixi

# Using npm scripts
npm run example:gui
npm run example:math
npm run example:dashboard
```

### 2. Interactive REPL

```bash
# Start REPL mode
nixi

# Or using npm
npm start
```

In REPL mode, you can:
- Enter Nixi expressions interactively
- Get immediate results
- Use all language features
- Type `exit` to quit

Example REPL session:
```
nixi> let x = 42; y = 23; in add(x, y)
65
nixi> echo "Hello from REPL"
Hello from REPL
nixi> div { text: "Hello World" }
{ type: 'div', props: { text: 'Hello World' } }
nixi> exit
Goodbye!
```

### 3. Compilation to JavaScript

```bash
# Compile to JavaScript and save to file
nixi --compile examples/simple-gui.nixi > compiled.js

# Compile and view output
nixi --compile config/math-demo.nixi
```

## Language Features

### 1. Basic Operations

```nixi
# Arithmetic operations
let
  x = 42;
  y = 23;
  sum = add(x, y);
  product = multiply(x, y);
in
  echo "Sum: ${sum}, Product: ${product}"
```

### 2. String Operations

```nixi
let
  greeting = "Hello";
  name = "World";
  message = greeting + ", " + name + "!";
in
  echo message
```

### 3. GUI Components

```nixi
let
  app = div {
    class: "container";
    children: [
      h1 { text: "Welcome to Nixi" };
      p { text: "This is a GUI example" };
      button { 
        text: "Click me";
        onClick: () => echo "Button clicked!"
      }
    ]
  };
in
  saveHTML(app, "example.html", "Nixi GUI Example")
```

### 4. Styling

```nixi
let
  # Define styles
  _ = addStyle ".container" {
    background: "#f0f0f0";
    padding: "20px";
    border-radius: "8px"
  };
  
  _ = addStyle ".button" {
    background: "#007bff";
    color: "white";
    padding: "10px 20px";
    border: "none";
    border-radius: "4px"
  };
  
  app = div {
    class: "container";
    children: [
      h1 { text: "Styled App" };
      button { class: "button"; text: "Styled Button" }
    ]
  };
in
  saveHTML(app, "styled.html", "Styled Nixi App")
```

### 5. File System Operations

```nixi
let
  files = ls ".";
  currentDir = pwd();
  _ = echo "Current directory: ${currentDir}";
  _ = echo "Files: ${files}";
in
  "File operations completed"
```

### 6. Component Definitions

```nixi
component Card = { title, content }:
  div {
    class: "card";
    children: [
      h3 { text: title };
      p { text: content }
    ]
  };

component App = {}:
  div {
    class: "app";
    children: [
      Card { title: "Welcome"; content: "This is a card component" };
      Card { title: "Features"; content: "Reusable components work!" }
    ]
  };

in
  saveHTML(App {}, "components.html", "Component Example")
```

## Advanced Features

### 1. Conditional Logic

```nixi
let
  age = 25;
  message = if age >= 18 then "Adult" else "Minor";
in
  echo message
```

### 2. Arrays and Objects

```nixi
let
  numbers = [1, 2, 3, 4, 5];
  person = {
    name: "Alice";
    age: 30;
    city: "New York"
  };
  doubled = map (x: multiply(x, 2)) numbers;
in
  echo "Person: ${person}, Doubled numbers: ${doubled}"
```

### 3. Function Definitions

```nixi
let
  # Function with positional parameters
  greet = name: "Hello, " + name + "!";
  
  # Function with named parameters
  createPerson = { name, age }: {
    name: name;
    age: age;
    isAdult: age >= 18
  };
  
  person = createPerson { name: "Bob"; age: 25 };
in
  echo greet(person.name)
```

## Debugging

### 1. Debug Output

The compiler automatically writes compiled JavaScript to `debug_output.js` for inspection:

```bash
nixi examples/simple-gui.nixi
# Check debug_output.js to see generated JavaScript
```

### 2. Error Handling

```nixi
let
  result = if true then "Success" else "Error";
in
  echo result
```

## Project Structure

```
nixi/
├── src/
│   ├── compiler.js     # Main compiler (replaces cli.js)
│   ├── lexer.js        # Lexical analyzer
│   ├── parser.js       # Parser
│   ├── interpreter.js  # Interpreter (for reference)
│   └── gui-renderer.js # GUI rendering engine
├── config/             # Configuration examples
├── examples/           # GUI examples
└── tests/             # Test suite
```

## npm Scripts

```bash
# Development
npm start              # Start compiler in REPL mode
npm run dev            # Watch mode for development
npm test              # Run test suite

# Examples
npm run example:gui    # Run GUI example
npm run example:math   # Run math demo
npm run example:config # Run config example
npm run example:dashboard # Run dashboard example

# Installation
npm run install:windows # Windows installation
npm run install:macos   # macOS installation
npm run install:linux   # Linux installation
```

## Best Practices

1. **Use let expressions** for complex logic
2. **Define components** for reusable UI elements
3. **Add styles** using the addStyle function
4. **Test in REPL** before writing to files
5. **Check debug_output.js** for generated JavaScript
6. **Use meaningful variable names** and component names

## Migration from cli.js

The new compiler provides all functionality of the old CLI plus:

- ✅ REPL mode (same as before)
- ✅ File execution (same as before)
- ✅ Help and version commands (same as before)
- ✅ **NEW**: Compilation to JavaScript output
- ✅ **NEW**: Better error messages
- ✅ **NEW**: Enhanced GUI support
- ✅ **NEW**: Component definitions

No changes needed to existing Nixi files - they work exactly the same!