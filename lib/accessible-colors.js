/*

Exposes a function that creates a color palette, with correct contrasts according to WCAG2.
Choose between AA and AAA (AAA preferred, accessibility for everyone)

Input paramameters - { options } - should be able to call, and get a randomly created palette

options below

CONSTANTS:
font is white or black for normal text (but we also create onPrimaryBackground, onPrimary and so on, with input contrastThreshold (AA, AAA))

all colors are setup as color objects (to be able to expand) - returns (rgb, hex, hsl) (and possibly more as we need more color spaces)
should maybe take input object { colorSpace: value } - to be able to use any convertible color-space as input color

need contrast checker function

need random generator

need palette genereator for each palettetype

need a final function that genereates the entire palette

https://colorjs.io/docs/contrast

*/

const options = {
  colors: { // Optional
    primary, // optional
    secondary, // optional
    tertiary, // optional
    actionHue: 1 - 360, // For links and primary buttons - Optional, will default to blue hue space based on primary color
    errorHue: 1 - 360, // For error-colors - optional, will default to red hue space based on primary color
    warningHue: 1 - 360, // For warning-colors - optional, will default to yellow hue space based on primary color
    successHue: 1 - 360 // For success-colors - optional, will default to green hue space based on primary color
  },
  paletteType: 'vibrant|monochromatic|contrasting' // optional
}

/*
Flow
- gnereateAccessiblePalette (options)

first check input/options
generateBaseColors
  if no colors are defined, generate random primary, then secondary, and tertiary based on primary (and secondary) - based on palettetype!
  then actionhue, errorhue, warninghue, and successhue (and maybe others in the future)
  contrast between the base-colors themselves should be 3 or something (check wcag)

  Can try to first generate accessible primary color, and then generate secondary and tertiary based on that - and then generate the rest based on those?
*/

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
 * @typedef {Object} InputColor
 * @property {HEX} [hex]
 * @property {RGB} [rgb]
 * @property {HSV} [hsv]
 * @property {HSL} [hsl]
 *
 */

/**
 *
 * @param {InputColor} inputColor
 * @returns {Color}
 */
export const createColor = (inputColor) => {
  if (!inputColor) throw new Error('Input was not an object...')
  if (!(inputColor.hex || inputColor.rgb || inputColor.hsv || inputColor.hsl)) throw new Error('Input was not a color object...')

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
