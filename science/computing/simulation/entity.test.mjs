
import { Entity } from "./entity.mjs"

describe('entity', () => {

  describe('empty constructor', () => {
    const entity = new Entity()

    test('default position is NO_POSITION', () => {
      expect(entity.position).toBe(Entity.NO_POSITION)
    })
  })
})
