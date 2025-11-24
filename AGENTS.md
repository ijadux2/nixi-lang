# Nixi Development Guidelines

## Build/Test Commands
- `npm test` - Run full test suite
- `node tests/test.js` - Direct test execution
- `npm run dev` - Development mode with file watching
- `npm start` - Start interactive REPL
- `node src/compiler.js file.nixi` - Compile specific file
- `node src/compiler.js --compile file.nixi` - Compile to JavaScript

## Code Style Guidelines

### Imports & Dependencies
- Use CommonJS require() syntax (not ES6 imports)
- Import relative modules first: `const Lexer = require('./lexer')`
- Import built-in modules second: `const fs = require('fs')`
- No external dependencies - project uses zero dependencies

### Naming Conventions
- Classes: PascalCase (Lexer, Parser, Interpreter)
- Functions/variables: camelCase (tokenize, evaluate, currentToken)
- Constants: UPPER_SNAKE_CASE (INTEGER, STRING, LET)
- Files: kebab-case (lexer.js, parser.js, compiler.js)

### Error Handling
- Always include filename in error messages: `${filename}:${error.message}`
- Use try-catch blocks for file operations and parsing
- Throw descriptive Error objects with context
- Log compilation stack traces for debugging

### Code Structure
- Each class in separate file with clear single responsibility
- Use constructor injection for dependencies
- Methods should be small and focused
- Add console.log for compilation steps (Step 1, Step 2, etc.)

### Testing
- Write descriptive test descriptions with `test('should...', () => {})`
- Use assertEqual() for simple comparisons
- Use assertDeepEqual() for object/array comparisons
- Test lexer, parser, interpreter, and GUI components separately
- All tests must pass before committing changes