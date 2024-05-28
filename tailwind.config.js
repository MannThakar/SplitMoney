/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				poppins: ["Poppins", "sans-serif"],
				panchang: ["Panchang", "sans-serif"],
				satoshi: ["Habibi", "serif"],
			},
			screens: {
				xxs: "320px",
				xs: "576px",
				sm: "768px",
				md: "992px",
				lg: "1200px",
				xl: "1400px",
				xxl: "1600px",
			},
			container: {
				center: true,
				padding: "1rem",
				screens: {
					xxs: "340px",
					xs: "540px",
					sm: "720px",
					md: "960px",
					lg: "1140px",
					xl: "1200px",
				},
			},
			colors: {
				textColor: "#29B6F6",
				primaryColor: "#000000",
				buttonColor: "#ffffff",
				highlightColor: "#FFD700",
				boxColor: "#857f95",
				trashColor: "#D50000",
			},
		},

		plugins: [],
	},
};
