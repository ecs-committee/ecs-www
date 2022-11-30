import { useContext } from 'react'
import { SessionContext } from '../contexts/session'

export function useSession() {
	const sessionContext = useContext(SessionContext)
	return sessionContext
}
