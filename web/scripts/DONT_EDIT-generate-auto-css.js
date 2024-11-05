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
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) throw new Error(`Input ${hex} was not hex...`)
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
}

const colorToRgb = (color) => {
  if (color.startsWith('#')) return hexToRgb(color)
  if (Array.isArray(color) && color.length === 3) return color
  throw new Error(`Color on format ${color} is not supported`)
}

const invertRgb = (rgb) => {
  return [255-rgb[0], 255-rgb[1], 255-rgb[2]]
}

const getPercentageRgb = (baseRgb, percent) => {
  return [
    Math.round(baseRgb[0]+((255-baseRgb[0])*(1-percent))),
    Math.round(baseRgb[1]+((255-baseRgb[1])*(1-percent))),
    Math.round(baseRgb[2]+((255-baseRgb[2])*(1-percent)))
  ]
}

const getColorVariants = (rgb) => {
  const result = {
    base: rgb
  }
  for (let i=9; i>0; i--) {
    // 28+(255-28)*(1-0,9)
    const currentPercentage = i / 10
    const percentageRgb = getPercentageRgb(rgb, currentPercentage)
    result[`${i}0`] = percentageRgb
  }
  return result
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

  // Resulting css
  const autoCss = new Css()
  autoCss.addLine('/* AUTO GENERATED CSS */')

  // Write css colors
  // autoCss.addLine('@media (prefers-color-scheme: light) {') // IF WE HAVE DARK MODE ENABLED
  autoCss.addLine(':root {')
  autoCss.addLine('/* COLOR VARIANTS */')
  for (const [colorName, colorVariants] of Object.entries(colorValues)) {
    for (const [colorPercentage, rgb] of Object.entries(colorVariants)) {
      const colorPercentageString = colorPercentage === 'base' ? '' : `-${colorPercentage}` 
      const cssLine = `--${colorName}-color${colorPercentageString}: rgb(${rgb.join(', ')});`
      autoCss.addLine(cssLine)
    }
  }
  autoCss.addLine()
  autoCss.addLine('/* SPECIFIC COLORS */')
  // Add main background-color
  const primaryBackgroundColor = getPercentageRgb(theme.colors.primary, 0.05)
  autoCss.addLine(`--primary-background-color: rgb(${primaryBackgroundColor.join(', ')});`)
  
  // Main font color
  autoCss.addLine(`--font-color: rgb(${theme.colors.font.join(', ')});`)
  autoCss.addLine(`--font-color-inverted: rgb(${invertRgb(theme.colors.font).join(', ')});`)

  // Link color
  autoCss.addLine(`--link-color: rgb(${theme.colors.link.base.join(', ')});`)
  autoCss.addLine(`--link-color-hover: rgb(${theme.colors.link.hover.join(', ')});`)

  // Error, warn, success
  autoCss.addLine(`--error-color: rgb(${theme.colors.error.join(', ')});`)
  const errorBackgroundColor = getPercentageRgb(theme.colors.error, 0.2)
  autoCss.addLine(`--error-background-color: rgb(${errorBackgroundColor.join(', ')});`)

  autoCss.addLine(`--warning-color: rgb(${theme.colors.warning.join(', ')});`)
  const warningBackgroundColor = getPercentageRgb(theme.colors.warning, 0.2)
  autoCss.addLine(`--warning-background-color: rgb(${warningBackgroundColor.join(', ')});`)

  autoCss.addLine(`--success-color: rgb(${theme.colors.success.join(', ')});`)
  const successBackgroundColor = getPercentageRgb(theme.colors.success, 0.2)
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
