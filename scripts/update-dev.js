import { generateCssFile } from "../esm/index.js"

{
  // Updates dev css file with newest auto-css (colors and stuff)
  const options = {
    cssPath: './lib/css-components.css'
  }
  generateCssFile(null, options)
}

{
  // Updates example html/css locally
  const customTheme = {
    colors: {
      // Convert colors to rgb as well, if they are not
      primary:  "#005260", // Vann (can use rgb as value [x, x, x] as well instead of hex)
      secondary: "#1F9562", // Gress
      tertiary: "#009BC2", // Himmel
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
  const options = {
    cssPath: './example/style.css'
  }
  generateCssFile(customTheme, options)
}

{
  // Updates example html/css locally
  const minElevTheme = {
    colors: {
      // Convert colors to rgb as well, if they are not
      primary:  "#005260", // Vann (can use rgb as value [x, x, x] as well instead of hex)
      secondary: "#1F9562", // Gress
      tertiary: "#009BC2", // Himmel
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
  const options = {
    cssPath: './themes/minelev.css'
  }
  generateCssFile(minElevTheme, options)
}

{
  // Updates example html/css locally
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
  const options = {
    cssPath: './themes/elevdok.css'
  }
  generateCssFile(elevdokTheme, options)
}