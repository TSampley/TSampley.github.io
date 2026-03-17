/*
 * Copyright (c) 2026 Taush Sampley
 * This software is released under the GPL-3.0 License.
 * See LICENSE file in the project root for full license information.
 */

import YamlParser from "./yaml-parser.mjs"

const parserUnderTest = new YamlParser()

/**
 * 
 * @param {Array<any>} cases An array of cases to test.
 * @param {Array<any>|any} expected One or more expected return values.
 * @param {async (any)=>any} unit The unit under test.
 */
async function testCases(cases,expected,unit) {
  if (cases.length === undefined) {
    throw "Cases must be an array"
  }
  if (expected === null || expected.length === undefined) { // single expectation
    cases.forEach(async (e)=>{
      const result = await unit(e)
      
    })
  } else { // array of expectations
    if (cases.length === expected.length) throw "Cases and Expected must be same length";

    const length = cases.length
    for (let index = 0; index < length; index++) {
      const result = await(unit(cases[index]))
      
      if (result != expected[index]) throw `Result did not match expectations: (${result}) != (${expected[index]})`
    }
  }
}

test('parsing empty or blank input produces null', async ()=>{
  let cases = [
    '',
    '\n',
    "   \n  \t\s   \n",
    'null'
  ]

  let expected = null

  testCases(cases,expected, async (input) => {
    await parserUnderTest.parse(input)
  });
})

test('parsing true produces boolean true', async () => {
  let cases = [
    'true',
    'True',
    'TRUE',
    'tRuE'
  ]

  let expected = true
})

test('parsing false produces boolean false', () => {
  let cases = [
    'false',
    'False',
    'FALSE',
    'fAlSe'
  ]
})

test('parsing number sequence produces number', () => {
  let cases = [

  ]

  let expected = [

  ]
})

test('parsing arbitrary sequence produces string', () => {
  let cases = [

  ]

  let expected = [

  ]
})

test('parsing square brackets produces empty list', ()=> {
  let cases = [
    '[]',
    '[  \n\b\n\n\n]'
  ]

  let expected = []
})


test('parsing curly braces produces empty map', ()=> {
  let cases = [
    '{}',
    '{   \n\t  }',
    '{  }'
  ]

  let expected = {}
})

test('parsing objects produces map with property values', () => {
  let cases = [

  ]

  let expected = {

  }
})

test('parsing properties produces map with property values', () => {
  let cases = [
    'name: value',
    'key: 0',
`
key1: null
key2: false
key3: true
key4: foobar
key5: 9001
key6: []
key7: {}
`,
  ]

  let expected = [
    { name: "value" },
    { key: 0 },
    { key1: null, key2: false, key3: true, key4: "foobar", key5: 9001, key6: [], key7: {}}
  ]
})

test('comments are skipped by parser', () => {
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
})

test('parsing maps within lists is allowed', () => {
  let cases = [
`
- string
- key: value
  key2: value2
`
  ]
  let expected = [
    [ "string", { key: "value", key2: "value2" }]
  ]

})
/*
Case Studies:


Case: List property
`
key: [element, element2, element3]
`

Case: Map property
`
key: { alpha: value, beta: value }
`

Case: 
`
key:
  prop: value
  prop2: value2
key2:
  prop: value
  prop2: value2
`


 */

test('parsing lists on properties is allowed', () => {
  let cases = [
    'key: [element, element2, "element3", 4, "5"]'
  ]

  let expected = [
    { key: ["element", "element2", "element3", 4, "5"]}
  ]
})
