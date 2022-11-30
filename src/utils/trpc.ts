import { createWSClient, httpBatchLink, loggerLink, wsLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import superjson from 'superjson'
import getConfig from 'next/config'
import type { NextPageContext } from 'next'
import { type AppRouter } from '../server/trpc/router/_app'

const { publicRuntimeConfig } = getConfig()

const { APP_URL, WS_URL } = publicRuntimeConfig

function getEndingLink(ctx: NextPageContext | undefined) {
	if (typeof window === 'undefined') {
		return httpBatchLink({
			url: `${APP_URL}/api/trpc`,
			headers() {
				if (ctx?.req) {
					// on ssr, forward client's headers to the server
					return {
						...ctx.req.headers,
						'x-ssr': '1',
					}
				}
				return {}
			},
		})
	}
	const client = createWSClient({
		url: WS_URL.match(/:\/\//) ? WS_URL : `${window.location.origin}${WS_URL}`.replace(/^http/, 'ws'),
	})

	return wsLink<AppRouter>({
		client,
	})
}

export const trpc = createTRPCNext<AppRouter>({
	config({ ctx }) {
		return {
			transformer: superjson,
			links: [
				loggerLink({
					enabled: (opts) =>
						process.env.NODE_ENV === 'development' ||
						(opts.direction === 'down' && opts.result instanceof Error),
				}),
				getEndingLink(ctx),
			],
		}
	},
	ssr: false,
})
