// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
//!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: false,
	swcMinify: true,
	i18n: {
		locales: ['en'],
		defaultLocale: 'en',
	},
	output: 'standalone',
	images: {
		domains: ['images.unsplash.com', 'tailwindui.com'],
	},
	publicRuntimeConfig: {
		// Will be available on both server and client
		APP_URL: process.env.APP_URL,
		WS_URL: process.env.WS_URL,
	},
}
export default config
