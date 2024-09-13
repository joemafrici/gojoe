/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./templates/**/*.{html,js}"],
	theme: {
		extend: {
			colors: {
				'background-blue': '#b0c4de',
				'background-gray': '#c7c7c7',
			},
			fontFamily: {
				'hack': ['HackNerdFont', 'monospace'],
			},
		},
	},
	plugins: [],
}

