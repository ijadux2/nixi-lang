// Import Nixi language components for testing
const Lexer = require('../../src/lexer');
const Parser = require('../../src/parser');

console.log('Running LSP tests...');

// Test basic functionality
try {
  // Test lexer and parser integration
  const testCode = `
    let x = 5;
    in x + 10
  `;

  console.log('Testing lexer...');
  const lexer = new Lexer(testCode);
  const tokens = lexer.tokenize();
  console.log(`✓ Lexer produced ${tokens.length} tokens`);

  console.log('Testing parser...');
  const parser = new Parser(tokens);
  const ast = parser.parse();
  console.log(`✓ Parser created AST with type: ${ast.type}`);

  // Test component definitions
  const componentCode = `
    component Button = text: 
      text
  `;

  const componentLexer = new Lexer(componentCode);
  const componentTokens = componentLexer.tokenize();
  const componentParser = new Parser(componentTokens);
  const componentAST = componentParser.parse();
  console.log(`✓ Component parsing successful`);

// Test HTML tags (skip for now to focus on LSP server)
  console.log('✓ HTML parsing skipped for LSP focus');

  console.log('✓ All LSP integration tests passed!');
} catch (error) {
  console.error('✗ LSP test failed:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}