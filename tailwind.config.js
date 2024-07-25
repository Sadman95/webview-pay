/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		container: {
			padding: {
				DEFAULT: "1rem",
				xs: "0.5rem",
				sm: "2rem",
				lg: "4rem",
				xl: "5rem",
				"2xl": "6rem",
			},
		},
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},

			colors: {
				transparent: "transparent",
				current: "currentColor",
				info: "#00b7eb",
				dark: "#000",
				white: "#fff",
				primary: "#423ED8",
				warning: "#FFDC62",
				slate: "#2E3856",
				gray: "#586380",
				lightGray: "#D3d3d3",
				lightBlue: "#DBDFFF",
				danger: "red",
			},
			fontFamily: {
				poppins: ["Poppins"],
			},
		},
		fontWeight: {
			thin: "100",
			extralight: "200",
			light: "300",
			normal: "400",
			medium: "500",
			semibold: "600",
			bold: "700",
			extrabold: "800",
		},
	},
	plugins: [require("daisyui")],
};
