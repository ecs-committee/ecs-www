import { createContext } from './trpc/context'
import { appRouter } from './trpc/router/_app'
import { applyWSSHandler } from '@trpc/server/adapters/ws'
import fetch from 'node-fetch'
import ws from 'ws'
import { _error, _info } from '../utils/debug'
import '../server/lib/sms'
import { initializeSms } from '../server/lib/sms'

if (!global.fetch) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	;(global as any).fetch = fetch
}
const wss = new ws.Server({
	port: 3001,
})
wss.on('listening', () => {
	initializeSms().catch((e) => {
		_error('SMS: Failed to initialize', e)
	});
});

const handler = applyWSSHandler({ wss, router: appRouter, createContext })

wss.on('connection', (ws: ws.WebSocket) => {
	console.log(`➕➕ WS Connection (${wss.clients.size})`)
	ws.once('close', () => {
		console.log(`➖➖ WS Connection (${wss.clients.size})`)
	})
})

_info('WebSocket Server listening on ws://localhost:3001')

process.on('SIGTERM', () => {
	console.log('SIGTERM')
	handler.broadcastReconnectNotification()
	wss.close()
})
