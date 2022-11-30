import { type AuthProviderDefinition } from './authProvider'
import { type Session } from './session'

export interface SessionContextType {
	session: Session
	loading: boolean
	sessionUserAuthProviders: AuthProviderDefinition[]
	sessionPublicGoto: (url: string) => void
	sessionUserLogin: (user: string, password: string, provider: AuthProviderDefinition['id']) => Promise<void>
	sessionUserLogout: (url?: string) => Promise<void>
}
