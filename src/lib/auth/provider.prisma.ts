import { type Context } from '../../server/trpc/context'
import { type AuthProvider } from '../../types/authProvider'
import { type UserRole, type User } from '../../types/user'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 11

class Provider implements AuthProvider {
	async login(try_user: string, try_pass: string, ctx: Context): Promise<User> {
		//await this.create('haakon', 'zaykei3', ctx)

		const foundUser = await ctx.prisma.user.findUnique({
			where: {
				username: try_user,
			},
		})

		if (foundUser) {
			if (bcrypt.compareSync(try_pass, foundUser.password)) {
				return {
					id: foundUser.id,
					username: foundUser.username,
					role: foundUser.role as UserRole,
				}
			}
		}

		throw new Error('No such username or password')
	}

	async create(username: string, password: string, ctx: Context): Promise<User> {
		const salt = bcrypt.genSaltSync(SALT_ROUNDS)
		const passwordHash = bcrypt.hashSync(password, salt)
		const user = await ctx.prisma.user.create({
			data: {
				username,
				password: passwordHash,
			},
		})

		return {
			id: user.id,
			username: user.username,
			role: user.role as UserRole,
		}
	}

	async update(username: string, password: string, ctx: Context): Promise<User> {
		const salt = bcrypt.genSaltSync(SALT_ROUNDS)
		const passwordHash = bcrypt.hashSync(password, salt)
		const user = await ctx.prisma.user.update({
			data: {
				username,
				password: passwordHash,
			},
			where: {
				username,
			},
		})

		return {
			id: user.id,
			username: user.username,
			role: user.role as UserRole,
		}
	}
}

const provider = new Provider()
export default provider
