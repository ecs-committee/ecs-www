import { type Context } from '../server/trpc/context'
import { type User } from './user'

export interface AuthProvider {
	login: (username: string, password: string, context: Context) => Promise<User | null>
	create: (username: string, password: string, ctx: Context) => Promise<User>
	update: (username: string, password: string, ctx: Context) => Promise<User>
}

export type AuthProviderDefinition = { id: string; component: AuthProvider; label: string }
