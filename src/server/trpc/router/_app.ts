import { router } from '../trpc'
import { settingsRouter } from './settings'
import { sessionRouter } from './session'
import { userRouter } from './user'

export const appRouter = router({
	settings: settingsRouter,
	session: sessionRouter,
	user: userRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
