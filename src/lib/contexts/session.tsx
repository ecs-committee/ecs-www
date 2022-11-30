import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { createContext, useEffect, useState } from 'react'
import { type AuthProviderDefinition } from '../../types/authProvider'
import { type SessionContextType } from '../../types/sessionContext'
import { trpc } from '../../utils/trpc'

const defaultSession: SessionContextType = {
	session: {
		user: null,
		homeUrlPrivate: '/app',
	},
	loading: true,
	sessionUserAuthProviders: [],
	sessionPublicGoto: () => {},
	sessionUserLogin: async () => {},
	sessionUserLogout: async () => {},
}

export const SessionContext = createContext<SessionContextType>(defaultSession)

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
	const queryClient = useQueryClient()
	let login = trpc.session.sessionUserLogin.useMutation()
	let logout = trpc.session.sessionUserLogout.useMutation()
	let refreshToken = trpc.session.sessionRefresh.useMutation()
	const checkAuthed = trpc.session.ping.useQuery(undefined, {
		refetchInterval: 5000,
		refetchIntervalInBackground: true,
	})
	const { data: sessionUserAuthProviders } = trpc.session.sessionUserLoginProviders.useQuery()

	const router = useRouter()

	const [session, setSession] = useState({
		...defaultSession.session,
	})

	const [loading, setLoading] = useState(true)

	const sessionUserLogin = async (username: string, password: string, provider: AuthProviderDefinition['id']) => {
		const { session, token } = await login.mutateAsync({ username, password, provider })

		if (session) {
			window.localStorage.setItem('jwt', token)
			setSession(session)
		}
	}

	const sessionUserLogout = async (url?: string) => {
		const session = await logout.mutateAsync()
		if (session) {
			setSession(session)
		}

		localStorage.removeItem('jwt')

		if (url !== undefined) {
			window.location.href = url
		}
	}

	const sessionPublicGoto = async (url: string) => {
		console.log('sessionPublicGoto', url)
		router.push(url)
	}

	useEffect(() => {
		if (!checkAuthed.data?.authed && window.localStorage.getItem('jwt')) {
			;(async () => {
				setLoading(true)
				try {
					const { token, session } = await refreshToken.mutateAsync({
						token: localStorage.getItem('jwt') || '',
					})
					if (session) {
						window.localStorage.setItem('jwt', token)
						setSession(session)
						setLoading(false)
					}
				} catch (e) {
					console.log('error refreshing token', e)
					localStorage.removeItem('jwt')
					setLoading(false)
				}
			})()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkAuthed.data])

	useEffect(() => {
		console.log('mounting session provider')
		queryClient.resetQueries()

		if (localStorage.getItem('jwt')) {
			console.log('jwt found in localstorage')
			;(async () => {
				setLoading(true)
				try {
					const { token, session } = await refreshToken.mutateAsync({
						token: localStorage.getItem('jwt') || '',
					})

					if (session) {
						window.localStorage.setItem('jwt', token)
						setSession(session)
						setLoading(false)
					}
				} catch (e) {
					console.log('error refreshing token', e)
					localStorage.removeItem('jwt')
					setLoading(false)
				}
			})()
		} else {
			setLoading(false)
		}

		return () => {
			console.log('unmounting session provider')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<SessionContext.Provider
			value={{
				session,
				loading,
				sessionUserLogin,
				sessionUserLogout,
				sessionPublicGoto,
				sessionUserAuthProviders: sessionUserAuthProviders || [],
			}}
		>
			{children}
		</SessionContext.Provider>
	)
}
