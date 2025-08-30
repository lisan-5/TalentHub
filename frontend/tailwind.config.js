/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#1E40AF', // Primary Blue
					50: '#eef3ff',
					100: '#e1e9ff',
					200: '#c7d4ff',
					300: '#9fb0ff',
					400: '#6f86ff',
					500: '#1E40AF',
					600: '#18368f',
					700: '#12286f',
					800: '#0b1b4f',
					900: '#050c2f',
				},
				secondary: {
					DEFAULT: '#10B981', // Secondary Green
					50: '#ecfdf6',
					100: '#d1fae7',
					200: '#a7f3d0',
					300: '#6ee7b7',
					400: '#34d399',
					500: '#10B981',
					600: '#059669',
					700: '#047a54',
					800: '#065f44',
					900: '#044032',
				},
				background: '#ffffff',
			},
		},
	},
	plugins: [],
};