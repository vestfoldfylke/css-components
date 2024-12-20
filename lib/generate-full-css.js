import { manualCss } from './auto-generated/custom-css.js'
import { cssMetadata } from './auto-generated/metadata.js'
import { generateAutoCss } from './generate-auto-css.js'


/**
 * @typedef {Object} Theme Default is fylkeskommune-colors
 * @property {Object} colors - The color palette for the theme.
 * @property {string} [colors.primary="#005260"] - The primary color (Vann).
 * @property {string} [colors.secondary="#1F9562"] - The secondary color (Gress).
 * @property {string} [colors.tertiary="#009BC2"] - The tertiary color (Himmel).
 * @property {Object} [colors.link] - The link colors.
 * @property {string} [colors.link.base="#005260"] - The base link color (Vann).
 * @property {string} [colors.link.hover="#000000"] - The hover link color (Sort).
 * @property {string} [colors.font="#000000"] - The font color (Sort).
 * @property {string} [colors.error="#B7173D"] - The error color (Nype).
 * @property {string} [colors.warning="#BC7726"] - The warning color (Siv).
 * @property {string} [colors.success="#2F7542"] - The success color (Gran).
 * @property {string} [customcolor] - A custom color (will be added with the same name to css-variables).
 * @property {string} [colors.contrastIncreaser="doINeedThis?"] - The contrast increaser.
 * @property {Object} typography - The typography settings for the theme.
 * @property {string} [typography.fontFamily="'Nunito Sans', Lato, 'Trebuchet MS', sans-serif"] - The font family for the theme.
 */

/**
 * @typedef {Object} CssOptions
 * @property {Theme} [theme] - The theme object.
 * @property {boolean} [darkMode=false] - The custom theme object.
 */

export const defaultTheme = {
  colors: {
    constrastIncreaser: 'doINeedThis?',
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

/**
 *
 * @param {CssOptions} options
 * @returns css?
 */
export const generateFullCss = (options=null) => {
  const autoCss = generateAutoCss(options, defaultTheme)
  return `${cssMetadata}\n${autoCss.css}\n${manualCss}`
}

console.log(generateFullCss())