
import { Parser } from '/science/computing/compilers/parser.mjs'


/**
 * 
 */
export class Token {
  constructor(line,column,sequence,type) {
    this.line = line
    this.column = column
    this.sequence = sequence
    this.type = type
  }

  static Type = Object.freeze({
    null: 'null',
    boolean: 'boolean',
    number: 'number',
    string: 'string',
    key: 'key',
    newline: 'newline',
    indent: 'indent',
    dedent: 'dedent',
    comma: 'comma',
    colon: 'colon',
    listItem: 'hyphen',
    squareOpen: 'sqrOp',
    squareClose: 'sqrCl',
    curlyOpen: 'crlOp',
    curlyClose: 'crlCl',
    parenOpen: 'parOp',
    parenClose: 'parenCl',
  })
}

/**
 * This Lexer works in a lazy way, only consuming as much of the input as
 * needed to produce the next token(s).
 */
export class YamlLexer {
  /**
   * 
   */
  constructor() {

  }

  /**
   * 
   * @param {string} input 
   */
  *lex(input) {
    "use strict";
    const length = input.length
    let lastPosition = -1
    let position = 0
    
    let line = 0
    let column = 0
    function advanceLine() {
      line++
      column = 0
    }
    function advancePosition() {
      lastPosition = position
    }

    function* yieldType(type) {
      yield new Token(line, column, input.substring(lastPosition+1, position+1), type);
      advancePosition()
    }
    while (position < length) {
      let char = input[position]
      switch (char) {
        case '(':
          yield* yieldType(Token.Type.parenOpen);
          break;
        case ')':
          yield* yieldType(Token.Type.parenClose);
          break;
        case '{':
          yield* yieldType(Token.Type.curlyOpen);
          break;
        case '}':
          yield* yieldType(Token.Type.curlyClose);
          break;
        case '[':
          yield* yieldType(Token.Type.squareOpen);
          break;
        case ']':
          yield* yieldType(Token.Type.squareClose);
          break;
        case ':':
          yield* yieldType(Token.Type.colon);
          break;
        case ',':
          yield* yieldType(Token.Type.comma);
          break;
        case '-':
          yield* yieldType(Token.Type.listItem);
          break;
        case '\n':
          yield* yieldType(Token.Type.newline);
          advanceLine()
          break;
        default:
          if (char >= 'a' && char <= 'z') {

          } else if (char >= 'A' && char <= 'Z') {

          } else if (char >= '0' && char <= '9') {

          } else {

          }
          break;
      }

    }

    return
  }
}

/**
 * Array<Char>|String --[Lexer]--> Array<Token>|TokenSequence
 * TokenSequence --[Parser]--> AST/IR
 * AST/IR --[Target/Platform]--> ???
 */
export class TokenSequence {

  /**
   * @param {YamlLexer} lexer
   */
  constructor(lexer) {
    this.lexer = lexer
    this.position = 0
  }

  hasNext() {
    // TODO: return whether or not there is another character from the 
    //   current position
    return true;
  }

  /**
   * @returns {Token} The next token in the sequence, if any, and 
   * advances the cursor.
   */
  next() {
    // TODO: return the next token in the sequence
    return ;
  }

  /**
   * @returns {Token} The next token in the sequence, if any, without
   * advancing the cursor.
   */
  peek() {
    return new Token(0, 0, '', Token.Type.null)
  }
}

/**
 * @param {string} input
 * @returns {TokenSequence}
 */
function conversionFunction(input) {
  return new TokenSequence(new YamlLexer().lex(input))
}

/**
 * 
 * This documentation uses the escape sequence '\I' to refer to the current
 * level of indentation.
 */
export class YamlParser extends Parser {

  constructor() {
    super()

  }
  
  /**
   * Parsing this document starts at the top-level document definition,
   * invoked by private method {@link #doc(tokenInput)}.
   * @param {*} input 
   * @returns {Promise<any>}
   */
  async parse(input) {
    // TODO: convert input to tokenInput stream for parser internals
    const tokenInput = conversionFunction(input);
    return this.#doc(tokenInput)
  }

  /**
   * doc
   * --> <property>\ndoc
   * --> <blank>\ndoc
   * --> ε
   * @param {TokenSequence} tokenInput 
   * @returns {Promise<any>}
   */
  async #doc(tokenInput) {
    // TODO: expect property followed by doc OR blank followed by doc OR nothing
    if (!this.#property(tokenInput) 
      && !this.#blank(tokenInput) 
     && !tokenInput.hasNext()) {
      throw `Unrecognized Input Sequence. Expected <property>, <blank>, or <eof>, but found ${tokenInput.next()}`
    }
    return null;
  }

  /**
   * <property> --> <name>: <value>
   * @param {*} tokenInput 
   */
  async #property(tokenInput) {
    // TODO: expect identifier token for name
    // TODO: expect colon separator token
    // TODO: expect value
    this.#value(tokenInput)
    // TODO: convert if-else cases to syntax-table?
  }

  /**
   * <value>
   * --> null
   * --> <boolean>
   * --> <number>
   * --> <string>
   * --> <list>
   * --> <map>
   * @param {*} tokenInput 
   */
  async #value(tokenInput) {
    if (this.#null(tokenInput)) {
      // TODO: null token accepted
    } else if (this.#boolean(tokenInput)) {
      // TODO: boolean accepted
    } else if (this.#number(tokenInput)) {
      // TODO: number accepted
    } else if (this.#string(tokenInput)) {
      // TODO: string accepted
    } else if (this.#list(tokenInput)) {
      // TODO: list accepted
    } else if (this.#map(tokenInput)) {
      // TODO: map accepted
    } else {
      // TODO: throw unrecognized error
    }
  }

  /**
   * null
   * @param {*} tokenInput 
   */
  async #null(tokenInput) {
    // TODO: 
  }

  /**
   * <boolean> --> true|false
   * @param {*} tokenInput 
   */
  async #boolean(tokenInput) {
    // TODO: accept 'true' or 'false'
  }

  /**
   * <number> --> [0-9]+(\.[0-9]+)?
   * @param {*} tokenInput 
   */
  async #number(tokenInput) {
    // TODO: accept integer/decimal format
  }

  /**
   * <string>
   * --> [a-zA-Z0-9]{254}
   * --> "[a-zA-Z0-9\"'\w]*"
   * @param {*} tokenInput
   */
  async #string(tokenInput) {

  }

  /**
   * <list>
   * --> <inline-list>
   * --> <block-list>
   * @param {*} tokenInput 
   */
  async #list(tokenInput) {
    // TODO: expect inline-list OR block-list
    this.#inlineList(tokenInput) || this.#blockList(tokenInput);
  }

  /**
   * <inline-list>
   * --> [<inline-item>,...]
   * <inline-item>
   * --> <string>
   * --> <inline-list>
   * --> <inline-map>
   * @param {*} tokenInput 
   */
  async #inlineList(tokenInput) {
  }

  /**
   * <block-list>
   * --> (\n\I- <block-item>)+
   * <block-item>
   * --> <string>
   * --> <list>
   * --> <map>
   * --> <value>
   * @param {*} tokenInput 
   */
  async #blockList(tokenInput) {
    // TODO: expect one or more lines with one additional indentation followed by a value
  }

  /**
   * <map>
   * --> <inline-map>
   * --> <block-map>
   * @param {*} tokenInput 
   */
  async #map(tokenInput) {
    // TODO: expect inline map OR block map
    this.#inlineMap(tokenInput) || this.#blocKMap(tokenInput);
  }

  /**
   * <inline-map>
   * --> { (<property>(,<property>)*)? }
   * @param {*} tokenInput 
   */
  async #inlineMap(tokenInput) {
    // TODO: expect opening brace, property list, closing brace
  }

  /**
   * <block-map>
   * --> (\n\I<property>)*
   * @param {*} tokenInput 
   */
  async #blocKMap(tokenInput) {
    // TODO: expect 0 or more lines with one additional indentation and a property definition
  }

  /**
   * <blank> --> [\w\s\b]*
   * @param {*} tokenInput 
   */
  async #blank(tokenInput) {
    // TODO: accept blank/epmty input lines
  }
}
