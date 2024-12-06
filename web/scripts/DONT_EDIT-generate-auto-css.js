// CSS generation
export class Css {
  constructor () {
    this.css = ''
    this.tabs = 0
    this.tab = '\t'
  }

  /**
   *
   * @param {string} line The line to add
   * @returns {void}
   */
  addLine (line) {
    if (!line) {
      this.css += '\n'
      return
    }
    if (!typeof line === 'string') {
      throw new Error('The line must be a string')
    }
    if (line.trim().endsWith('}')) {
      this.tabs--
    }
    this.css += `${this.tab.repeat(this.tabs)}${line}\n`
    if (line.trim().endsWith('{')) {
      this.tabs++
    }
  }
}

// COLOR FUNCTIONS

/**
 * @typedef {string} HEX
 */

/**
 * @typedef {number[]} RGB
 */

/**
 * HSV: Hue - the color (0-360), Saturation (0-100) the intensity of the color, Value (0-100) the brightness of the color (turns up the brightness of the hue, does not go to white)
 *
 * @typedef {number[]} HSV
 */

/**
 * HSL: Hue - the color (0-360), Saturation (0-100) the intensity of the color, Lightness (0-100) the lightness of the color (turns up the lightness of the color until we reach white). To get 100& v as in HSV, we need to set Lightness to 50.
 *
 * @typedef {number[]} HSL
 */

/**
 *
 * @param {HEX} hex
 * @returns {RGB}
 */
const hexToRgb = (hex) => {
  if (!typeof hex === 'string') throw new Error(`Input ${hex} was not a string...`)
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) throw new Error(`Input ${hex} was not hex...`)
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
}

/**
 *
 * @param {RGB} rgb
 * @returns {HEX}
 */
const rgbToHex = (rgb) => {
  if (!Array.isArray(rgb) || rgb.length !== 3 || !rgb.every(value => Number.isInteger(value))) throw new Error(`Input ${rgb} was not rgb... [r, g, b]`)
  const rgbValueToHex = (value) => {
    const hex = value.toString(16).toUpperCase()
    return hex.length === 1 ? `0${hex}` : hex
  }
  return `#${rgbValueToHex(rgb[0])}${rgbValueToHex(rgb[1])}${rgbValueToHex(rgb[2])}`
}

/**
 * Sources:
 * https://en.wikipedia.org/wiki/HSL_and_HSV
 * https://gist.github.com/mjackson/5311256
 *
 *
 * @param {RGB} rgb
 * @returns {HSV}
 */
export const rgbToHsv = (rgb) => {
  const r = rgb[0] / 255 // Convert to 0-1
  const g = rgb[1] / 255 // Convert to 0-1
  const b = rgb[2] / 255 // Convert to 0-1

  const max = Math.max(r, g, b) // Get max value
  const min = Math.min(r, g, b) // Get min value
  const v = max // Value (brightness) is the max value

  const difference = max - min // Get difference between max and min

  const s = max === 0 ? 0 : difference / max // Calculate saturation (intensity)

  let h // hue
  if (max === min) {
    h = 0 // Achromatic (no color)
  } else {
    // Calculate hue
    if (max === r) { // If red is max
      h = (g - b) / difference + (g < b ? 6 : 0)
    } else if (max === g) { // If green is max
      h = (b - r) / difference + 2
    } else if (max === b) { // If blue is max
      h = (r - g) / difference + 4
    }
    if (!h && h !== 0) throw new Error(`Could not calculate hue for rgb ${rgb} - have you fickled with the code? ${h}`)
    h /= 6 // Normalize to 0-1
  }
  return [h, s, v]
}

/**
 * Sources:
 * https://en.wikipedia.org/wiki/HSL_and_HSV
 * https://gist.github.com/mjackson/5311256
 *
 *
 * @param {RGB} rgb
 * @returns {HSL}
 */
export const rgbToHsl = (rgb) => {
  const r = rgb[0] / 255 // Convert to 0-1
  const g = rgb[1] / 255 // Convert to 0-1
  const b = rgb[2] / 255 // Convert to 0-1

  const max = Math.max(r, g, b) // Get max value
  const min = Math.min(r, g, b) // Get min value
  const l = (max + min) / 2 // Get lightness (average of max and min, as in contrast to brightness in HSV)

  let h // hue
  let s // saturation
  if (max === min) {
    h = 0 // Achromatic (no color)
    s = 0 // No saturation
  } else {
    // Calculate saturation (intensity)
    const difference = max - min // Get difference between max and min
    s = l > 0.5 ? difference / (2 - max - min) : difference / (max + min)

    // Calculate hue
    if (max === r) { // If red is max
      h = (g - b) / difference + (g < b ? 6 : 0)
    } else if (max === g) { // If green is max
      h = (b - r) / difference + 2
    } else if (max === b) { // If blue is max
      h = (r - g) / difference + 4
    }
    if (!h && h !== 0) throw new Error(`Could not calculate hue for rgb ${rgb} - have you fickled with the code?`)
    h /= 6 // Normalize to 0-1
  }

  return [h, s, l]
}

/**
 * Source: https://gist.github.com/mjackson/5311256
 *
 * @param {HSV} hsv
 * @returns {RGB}
 */
export const hsvToRgb = (hsv) => {
  const h = hsv[0]
  const s = hsv[1]
  const v = hsv[2]

  let r, g, b // Initialize rgb values

  // No idea how this works, i am a thief
  const i = Math.floor(h * 6)
  const f = h * 6 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)

  // Somehow, Palpatine returned
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break
    case 1: r = q, g = v, b = p; break
    case 2: r = p, g = v, b = t; break
    case 3: r = p, g = q, b = v; break
    case 4: r = t, g = p, b = v; break
    case 5: r = v, g = p, b = q; break
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

/**
 * Source: https://gist.github.com/mjackson/5311256
 * I have no idea how this works, i am a thief
 *
 * @param {HSL} hsl
 * @returns {RGB}
 */
export const hslToRgb = (hsl) => {
  const h = hsl[0]
  const s = hsl[1]
  const l = hsl[2]

  let r, g, b // Initialize rgb values
  if (s === 0) {
    r = g = b = l // Achromatic (no color)
  } else {
    const hue2rgb = (p, q, t) => { // what?
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s // ahhh my eyes!
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

/**
 * @typedef {Object} Color
 * @property {HEX} hex
 * @property {RGB} rgb
 * @property {HSV} hsv
 * @property {HSL} hsl
 */

/**
 *
 * @param {HEX|RGB} hexOrRgb
 * @returns {Color}
 */
export const createColor = (hexOrRgb) => {
  const result = {
    hex: null,
    rgb: null,
    hsv: null,
    hsl: null
  }
  const isHex = typeof hexOrRgb === 'string' && (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexOrRgb))
  if (isHex) {
    result.hex = hexOrRgb
    result.rgb = hexToRgb(hexOrRgb)
  } else if (Array.isArray(hexOrRgb) && hexOrRgb.length === 3) {
    result.rgb = hexOrRgb
    result.hex = rgbToHex(hexOrRgb)
  } else {
    throw new Error(`Input ${hexOrRgb} was not hex or rgb...`)
  }
  result.hsv = rgbToHsv(result.rgb)
  result.hsl = rgbToHsl(result.rgb)

  return result
}

/**
 *
 * @param {*} color
 * @returns {boolean}
 */
const isColorObject = (color) => {
  if (!color) return false
  return color.hex && color.rgb && color.hsv && color.hsl
}

/**
 *
 * @param {Color} color
 * @returns {Color}
 */
export const invertColor = (color) => {
  if (!isColorObject(color)) throw new Error('Input was not a color object...')
  const rgb = color.rgb
  const invertedRgb = [255 - rgb[0], 255 - rgb[1], 255 - rgb[2]]
  return createColor(invertedRgb)
}

/**
 * Tints a color (makes it brighter by adding white to rgb)
 *
 * @param {Color} color
 * @param {number} percent
 * @returns {Color}
 */
export const tint = (color, percent) => {
  if (!isColorObject(color)) throw new Error('Input was not a color object...')
  const rgb = color.rgb
  const tintedRgb = [
    Math.round(rgb[0] + (255 - rgb[0]) * percent),
    Math.round(rgb[1] + (255 - rgb[1]) * percent),
    Math.round(rgb[2] + (255 - rgb[2]) * percent)
  ]
  return createColor(tintedRgb)
}

/**
 * Shades a color (makes it darker by adding black to rgb)
 *
 * @param {Color} color
 * @param {number} percent
 * @returns {Color}
 */
export const shade = (color, percent) => {
  if (!isColorObject(color)) throw new Error('Input was not a color object...')
  const rgb = color.rgb
  const shadedRgb = [
    Math.round(rgb[0] * (1 - percent)),
    Math.round(rgb[1] * (1 - percent)),
    Math.round(rgb[2] * (1 - percent))
  ]
  return createColor(shadedRgb)
}

/**
 * Saturates a color (increases/decreases the intensity of the color by S in HSV)
 *
 * @param {Color} color
 * @param {number} percent -1 to 1
 * @returns {Color}
 */
export const saturate = (color, percent) => {
  if (!isColorObject(color)) throw new Error('Input was not a color object...')
  if (percent < -1 || percent > 1) throw new Error(`Percent must be between 0 and 1 - was ${percent}`)
  const hsv = color.hsv
  const saturation = percent < 0 ? Math.max(hsv[1] + percent, 0) : Math.min(hsv[1] + percent, 1)
  const saturatedHsv = [hsv[0], saturation, hsv[2]]
  return createColor(hsvToRgb(saturatedHsv))
}

/**
 * Adjusts the brightness of a color (increases/decreases the brightness of the color by V in HSV)
 *
 * @param {Color} color
 * @param {number} percent
 * @returns {Color}
 */
export const adjustBrightness = (color, percent) => {
  if (!isColorObject(color)) throw new Error('Input was not a color object...')
  if (percent < -1 || percent > 1) throw new Error(`Percent must be between 0 and 1 - was ${percent}`)
  const hsv = color.hsv
  const brightness = percent < 0 ? Math.max(hsv[2] + percent, 0) : Math.min(hsv[2] + percent, 1)
  const brightHsv = [hsv[0], hsv[1], brightness]
  return createColor(hsvToRgb(brightHsv))
}

/**
 * Adjusts the lightness of a color (increases/decreases the lightness of the color by L in HSL)
 *
 * @param {Color} color
 * @param {number} percent
 * @returns
 */
export const adjustLightness = (color, percent) => {
  if (!isColorObject(color)) throw new Error('Input was not a color object...')
  if (percent < -1 || percent > 1) throw new Error(`Percent must be between 0 and 1 - was ${percent}`)
  const hsl = color.hsl
  const lightness = percent < 0 ? Math.max(hsl[2] + percent, 0) : Math.min(hsl[2] + percent, 1)
  const brightHsl = [hsl[0], hsl[1], lightness]
  return createColor(hslToRgb(brightHsl))
}

/**
 * @typedef {Object} ColorVariants
 * @property {Color} base
 * @property {Color} 10
 * @property {Color} 20
 * @property {Color} 30
 * @property {Color} 40
 * @property {Color} 50
 * @property {Color} 60
 * @property {Color} 70
 * @property {Color} 80
 * @property {Color} 90
 *
 */

/**
 *
 * @param {Color} color
 * @param {"tint"|"shade"} type = "tint"
 * @returns {ColorVariants}
 */
export const getColorVariants = (color, type = 'tint') => {
  if (!isColorObject(color)) throw new Error('Input was not a color object...')
  const result = {
    base: color
  }
  for (let i = 9; i > 0; i--) {
    // 28+(255-28)*(1-0,9)
    const currentPercentage = i / 10
    const percentageColor = type === 'tint' ? tint(color, currentPercentage) : shade(color, currentPercentage)

    result[`${10 - i}0`] = percentageColor
  }
  return result
}

/**
 * Returns the luminance of a color (https://www.w3.org/TR/WCAG20-TECHS/G18.html)
 *
 * @param {Color} color
 * @returns {number}
 */
export const getLuminance = (color) => {
  if (!isColorObject(color)) throw new Error('Input was not a color object...')
  const rgb = color.rgb
  // Constants for luminance calculation
  const RED = 0.2126
  const GREEN = 0.7152
  const BLUE = 0.0722
  const GAMMA = 2.4

  const a = rgb.map((value) => {
    value /= 255
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, GAMMA)
  })
  return a[0] * RED + a[1] * GREEN + a[2] * BLUE
}

/**
 * Returns the contrast between two colors (https://www.w3.org/TR/WCAG20-TECHS/G18.html)
 *
 * @param {Color} color1
 * @param {Color} color2
 * @returns {number}
 */
export const getContrast = (color1, color2) => {
  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

/**
 * @typedef {Object} AccessibleColors
 * @property {Color} originalBaseColor
 * @property {Color} originalContrastColor
 * @property {Color} baseColor
 * @property {Color} contrastColor
 * @property {number} contrast
 */

/**
 * Takes in a baseColor, a contrastColor, and a minimum contrast value, adjusts the contrastColor until it reaches the minimum contrast value - if it does not reach the minimum contrast value, it will adjust the baseColor as well in the opposite direction of the contrastColor
 * If you only have a base color - use the base color as contrast color as well, to get a sufficient contrast color for the primary color
 *
 * @param {Color} baseColor
 * @param {Color} contrastColor
 * @param {*} minimumContrast
 * @param {number} step = 0.01
 * @param {"tintshade"|"maxSaturationLightness"|"saturationLightnessPreferWhite"} contrastIncreaser tintshade simply tints or shades the color, maxSaturationLightness first increases saturation, then increases/decreases lightness to get a acceptable contrast
 * @returns {AccessibleColors} { originalRgb: RGB, baseRgb: RGB, contrastRgb: RGB, contrast: number }
 */
export const generateAccessibleContrastColors = (baseColor, contrastColor, minimumContrast, step = 0.01, contrastIncreaser = 'saturationLightnessPreferWhite') => {
  if (!isColorObject(baseColor)) throw new Error('Input baseColor was not a color object...')
  if (!isColorObject(contrastColor)) throw new Error('Input contrastColor was not a color object...')
  if (!contrastIncreaser || (contrastIncreaser !== 'tintshade' && contrastIncreaser !== 'maxSaturationLightness' && contrastIncreaser !== 'saturationLightnessPreferWhite')) throw new Error('contrastIncreaser must be either \'tintshade\' or \'maxSaturationLightness\' or saturationLightnessPreferWhite')

  if (contrastIncreaser === 'saturationLightnessPreferWhite') {
    const white = createColor('#ffffff')
    const whiteContrast = getContrast(baseColor, white)
    if (whiteContrast >= minimumContrast) {
      return { originalBaseColor: baseColor, originalContrastColor: contrastColor, baseColor, contrastColor: white, contrast: whiteContrast }
    }

    let percent = 0
    if (whiteContrast > minimumContrast - 1) {
      // We try to darken the base color a bit, and see if we can reach minimum contrast
      let currentBaseColor = JSON.parse(JSON.stringify(baseColor))

      let contrast = getContrast(currentBaseColor, white)
      percent = 0
      while (getContrast(currentBaseColor, white) < minimumContrast && percent < 1) {
        percent += step
        // Since floating point numbers cannot be trusted, we check if we are above 1, and set to 1 in that case
        percent = Math.min(percent, 1)
        // Decrease lightness, and increase saturation
        currentBaseColor = adjustLightness(currentBaseColor, -percent)
        currentBaseColor = saturate(currentBaseColor, percent)
        contrast = getContrast(currentBaseColor, white)
      }
      if (contrast >= minimumContrast) { // we got it right, lucky us
        return { originalBaseColor: baseColor, originalContrastColor: contrastColor, baseColor: currentBaseColor, contrastColor: white, contrast }
      }
    }
    // We cannot use white as contrast color, so we need to adjust the contrast color to a darker color
    let currentBaseColor = JSON.parse(JSON.stringify(baseColor))
    let currentContrastColor = JSON.parse(JSON.stringify(contrastColor))

    let contrast = getContrast(currentBaseColor, currentContrastColor)
    percent = 0
    while (getContrast(currentBaseColor, currentContrastColor) < minimumContrast && percent < 1) {
      percent += step
      // Since floating point numbers cannot be trusted, we check if we are above 1, and set to 1 in that case
      percent = Math.min(percent, 1)
      // Decrease lightness, and increase saturation
      currentContrastColor = adjustLightness(currentContrastColor, -percent)
      currentContrastColor = saturate(currentContrastColor, percent)
      contrast = getContrast(currentBaseColor, currentContrastColor)
    }
    // If we still don't have a good contrast, we need to increase saturation and lightness of the base color as well
    percent = 0
    while (getContrast(currentBaseColor, currentContrastColor) < minimumContrast && percent < 1) {
      percent += step
      // Since floating point numbers cannot be trusted, we check if we are above 1, and set to 1 in that case
      percent = Math.min(percent, 1)
      // Increase lightness, and decrease saturation
      currentBaseColor = adjustLightness(currentBaseColor, percent)
      currentBaseColor = saturate(currentBaseColor, -percent)
      contrast = getContrast(currentBaseColor, currentContrastColor)
    }
    if (contrast < minimumContrast) {
      throw new Error(`Could not generate a color with a contrast of ${minimumContrast} for colors ${baseColor.rgb} and ${contrastColor.rgb}`)
    }
    return { originalBaseColor: baseColor, originalContrastColor: contrastColor, baseColor: currentBaseColor, contrastColor: currentContrastColor, contrast }
  }

  if (contrastIncreaser === 'maxSaturationLightness') {
    // First we take the contrastColor and increase saturation to max
    const contrastColorfullySaturated = saturate(contrastColor, 1)
    // Then the same for baseColor, in case we need to adjust that as well
    const baseColorfullySaturated = saturate(baseColor, 1)

    // Check if we should lighten or darken the color to get highest contrast
    let percent = 0.01
    const lighter = adjustLightness(contrastColorfullySaturated, percent)
    const darker = adjustLightness(contrastColorfullySaturated, -percent)
    const contrastLighter = getContrast(lighter, baseColor)
    const contrastDarker = getContrast(darker, baseColor)
    const shouldLighten = contrastLighter > contrastDarker

    let currentBaseColor = JSON.parse(JSON.stringify(baseColor))
    let currentContrastColor = JSON.parse(JSON.stringify(contrastColorfullySaturated))

    let contrast = getContrast(currentBaseColor, currentContrastColor)
    percent = 0
    while (getContrast(currentBaseColor, currentContrastColor) < minimumContrast && percent < 1) {
      percent += step
      // Since floating point numbers cannot be trusted, we check if we are above 1, and set to 1 in that case
      percent = Math.min(percent, 1)
      currentContrastColor = shouldLighten ? adjustLightness(contrastColorfullySaturated, percent) : adjustLightness(contrastColorfullySaturated, -percent)
      contrast = getContrast(currentBaseColor, currentContrastColor)
      if (contrast >= minimumContrast) break
    }
    // If we still don't have a good contrast, we need to increase saturation and lightness of the base color as well
    percent = 0
    while (getContrast(currentBaseColor, currentContrastColor) < minimumContrast && percent < 1) {
      percent += step
      // Since floating point numbers cannot be trusted, we check if we are above 1, and set to 1 in that case
      percent = Math.min(percent, 1)
      currentBaseColor = shouldLighten ? adjustLightness(baseColorfullySaturated, -percent) : adjustLightness(baseColorfullySaturated, percent) // Opposite way of contrastColor
      contrast = getContrast(currentBaseColor, currentContrastColor)
    }
    if (contrast < minimumContrast) {
      throw new Error(`Could not generate a color with a contrast of ${minimumContrast} for colors ${baseColor.rgb} and ${contrastColor.rgb}`)
    }
    return { originalBaseColor: baseColor, originalContrastColor: contrastColor, baseColor: currentBaseColor, contrastColor: currentContrastColor, contrast }
  }

  if (contrastIncreaser === 'tintshade') {
    let percent = 0.01
    // Check first if we should tint or shade - generate 0.01 shade and 0.01 tine - check which one has the best contrast
    const tinted = tint(baseColor, percent)
    const shaded = shade(baseColor, percent)
    const contrastTinted = getContrast(tinted, baseColor)
    const contrastShaded = getContrast(shaded, baseColor)
    const shouldTint = contrastTinted > contrastShaded

    let currentBaseColor = JSON.parse(JSON.stringify(baseColor))
    let currentContrastColor = JSON.parse(JSON.stringify(contrastColor))
    percent = 0
    let contrast = getContrast(currentBaseColor, currentContrastColor)
    while (getContrast(currentBaseColor, currentContrastColor) < minimumContrast && percent < 1) {
      percent += step
      // Since floating point numbers cannot be trusted, we check if we are above 1, and set to 1 in that case
      percent = Math.min(percent, 1)
      currentContrastColor = shouldTint ? tint(baseColor, percent) : shade(baseColor, percent)
      contrast = getContrast(currentBaseColor, currentContrastColor)
      if (contrast >= minimumContrast) break
    }
    // If we still don't have a good contrast, we need to tint or shade the base color away from the contrast color (which is now black or white) as well
    percent = 0
    while (getContrast(currentBaseColor, currentContrastColor) < minimumContrast && percent < 1) {
      percent += step
      // Since floating point numbers cannot be trusted, we check if we are above 1, and set to 1 in that case
      percent = Math.min(percent, 1)
      currentBaseColor = shouldTint ? shade(baseColor, percent) : tint(baseColor, percent) // Opposite of contrastRgb
      contrast = getContrast(currentBaseColor, currentContrastColor)
    }
    if (contrast < minimumContrast) {
      throw new Error(`Could not generate a color with a contrast of ${minimumContrast} for colors ${baseColor.rgb} and ${contrastColor.rgb}`)
    }
    return { originalBaseColor: baseColor, originalContrastColor: contrastColor, baseColor: currentBaseColor, contrastColor: currentContrastColor, contrast }
  }
}

/**
 * @typedef {Object} ColorPalette
 * @property {AccessibleColors} accessibleContrastColors
 * @property {ColorVariants} tintedVariants
 * @property {ColorVariants} shadedVariants
 * @property {AccessibleColors} tintedContrastColors
 * @property {AccessibleColors} shadedContrastColors
 *
 */

/**
 * // Generate a beautiful color palette
 *
 * @param {Color} baseColor
 * @param {"tintShade"|"maxSaturationLightness"|"saturationLightnessPreferWhite"} contrastIncreaser
 * @returns {ColorPalette}
 */
export const generateColorPalette = (baseColor, contrastIncreaser) => {
  if (!isColorObject(baseColor)) throw new Error('Input baseColor was not a color object...')
  const AAAContrast = 7
  const step = 0.01

  // Adjust base color to get a good contrast color if needed
  const accessibleContrastColors = generateAccessibleContrastColors(baseColor, baseColor, AAAContrast, step, contrastIncreaser)

  // Create color variants
  const tintedVariants = getColorVariants(accessibleContrastColors.baseColor, 'tint')
  const shadedVariants = getColorVariants(accessibleContrastColors.baseColor, 'shade')

  // Background colors
  const originalTintedBackgroundColor = tint(accessibleContrastColors.baseColor, 0.95)
  const originalShadedBackgroundColor = shade(accessibleContrastColors.baseColor, 0.95)

  // Get onBackgroundColor with enough contrast
  const tintedContrastColors = generateAccessibleContrastColors(originalTintedBackgroundColor, accessibleContrastColors.baseColor, AAAContrast, step, contrastIncreaser) // Will adjust the base color to AAA contrast to background if needed
  const shadedContrastColors = generateAccessibleContrastColors(originalShadedBackgroundColor, accessibleContrastColors.baseColor, AAAContrast, step, contrastIncreaser) // Will adjust the base color to AAA contrast to background if needed

  return { accessibleContrastColors, tintedVariants, shadedVariants, tintedContrastColors, shadedContrastColors }
}

// END COLOR FUNCTIONS

const defaultTheme = {
  colors: {
    constrastIncreaser: 'saturationLightnessPreferWhite',
    primary: '#005260', // Vann (can use rgb as value [x, x, x] as well instead of hex)
    secondary: '#1F9562', // Gress
    tertiary: '#009BC2', // Himmel
    link: {
      base: '#005260', // Vann
      hover: '#000000' // Sort
    },
    font: '#000000', // Sort
    error: '#B7173D', // Nype
    warning: '#BC7726', // Siv
    success: '#2F7542' // Gran
  },
  typography: {
    fontFamily: "'Nunito Sans', Lato, 'Trebuchet MS', sans-serif"
  }
}

const generateTheme = (customTheme) => {
  // Set default theme values if anything is missing
  const theme = {
    layout: {
      contentMaxWidth: customTheme?.layout?.contentMaxWidth || '80rem'
    },
    colors: {
      contrastIncreaser: customTheme?.colors?.contrastIncreaser || 'maxSaturationLightness', // Can be tintshade or maxSaturationLightness
      // Convert colors to rgb as well, if they are not already
      primary: createColor(customTheme?.colors?.primary || defaultTheme.colors.primary),
      secondary: createColor(customTheme?.colors?.secondary || defaultTheme.colors.secondary),
      tertiary: createColor(customTheme?.colors?.tertiary || defaultTheme.colors.tertiary),
      link: {
        base: createColor(customTheme?.colors?.link.base || defaultTheme.colors.link.base),
        hover: createColor(customTheme?.colors?.link.hover || defaultTheme.colors.link.hover)
      },
      font: createColor(customTheme?.colors?.font || defaultTheme.colors.font),
      error: createColor(customTheme?.colors?.error || defaultTheme.colors.error),
      warning: createColor(customTheme?.colors?.warning || defaultTheme.colors.warning),
      success: createColor(customTheme?.colors?.success || defaultTheme.colors.success)
    },
    typography: {
      fontFamily: customTheme?.typography?.fontFamily || defaultTheme.typography.fontFamily
    }
  }
  return theme
}

export const generateAutoCss = (options) => {
  // Setup theme - uses default theme if no custom theme is provided
  const theme = generateTheme(options?.customTheme)

  const config = {
    addDarkMode: (options?.addDarkMode === true) || false // NOT IN USE YET
  }

  // Color handling
  const colorValues = {
    primary: getColorVariants(theme.colors.primary),
    secondary: getColorVariants(theme.colors.secondary),
    tertiary: getColorVariants(theme.colors.tertiary)
  }

  // Color-palettes (can add all colors here if needed)
  const colorPalettes = {
    primary: generateColorPalette(theme.colors.primary, theme.colors.contrastIncreaser),
    secondary: generateColorPalette(theme.colors.secondary, theme.colors.contrastIncreaser),
    tertiary: generateColorPalette(theme.colors.tertiary, theme.colors.contrastIncreaser)
    // We may need to generate background based on font-color as well... But we should use black as font-color
  }

  // Resulting css
  const autoCss = new Css()
  autoCss.addLine('/* AUTO GENERATED CSS */')

  // Write css colors
  // autoCss.addLine('@media (prefers-color-scheme: light) {') // IF WE HAVE DARK MODE ENABLED - MUST IMPLEMENT
  autoCss.addLine(':root {')
  autoCss.addLine('/* OLD COLOR VARIANTS */')
  for (const [colorName, colorVariants] of Object.entries(colorValues)) {
    for (const [colorPercentage, color] of Object.entries(colorVariants)) {
      const colorPercentageString = colorPercentage === 'base' ? '' : `-${colorPercentage}`
      const cssLine = `--old--${colorName}-color${colorPercentageString}: rgb(${color.rgb.join(', ')});`
      autoCss.addLine(cssLine)
    }
  }
  autoCss.addLine()
  for (const [colorName, colorPalette] of Object.entries(colorPalettes)) {
    autoCss.addLine(`/* ${colorName.toUpperCase()} COLOR */`)
    autoCss.addLine(`/* Original ${colorName} color: rgb(${colorPalette.accessibleContrastColors.originalBaseColor.rgb.join(', ')}). Accessible color: rgb(${colorPalette.accessibleContrastColors.baseColor.rgb.join(', ')}). Contrast color: rgb(${colorPalette.accessibleContrastColors.contrastColor.rgb.join(', ')}). Contrast: ${colorPalette.accessibleContrastColors.contrast} */`)
    autoCss.addLine(`/* ${colorName.toUpperCase()} COLOR VARIANTS */`)
    for (const [colorPercentage, color] of Object.entries(colorPalette.tintedVariants)) {
      const colorPercentageString = colorPercentage === 'base' ? '' : `-${colorPercentage}`
      const cssLine = `--${colorName}-color${colorPercentageString}: rgb(${color.rgb.join(', ')});`
      autoCss.addLine(cssLine)
    }
    autoCss.addLine(`/* SPECIFIC ${colorName.toUpperCase()} COLORS */`)
    autoCss.addLine(`--on-${colorName}-color: rgb(${colorPalette.accessibleContrastColors.contrastColor.rgb.join(', ')});`)
    autoCss.addLine(`--${colorName}-background-color: rgb(${colorPalette.tintedContrastColors.baseColor.rgb.join(', ')}); /* Tinted background color. Original: rgb(${colorPalette.tintedContrastColors.originalBaseColor.rgb.join(', ')}) */`)
    autoCss.addLine(`--on-${colorName}-background-color: rgb(${colorPalette.tintedContrastColors.contrastColor.rgb.join(', ')}); /* Tinted on-background (contrast) color. Original: rgb(${colorPalette.tintedContrastColors.originalContrastColor.rgb.join(', ')}). Contrast to bakkground: ${colorPalette.tintedContrastColors.contrast} */`)
    autoCss.addLine()
  }
  autoCss.addLine()
  autoCss.addLine('/* SPECIFIC COLORS */')
  // Add main background-color

  // Main font color
  autoCss.addLine(`--font-color: rgb(${theme.colors.font.rgb.join(', ')});`)
  autoCss.addLine(`--font-color-inverted: rgb(${invertColor(theme.colors.font).rgb.join(', ')});`)

  // Link color
  autoCss.addLine(`--link-color: rgb(${theme.colors.link.base.rgb.join(', ')});`)
  autoCss.addLine(`--link-color-hover: rgb(${theme.colors.link.hover.rgb.join(', ')});`)

  // Error, warn, success
  autoCss.addLine(`--error-color: rgb(${theme.colors.error.rgb.join(', ')});`)
  const errorBackgroundColor = tint(theme.colors.error, 0.8)
  autoCss.addLine(`--error-background-color: rgb(${errorBackgroundColor.rgb.join(', ')});`)

  autoCss.addLine(`--warning-color: rgb(${theme.colors.warning.rgb.join(', ')});`)
  const warningBackgroundColor = tint(theme.colors.warning, 0.8)
  autoCss.addLine(`--warning-background-color: rgb(${warningBackgroundColor.rgb.join(', ')});`)

  autoCss.addLine(`--success-color: rgb(${theme.colors.success.rgb.join(', ')});`)
  const successBackgroundColor = tint(theme.colors.success, 0.8)
  autoCss.addLine(`--success-background-color: rgb(${successBackgroundColor.rgb.join(', ')});`)

  autoCss.addLine()

  // Sizes - oh boy oh boy...
  /*
  Font-sized should be dynamic (not px even though px is dynamic) - because accessibility
  We assume 1rem = 16px (for calculations)
  We set some variables and hope for the best
  */
  autoCss.addLine('/* SIZES */')
  autoCss.addLine('--font-size-root: 1rem;')
  autoCss.addLine('--font-size-extra-large: 2rem;')
  autoCss.addLine('--font-size-large: 1.5rem;')
  autoCss.addLine('--font-size-small: 0.9rem;')
  autoCss.addLine('--font-size-extra-small: 0.8rem;')
  autoCss.addLine('--spacing: 1rem;')
  autoCss.addLine('--spacing-extra-small: 0.25rem;')
  autoCss.addLine('--spacing-small: 0.5rem;')
  autoCss.addLine('--spacing-large: 1.5rem;')
  autoCss.addLine('--spacing-extra-large: 2rem;')

  autoCss.addLine('}')
  // autoCss.addLine('}') // IF WE HAVE DARK MODE ENABLED
  autoCss.addLine()

  autoCss.addLine('/* HTML BODY */')
  autoCss.addLine('html, body {')
  autoCss.addLine(`font-family: ${theme.typography.fontFamily};`)
  autoCss.addLine('color: var(--font-color);')
  autoCss.addLine('background-color: var(--primary-background-color);')
  autoCss.addLine('margin: 0rem;')
  autoCss.addLine('padding: 0rem;')
  autoCss.addLine('min-height: 100vh;')
  autoCss.addLine('}')
  autoCss.addLine()

  // Page layout
  autoCss.addLine('/* LAYOUT */')
  autoCss.addLine('.page-content {')
  autoCss.addLine(`max-width: ${theme.layout.contentMaxWidth};`)
  autoCss.addLine('margin: 0 auto;')
  autoCss.addLine('padding: var(--spacing);')
  autoCss.addLine('}')
  autoCss.addLine()

  autoCss.addLine('/* Do not remove the line below... If you do, things will get messy when building */')
  const endAutoCssLine = '/* END AUTO CSS */'

  autoCss.addLine(endAutoCssLine)
  autoCss.addLine()

  return { css: autoCss.css, endAutoCssLine }
}
