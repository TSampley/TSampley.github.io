import { JsonParser } from "./json-parser.mjs"


describe('JsonParser',()=> {
  test('parsing empty input produces null', ()=>{
    const input = ''
    const parser = new JsonParser()

    const result = parser.parse(input)

    expect(result).toBe(null)
  })
  
  test('parsing curly braces produces empty object', ()=> {
    const input = '{}'
    const parser = new JsonParser()

    const result = parser.parse(input)

    expect(result).toBe({})
  })
  
  test('parsing square brackets produces empty array', ()=> {
    const input = '[]'
    const parser = new JsonParser()

    const result = parser.parse(input)

    expect(result).toBe([])
  })
})
