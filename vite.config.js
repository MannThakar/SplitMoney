import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { qrcode } from "vite-plugin-qrcode";
const manifestForPlugIn = {
	registerType: "prompt",
	includeAssests: ["favicon.ico", "apple-touc-icon.png", "masked-icon.svg"],
	manifest: {
		name: "React-vite-app",
		short_name: "react-vite-app",
		description: "I am a simple vite app",
		icons: [
			{
				src: "/android-chrome-192x192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "favicon",
			},
			{
				src: "/android-chrome-512x512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "favicon",
			},
			{
				src: "/apple-touch-icon.png",
				sizes: "180x180",
				type: "image/png",
				purpose: "apple touch icon",
			},
			{
				src: "/maskable_icon.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "any maskable",
			},
		],
		theme_color: "#171717",
		background_color: "#f0e7db",
		display: "standalone",
		scope: "/",
		start_url: "/",
		orientation: "portrait",
	},
};
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), VitePWA(manifestForPlugIn), qrcode()],
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import { VitePWA } from "vite-plugin-pwa";
// import { qrcode } from "vite-plugin-qrcode";
// import path from "path";

// export default defineConfig({
// 	plugins: [
// 		react(),
// 		qrcode(),
// 		VitePWA({
// 			registerType: "autoUpdate",
// 			includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
// 			manifest: {
// 				name: "SplitMoney",
// 				short_name: "SplitMoney",
// 				theme_color: "#ffffff",
// 				icons: [
// 					{
// 						src: "android-chrome-192x192.png",
// 						sizes: "64x64",
// 						type: "image/png",
// 					},
// 					{
// 						src: "android-chrome-512x512.png",
// 						sizes: "192x192",
// 						type: "image/png",
// 					},
// 					{
// 						src: "apple-touch-icon.png",
// 						sizes: "512x512",
// 						type: "image/png",
// 						purpose: "any",
// 					},
// 					{
// 						src: "maskable_icon",
// 						sizes: "512x512",
// 						type: "image/png",
// 						purpose: "maskable",
// 					},
// 				],
// 			},
// 		}),
// 	],

// 	resolve: {
// 		alias: {
// 			"@": path.resolve(__dirname, "./src"),
// 		},
// 	},
// });
