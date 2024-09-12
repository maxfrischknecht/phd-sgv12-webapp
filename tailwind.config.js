/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
				grey: '#5A5A5A',
				dark: '#282828',
				light: '#F4F4F4',
				background: '#141414',
				blue: '#8390FA',
        black: "#000"
			}
    },
    fontFamily: {
			// creates font-sans class
			sans: ['Helvetica Neue', 'sans-serif'],
			mono: ['Everett Mono', 'monospace']
		},
		fontSize: {
			// https://tailwindcss.com/docs/customizing-spacing#default-spacing-scale
      		base: ['1.125rem', '1.375rem'],
			'sans-md': ['1.125rem', '1.375rem'],
			'mono-sm': ['0.71875rem', '1rem'],
		}
  },
  plugins: [],
}

