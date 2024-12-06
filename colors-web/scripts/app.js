import Color from "colorjs.io"

console.log("Halla!")

// Get ecxisitng HTML elements
const baseColorInput = document.getElementById("base-color")
const starthueNumber = document.getElementById("starthue-number")
const starthueSlider = document.getElementById("starthue-slider")
const lightnessNumber = document.getElementById("lightness-number")
const lightnessSlider = document.getElementById("lightness-slider")
const chromaNumber = document.getElementById("chroma-number")
const chromaSlider = document.getElementById("chroma-slider")
const stepsNumber = document.getElementById("steps-number")
const stepsSlider = document.getElementById("steps-slider")
const huesContainer = document.getElementById("hues")

/**
 * Function for generating hues based on lightness, chroma, and number of steps in the Oklch color space
 * 
 * @param {number} lightness [0, 1] 
 * @param {number} chroma [0, 0.4]
 * @param {number} steps [1, 100000]
 * @param {number} startHue [0, 360]
 * @returns {Color}
 */
const generateHues = (lightness, chroma, steps, startHue = 0) => {
  let hues = []
  for (let i = 0; i < steps; i++) {
      const currentHue = (i * (360 / steps)) + startHue > 359 ? (i * (360 / steps)) + startHue - 360 : (i * (360 / steps)) + startHue
      hues.push(new Color(`oklch(${lightness*100}%, ${chroma}, ${currentHue})`))
      // hues.push(new Color(`oklch(${lightness*100}%, ${chroma}, ${(i * (360 / steps)) + startHue})`))
  }
  return hues
}

const colorRanges = {
  pink: [0, 17],
  red: [18, 53],
  orange: [54, 89],
  yellow: [90, 125],
  green: [126, 161],
  cyan: [162, 197],
  lightBlue: [198, 233],
  blue: [234, 269],
  purple: [270, 305],
  magenta: [306, 341],
  pink: [342, 359]
}

const getColorName = (hue) => {
  const hueName = Object.keys(colorRanges).find(color => {
    const range = colorRanges[color]
    return hue >= range[0] && hue <= range[1]
  })
  return hueName
}

const getPaletteColors = (inputColor) => {
  const pureHues = {
    red: 30,
    orange: 60,
    brown: 75,
    yellow: 105, 
    green: 150,
    cyan: 200,
    blue: 255,
    purple: 300,
    pink: 330
  }
  const baseColor = new Color(inputColor)
  const baseColorHue = baseColor.oklch[2]
  const baseColorHueName = Object.keys(pureHues).reduce((a, b) => Math.abs(pureHues[a] - baseColorHue) < Math.abs(pureHues[b] - baseColorHue) ? a : b)
  console.log(baseColorHueName)
}

let hueStepContainers = {}

/**
 * Function for updating the hue step containers - creating container for each (maybe selected) color space, adn each step-div for the hue for each color space
 */
const updateHueStepContainers = () => {
  // What color spaces are we working with (selected?)
  const colorSpaces = ["oklch", "p3", "srgb"] // "oklch-notGamut"

  // First we need to remove all existing hue step containers and rango-info-row
  const existingHueStepContainers = Array.from(document.getElementsByClassName("hue-step-container"))
  existingHueStepContainers.forEach(container => container.remove())

  // Then we create the new hue step containers
  hueStepContainers = {}
  colorSpaces.forEach((colorSpace, index) => {
    const container = document.createElement("div")
    container.className = "hue-step-container"
    container.id = `hue-step-${colorSpace}-container`
    hueStepContainers[colorSpace] = {
      container,
      hueSteps: []
    }
    // Then we add some style to the container
    container.style.display = "flex"
    container.style.alignItems = "center"
    // Then we add a title to the container
    const title = document.createElement("div")
    title.innerText = colorSpace
    title.style.width = "4rem"
    title.style.flexShrink = "0"
    container.appendChild(title)
    // Then we add all the step-divs to the container
    const steps = Number(stepsNumber.value)
    for (let i = 0; i < steps; i++) {
      const hueStep = document.createElement("div")
      hueStep.className = "hue-step"
      hueStep.style.height = "6.25rem"
      hueStep.style.width = "6.25rem"
      hueStep.style.position = "relative"

      // Infobox about current color
      const infoBox = document.createElement("div")
      infoBox.className = "hue-step-info-box"
      infoBox.style.position = "absolute"
      if (index === 0) { // infoBox on first row
        infoBox.classList.add("hue-step-info-box-first-row")
        infoBox.style.top = "-6.25rem"
        infoBox.style.width = "6.25rem"
        infoBox.style.height = "6.25rem"
        infoBox.style.backgroundColor = "red"
        infoBox.style.textAlign = "center"
      } else { // Just hue on other rows
        infoBox.style.top = "-1.2rem"
      }
      infoBox.style.display = "none"
      hueStep.appendChild(infoBox)

      hueStepContainers[colorSpace].hueSteps.push(hueStep)
      container.appendChild(hueStep)
    }
    huesContainer.appendChild(container)
  })
}

const generateWebHues = () => {
  const startHue = Number(starthueNumber.value)
  const lightness = Number(lightnessNumber.value) / 100
  const chroma = Number(chromaNumber.value)
  const steps = Number(stepsNumber.value)
  for (const [step, hue] of Object.entries(generateHues(lightness, chroma, steps, startHue))) {
    for (const [colorSpace, hueStepContainer] of Object.entries(hueStepContainers)) {
      const inGamut = !colorSpace.endsWith("notGamut")
      const hueStep = hueStepContainer.hueSteps[step]
      const currentColor = hue.to(colorSpace.replace("-notGamut", "")).toString({ inGamut })
      hueStep.style.backgroundColor = currentColor
      // Info box about current color?
      const hueStepInfoBox = hueStep.firstChild
      if (hueStepInfoBox.classList.contains("hue-step-info-box-first-row")) {
        hueStepInfoBox.style.backgroundColor = currentColor
      }
      hueStep.firstChild.innerHTML = `${hue.h} - ${getColorName(hue.h)}`
    }
  }
  getPaletteColors(baseColorInput.value)
  // Also add color-names to correct ranges (somehow) maybe above the stuff
}

// Iitial hue generation
updateHueStepContainers()
generateWebHues()

// Add interactivity to the base color input
baseColorInput.addEventListener("input", () => {
  const baseColor = new Color(baseColorInput.value)
  starthueNumber.value = baseColor.oklch[2]
  starthueSlider.value = baseColor.oklch[2]
  lightnessNumber.value = baseColor.oklch[0] * 100
  lightnessSlider.value = baseColor.oklch[0] * 100
  chromaNumber.value = baseColor.oklch[1]
  chromaSlider.value = baseColor.oklch[1]
  generateWebHues()
})

// Update base color input based
const updateBaseColorInput = () => {
  const baseColor = new Color(`oklch(${lightnessNumber.value}%, ${chromaNumber.value}, ${starthueNumber.value})`)
  const baseColorAsHex = baseColor.to("srgb").toString({ format: "hex" })
  baseColorInput.value = baseColorAsHex
}

// Add interacitvity to the number inputs and sliders
stepsNumber.addEventListener("input", () => {
  stepsSlider.value = stepsNumber.value
  updateHueStepContainers()
  generateWebHues()
})
stepsSlider.addEventListener("input", () => {
  stepsNumber.value = stepsSlider.value
  updateHueStepContainers()
  generateWebHues()
})
starthueNumber.addEventListener("input", () => {
  starthueSlider.value = starthueNumber.value
  generateWebHues()
  updateBaseColorInput()
})
starthueSlider.addEventListener("input", () => {
  starthueNumber.value = starthueSlider.value
  generateWebHues()
  updateBaseColorInput()
})
lightnessNumber.addEventListener("input", () => {
  lightnessSlider.value = lightnessNumber.value
  generateWebHues()
  updateBaseColorInput()
})
lightnessSlider.addEventListener("input", () => {
  lightnessNumber.value = lightnessSlider.value
  generateWebHues()
  updateBaseColorInput()
})
chromaNumber.addEventListener("input", () => {
  chromaSlider.value = chromaNumber.value
  generateWebHues()
  updateBaseColorInput()
})
chromaSlider.addEventListener("input", () => {
  chromaNumber.value = chromaSlider.value
  generateWebHues()
  updateBaseColorInput()
})


