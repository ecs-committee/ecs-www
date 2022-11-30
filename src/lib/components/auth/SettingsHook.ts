import { useQueryClient } from '@tanstack/react-query'
import { type inferRouterOutputs } from '@trpc/server'
import { cloneDeep } from 'lodash'
import { type AppRouter } from '../../../server/trpc/router/_app'
import { trpc } from '../../../utils/trpc'

type RouterOutput = inferRouterOutputs<AppRouter>
type SettingsOutput = RouterOutput['settings']['getAll']

export const useSettings = () => {
	const queryClient = useQueryClient()
	const settings = trpc.settings.getAll.useQuery()

	trpc.settings.onChange.useSubscription(undefined, {
		onData(data) {
			const localSettings = cloneDeep(
				queryClient.getQueryData([['settings', 'getAll'], { type: 'query' }])
			) as SettingsOutput
			try {
				localSettings[data.key] = data.value
				queryClient.setQueryData([['settings', 'getAll'], { type: 'query' }], localSettings)
			} catch (e) {
				console.error('Error updating settings:', e)
			}
		},
		onError(error) {
			console.error(error)
		},
	})

	return settings
}
