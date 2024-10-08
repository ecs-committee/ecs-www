import { createContext } from './trpc/context'
import { appRouter } from './trpc/router/_app'
import { applyWSSHandler } from '@trpc/server/adapters/ws'
import http from 'http'
import next from 'next'
import { parse } from 'url'
import ws from 'ws'
import { _error, _info } from '../utils/debug'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
	const server = http.createServer((req, res) => {
		const proto = req.headers['x-forwarded-proto']
		if (proto && proto === 'http') {
			// redirect to ssl
			res.writeHead(303, {
				location: `https://` + req.headers.host + (req.headers.url ?? ''),
			})
			res.end()
			return
		}
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const parsedUrl = parse(req.url!, true)
		handle(req, res, parsedUrl)
	})
	const wss = new ws.Server({ server })
	const handler = applyWSSHandler({ wss, router: appRouter, createContext })

	process.on('SIGTERM', () => {
		console.log('SIGTERM')
		handler.broadcastReconnectNotification()
	})
	server.listen(port)

	// tslint:disable-next-line:no-console
	console.log(
		`> TRPC WS Enabled Server listening at http://localhost:${port} as ${
			dev ? 'development' : process.env.NODE_ENV
		}`
	)


})

// Docker/kube stuff
process.on('SIGINT', () => {
	_info('SIGINT')
	process.exit(0)
})
process.on('SIGTERM', () => {
	_info('SIGTERM')
	process.exit(0)
})
