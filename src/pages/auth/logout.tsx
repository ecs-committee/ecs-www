import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSession } from '../../lib/hooks/useSession'

export default function LogoutPage() {
	const session = useSession()
	const router = useRouter()

	useEffect(() => {
		const logout = async () => {
			if (session && !session.loading) {
				await session.sessionUserLogout()
			}
			router.push('/')
		}
		logout()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
}
