/*
 * Copyright (c) 2026 Taush Sampley
 * This software is released under the GPL-3.0 License.
 * See LICENSE file in the project root for full license information.
 */

import { YamlParser, YamlLexer, Token } from "./yaml-parser.mjs"

// MARK: TokenSequence
describe('YamlLexer', () => {
  const input = 'some_key: some_value'

  test('initialization', () => {
    const tokenSequence = new YamlLexer(input)
    expect(tokenSequence.input).toBe(input)
  })

  test('peek returns next token without advancing position', () => {
    const tokenSequence = new YamlLexer(input)
    expect(tokenSequence.peek()).toBe(new Token(0, 0, 'some_key', Token.Type.key))
  })

  test('next returns next token and advances position', () => {
    const tokenSequence = new YamlLexer(input)
    expect(tokenSequence.next()).toBe(new Token(0, 0, 'some_key', Token.Type.key))
  })

  test('peek and next work together correctly', () => {
    const tokenSequence = new YamlLexer(input)
    expect(tokenSequence.peek()).toBe(new Token(0, 0, 'some_key', Token.Type.key))
    expect(tokenSequence.next()).toBe(new Token(0, 0, 'some_key', Token.Type.key))

    expect(tokenSequence.peek()).toBe(new Token(0, 8, ':', Token.Type.colon))
    expect(tokenSequence.next()).toBe(new Token(0, 8, ':', Token.Type.colon))

    expect(tokenSequence.next()).toBe(new Token(0, 10, 'some_value', Token.Type.string))
  })
})

// MARK: YamlParser
describe('YamlParser', () => {

  const parserUnderTest = new YamlParser()

  test('parsing empty or blank input produces null', async () => {
    expect(await parserUnderTest.parse('')).toBe(null)
    expect(await parserUnderTest.parse('\n')).toBe(null)
    expect(await parserUnderTest.parse("   \n  \t   \n")).toBe(null)
    expect(await parserUnderTest.parse('null')).toBe(null)
    expect(await parserUnderTest.parse('   null ')).toBe(null)
    expect(await parserUnderTest.parse('\nnull\n')).toBe(null)
  })

  test('parsing true produces boolean true', async () => {
    expect(await parserUnderTest.parse('true')).toBe(true)
    expect(await parserUnderTest.parse('True')).toBe(true)
    expect(await parserUnderTest.parse('TRUE')).toBe(true)
    expect(await parserUnderTest.parse('tRuE')).toBe(true)
  })

  test('parsing false produces boolean false', async () => {
    expect(await parserUnderTest.parse('false')).toBe(false)
    expect(await parserUnderTest.parse('False')).toBe(false)
    expect(await parserUnderTest.parse('FALSE')).toBe(false)
    expect(await parserUnderTest.parse('fAlSe')).toBe(false)
  })

  test('parsing number sequence produces number', async () => {
    expect(await parserUnderTest.parse('5000')).toBe(5000)
    expect(await parserUnderTest.parse('1')).toBe(1)
    expect(await parserUnderTest.parse('-50')).toBe(-50)
    expect(await parserUnderTest.parse('\n4\n\n')).toBe(4)
    expect(await parserUnderTest.parse('5.6E8')).toBe(5.6E8)
  })

  test('parsing arbitrary sequence produces string', async () => {
    expect(await parserUnderTest.parse('""')).toBe('')
    expect(await parserUnderTest.parse('"5000"')).toBe('5000')
    expect(await parserUnderTest.parse('hello')).toBe('hello')
    expect(await parserUnderTest.parse('"hello"')).toBe('5000')
    expect(await parserUnderTest.parse('\n"hello"    ')).toBe('5000')
    expect(await parserUnderTest.parse('\n\ngoodbye\n\n\n')).toBe('goodbye')
    expect(await parserUnderTest.parse('"Hello\nWorld"')).toBe('Hello\nWorld')
    expect(await parserUnderTest.parse('Once upon a time,\n in a land far, far away.')).toBe('Once upon a time, in a land far, far away.')
    expect(await parserUnderTest.parse('Once upon a time\nin a land far away.')).toBe('Once upon a timein a land far away.')
  })

  test('parsing square brackets produces empty list', async () => {
    expect(await parserUnderTest.parse('[]')).toBe([])
    expect(await parserUnderTest.parse('[   \n\b\n\n\n]')).toBe([])
    expect(await parserUnderTest.parse('[   ]')).toBe([])
  })


  test('parsing curly braces produces empty map', async () => {
    expect(await parserUnderTest.parse('{}')).toBe({})
    expect(await parserUnderTest.parse('{\n}')).toBe({})
    expect(await parserUnderTest.parse('{   \t\n\n    }')).toBe({})
  })

  test('parsing objects produces map with property values', async () => {
    expect(await parserUnderTest.parse('{ name: value, name2: value2}')).toBe({ name: 'value', name2: 'value2' })
  })

  test('parsing properties produces map with property values', async () => {
    expect(await parserUnderTest.parse('name: value')).toBe({ name: "value" })
    expect(await parserUnderTest.parse('key: 0')).toBe({ key: 0 })
    expect(await parserUnderTest.parse(`key1: null
key2: false
key3: true
key4: foobar
key5: 9001
key6: []
key7: {}
  `)).toBe({ key1: null, key2: false, key3: true, key4: "foobar", key5: 9001, key6: [], key7: {} })
  })

  test('comments are skipped by parser', async () => {
    let cases = [
      `
# Please ignore this line
alpha: 10
# I can't remember why this is here but we need to retain it!!1
beta: hello
  `
    ]

    let expected = [
      { alpha: 10, beta: "hello" }
    ]

    const result = await parserUnderTest.parse(cases[0])
    expect(result).toEqual(expected[0])
  })

  test('parsing maps within lists is allowed', async () => {
    let cases = [
      `
- string
- key: value
  key2: value2
  `
    ]
    let expected = [
      ["string", { key: "value", key2: "value2" }]
    ]

    const result = await parserUnderTest.parse(cases[0])
    expect(result).toEqual(expected[0])
  })

  test('parsing lists on properties is allowed', async () => {
    let cases = [
      'key: [element, element2, "element3", 4, "5"]'
    ]

    let expected = [
      { key: ["element", "element2", "element3", 4, "5"] }
    ]
    const result = await parserUnderTest.parse(cases[0])
    expect(result).toEqual(expected[0])
  })


  test('parsing maps on properties is allowed', async () => {
    let cases = [
      'key: { alpha: value, beta: value }'
    ]

    let expected = [
      { key: { alpha: "value", beta: "value" } }
    ]
    const result = await parserUnderTest.parse(cases[0])
    expect(result).toEqual(expected[0])
  })
  test('nested properties are allowed', async () => {
    let cases = [
      `
key:
  prop: value
  prop2: value2
key2:
  prop: value
  prop2: value2
  `
    ]

    let expected = [
      { key: { prop: "value", prop2: "value2" }, key2: { prop: "value", prop2: "value2" } }
    ]
    const result = await parserUnderTest.parse(cases[0])
    expect(result).toEqual(expected[0])
  })

})
