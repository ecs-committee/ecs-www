/** @type {import("prettier").Config} */
module.exports = {
	plugins: [require.resolve('prettier-plugin-tailwindcss'), require.resolve('prettier-plugin-prisma')],
	tabs: true,
	useTabs: true,
	singleQuote: true,
	arrowParens: 'always',
	bracketSpacing: true,
	printWidth: 120,
	semi: false,
	endOfLine: 'lf',
}
