// This is loaded in as global variable in index.html - reset on reload, which might cause some frustration
let currentTheme = {
	colors: {
    primary: "#005260", // Vann (can use rgb as value [x, x, x] as well instead of hex)
    secondary: "#1F9562", // Gress
    tertiary: "#009BC2", // Himmel
    link: {
      base: "#005260", // Vann
      hover: "#000000" // Sort
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

const themePresets = [
	{
		name: "Vann, Gress, Himmel",
		colors: {
			primary: "#005260", // Vann (can use rgb as value [x, x, x] as well instead of hex)
			secondary: "#1F9562", // Gress
			tertiary: "#009BC2", // Himmel
			link: {
				base: "#005260", // Vann
				hover: "#000000" // Sort
			},
			font: '#000000', // Sort
			error: '#B7173D', // Nype
			warning: '#BC7726', // Siv
			success: '#2F7542' // Gran
		},
		typography: {
			fontFamily: "'Nunito Sans', Lato, 'Trebuchet MS', sans-serif"
		}
	},
	{
		name: "Blåveis, Plomme, Korn",
		colors: {
			// Convert colors to rgb as well, if they are not
			primary:  "#414681", // Blåveis (can use rgb as value [x, x, x] as well instead of hex)
			secondary: "#5A2E61", // Plomme
			tertiary: "#A5983A", // Korn
			link: {
				base: "#005260", // Vann
				hover: "#000000" // Sort
			},
			font: '#000000', // Sort
			error: '#B7173D', // Nype
			warning: '#BC7726', // Siv
			success: '#2F7542' // Gran
		},
		typography: {
			fontFamily: "'Nunito Sans', Lato, 'Trebuchet MS', sans-serif",
		}
	},
	{
		name: "Siv, Nype, Plomme",
		colors: {
			// Convert colors to rgb as well, if they are not
			primary:  "#BC7726", // Siv (can use rgb as value [x, x, x] as well instead of hex)
			secondary: "#B7173D", // Nype
			tertiary: "#5A2E61", // Plomme 
			link: {
				base: "#005260", // Vann
				hover: "#000000" // Sort
			},
			font: '#000000', // Sort
			error: '#B7173D', // Nype
			warning: '#BC7726', // Siv
			success: '#2F7542' // Gran
		},
		typography: {
			fontFamily: "'Nunito Sans', Lato, 'Trebuchet MS', sans-serif",
		}
	},
	{
		name: "Gran, Korn, Stein",
		colors: {
			// Convert colors to rgb as well, if they are not
			primary:  "#2F7542", // Gran (can use rgb as value [x, x, x] as well instead of hex)
			secondary: "#A5983A", // Korn
			tertiary: "#7B7B7A", // Stein 
			link: {
				base: "#005260", // Vann
				hover: "#000000" // Sort
			},
			font: '#000000', // Sort
			error: '#B7173D', // Nype
			warning: '#BC7726', // Siv
			success: '#2F7542' // Gran
		},
		typography: {
			fontFamily: "'Nunito Sans', Lato, 'Trebuchet MS', sans-serif",
		}
	},
	{
		name: "Fjord, Himmel, Strand",
		colors: {
			// Convert colors to rgb as well, if they are not
			primary:  "#14828C", // Fjord (can use rgb as value [x, x, x] as well instead of hex)
			secondary: "#009BC2", // Himmel
			tertiary: "#8A6C3E", // Strand 
			link: {
				base: "#005260", // Vann
				hover: "#000000" // Sort
			},
			font: '#000000', // Sort
			error: '#B7173D', // Nype
			warning: '#BC7726', // Siv
			success: '#2F7542' // Gran
		},
		typography: {
			fontFamily: "'Nunito Sans', Lato, 'Trebuchet MS', sans-serif",
		}
	},
	{
		name: "Bark, Strand, Berg",
		colors: {
			// Convert colors to rgb as well, if they are not
			primary:  "#996954", // Bark (can use rgb as value [x, x, x] as well instead of hex)
			secondary: "#8A6C3E", // Strand
			tertiary: "#727062", // Berg 
			link: {
				base: "#005260", // Vann
				hover: "#000000" // Sort
			},
			font: '#000000', // Sort
			error: '#B7173D', // Nype
			warning: '#BC7726', // Siv
			success: '#2F7542' // Gran
		},
		typography: {
			fontFamily: "'Nunito Sans', Lato, 'Trebuchet MS', sans-serif",
		}
	}
	
]
