import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { _debug, _info } from '../../../utils/debug'
import { type Session } from '../../../types/session'
import { type AuthProviderDefinition } from '../../../types/authProvider'
import ProviderLocal from '../../../lib/auth/provider.local'
import ProviderPrisma from '../../../lib/auth/provider.prisma'
import JWT from 'jsonwebtoken'

export const loginProviders: AuthProviderDefinition[] = [
	{
		id: 'prisma',
		component: ProviderPrisma,
		label: 'Database',
	},
]

export const loginProviderFallback = loginProviders[0] as AuthProviderDefinition

export const sessionRouter = router({
	ping: publicProcedure.query(async ({ ctx }) => {
		return { authed: ctx.session.user ? true : false }
	}),

	sessionUserLoginProviders: publicProcedure.query(() => {
		return loginProviders.map((provider) => ({
			id: provider.id,
			label: provider.label,
		})) as AuthProviderDefinition[]
	}),

	sessionRefresh: publicProcedure.input(z.object({ token: z.string() })).mutation(async ({ input, ctx }) => {
		const { token } = input

		const session = JWT.verify(token, process.env.JWT_SECRET || 'w00t') as any
		if (session.user?.id) {
			delete session.exp

			ctx.session = session

			return {
				token: JWT.sign(session, process.env.JWT_SECRET || 'w00t', { expiresIn: '1d' }),
				session,
			}
		}

		throw new Error('Invalid token')
	}),

	sessionUserLogin: publicProcedure
		.input(z.object({ username: z.string(), password: z.string(), provider: z.string() }))
		.mutation(async ({ input, ctx }) => {
			_info('sessionUserLogin', input.username)

			let provider = loginProviderFallback

			if (input.provider !== '') {
				const foundProvider = loginProviders.find((provider) => provider.id === input.provider)
				if (!provider) {
					throw new Error('No such provider')
				} else {
					provider = foundProvider as AuthProviderDefinition
				}
			}

			const user = await provider.component.login(input.username, input.password, ctx)

			if (user) {
				const session: Session = {
					user,
				}
				ctx.session = session

				return {
					token: JWT.sign(session, process.env.JWT_SECRET || 'w00t', { expiresIn: '1d' }),
					session,
				}
			}

			throw new Error('No such username or password')
		}),

	sessionUserLogout: publicProcedure.mutation(async ({ ctx }) => {
		_info('sessionUserLogout', ctx.session)

		const session = {
			user: null,
		}

		ctx.session = session
		return session
	}),
})
