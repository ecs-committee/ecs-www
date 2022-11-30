import { type Context } from '../../server/trpc/context'
import { type AuthProvider } from '../../types/authProvider'
import { UserRole, type User } from '../../types/user'

const users: User[] = [{ id: '0001', username: 'admin', role: UserRole.ADMIN }]

const passwords: { id: string; password: string }[] = [
	{
		id: '0001',
		password: 'admin',
	},
]

class Provider implements AuthProvider {
	async login(try_user: string, try_pass: string, context: Context): Promise<User> {
		const user = users.find((user) => user.username === try_user)
		if (user) {
			const password = passwords.find((password) => password.id === user.id)
			if (password && password.password === try_pass) {
				return user
			}
		}
		throw new Error('No such username or password')
	}

	async create(username: string, password: string, context: Context): Promise<User> {
		throw new Error('Local static users does not implement create()')
	}

	async update(username: string, password: string, context: Context): Promise<User> {
		throw new Error('Local static users does not implement update()')
	}
}

export default new Provider()
