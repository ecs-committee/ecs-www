import { z } from 'zod'
import { router, adminProcedure } from '../trpc'
import { _debug } from '../../../utils/debug'
import authProvider from '../../../lib/auth/provider.prisma'
import { type User } from '../../../types/user'

export const userRouter = router({
	/* Admin routes */
	create: adminProcedure
		.input(z.object({ username: z.string(), password: z.string() }))
		.mutation(async ({ input, ctx }) => {
			if (input.username.trim() === '') {
				throw new Error('Username cannot be empty')
			}

			// check if user exists
			const user = await ctx.prisma.user.findUnique({
				where: {
					username: input.username,
				},
			})

			if (user) {
				throw new Error('User already exists')
			}

			return authProvider.create(input.username, input.password, ctx)
		}),

	list: adminProcedure.query(async ({ ctx }) => {
		return ctx.prisma.user.findMany({ select: { id: true, username: true, role: true } }) as unknown as User[]
	}),

	update: adminProcedure
		.input(
			z.object({
				id: z.string(),
				username: z.string(),
				password: z.string().optional(),
				role: z.enum(['admin', 'user']),
			})
		)
		.mutation(async ({ input, ctx }) => {
			try {
				if (input.username.trim() === '') {
					throw new Error('Username cannot be empty')
				}
				await ctx.prisma.user.update({
					where: {
						id: input.id,
					},
					data: {
						username: input.username,
						role: input.role,
					},
				})

				// Update password if set
				if (input.password) {
					_debug("Updating password for user '" + input.username + "'")
					await authProvider.update(input.username, input.password, ctx)
				} else {
					_debug("Not updating password for user '" + input.username + "'")
				}

				return true
			} catch (error) {
				throw new Error("Couldn't update user")
			}
		}),

	delete: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
		try {
			await ctx.prisma.user.delete({
				where: {
					id: input.id,
				},
			})
			return true
		} catch (error) {
			throw new Error("Couldn't delete user")
		}
	}),
})
