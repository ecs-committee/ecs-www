import * as trpc from '@trpc/server'
import type * as trpcNext from '@trpc/server/adapters/next'
import { type inferAsyncReturnType } from '@trpc/server'
import type { NodeHTTPCreateContextFnOptions } from '@trpc/server/adapters/node-http'
import { type IncomingMessage } from 'http'
import type ws from 'ws'
import { prisma } from '../db/client'
import { type Session } from '../../types/session'

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type CreateContextOptions = Record<string, never>

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	opts: trpcNext.CreateNextContextOptions | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
) => {
	return {
		prisma,
	}
}

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (
	opts: trpcNext.CreateNextContextOptions | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
) => {
	const settings = (await prisma.settings.findMany()).reduce<{ [key: string]: string }>((acc, cur) => {
		acc[cur.name] = cur.value
		return acc
	}, {})

	return {
		...(await createContextInner(opts)),
		settings,
		session: {
			user: null,
			homeUrlPrivate: '/app',
		} as Session,
	}
}

export type Context = inferAsyncReturnType<typeof createContext>
