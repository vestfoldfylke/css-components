import Color from "colorjs.io"
import { Css } from "./css.js"

const createColor = (color) => {
  try {
    return new Color(color)
  } catch (error) {
    const extendedMessage = `Error creating color from value ${color.toString() || undefined} - ${error.message}`
    throw new Error(extendedMessage)
  }
}

/**
 * 
 * @param {import('./generate-full-css.js').Theme} [customTheme] 
 * @param {import('./generate-full-css.js').Theme} defaultTheme 
 */
export const generateTheme = (customTheme, defaultTheme) => {
  // Set default theme values if anything is missing
  const theme = {
    colors: {
      // Convert colors to rgb as well, if they are not already
      primary: createColor(customTheme?.colors?.primary || defaultTheme.colors.primary),
      secondary: createColor(customTheme?.colors?.secondary || defaultTheme.colors.secondary),
      tertiary: createColor(customTheme?.colors?.tertiary || defaultTheme.colors.tertiary),
      link: {
        base: createColor(customTheme?.colors?.link?.base || defaultTheme.colors.link.base),
        hover: createColor(customTheme?.colors?.link?.hover || defaultTheme.colors.link.hover)
      },
      font: createColor(customTheme?.colors?.font || defaultTheme.colors.font),
      error: createColor(customTheme?.colors?.error || defaultTheme.colors.error),
      warning: createColor(customTheme?.colors?.warning || defaultTheme.colors.warning),
      success: createColor(customTheme?.colors?.success || defaultTheme.colors.success),
      contrastIncreaser: customTheme?.colors?.contrastIncreaser || 'maxSaturationLightness', // Can be tintshade or maxSaturationLightness
    },
    typography: {
      fontFamily: customTheme?.typography?.fontFamily || defaultTheme.typography.fontFamily
    }
  }

  for (const [colorName, color] of Object.entries(customTheme?.colors || [])) {
    if (!defaultTheme.colors[colorName]) {
      console.log(colorName, '!!!!!!!!!!!!!!!!!!!!!')
      theme.colors[colorName] = createColor(color)
    }
  }

  return theme
}

export const generateAutoCss = (options, defaultTheme) => {
  if (!defaultTheme) throw new Error('Default theme is required, did you forget it from "lib/generate-all-css.js"?')
  // Setup theme - uses default theme if no custom theme is provided
  const theme = generateTheme(options?.customTheme, defaultTheme)

  const config = {
    addDarkMode: (options?.darkMode === true) || false // NOT IN USE YET
  }

  // Color-palettes (can add all colors here if needed)
  const colorPalettes = {
    primary: theme.colors.primary.toString({ format: 'rgb' }),
    secondary: theme.colors.secondary.toString({ format: 'rgb' }),
    tertiary: theme.colors.tertiary.toString({ format: 'rgb' })
    // We may need to generate background based on font-color as well... But we should use black as font-color
  }

  // Resulting css
  const autoCss = new Css()
  autoCss.addLine('/* --- AUTO GENERATED CSS --- */')

  // Write css colors
  // autoCss.addLine('@media (prefers-color-scheme: light) {') // IF WE HAVE DARK MODE ENABLED - MUST IMPLEMENT
  autoCss.addLine(':root {')
  autoCss.addLine()
  autoCss.addLine('/* SPECIFIC COLORS */')
  // Add main background-color

  // Main font color
  autoCss.addLine(`--font-color: ${theme.colors.font.toString()};`)
  /* Nå ER DET BARE Å KOSE SEG!!! */
  
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

  autoCss.addLine('/* Do not remove the line below... If you do, things will get messy when refreshing */')
  const endAutoCssLine = '/* --- END AUTO CSS --- */'

  autoCss.addLine(endAutoCssLine)
  autoCss.addLine()

  return autoCss
}
