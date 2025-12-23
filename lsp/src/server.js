const { createConnection, TextDocuments, ProposedFeatures, InitializeRequest, TextDocumentSyncKind, CompletionRequest, HoverRequest, SignatureHelpRequest, DefinitionRequest, TextDocumentPositionParams, CompletionItemKind, Hover, TextDocument } = require('vscode-languageserver');

// Import Nixi language components
const Lexer = require('../../src/lexer');
const Parser = require('../../src/parser');

// Create connection for the server
const connection = createConnection(ProposedFeatures.all);

// Create a text document manager
const documents = new TextDocuments(TextDocument);

// Nixi language keywords and completion items
const NIXI_KEYWORDS = [
  'let', 'in', 'if', 'then', 'else',
  'component', 'style', 'html', 'css', 'js',
  'script', 'link', 'meta', 'head', 'body',
  'title', 'header', 'footer', 'main', 'section',
  'article', 'aside', 'nav', 'ul', 'ol', 'li',
  'table', 'tr', 'td', 'th', 'thead', 'tbody',
  'img', 'video', 'audio', 'canvas', 'svg',
  'form', 'label', 'select', 'option', 'textarea', 'iframe',
  'true', 'false', 'null'
];

const HTML_TAGS = [
  'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'a', 'button', 'input', 'textarea', 'select', 'option',
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'img', 'video', 'audio', 'canvas', 'svg',
  'form', 'fieldset', 'legend', 'label',
  'header', 'footer', 'nav', 'main', 'section', 'article', 'aside'
];

const CSS_PROPERTIES = [
  'color', 'background-color', 'font-size', 'font-family', 'font-weight',
  'margin', 'padding', 'width', 'height', 'display', 'position',
  'border', 'border-radius', 'box-shadow', 'text-align', 'line-height'
];

class NixiLanguageServer {
  constructor() {
    this.documents = new Map(); // Store document ASTs
    this.setupConnectionHandlers();
  }

  setupConnectionHandlers() {
    // Set up connection event handlers
    connection.onInitialize((params) => {
      // LSP server initialized
      return {
        capabilities: {
          textDocumentSync: TextDocumentSyncKind.Full,
          completionProvider: {
            resolveProvider: false,
            triggerCharacters: [' ', '<', '{', '.', ':', '(', '[']
          },
          hoverProvider: true,
          definitionProvider: true,
          signatureHelpProvider: {
            triggerCharacters: ['(', '{']
          },
          documentSymbolProvider: true
        }
      };
    });

    connection.onCompletion(this.onCompletion.bind(this));
    connection.onHover(this.onHover.bind(this));
    connection.onDefinition(this.onDefinition.bind(this));
    connection.onSignatureHelp(this.onSignatureHelp.bind(this));
    connection.onDocumentSymbol(this.onDocumentSymbol.bind(this));

    // Document change handlers
    documents.onDidChangeContent(this.onDocumentChange.bind(this));
    documents.onDidClose(this.onDocumentClose.bind(this));
  }

  onDocumentChange(change) {
    const uri = change.document.uri;
    const text = change.document.getText();
    
    try {
      // Parse the document
      const lexer = new Lexer(text);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const ast = parser.parse();
      
      // Store the AST and any parse errors
      this.documents.set(uri, {
        ast,
        tokens,
        errors: [], // TODO: Extract parse errors
        lexer,
        parser
      });

      // Send diagnostics (if any errors)
      this.sendDiagnostics(uri, []);
    } catch (error) {
      console.error(`Parse error in ${uri}:`, error.message);
      
      // Store error information
      this.documents.set(uri, {
        ast: null,
        tokens: [],
        errors: [{ message: error.message, line: 1, column: 1 }],
        lexer: null,
        parser: null
      });

      // Send error diagnostics
      this.sendDiagnostics(uri, [{
        range: {
          start: { line: 0, character: 0 },
          end: { line: 0, character: 1 }
        },
        severity: 1, // Error
        message: error.message,
        source: 'nixi'
      }]);
    }
  }

  onDocumentClose(event) {
    this.documents.delete(event.document.uri);
  }

  sendDiagnostics(uri, diagnostics) {
    connection.sendDiagnostics({ uri, diagnostics });
  }

  onCompletion(params) {
    const uri = params.textDocument.uri;
    const document = documents.get(uri);
    
    if (!document) return [];

    const text = document.getText();
    const position = params.position;
    const line = text.split('\n')[position.line];
    const prefix = line.substring(0, position.character);

    const completions = [];

    // Complete Nixi keywords
    if (this.shouldCompleteKeywords(prefix)) {
      NIXI_KEYWORDS.forEach(keyword => {
        completions.push({
          label: keyword,
          kind: CompletionItemKind.Keyword,
          documentation: `Nixi keyword: ${keyword}`
        });
      });
    }

    // Complete HTML tags
    if (prefix.includes('<')) {
      HTML_TAGS.forEach(tag => {
        completions.push({
          label: tag,
          kind: CompletionItemKind.Class,
          documentation: `HTML tag: <${tag}>`,
          insertText: `${tag}>`,
          filterText: `<${tag}>`
        });
      });
    }

    // Complete CSS properties
    if (prefix.includes('{') || prefix.includes(':')) {
      CSS_PROPERTIES.forEach(prop => {
        completions.push({
          label: prop,
          kind: CompletionItemKind.Property,
          documentation: `CSS property: ${prop}`
        });
      });
    }

    return completions;
  }

  onHover(params) {
    const uri = params.textDocument.uri;
    const document = this.documents.get(uri);
    
    if (!document || !document.ast) return null;

    const text = document.getText();
    const position = params.position;
    const line = text.split('\n')[position.line];
    const word = this.getWordAtPosition(line, position.character);

    if (!word) return null;

    // Provide hover information for keywords
    if (NIXI_KEYWORDS.includes(word)) {
      return {
        contents: `**${word}**\n\nNixi language keyword.`
      };
    }

    // Provide hover information for HTML tags
    if (HTML_TAGS.includes(word)) {
      return {
        contents: `**${word}**\n\nHTML element.`
      };
    }

    // Provide hover information for CSS properties
    if (CSS_PROPERTIES.includes(word)) {
      return {
        contents: `**${word}**\n\nCSS property.`
      };
    }

    return null;
  }

  onDefinition(params) {
    const uri = params.textDocument.uri;
    const document = this.documents.get(uri);
    
    if (!document || !document.ast) return null;

    const text = document.getText();
    const position = params.position;
    const line = text.split('\n')[position.line];
    const word = this.getWordAtPosition(line, position.character);

    if (!word) return null;

    // Find all occurrences of the identifier in the document
    const locations = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const lineText = lines[i];
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      let match;

      while ((match = regex.exec(lineText)) !== null) {
        // Check if this is a definition (assignment, component definition, let binding, etc.)
        const beforeMatch = lineText.substring(0, match.index);
        const isDefinition = 
          beforeMatch.includes('component ') ||
          beforeMatch.includes('let ') ||
          beforeMatch.match(/\w+\s*=\s*$/) ||
          beforeMatch.includes('function ') ||
          beforeMatch.includes('const ') ||
          beforeMatch.includes('var ');

        if (isDefinition) {
          locations.push({
            uri: uri,
            range: {
              start: { line: i, character: match.index },
              end: { line: i, character: match.index + word.length }
            }
          });
        }
      }
    }

    return locations.length > 0 ? locations : null;
  }

  onSignatureHelp(params) {
    // TODO: Implement signature help for function calls
    return null;
  }

  onDocumentSymbol(params) {
    const uri = params.textDocument.uri;
    const document = this.documents.get(uri);
    
    if (!document || !document.ast) return [];

    const symbols = [];

    // TODO: Extract symbols from AST
    // For now, return empty array
    return symbols;
  }

  shouldCompleteKeywords(prefix) {
    // Complete keywords if we're at start of line or after certain characters
    return /^(\s*)$/.test(prefix) || 
           prefix.endsWith(' ') || 
           prefix.endsWith('\n') ||
           prefix.endsWith(';') ||
           prefix.endsWith('{') ||
           prefix.endsWith('}');
  }

  getWordAtPosition(line, character) {
    // Extract word at cursor position
    const before = line.substring(0, character);
    const after = line.substring(character);
    
    const beforeMatch = before.match(/[a-zA-Z0-9_\-]*$/);
    const afterMatch = after.match(/^[a-zA-Z0-9_\-]*/);
    
    if (beforeMatch && afterMatch) {
      return beforeMatch[0] + afterMatch[0];
    }
    
    return null;
  }
}

// Start the language server
const server = new NixiLanguageServer();

// Listen for the connection
connection.listen();

// Make the text document manager listen on the connection
documents.listen(connection);

// Handle command line arguments for LSP protocol
// Using stdio for LSP communication (no print statements to avoid interfering with protocol)