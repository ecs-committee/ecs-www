import { Spinner } from '@blueprintjs/core'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import { useSession } from '../../hooks/useSession'

export default function AuthenticationRequired({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const { session, loading } = useSession()

	if (loading) {
		return <Spinner size={128} />
	}

	if (!session.user) {
		router.push('/auth/login')
		return <div>Redirecting...</div>
	}

	return <>{children}</>
}
