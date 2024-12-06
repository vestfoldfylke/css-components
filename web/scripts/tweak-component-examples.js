export const tweakComponentExamples = () => {
  // Add code to components
  const components = document.getElementsByClassName('component-example') // These contain the html code for the component
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
    // And add the code to the code container
    codeContainer.appendChild(codeElement)

    // Then we create a div for the examples, and move the examples into it
    const examplesContainer = document.createElement('div')
    examplesContainer.classList.add('examples-container')
    while (component.firstChild) { // Move all children to the examples container, until there are no more children
      examplesContainer.appendChild(component.firstChild)
    }

    // Then we add a neat title for the example and add it to the component
    const titleContainer = document.createElement('div')
    titleContainer.classList.add('component-example-title')
    const titleText = component.getAttribute('data-title')
    const titleElement = document.createElement('div')
    if (titleText) {
      titleElement.textContent = titleText
    } else {
      titleElement.innerHTML = '&nbsp;'
    }
    titleContainer.appendChild(titleElement)
    component.insertBefore(titleContainer, component.firstChild)

    // Then we add the examples container to the component
    component.appendChild(examplesContainer)

    // Then we create a footer for the component, add stuff to it, and add it to the component
    const footer = document.createElement('div')
    footer.classList.add('component-example-footer')

    // Add button for displaying/hiding code
    const displayCodeButton = document.createElement('button')
    displayCodeButton.classList.add('link')
    displayCodeButton.classList.add('no-underline')
    displayCodeButton.title = 'Show code'
    displayCodeButton.innerHTML = '<span class="material-symbols-outlined">code</span>Show code'
    displayCodeButton.addEventListener('click', () => {
      codeContainer.classList.toggle('hidden')
      if (codeContainer.classList.contains('hidden')) {
        displayCodeButton.title = 'Show code'
        displayCodeButton.innerHTML = '<span class="material-symbols-outlined">code</span>Show code'
      } else {
        displayCodeButton.title = 'Hide code'
        displayCodeButton.innerHTML = '<span class="material-symbols-outlined">code_off</span>Hide code'
      }
    })

    footer.appendChild(displayCodeButton)
    component.appendChild(footer)

    // Also we add a neat copy code button, and add it to the code container (or somewhere else?)
    const copyCodeButton = document.createElement('button')
    copyCodeButton.title = 'Copy code'
    copyCodeButton.innerHTML = '<span class="material-symbols-outlined">content_copy</span>'
    copyCodeButton.addEventListener('click', () => {
      navigator.clipboard.writeText(codeElement.textContent)
    })
    copyCodeButton.classList.add('action')
    codeContainer.appendChild(copyCodeButton)

    // component.insertAdjacentElement('afterend', codeContainer)
    component.appendChild(codeContainer)
  }
}
