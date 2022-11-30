import AuthenticationRequired from '../components/auth/AuthenticationRequired'
import { BitfocusLayoutAdmin } from '../components/bitfocus/layout/admin'
import { ChartBarIcon, ChatBubbleLeftRightIcon, CogIcon, GlobeEuropeAfricaIcon, UsersIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import { useSession } from '../hooks/useSession'

export function LayoutAdmin({ children, title }: { children: React.ReactNode; title?: string }) {
	const router = useRouter()
	const { session, loading } = useSession()

	return loading ? (
		<div>loading</div>
	) : (
		<AuthenticationRequired>
			<BitfocusLayoutAdmin
				navigation={[
					{ label: 'Settings', link: '/app', icon: CogIcon, current: router.asPath === '/app' },
					{
						label: 'ECS Versions',
						link: '/app/ecs-versions',
						icon: ChatBubbleLeftRightIcon,
						current: router.asPath === '/app/ecs-versions',
					},
					{ label: 'Users', link: '/app/user', icon: UsersIcon, current: router.asPath === '/app/user' },
				]}
				user={{
					link: '#',
					label: session.user?.username || 'Anonymous',
				}}
				company={{
					label: 'ECS Committee Dashboard',
				}}
				page={{
					label: title,
				}}
			>
				{children}
			</BitfocusLayoutAdmin>
		</AuthenticationRequired>
	)
}
