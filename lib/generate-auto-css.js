// CSS generation
export class Css {
  constructor() {
    this.css = ''
    this.tabs = 0
    this.tab = '\t'
  }
  /**
   * 
   * @param {string} line The line to add 
   * @returns {void}
   */
  addLine(line) {
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
 * @typedef {number[]} RGB
 */

/**
 * 
 * @param {string} hex 
 * @returns {RGB}
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) throw new Error(`Input ${hex} was not hex...`)
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
}


/**
 * 
 * @param {string|RGB} color 
 * @returns {RGB}
 */
const colorToRgb = (color) => {
  if (typeof color === 'string' && color.startsWith('#')) return hexToRgb(color)
  if (Array.isArray(color) && color.length === 3) return color
  throw new Error(`Color on format ${color} is not supported`)
}

/**
 * 
 * @param {string|RGB} rgb
 * @returns {RGB}
 */
const invertColor = (color) => {
  const rgb = colorToRgb(color)
  return [255-rgb[0], 255-rgb[1], 255-rgb[2]]
}

/**
 * Makes a color lighter
 * 
 * @param {string|RGB} color 
 * @param {number} percent 
 * @returns {RGB}
 */
export const tint = (color, percent) => {
  const rgb = colorToRgb(color)
  return [
    Math.round(rgb[0] + (255 - rgb[0]) * percent),
    Math.round(rgb[1] + (255 - rgb[1]) * percent),
    Math.round(rgb[2] + (255 - rgb[2]) * percent)
  ]
}

/**
 * Makes a color darker
 * 
 * @param {string|RGB} color 
 * @param {number} percent 
 * @returns {RGB}
 */
export const shade = (color, percent) => {
  const rgb = colorToRgb(color)
  return [
    Math.abs(Math.round(rgb[0] * (1 - percent))),
    Math.abs(Math.round(rgb[1] * (1 - percent))),
    Math.abs(Math.round(rgb[2] * (1 - percent)))
  ]
}

/**
 * @typedef {Object} ColorVariants
 * @property {RGB} base
 * @property {RGB} 10
 * @property {RGB} 20
 * @property {RGB} 30
 * @property {RGB} 40
 * @property {RGB} 50
 * @property {RGB} 60
 * @property {RGB} 70
 * @property {RGB} 80
 * @property {RGB} 90
 * 
 */

/**
 * 
 * @param {string|RGB} color
 * @param {"tint"|"shade"} type = "tint"
 * @returns
 */
export const getColorVariants = (color, type = "tint") => {
  const rgb = colorToRgb(color)
  const result = {
    base: rgb
  }
  for (let i=9; i>0; i--) {
    // 28+(255-28)*(1-0,9)
    const currentPercentage = i / 10
    const percentageRgb = type === 'tint' ? tint(rgb, currentPercentage) : shade(rgb, currentPercentage)

    result[`${10-i}0`] = percentageRgb
  }
  return result
}

/**
 * Returns the luminance of a color (https://www.w3.org/TR/WCAG20-TECHS/G18.html)
 * 
 * @param {string|RGB} color 
 * @returns {number}
 */
export const getLuminance = (color) => {
  const rgb = colorToRgb(color)
  // Constants for luminance calculation
  const RED = 0.2126
  const GREEN = 0.7152
  const BLUE = 0.0722
  const GAMMA = 2.4

  const a = rgb.map((value) => {
    value /= 255
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, GAMMA);
  })
  return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
}

/**
 * Returns the contrast between two colors (https://www.w3.org/TR/WCAG20-TECHS/G18.html)
 * 
 * @param {string|RGB} color1 
 * @param {string|RGB} color2 
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
 * @property {RGB} originalBaseRgb
 * @property {RGB} originalContrastRgb
 * @property {RGB} baseRgb
 * @property {RGB} contrastRgb
 * @property {number} contrast
 */

/**
 * Takes in a baseColor (hex or rgb), a contrastColor, and a minimum contrast value, tints or shades the contrast color until minimum contrast is reached. If minimum contrast is not reached by tinting/shading the contrast color, the base color is tinted or shaded as well, until minimum contrast is reached.
 * If you only have a base color - use the base color as contrast color as well, to get a good contrast color for the primary color
 * 
 * @param {string|RGB} baseColor
 * @param {string|RGB} contrastColor
 * @param {*} minimumContrast
 * @param {number} step = 0.01
 * @returns {AccessibleColors} { originalRgb: RGB, baseRgb: RGB, contrastRgb: RGB, contrast: number }
 */
export const generateAccessibleContrastColors = (baseColor, contrastColor, minimumContrast, step=0.01) => {
  const originalBaseRgb = colorToRgb(baseColor)
  const originalContrastRgb = colorToRgb(contrastColor)

  let percent = 0.01
  // Check first if we should tint or shade - generate 0.01 shade and 0.01 tine - check which one has the best contrast
  const tinted = tint(originalContrastRgb, percent)
  const shaded = shade(originalContrastRgb, percent)
  const contrastTinted = getContrast(tinted, originalBaseRgb)
  const contrastShaded = getContrast(shaded, originalBaseRgb)
  const shouldTint = contrastTinted > contrastShaded

  let baseRgb = [...originalBaseRgb]
  let contrastRgb = [...originalContrastRgb]
  percent = 0
  let contrast = getContrast(contrastRgb, baseRgb)
  while (getContrast(contrastRgb, baseRgb) < minimumContrast && percent < 1) {
    percent += step
    contrastRgb = shouldTint ? tint([...originalContrastRgb], percent) : shade([...originalContrastRgb], percent)
    contrast = getContrast(contrastRgb, baseRgb)
    if (contrast >= minimumContrast) break
  }
  // If we still don't have a good contrast, we need to tint or shade the base color away from the contrast color (which is now black or white) as well
  percent = 0
  while (getContrast(contrastRgb, baseRgb) < minimumContrast && percent < 1) {
    percent += step
    baseRgb = shouldTint ? shade([...originalBaseRgb], percent) : tint([...originalBaseRgb], percent) // Opposite of contrastRgb
    contrast = getContrast(contrastRgb, baseRgb)
  }
  if (contrast < minimumContrast) {
    throw new Error(`Could not generate a color with a contrast of ${minimumContrast} for colors ${baseColor} and ${contrastColor}`)
  }
  return { originalBaseRgb, originalContrastRgb, baseRgb, contrastRgb, contrast }
}

/**
 * @typedef {Object} ColorPalette
 * @property {AccessibleColors} accessibleContrastColors
 * @property {ColorVariants} tintedRgbs
 * @property {ColorVariants} shadedRgbs
 * @property {AccessibleColors} tintedContrastColors
 * @property {AccessibleColors} shadedContrastColors
 * 
 */

/**
 * // Generate a beautiful color palette
 * 
 * @param {string|RGB} baseColor
 * @returns {ColorPalette}
 */
export const generateColorPalette = (baseColor) => {
  const AAAContrast = 7
  const step = 0.01

  // Adjust base color to get a good contrast color if needed
  const originalBaseRgb = colorToRgb(baseColor)
  const accessibleContrastColors = generateAccessibleContrastColors(originalBaseRgb, originalBaseRgb, AAAContrast, step)

  // Create color variants

  // HMM - we could try to change saturation of color instead - to get a more vibrant color and better contrast (or a combination of both)
  // HMM - we can try first to choose between both (make an easy switch somehow) - and also have a combination in the backhead
  // I think we may just want to saturate it
  // Hmm triple - HVS seems much easier to work with when dealing with this, should try :)
  const tintedRgbs = getColorVariants(accessibleContrastColors.baseRgb, 'tint')
  const shadedRgbs = getColorVariants(accessibleContrastColors.baseRgb, 'shade')

  // Background colors
  const originalTintedBackgroundColor = tint(accessibleContrastColors.baseRgb, 0.95)
  const originalShadedBackgroundColor = shade(accessibleContrastColors.baseRgb, 0.95)

  // Get onBackgroundColor with enough contrast
  const tintedContrastColors = generateAccessibleContrastColors(originalTintedBackgroundColor, accessibleContrastColors.baseRgb, AAAContrast, step) // Will adjust the base color to AAA contrast to background if needed
  const shadedContrastColors = generateAccessibleContrastColors(originalShadedBackgroundColor, accessibleContrastColors.baseRgb, AAAContrast, step) // Will adjust the base color to AAA contrast to background if needed

  return { accessibleContrastColors, tintedRgbs, shadedRgbs, tintedContrastColors, shadedContrastColors }
}

// END COLOR FUNCTIONS

const defaultTheme = {
  colors: {
    primary: "#005260", // Vann (can use rgb as value [x, x, x] as well instead of hex)
    secondary: "#1F9562", // Gress
    tertiary: "#009BC2", // Himmel
    link: {
      base: "#005260", // Vann
      hover: "#000000" // Sort
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
      // Convert colors to rgb as well, if they are not already
      primary: colorToRgb(customTheme?.colors?.primary || defaultTheme.colors.primary),
      secondary: colorToRgb(customTheme?.colors?.secondary || defaultTheme.colors.secondary),
      tertiary: colorToRgb(customTheme?.colors?.tertiary || defaultTheme.colors.tertiary),
      link: {
        base: colorToRgb(customTheme?.colors?.link.base || defaultTheme.colors.link.base),
        hover: colorToRgb(customTheme?.colors?.link.hover || defaultTheme.colors.link.hover)
      },
      font: colorToRgb(customTheme?.colors?.font || defaultTheme.colors.font),
      error: colorToRgb(customTheme?.colors?.error || defaultTheme.colors.error),
      warning: colorToRgb(customTheme?.colors?.warning || defaultTheme.colors.warning),
      success: colorToRgb(customTheme?.colors?.success || defaultTheme.colors.success)
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
    primary: generateColorPalette(theme.colors.primary),
    secondary: generateColorPalette(theme.colors.secondary),
    tertiary: generateColorPalette(theme.colors.tertiary)
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
    for (const [colorPercentage, rgb] of Object.entries(colorVariants)) {
      const colorPercentageString = colorPercentage === 'base' ? '' : `-${colorPercentage}` 
      const cssLine = `--old--${colorName}-color${colorPercentageString}: rgb(${rgb.join(', ')});`
      autoCss.addLine(cssLine)
    }
  }
  autoCss.addLine()
  for (const [colorName, colorPalette] of Object.entries(colorPalettes)) {
    autoCss.addLine(`/* ${colorName.toUpperCase()} COLOR */`)
    autoCss.addLine(`/* Original ${colorName} color: ${colorPalette.accessibleContrastColors.originalBaseRgb}. Accessible color: rgb(${colorPalette.accessibleContrastColors.baseRgb.join(', ')}). Contrast color: rgb(${colorPalette.accessibleContrastColors.contrastRgb.join(', ')}). Contrast: ${colorPalette.accessibleContrastColors.contrast} */`)
    autoCss.addLine(`/* ${colorName.toUpperCase()} COLOR VARIANTS */`)
    for (const [colorPercentage, rgb] of Object.entries(colorPalette.tintedRgbs)) {
      const colorPercentageString = colorPercentage === 'base' ? '' : `-${colorPercentage}` 
      const cssLine = `--${colorName}-color${colorPercentageString}: rgb(${rgb.join(', ')});`
      autoCss.addLine(cssLine)
    }
    autoCss.addLine(`/* SPECIFIC ${colorName.toUpperCase()} COLORS */`)
    autoCss.addLine(`--on-${colorName}-color: rgb(${colorPalette.accessibleContrastColors.contrastRgb.join(', ')});`)
    autoCss.addLine(`--${colorName}-background-color: rgb(${colorPalette.tintedContrastColors.baseRgb.join(', ')}); /* Tinted background color. Original: rgb(${colorPalette.tintedContrastColors.originalBaseRgb.join(', ')}) */`)
    autoCss.addLine(`--on-${colorName}-background-color: rgb(${colorPalette.tintedContrastColors.contrastRgb.join(', ')}); /* Tinted on-background (contrast) color. Original: rgb(${colorPalette.tintedContrastColors.originalContrastRgb.join(', ')}). Contrast to bakkground: ${colorPalette.tintedContrastColors.contrast} */`)
    autoCss.addLine()
  }
  autoCss.addLine()
  autoCss.addLine('/* SPECIFIC COLORS */')
  // Add main background-color

  // Main font color
  autoCss.addLine(`--font-color: rgb(${theme.colors.font.join(', ')});`)
  autoCss.addLine(`--font-color-inverted: rgb(${invertColor(theme.colors.font).join(', ')});`)

  // Link color
  autoCss.addLine(`--link-color: rgb(${theme.colors.link.base.join(', ')});`)
  autoCss.addLine(`--link-color-hover: rgb(${theme.colors.link.hover.join(', ')});`)

  // Error, warn, success
  autoCss.addLine(`--error-color: rgb(${theme.colors.error.join(', ')});`)
  const errorBackgroundColor = tint(theme.colors.error, 0.8)
  autoCss.addLine(`--error-background-color: rgb(${errorBackgroundColor.join(', ')});`)

  autoCss.addLine(`--warning-color: rgb(${theme.colors.warning.join(', ')});`)
  const warningBackgroundColor = tint(theme.colors.warning, 0.8)
  autoCss.addLine(`--warning-background-color: rgb(${warningBackgroundColor.join(', ')});`)

  autoCss.addLine(`--success-color: rgb(${theme.colors.success.join(', ')});`)
  const successBackgroundColor = tint(theme.colors.success, 0.8)
  autoCss.addLine(`--success-background-color: rgb(${successBackgroundColor.join(', ')});`)

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
