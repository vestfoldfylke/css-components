import { customCss } from './DONT_EDIT-custom-css.js'
import { cssMetadata } from './DONT_EDIT-metadata.js'
import { generateAutoCss } from './DONT_EDIT-generate-auto-css.js'

// Set up style and add it to document
const customStyleSheet = document.createElement('style')
document.head.appendChild(customStyleSheet)

// Function for updating entire css
const updateCss = (options) => {
	const autoCss = generateAutoCss(options)
	const fullCss = cssMetadata + autoCss.css + customCss
	customStyleSheet.textContent = fullCss
}
updateCss()
const addStyleButton = document.getElementById('add-style-button')
addStyleButton.addEventListener('click', updateCss)

// Function for removing entire css
const removeCss = () => {
	customStyleSheet.textContent = ''
}
const removeStyleButton = document.getElementById('remove-style-button')
removeStyleButton.addEventListener('click', removeCss)

const elevdokTheme = {
	colors: {
		// Convert colors to rgb as well, if they are not
		primary:  "#414681", // Blåveis (can use rgb as value [x, x, x] as well instead of hex)
		secondary: "#5A2E61", // Plomme
		tertiary: "#A5983A", // Korn
		link: {
			base: "#005260", // Vann
			hover: "#000000" // Sort
		},
		font: '#000000' // Sort
	},
	typography: {
		fontFamily: "'Nunito Sans', Lato, 'Trebuchet MS', sans-serif",
		fontSize: '16px' // Trenger vi denne?
	}
}

const changeThemeButton = document.getElementById('change-theme-button')
changeThemeButton.addEventListener('click', () => {
	updateCss({ customTheme: elevdokTheme })
})

// Add code to components
const components = document.getElementsByClassName('component') // These contain the html code for the component
for (const component of components) {
	// Get code before messing with it, and set it to hidden as default :)
	const codeContainer = document.createElement('div')
	codeContainer.classList.add('code-container')
	codeContainer.classList.add('hidden')
	const codeElement = document.createElement('code')

	// Remove uneccessary whitespace for prettiness
	const actualCode = component.innerHTML
	const whereWeWantToStartEachLine = actualCode.indexOf('<') - 1
	const codeLines = actualCode.split('\n')
	const codeLinesWithoutBonusIndentation = codeLines.map((line) => { return line.substring(whereWeWantToStartEachLine) })
	const perfectCode = codeLinesWithoutBonusIndentation.join('\n')
	codeElement.textContent = perfectCode.trim()
	codeContainer.appendChild(codeElement)
	
	// Also we add a neat copy code button, and add it beside the code
	const copyCodeButton = document.createElement('button')
	copyCodeButton.title = 'Copy code'
	copyCodeButton.innerHTML = '<span class="material-symbols-outlined">content_copy</span>'
	copyCodeButton.addEventListener('click', () => {
		navigator.clipboard.writeText(codeElement.textContent)
	})
	copyCodeButton.classList.add('link')
	codeContainer.appendChild(copyCodeButton)

	// Add button for displaying/hiding code
	const displayCodeButton = document.createElement('button')
	displayCodeButton.title = 'Display code'
	displayCodeButton.innerHTML = '<span class="material-symbols-outlined">code</span>'
	displayCodeButton.addEventListener('click', () => {
		codeContainer.classList.toggle('hidden')
		if (codeContainer.classList.contains('hidden')) {
			displayCodeButton.title = 'Display code'
			displayCodeButton.innerHTML = '<span class="material-symbols-outlined">code</span>'
		} else {
			displayCodeButton.title = 'Hide code'
			displayCodeButton.innerHTML = '<span class="material-symbols-outlined">code_off</span>'
		}
	})

	displayCodeButton.classList.add('link')
	component.appendChild(displayCodeButton)

	component.insertAdjacentElement('afterend', codeContainer)
}
