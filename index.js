import { generateCss } from "./lib/generate-css.js"; 

export const generateCssFile = (customTheme, options = {}) => {
  return generateCss(customTheme, { ...options, generateCssFile: true })
}

export const generateCssString = (customTheme, options = {}) => {
  return generateCss(customTheme, { ...options, generateCssFile: false })
}