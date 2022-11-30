import { PrismaClient } from '@prisma/client'
//import { env } from '../../env/server' // imports next
import authProvider from '../../lib/auth/provider.prisma'
import { _info } from '../../utils/debug'

declare global {
	var prisma: PrismaClient | undefined
}

export const prisma =
	global.prisma ||
	new PrismaClient({
		log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
	})

if (process.env.NODE_ENV !== 'production') {
	global.prisma = prisma
}

async function initDB() {
	const INITIAL_USER = process.env.INITIAL_USER || 'admin'
	const INITIAL_PASSWORD = process.env.INITIAL_PASSWORD || 'admin'

	console.log('Checking Database')

	try {
		const result = await prisma.user.findUnique({ where: { username: INITIAL_USER } })
		if (!result) {
			_info("Creating initial user '" + INITIAL_USER + "'")
			// Create initial user with dummy-context
			const user = await authProvider.create(INITIAL_USER, INITIAL_PASSWORD, {
				prisma,
				settings: {},
				session: { user: null, homeUrlPrivate: '/app' },
			})
			await prisma.user.update({
				data: { role: 'admin' },
				where: { id: user.id },
			})
		}
	} catch (e) {
		console.error('Error initializing database')
		// Fail (un)gracefully
		throw e
	}
}

// Let database calm down first
setTimeout(() => {
	initDB()
}, 2000)
