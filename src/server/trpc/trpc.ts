import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'

import { type Context } from './context'

const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter({ shape }) {
		return shape
	},
})

/**
 * @see https://trpc.io/docs/v10/middlewares
 */

const isUser = t.middleware(({ next, ctx }) => {
	// remember to include the admin here.
	if (ctx.session.user?.role !== 'user' && ctx.session.user?.role !== 'admin') {
		throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not loggedin user' })
	}
	return next({
		ctx: {
			user: ctx.session.user,
		},
	})
})

const isAdmin = t.middleware(({ next, ctx }) => {
	if (ctx.session.user?.role !== 'admin') {
		throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not admin' })
	}
	return next({
		ctx: {
			user: ctx.session.user,
		},
	})
})

export const middleware = t.middleware
export const router = t.router

export const publicProcedure = t.procedure
export const userProcedure = t.procedure.use(isUser)
export const adminProcedure = t.procedure.use(isAdmin)