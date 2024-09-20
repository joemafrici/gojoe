/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./templates/**/*.{html,js}"],
	theme: {
		extend: {
			colors: {
				'background-blue': '#b0c4de',
				'background-gray': '#c7c7c7',
				'custom-green': '#bdd1bf',
				'ash-gray': '#b2beb5',
				'ghost-white': '#f8f8ff',
				'my-black': '#393e45',
				'green-cyan': '#009966',
			},
			fontFamily: {
				'hack': ['HackNerdFont', 'monospace'],
			},
		},
	},
	plugins: [],
}

