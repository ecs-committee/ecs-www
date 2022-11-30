import { router, publicProcedure, adminProcedure } from '../trpc'
import { _debug } from '../../../utils/debug'
import Settings from '../../lib/settings'
import { observable } from '@trpc/server/observable'
import { z } from 'zod'

export const settingsRouter = router({
	getAll: publicProcedure.query(async ({ ctx }) => {
		_debug('settingsGetAll')
		return Settings.settings
	}),

	set: adminProcedure.input(z.object({}).catchall(z.string())).mutation(async ({ input, ctx }) => {
		_debug('settingsSet', input)

		for (const [key, value] of Object.entries(input)) {
			await Settings.set(key, value)
		}

		return Settings.settings
	}),

	onChange: publicProcedure.subscription(({ ctx }) =>
		observable<{ key: string; value: any }>((emit) => {
			const handler = (key: string, value: any) => {
				emit.next({ key, value })
			}
			Settings.on('*', handler)
			return () => {
				Settings.off('*', handler)
			}
		})
	),
})
