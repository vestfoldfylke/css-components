import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs'

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

export const generateCss = (customTheme, options) => {
  // Set default theme values if anything is missing
  const theme = {
    colors: {
      // Convert colors to rgb as well, if they are not
      primary: colorToRgb(customTheme?.colors?.primary || "#005260"), // Vann (can use rgb as value [x, x, x] as well instead of hex)
      secondary: colorToRgb(customTheme?.colors?.secondary || "#1F9562"), // Gress
      tertiary: colorToRgb(customTheme?.colors?.tertiary || "#009BC2"), // Himmel
      link: {
        base: colorToRgb(customTheme?.colors?.link.base || "#005260"), // Vann
        hover: colorToRgb(customTheme?.colors?.link.hover || "#000000") // Sort
      },
      font: colorToRgb(customTheme?.colors?.font || '#000000'), // Sort
      error: colorToRgb(customTheme?.colors?.error || '#B7173D'), // Nype
      warning: colorToRgb(customTheme?.colors?.warning || '#BC7726'), // Siv
      success: colorToRgb(customTheme?.colors?.success || '#2F7542') // Gran
    },
    typography: {
      fontFamily: customTheme?.typography?.fontFamily || "'Nunito Sans', Lato, 'Trebuchet MS', sans-serif"
    }
  }

  const config = {
    generateCssFile: (options?.generateCssFile === true) || false,
    addDarkMode: (options?.addDarkMode === true) || false,
    cssPath: options?.cssPath || './autoStyle.css',
    onlyColorTheming: (options.onlyColorTheming === true) || false
  }

  // Color handling
  const colorValues = {
    primary: getColorVariants(theme.colors.primary),
    secondary: getColorVariants(theme.colors.secondary),
    tertiary: getColorVariants(theme.colors.tertiary)
  }

  // Resulting css
  let css = ''

  // Line handling
  const tab = '\t'
  let tabs = 0
  /**
   *
   * @param {string} line
   */
  const addLine = (line) => {
    if (!line) {
      css += '\n'
      // appendFileSync(config.cssPath, '\n')
      return
    }
    if (line.trim().endsWith('}')) {
      tabs--
    }
    css += `${tab.repeat(tabs)}${line}\n`
    // appendFileSync(config.cssPath, `${tab.repeat(tabs)}${line}\n`)
    if (line.trim().endsWith('{')) {
      tabs++
    }
  }

  // Get and Write metadata / info about package
  const metadata = JSON.parse(readFileSync('./package.json', 'utf-8'))
  addLine(`/* ${metadata.name} - ${metadata.description} */`)
  addLine(`/* VERSION: ${metadata.version} */`)
  addLine(`/* License: ${metadata.license} */`)
  addLine()

  // Write css colors
  // addLine('@media (prefers-color-scheme: light) {') // IF WE HAVE DARK MODE ENABLED
  addLine(':root {')
  addLine('/* COLOR VARIANTS */')
  for (const [colorName, colorVariants] of Object.entries(colorValues)) {
    for (const [colorPercentage, rgb] of Object.entries(colorVariants)) {
      const colorPercentageString = colorPercentage === 'base' ? '' : `-${colorPercentage}` 
      const cssLine = `--${colorName}-color${colorPercentageString}: rgb(${rgb.join(', ')});`
      addLine(cssLine)
    } 
  }
  addLine()
  addLine('/* SPECIFIC COLORS */')
  // Add main background-color
  const primaryBackgroundColor = getPercentageRgb(theme.colors.primary, 0.05)
  addLine(`--primary-background-color: rgb(${primaryBackgroundColor.join(', ')});`)
  
  // Main font color
  addLine(`--font-color: rgb(${theme.colors.font.join(', ')});`)
  addLine(`--font-color-inverted: rgb(${invertRgb(theme.colors.font).join(', ')});`)

  // Link color
  addLine(`--link-color: rgb(${theme.colors.link.base.join(', ')});`)
  addLine(`--link-color-hover: rgb(${theme.colors.link.hover.join(', ')});`)

  // Error, warn, success
  addLine(`--error-color: rgb(${theme.colors.error.join(', ')});`)
  const errorBackgroundColor = getPercentageRgb(theme.colors.error, 0.2)
  addLine(`--error-background-color: rgb(${errorBackgroundColor.join(', ')});`)

  addLine(`--warning-color: rgb(${theme.colors.warning.join(', ')});`)
  const warningBackgroundColor = getPercentageRgb(theme.colors.warning, 0.2)
  addLine(`--warning-background-color: rgb(${warningBackgroundColor.join(', ')});`)

  addLine(`--success-color: rgb(${theme.colors.success.join(', ')});`)
  const successBackgroundColor = getPercentageRgb(theme.colors.success, 0.2)
  addLine(`--success-background-color: rgb(${successBackgroundColor.join(', ')});`)

  addLine()
  // Sizes - oh boy oh boy...
  /*
  Font-sized should be dynamic (not px even though px is dynamic) - because accessibility
  We assume 1rem = 16px (for calculations)
  We set some variables and hope for the best
  */
  addLine('/* SIZES */')
  addLine('--font-size-root: 1rem;') // 24px (assuming 1rem=16px)
  addLine('--font-size-extra-large: 2rem;')
  addLine('--font-size-large: 1.5rem;')
  addLine('--font-size-small: 0.9rem;')
  addLine('--font-size-extra-small: 0.8rem;')
  addLine('--spacing: 1rem;')
  addLine('--spacing-extra-small: 0.25rem;')
  addLine('--spacing-small: 0.5rem;')
  addLine('--spacing-large: 1.5rem;')
  addLine('--spacing-extra-large: 2rem;')

  addLine('}')
  // addLine('}') // IF WE HAVE DARK MODE ENABLED
  addLine()

  if (config.onlyColorTheming) return // No need to generate the rest

  addLine('/* HTML BODY */')
  addLine('html, body {')
  addLine(`font-family: ${theme.typography.fontFamily};`)
  addLine('color: var(--font-color);')
  addLine('background-color: var(--primary-background-color);')
  addLine('margin: 0rem;')
  addLine('padding: 0rem;')
  addLine('min-height: 100vh;')
  addLine('}')
  addLine()

  const endAutoCssLine = '/* END AUTO CSS */'

  // Prepare and create entire css
  let cssFile = readFileSync('./lib/css-components.css', 'utf-8')
  const endOfAutoIndex = cssFile.indexOf(endAutoCssLine)
  if (endOfAutoIndex === -1) throw new Error(`Could not find end of auto-content line, please fix your css-components.css (add line "${endAutoCssLine}" above manual css content)`)
  
  const manualContent = cssFile.substring(endOfAutoIndex)

  const cssContent = css + manualContent

  if (config.generateCssFile) {
    if (existsSync(config.cssPath)) unlinkSync(config.cssPath)
    writeFileSync(config.cssPath, cssContent)
  }
  
  return css
}
