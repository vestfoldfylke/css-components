import test, { describe, it } from 'node:test'
import assert from 'node:assert'
import { createColor, hslToRgb, hsvToRgb, getContrast, tint, shade, generateAccessibleContrastColors } from '../lib/generate-auto-css.js'

// Create color
{
  const vann = '#005260'
  const himmel = '#009BC2'
  const vannRgb = [0, 82, 96]
  const himmelRgb = [0, 155, 194]

  describe('color should return correct values for vann:', () => {
    const colorFromHex = createColor(vann)
    const colorFromRgb = createColor(vannRgb)
    const rgbByHsl = hslToRgb(colorFromRgb.hsl)
    const rgbByHsv = hsvToRgb(colorFromRgb.hsv)
    it('should return correct hex value', () => {
      assert.strictEqual(colorFromHex.hex, vann)
      assert.deepEqual(colorFromHex.rgb, vannRgb)
    })
    it('should return correct rgb value', () => {
      assert.strictEqual(colorFromRgb.hex, vann)
      assert.deepEqual(colorFromRgb.rgb, vannRgb)
    })
    it('should return correct hsl value', () => {
      assert.deepEqual(rgbByHsl, colorFromRgb.rgb)
    })
    it('should return correct hsv value', () => {
      assert.deepEqual(rgbByHsv, colorFromRgb.rgb)
    })
  })
  describe('color should return correct values for himmel:', () => {
    const colorFromHex = createColor(himmel)
    const colorFromRgb = createColor(himmelRgb)
    const rgbByHsl = hslToRgb(colorFromRgb.hsl)
    const rgbByHsv = hsvToRgb(colorFromRgb.hsv)
    it('should return correct hex value', () => {
      assert.strictEqual(colorFromHex.hex, himmel)
      assert.deepEqual(colorFromHex.rgb, himmelRgb)
    })
    it('should return correct rgb value', () => {
      assert.strictEqual(colorFromRgb.hex, himmel)
      assert.deepEqual(colorFromRgb.rgb, himmelRgb)
    })
    it('should return correct hsl value', () => {
      assert.deepEqual(rgbByHsl, colorFromRgb.rgb)
    })
    it('should return correct hsv value', () => {
      assert.deepEqual(rgbByHsv, colorFromRgb.rgb)
    })
  })
}

// getContrast
{
  const primaryColor = createColor('#005260') // Vann
  const primaryBackgroundColor = createColor('#F2F6F7') // Vann backgroundColor rgb(242,246,247)
  const almostPrimaryColor = createColor('#185A6D')
  // https://colors.artyclick.com/contrast-color-finder is used as correct contrast

  test('getContrast should return a contrast of 8.1 compared to background color (rounded to 1 decimal point)', () => {
    const contrast = getContrast(primaryColor, primaryBackgroundColor)
    const roundedContrast = Math.round(contrast * 10) / 10
    assert.strictEqual(roundedContrast, 8.1)
  })
  test('getContrast should return a contrast of 1.1 compared to almost the same color (rounded to 1 decimal point)', () => {
    const contrast = getContrast(primaryColor, almostPrimaryColor)
    const roundedContrast = Math.round(contrast * 10) / 10
    assert.strictEqual(roundedContrast, 1.1)
  })
  test('getContrast should return a contrast of 1 compared to the same color (rounded to 1 decimal point)', () => {
    const contrast = getContrast(primaryColor, primaryColor)
    const roundedContrast = Math.round(contrast * 10) / 10
    assert.strictEqual(roundedContrast, 1.0)
  })
}

// Shade and tint color
{
  const primaryColor = createColor('#005260') // Vann
  const tint10 = createColor([26, 99, 112]) // rgb(26,99,112)
  const tint50 = createColor([128, 169, 176]) // rgb(128,169,176)
  const tint90 = createColor([230, 238, 239]) // rgb(230,242,244)
  const tint100 = createColor([255, 255, 255]) // rgb(255,255,255)

  test('tint should return correct tinted color', () => {
    const test10 = tint(primaryColor, 0.1)
    assert.deepEqual(test10, tint10)
    const test50 = tint(primaryColor, 0.5)
    assert.deepEqual(test50, tint50)
    const test90 = tint(primaryColor, 0.9)
    assert.deepEqual(test90, tint90)
    const test100 = tint(primaryColor, 1)
    assert.deepEqual(test100, tint100)
  })

  const shade10 = createColor([0, 74, 86]) // rgb(0,74,86)
  const shade50 = createColor([0, 41, 48]) // rgb(0,41,48)
  const shade90 = createColor([0, 8, 10]) // rgb(0,8,10)
  const shade100 = createColor([0, 0, 0]) // rgb(0,0,0)

  test('shade should return correct shaded color', () => {
    const test10 = shade(primaryColor, 0.1)
    assert.deepEqual(test10, shade10)
    const test50 = shade(primaryColor, 0.5)
    assert.deepEqual(test50, shade50)
    const test90 = shade(primaryColor, 0.9)
    assert.deepEqual(test90, shade90)
    const test100 = shade(primaryColor, 1)
    assert.deepEqual(test100, shade100)
  })
}

// accessibleContrastColor
{
  const vann = createColor('#005260')
  const vannLight = createColor([242, 246, 247])
  const himmel = createColor('#009BC2')
  const himmelLight = createColor([242, 250, 252])
  const AAAThreshold = 7

  test('generateAccessibleContrastColors (tintshade) should return a color with a contrast of 7 (but not more than 8) or more for vann and base should be original', () => {
    const res = generateAccessibleContrastColors(vann, vann, 7, 0.01, 'tintshade')
    const contrast = getContrast(res.baseColor, res.contrastColor)
    assert(contrast >= AAAThreshold)
    assert(contrast < 8)
    assert.deepEqual(res.baseRgb, res.originalBaseRgb)
  })

  test('generateAccessibleContrastColors (tintshade) should return a color with a contrast of 7 or more for vann and vannLight, and both vann and vannLight should be original', () => {
    const res = generateAccessibleContrastColors(vann, vannLight, 7, 0.01, 'tintshade')
    const contrast = getContrast(res.baseColor, res.contrastColor)
    assert(contrast >= AAAThreshold)
    assert.deepEqual(res.baseColor.rgb, res.originalBaseColor.rgb)
    assert.deepEqual(res.contrastColor.rgb, res.originalContrastColor.rgb)
  })

  test('generateAccessibleContrastColors (tintshade) should return a color with a contrast of 7 (but not more than 8) or more for himmel and base should NOT be original', () => {
    const res = generateAccessibleContrastColors(himmel, himmel, 7, 0.01, 'tintshade')
    const contrast = getContrast(res.baseColor, res.contrastColor)
    assert(contrast >= AAAThreshold)
    assert.notDeepEqual(res.baseColor.rgb, res.originalBaseColor.rgb)
    assert.notDeepEqual(res.contrastColor.rgb, res.originalContrastColor.rgb)
  })

  test(`generateAccessibleContrastColors (tintshade) should return a color with a contrast of 7 or more for himmel (${himmel.hex}) and himmelLight (${himmelLight.hex}), and himmel and himmelLight should NOT be original`, () => {
    const res = generateAccessibleContrastColors(himmel, himmelLight, 7, 0.01, 'tintshade')
    const contrast = getContrast(res.baseColor, res.contrastColor)
    assert(contrast >= AAAThreshold)
    assert.notDeepEqual(res.baseColor.rgb, res.originalBaseColor.rgb)
    assert.notDeepEqual(res.contrastColor.rgb, res.originalContrastColor.rgb)
  })

  test('generateAccessibleContrastColors (maxSaturationLightness) should return a color with a contrast of 7 (but not more than 8) or more for vann and base should be original', () => {
    const res = generateAccessibleContrastColors(vann, vann, 7, 0.01, 'maxSaturationLightness')
    const contrast = getContrast(res.baseColor, res.contrastColor)
    assert(contrast >= AAAThreshold)
    assert(contrast < 8)
    assert.deepEqual(res.baseRgb, res.originalBaseRgb)
  })

  test('generateAccessibleContrastColors (maxSaturationLightness) should return a color with a contrast of 7 or more for vann and vannLight, and both vann and vannLight should be original', () => {
    const res = generateAccessibleContrastColors(vann, vannLight, 7, 0.01, 'maxSaturationLightness')
    const contrast = getContrast(res.baseColor, res.contrastColor)
    assert(contrast >= AAAThreshold)
    assert.deepEqual(res.baseColor.rgb, res.originalBaseColor.rgb)
    assert.deepEqual(res.contrastColor.rgb, res.originalContrastColor.rgb)
  })

  test('generateAccessibleContrastColors (maxSaturationLightness) should return a color with a contrast of 7 (but not more than 8) or more for himmel and base should NOT be original', () => {
    const res = generateAccessibleContrastColors(himmel, himmel, 7, 0.01, 'maxSaturationLightness')
    const contrast = getContrast(res.baseColor, res.contrastColor)
    assert(contrast >= AAAThreshold)
    assert.notDeepEqual(res.baseColor.rgb, res.originalBaseColor.rgb)
    assert.notDeepEqual(res.contrastColor.rgb, res.originalContrastColor.rgb)
  })

  test(`generateAccessibleContrastColors (maxSaturationLightness) should return a color with a contrast of 7 or more for himmel (${himmel.hex}) and himmelLight (${himmelLight.hex}), and himmel and himmelLight should NOT be original`, () => {
    const res = generateAccessibleContrastColors(himmel, himmelLight, 7, 0.01, 'maxSaturationLightness')
    const contrast = getContrast(res.baseColor, res.contrastColor)
    assert(contrast >= AAAThreshold)
    assert.notDeepEqual(res.baseColor.rgb, res.originalBaseColor.rgb)
    assert.notDeepEqual(res.contrastColor.rgb, res.originalContrastColor.rgb)
  })
}
