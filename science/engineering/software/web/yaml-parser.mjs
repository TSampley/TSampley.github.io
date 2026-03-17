
import { Parser } from '/science/computing/compilers/parser.mjs'


/**
 * 
 */
class Token {
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
    indent: 'indent',
    dedent: 'dedent',
    listItem: 'hyphen',
    listStart: 'sqrOp',
    listEnd: 'sqrCl',
    mapStart: '{',
    mapEnd: '}',
  })
}

/**
 * This Lexer works in a lazy way, only consuming as much of the input as
 * needed to produce the next token(s).
 */
class YamlLexer {
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
    const length = input.length
    let lastPosition = -1
    let position = 0
    
    let line = 0
    let column = 0
    function advanceLine() {
      line++
      column = 0
    }
    while (position < length) {
      let char = input[position]
      switch (char) {
        case ':':
          break;
        case '\n':
          // produce NEWLINE
          yield new Token(line, column)
          // advance line
          line++
          column = 0
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
class TokenSequence {

  /**
   * @param {string} input
   */
  constructor(input) {
    this.input = input
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

  }
}

/**
 * 
 * This documentation uses the escape sequence '\I' to refer to the current
 * level of indentation.
 */
export default class YamlParser extends Parser {

  constructor() {
    super()

  }
  
  /**
   * Parsing this document starts at the top-level document definition,
   * invoked by private method {@link #doc(tokenInput)}.
   * @param {*} input 
   */
  async parse(input) {
    // TODO: convert input to tokenInput stream for parser internals
    const tokenInput = conversionFunction(input);
    this.#doc(tokenInput)
  }

  /**
   * doc
   * --> <property>\ndoc
   * --> <blank>\ndoc
   * --> ε
   * @param {*} tokenInput 
   */
  async #doc(tokenInput) {
    // TODO: expect property followed by doc OR blank followed by doc OR nothing
    if (!this.#property(tokenInput) 
      && !this.#blank(tokenInput) 
     && !tokenInput.hasNext()) {
      throw `Unrecognized Input Sequence. Expected <property>, <blank>, or <eof>, but found ${tokenInput.next()}`
    }
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
