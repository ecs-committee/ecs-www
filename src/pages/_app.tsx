import type { AppType } from 'next/app'
import { FocusStyleManager } from '@blueprintjs/core'
import { trpc } from '../utils/trpc'
//import 'normalize.css/normalize.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css'

import '../styles/globals.css'
import '../styles/index.css'

import { SessionProvider } from '../lib/contexts/session'

FocusStyleManager.onlyShowFocusOnTabs()

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<SessionProvider>
			<Component {...pageProps} />
		</SessionProvider>
	)
}

export default trpc.withTRPC(MyApp)
