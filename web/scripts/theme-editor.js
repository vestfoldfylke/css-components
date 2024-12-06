import { customCss } from './DONT_EDIT-custom-css.js'
import { cssMetadata } from './DONT_EDIT-metadata.js'
import { generateAutoCss, getContrast, getLuminance, tint } from './DONT_EDIT-generate-auto-css.js'

export const updateCss = () => {
  // Update css in web page
  const customStyleElement = document.getElementById('custom-stylesheet')
  const autoCss = generateAutoCss({ customTheme: currentTheme })
  const fullCss = cssMetadata + autoCss.css + customCss
  customStyleElement.textContent = fullCss

  // Update css-content for generate css-file link
  const generateCssLink = document.getElementById('generate-css-link')
  generateCssLink.setAttribute('href', 'data:text/css;charset=utf-8,' + encodeURIComponent(fullCss))
  generateCssLink.setAttribute('download', 'tester.css')
}

export const setupThemeEditor = () => {
  const themingButton = document.getElementById('theming-button')
  const themeEditor = document.getElementById('theme-editor')
  // '<span class="material-symbols-outlined">code</span>Show code'
  themingButton.addEventListener('click', () => {
    themeEditor.classList.toggle('hidden')
    if (themeEditor.classList.contains('hidden')) {
      themingButton.innerHTML = '<span class="material-symbols-outlined">palette</span>Theme editor'
    } else {
      themingButton.innerHTML = '<span class="material-symbols-outlined">close</span>Close theme editor'
    }
  })

  // Contrast increaser
  const contrastIncreaserRadioButtons = document.querySelectorAll('input[name="contrast-increaser"]')

  contrastIncreaserRadioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', () => {
      currentTheme.colors.contrastIncreaser = radioButton.value
      updateCss()
    })
  })

  // Link color
  // Switch if link color should be primary or not - on checked change
  // If checked, link color is primary color
  // Else we use currentTheme

  // Colors
  const primaryColorPicker = document.getElementById('primary-color-picker')
  const secondaryColorPicker = document.getElementById('secondary-color-picker')
  const tertiaryColorPicker = document.getElementById('tertiary-color-picker')
  const linkColorPicker = document.getElementById('link-color-picker')
  const linkHoverColorPicker = document.getElementById('link-hover-color-picker')
  const fontColorPicker = document.getElementById('font-color-picker')
  const errorColorPicker = document.getElementById('error-color-picker')
  const warningColorPicker = document.getElementById('warning-color-picker')
  const successColorPicker = document.getElementById('success-color-picker')

  primaryColorPicker.addEventListener('input', () => {
    currentTheme.colors.primary = primaryColorPicker.value
    updateCss()
  })
  secondaryColorPicker.addEventListener('input', () => {
    currentTheme.colors.secondary = secondaryColorPicker.value
    updateCss()
  })
  tertiaryColorPicker.addEventListener('input', () => {
    currentTheme.colors.tertiary = tertiaryColorPicker.value
    updateCss()
  })
  linkColorPicker.addEventListener('input', () => {
    currentTheme.colors.link.base = linkColorPicker.value
    updateCss()
  })
  linkHoverColorPicker.addEventListener('input', () => {
    currentTheme.colors.link.hover = linkHoverColorPicker.value
    updateCss()
  })
  fontColorPicker.addEventListener('input', () => {
    currentTheme.colors.font = fontColorPicker.value
    updateCss()
  })
  errorColorPicker.addEventListener('input', () => {
    currentTheme.colors.error = errorColorPicker.value
    updateCss()
  })
  warningColorPicker.addEventListener('input', () => {
    currentTheme.colors.warning = warningColorPicker.value
    updateCss()
  })
  successColorPicker.addEventListener('input', () => {
    currentTheme.colors.success = successColorPicker.value
    updateCss()
  })

  // Presets
  for (const preset of themePresets) {
    const presetButton = document.createElement('button')
    presetButton.classList.add('icon', 'filled')
    presetButton.title = preset.name
    presetButton.innerHTML = '&nbsp;'
    presetButton.style.border = 'none'
    presetButton.style.boxShadow = `0px 0px 0px 8px ${preset.colors.primary} inset, 0px 0px 0px 16px ${preset.colors.secondary} inset`
    presetButton.addEventListener('click', () => {
      currentTheme = JSON.parse(JSON.stringify(preset)) // Just a copy
      updateThemeEditor()
      updateCss()
    })
    const presetsDiv = document.getElementById('theme-presets')
    presetsDiv.appendChild(presetButton)
  }

  // Også fonts og andre farger her og...

  updateThemeEditor()
}

const updateThemeEditor = () => {
  // Contrast increaser
  const contrastIncreaserRadioButtons = document.querySelectorAll('input[name="contrast-increaser"]')
  contrastIncreaserRadioButtons.forEach(radioButton => {
    if (radioButton.value === currentTheme.colors.contrastIncreaser) {
      radioButton.checked = true
    }
  })
  const primaryColorPicker = document.getElementById('primary-color-picker')
  const secondaryColorPicker = document.getElementById('secondary-color-picker')
  const tertiaryColorPicker = document.getElementById('tertiary-color-picker')
  const linkColorPicker = document.getElementById('link-color-picker')
  const linkHoverColorPicker = document.getElementById('link-hover-color-picker')
  const fontColorPicker = document.getElementById('font-color-picker')
  const errorColorPicker = document.getElementById('error-color-picker')
  const warningColorPicker = document.getElementById('warning-color-picker')
  const successColorPicker = document.getElementById('success-color-picker')
  primaryColorPicker.value = currentTheme.colors.primary
  secondaryColorPicker.value = currentTheme.colors.secondary
  tertiaryColorPicker.value = currentTheme.colors.tertiary
  linkColorPicker.value = currentTheme.colors.link.base
  linkHoverColorPicker.value = currentTheme.colors.link.hover
  fontColorPicker.value = currentTheme.colors.font
  errorColorPicker.value = currentTheme.colors.error
  warningColorPicker.value = currentTheme.colors.warning
  successColorPicker.value = currentTheme.colors.success
}
