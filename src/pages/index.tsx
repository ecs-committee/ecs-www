import { type NextPage } from 'next'
import { useCallback, useEffect, useState } from 'react'
import { Spinner } from '@blueprintjs/core'
import { useSettings } from '../lib/components/auth/SettingsHook'
import { trpc } from '../utils/trpc'

const Home: NextPage = () => {
	const { data: settingsData, isLoading } = useSettings()

	return <div>lul</div>
}

export default Home
