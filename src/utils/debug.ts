import { env } from 'process'

export function _debug(...any: any[]) {
	if (env.NODE_ENV === 'development') console.log('ℹ️🔵', ...any)
}

export function _info(...any: any[]) {
	console.log('ℹ️🟢', ...any)
}

export function _warning(...any: any[]) {
	console.error('ℹ️⚠️', ...any)
}

export function _error(...any: any[]) {
	console.error('ℹ️❌', ...any)
}
