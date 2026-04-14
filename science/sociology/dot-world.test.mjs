
import { Size } from '/js/common/geom.mjs'
import { DotWorld, OK_LAT, SUN_POWER_FLUX, EARTH_TILT } from './dot-world.mjs'

// TODO: nested test hierarchy for smaller unit tests
describe('dot world', () => {

  const world = new DotWorld(new Size(100, 100))

  describe('constructor', () => {
    test('should initialize with the correct size', () => {
      expect(world.size.value).toEqual(new Size(100, 100))
    })
    test('should default axis tilt to Earth\'s tilt', () => {
      expect(world.axisOffset).toBe(EARTH_TILT)
    })
  })

  test('irradiance at latitude', () => {
    const irradiance = DotWorld.irradianceAtLatitude(EARTH_TILT, OK_LAT, 0, 0)
    // should be close to the solar constant at Oklahoma's latitude during the summer solstice
    expect(irradiance).toBeCloseTo(SUN_POWER_FLUX * Math.cos(OK_LAT - EARTH_TILT))
  })

  test('irradiance at latitude with tilt', () => {
    const irradiance = DotWorld.irradianceAtLatitude(EARTH_TILT, OK_LAT, Math.PI, 0)
    // should be close to the solar constant at Oklahoma's latitude during the winter solstice
    expect(irradiance).toBeCloseTo(SUN_POWER_FLUX * Math.cos(OK_LAT + EARTH_TILT))
  })

  test('irradiance at latitude with tilt and at midnight', () => {
    const irradiance = DotWorld.irradianceAtLatitude(EARTH_TILT, OK_LAT, Math.PI, Math.PI)
    // should be close to the solar constant at Oklahoma's latitude during the winter solstice
    expect(irradiance).toBe(0)
  })
})
