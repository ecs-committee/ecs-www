import { useRouter } from 'next/router'
import { useSession } from '../../hooks/useSession'

export default function AuthenticationRequired({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const { session, loading } = useSession()

	if (loading) {
		return <div>loading...</div>
	}

	if (!session.user) {
		router.push('/auth/login')
		return <div>Redirecting...</div>
	}

	return <>{children}</>
}
