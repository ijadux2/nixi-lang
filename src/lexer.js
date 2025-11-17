class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.line = 1;
    this.column = 1;
  }

  current() {
    return this.input[this.position];
  }

  peek(offset = 1) {
    return this.input[this.position + offset];
  }

  advance() {
    if (this.current() === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    this.position++;
  }

  skipWhitespace() {
    while (this.position < this.input.length && /\s/.test(this.current())) {
      this.advance();
    }
  }

  skipComment() {
    if (this.current() === '#') {
      while (this.position < this.input.length && this.current() !== '\n') {
        this.advance();
      }
    }
  }

  readString(quote) {
    let value = '';
    this.advance(); // Skip opening quote
    
    while (this.position < this.input.length && this.current() !== quote) {
      if (this.current() === '\\') {
        this.advance();
        if (this.position < this.input.length) {
          const escaped = this.current();
          switch (escaped) {
            case 'n': value += '\n'; break;
            case 't': value += '\t'; break;
            case 'r': value += '\r'; break;
            case '\\': value += '\\'; break;
            case '"': value += '"'; break;
            case "'": value += "'"; break;
            default: value += escaped;
          }
          this.advance();
        }
      } else {
        value += this.current();
        this.advance();
      }
    }
    
    if (this.current() === quote) {
      this.advance(); // Skip closing quote
    }
    
    return { type: 'STRING', value, line: this.line, column: this.column };
  }

  readNumber() {
    let value = '';
    let hasDecimal = false;
    
    while (this.position < this.input.length && 
           (/\d/.test(this.current()) || (this.current() === '.' && !hasDecimal))) {
      if (this.current() === '.') {
        hasDecimal = true;
      }
      value += this.current();
      this.advance();
    }
    
    return {
      type: hasDecimal ? 'FLOAT' : 'INTEGER',
      value: hasDecimal ? parseFloat(value) : parseInt(value),
      line: this.line,
      column: this.column
    };
  }

  readIdentifier() {
    let value = '';
    
    while (this.position < this.input.length && 
           /[a-zA-Z0-9_\-]/.test(this.current())) {
      value += this.current();
      this.advance();
    }
    
    // Check for keywords
    const keywords = {
      'let': 'LET',
      'in': 'IN',
      'if': 'IF',
      'then': 'THEN',
      'else': 'ELSE',
      'component': 'COMPONENT',
      'style': 'STYLE',
      'html': 'HTML',
      'css': 'CSS',
      'js': 'JS',
      'script': 'SCRIPT',
      'link': 'LINK',
      'meta': 'META',
      'head': 'HEAD',
      'body': 'BODY',
      'title': 'TITLE',
      'header': 'HEADER',
      'footer': 'FOOTER',
      'main': 'MAIN',
      'section': 'SECTION',
      'article': 'ARTICLE',
      'aside': 'ASIDE',
      'nav': 'NAV',
      'ul': 'UL',
      'ol': 'OL',
      'li': 'LI',
      'table': 'TABLE',
      'tr': 'TR',
      'td': 'TD',
      'th': 'TH',
      'thead': 'THEAD',
      'tbody': 'TBODY',
      'img': 'IMG',
      'video': 'VIDEO',
      'audio': 'AUDIO',
      'canvas': 'CANVAS',
      'svg': 'SVG',
      'form': 'FORM',
      'label': 'LABEL',
      'select': 'SELECT',
      'option': 'OPTION',
      'textarea': 'TEXTAREA',
      'iframe': 'IFRAME',
      'true': 'TRUE',
      'false': 'FALSE',
      'null': 'NULL'
    };
    
    const type = keywords[value] || 'IDENTIFIER';
    
    return { type, value, line: this.line, column: this.column };
  }

  readOperator() {
    const char = this.current();
    const next = this.peek();
    
    // HTML tag delimiters
    if (char === '<' && next !== '/') {
      this.advance();
      return { type: 'LT', value: '<', line: this.line, column: this.column };
    }
    
    if (char === '<' && next === '/') {
      this.advance(); this.advance();
      return { type: 'LT_SLASH', value: '</', line: this.line, column: this.column };
    }
    
    if (char === '/' && next === '>') {
      this.advance(); this.advance();
      return { type: 'SLASH_GT', value: '/>', line: this.line, column: this.column };
    }
    
    if (char === '>') {
      this.advance();
      return { type: 'GT', value: '>', line: this.line, column: this.column };
    }
    
    // Multi-character operators
    if (char === '=' && next === '=') {
      this.advance(); this.advance();
      return { type: 'EQ', value: '==', line: this.line, column: this.column };
    }
    
    if (char === '!' && next === '=') {
      this.advance(); this.advance();
      return { type: 'NEQ', value: '!=', line: this.line, column: this.column };
    }
    
    if (char === '<' && next === '=') {
      this.advance(); this.advance();
      return { type: 'LTE', value: '<=', line: this.line, column: this.column };
    }
    
    if (char === '>' && next === '=') {
      this.advance(); this.advance();
      return { type: 'GTE', value: '>=', line: this.line, column: this.column };
    }
    
    if (char === '&' && next === '&') {
      this.advance(); this.advance();
      return { type: 'AND', value: '&&', line: this.line, column: this.column };
    }
    
    if (char === '|' && next === '|') {
      this.advance(); this.advance();
      return { type: 'OR', value: '||', line: this.line, column: this.column };
    }
    
    // Single-character operators
    const operators = {
      '+': 'PLUS',
      '-': 'MINUS',
      '*': 'MULTIPLY',
      '/': 'DIVIDE',
      '=': 'ASSIGN',
      ':': 'COLON',
      ';': 'SEMICOLON',
      ',': 'COMMA',
      '.': 'DOT',
      '(': 'LPAREN',
      ')': 'RPAREN',
      '{': 'LBRACE',
      '}': 'RBRACE',
      '[': 'LBRACKET',
      ']': 'RBRACKET',
      '@': 'AT',
      '#': 'HASH'
    };
    
    const type = operators[char];
    if (type) {
      this.advance();
      return { type, value: char, line: this.line, column: this.column };
    }
    
    throw new Error(`Unexpected character: ${char} at line ${this.line}, column ${this.column}`);
  }

  readHTMLTag() {
    let value = '';
    const startLine = this.line;
    const startColumn = this.column;
    
    // We're at a '<', read until '>'
    while (this.position < this.input.length && this.current() !== '>') {
      value += this.current();
      this.advance();
    }
    
    if (this.current() === '>') {
      value += this.current();
      this.advance();
    }
    
    return { type: 'HTML_TAG', value, line: startLine, column: startColumn };
  }

  readCSSRule() {
    let value = '';
    const startLine = this.line;
    const startColumn = this.column;
    
    // Read CSS content until closing brace
    let braceCount = 1;
    this.advance(); // Skip opening brace
    
    while (this.position < this.input.length && braceCount > 0) {
      const char = this.current();
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      
      if (braceCount > 0) value += char;
      this.advance();
    }
    
    return { type: 'CSS_RULE', value, line: startLine, column: startColumn };
  }

  readJSCode() {
    let value = '';
    const startLine = this.line;
    const startColumn = this.column;
    
    // Read JavaScript content until closing tag
    while (this.position < this.input.length) {
      if (this.current() === '<' && this.peek(1) === '/') {
        const nextChars = this.input.substring(this.position, this.position + 9);
        if (nextChars === '</script>') break;
      }
      value += this.current();
      this.advance();
    }
    
    return { type: 'JS_CODE', value, line: startLine, column: startColumn };
  }

  tokenize() {
    const tokens = [];
    
    while (this.position < this.input.length) {
      this.skipWhitespace();
      
      if (this.position >= this.input.length) break;
      
      // Skip comments
      if (this.current() === '#') {
        this.skipComment();
        continue;
      }
      
      const char = this.current();
      const next = this.peek();
      
      // Handle HTML tags
      if (char === '<') {
        if (next === '!' && this.peek(2) === '-' && this.peek(3) === '-') {
          // HTML comment
          tokens.push(this.readHTMLComment());
        } else if (next === '/') {
          // Closing tag
          tokens.push(this.readHTMLTag());
        } else {
          // Opening tag or self-closing tag
          tokens.push(this.readHTMLTag());
        }
        continue;
      }
      
      // Handle CSS rules
      if (char === '{' && this.position > 0) {
        // Check if this might be CSS (look back for selector)
        const prevChar = this.input[this.position - 1];
        if (prevChar === ')' || prevChar === ']' || /\w/.test(prevChar)) {
          tokens.push(this.readCSSRule());
          continue;
        }
      }
      
      // Handle JavaScript code blocks
      if (char === '<' && next === 's' && this.peek(2) === 'c' && this.peek(3) === 'r' && 
          this.peek(4) === 'i' && this.peek(5) === 'p' && this.peek(6) === 't') {
        tokens.push(this.readHTMLTag());
        if (this.current() !== '>') {
          tokens.push(this.readJSCode());
        }
        continue;
      }
      
      if (char === '"' || char === "'") {
        tokens.push(this.readString(char));
      } else if (/\d/.test(char)) {
        tokens.push(this.readNumber());
      } else if (/[a-zA-Z_]/.test(char)) {
        tokens.push(this.readIdentifier());
      } else {
        tokens.push(this.readOperator());
      }
    }
    
    tokens.push({ type: 'EOF', value: null, line: this.line, column: this.column });
    return tokens;
  }

  readHTMLComment() {
    let value = '';
    const startLine = this.line;
    const startColumn = this.column;
    
    // Read until -->
    while (this.position < this.input.length) {
      const current = this.current();
      const next = this.peek();
      const nextNext = this.peek(2);
      
      value += current;
      this.advance();
      
      if (current === '-' && next === '-' && nextNext === '>') {
        value += next + nextNext;
        this.advance(); this.advance();
        break;
      }
    }
    
    return { type: 'HTML_COMMENT', value, line: startLine, column: startColumn };
  }
}

module.exports = Lexer;