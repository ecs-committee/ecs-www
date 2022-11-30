import { type User } from './user'

export type Session = {
	user: null | User
	homeUrlPrivate?: string
}
