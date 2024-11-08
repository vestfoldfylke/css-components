import { tweakComponentExamples } from './tweak-component-examples.js'
import { setupThemeEditor, updateCss } from './theme-editor.js'

// Set up style and add it to document
const customStyleSheet = document.createElement('style')
customStyleSheet.id = 'custom-stylesheet'
document.head.appendChild(customStyleSheet)

updateCss()

// Function for removing entire css
const removeCss = () => {
	customStyleSheet.textContent = ''
}
const removeStyleButton = document.getElementById('remove-style-button')
removeStyleButton.addEventListener('click', removeCss)


// Tweak component examples
tweakComponentExamples()

// Setup theme editor
setupThemeEditor()


/*
setupTheme setter opp
kan lage oppdater theme funksjon

Hva er fluyten her

Når jeg bytter en farge må det konstant kjøres en funksjon som oppdaterer cssen

En funksjon for å oppdatere themeEditor med theme fra generateCss

Og en funksjon som setter opp themeEditor
*/