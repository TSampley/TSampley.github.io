
import { Parser } from '/science/computing/compilers/parser.mjs'


/**
 * 
 */
export class Token {
  /**
   * 
   * @param {number} line 
   * @param {number} column 
   * @param {string} sequence 
   * @param {Token.Type} type 
   */
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
 * Array<Char>|String --[Lexer]--> Array<Token>|TokenSequence
 * TokenSequence --[Parser]--> AST/IR
 * AST/IR --[Target/Platform]--> ???
 */
export class YamlLexer {

  /**
   * @param {string} input
   */
  constructor(input) {
    this.input = input
    this.lexer = this.lex(this.input)
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
        // TODO: other character classes
        default:
          if (char >= 'a' && char <= 'z') {
            console.info('lowercase')
            advancePosition()
          } else if (char >= 'A' && char <= 'Z') {
            console.info('uppercase')
            advancePosition()
          } else if (char >= '0' && char <= '9') {
            console.info('digit')
            advancePosition()
          } else {
            console.info('unrecognized char: ', char)
          }
          break;
      }

    }

    return
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

  /**
   * Checks if the next token is of the expected type and if so, advances
   * the lexer, returning true. If the next token is not the expected type,
   * nothing is consumed and false is returned.
   * @param {Token.Type} tokenType 
   * @returns {Promise<Token>} The next token if of the expected type.
   */
  async expect(tokenType) {
    const next = this.peek()
    if (next.type == tokenType) {
      return this.next()
    } else {
      throw `Expected <${tokenType}> but found <${next.type}>`
    }
  }
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
    const tokenInput = new YamlLexer(input);
    return this.#doc(tokenInput)
  }

  /**
   * doc
   * --> <block-map>
   * --> <block-list>
   * --> <inline-map>
   * --> <inline-list>
   * --> <boolean>
   * --> <string>
   * --> <number>
   * --> ε
   * @param {YamlLexer} tokenInput 
   * @returns {Promise<any>}
   */
  async #doc(tokenInput) {
    // TODO: expect property followed by doc OR blank followed by doc OR nothing
    if (!this.#inlineMap(tokenInput)
      && !this.#blockList(tokenInput)
      && !this.#blocKMap(tokenInput)
      && !this.#string(tokenInput)
      && !this.#boolean(tokenInput)
      && !tokenInput.hasNext()) {
      throw `Unrecognized Input Sequence. Expected <property>, <blank>, or <eof>, but found ${tokenInput.next()}`
    }
    return null;
  }

  /**
   * <property> --> <name>: <value>
   * @param {YamlLexer} tokenInput 
   * @returns {Promise<Map<string,any>>}
   */
  async #property(tokenInput) {
    const identifier = await tokenInput.expect(Token.Type.string)
    await tokenInput.expect(Token.Type.colon)
    const value = await this.#value(tokenInput)
    const record = {}
    record[identifier] = value
    return record
  }

  /**
   * <value>
   * --> null
   * --> <boolean>
   * --> <number>
   * --> <string>
   * --> <list>
   * --> <map>
   * @param {YamlLexer} tokenInput 
   * @returns {Promise<any>}
   */
  async #value(tokenInput) {
    if (await this.#null(tokenInput)) {
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
   * @param {YamlLexer} tokenInput 
   * @returns {Promise<null>}
   */
  async #null(tokenInput) {
    await tokenInput.expect(Token.Type.null)
    return null
  }

  /**
   * <boolean> --> true|false
   * @param {YamlLexer} tokenInput 
   * @returns {Promise<boolean>}
   */
  async #boolean(tokenInput) {
    // TODO: accept 'true' or 'false'
    const token = await tokenInput.expect(Token.Type.boolean)
    return token.sequence.toLowerCase() == 'true'
  }

  /**
   * <number> --> [0-9]+(\.[0-9]+)?
   * @param {YamlLexer} tokenInput 
   * @returns {Promise<number>}
   */
  async #number(tokenInput) {
    await tokenInput.expect(Token.Type.number)
    return 0
  }

  /**
   * <string>
   * --> [a-zA-Z0-9]{254}
   * --> "[a-zA-Z0-9\"'\w]*"
   * @param {YamlLexer} tokenInput 
   * @returns {Promise<string>}
   */
  async #string(tokenInput) {
    await tokenInput.expect(Token.Type.string)
    return "hello"
  }

  /**
   * <list>
   * --> <inline-list>
   * --> <block-list>
   * @param {YamlLexer} tokenInput 
   * @returns {Promise<any[]>}
   */
  async #list(tokenInput) {
    return await this.#inlineList(tokenInput) || await this.#blockList(tokenInput);
  }

  /**
   * <inline-list>
   * --> [<inline-item>,...]
   * <inline-item>
   * --> <string>
   * --> <inline-list>
   * --> <inline-map>
   * @param {YamlLexer} tokenInput 
   * @returns {Promise<any[]>}
   */
  async #inlineList(tokenInput) {
    await tokenInput.expect(Token.Type.squareOpen)
    return []
  }

  /**
   * <block-list>
   * --> newline + indent + block-list-body + dedent
   * <block-list-body>
   * --> property-name + : + property-value
   * <block-item>
   * --> <string>
   * --> <list>
   * --> <map>
   * --> <value>
   * @param {YamlLexer} tokenInput 
   * @returns {Promise<any[]>}
   */
  async #blockList(tokenInput) {
    await tokenInput.expect(Token.Type.newline)
    await tokenInput.expect(Token.Type.indent)

    await tokenInput.expect(Token.Type.dedent)
    return []
  }

  /**
   * <map>
   * --> <inline-map>
   * --> <block-map>
   * @param {YamlLexer} tokenInput 
   * @returns {<PromiseMap<string,any>>}
   */
  async #map(tokenInput) {
    await this.#inlineMap(tokenInput)
    await this.#blocKMap(tokenInput)
    return {}
  }

  /**
   * <inline-map>
   * --> { (<property>(,<property>)*)? }
   * @param {YamlLexer} tokenInput 
   * @returns {Promise<Map<string,any>>}
   */
  async #inlineMap(tokenInput) {
    if (await tokenInput.expect(Token.Type.curlyOpen)) {
      this.#property(tokenInput)
    } else {
      throw "Expected opening brace."
    }
    if (await tokenInput.expect(Token.Type.curlyClose)) {
      return {}
    } else {
      throw "Expected closing brace."
    }
  }

  /**
   * <block-map>
   * --> <property> + \n + <block-map-tail>
   * <block-map-tail>
   * --> <property> + \n <block-map-tail>
   * --> ε
   * @param {YamlLexer} tokenInput 
   * @returns {Promise<Map<string,any>>}
   */
  async #blocKMap(tokenInput) {
    // TODO: expect 0 or more lines with one additional indentation and a property definition
    while (tokenInput.hasNext()) {
      await this.#property(tokenInput)
    }
    
    return {}
  }
}
