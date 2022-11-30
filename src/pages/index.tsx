import { type NextPage } from 'next'
import { useCallback, useEffect, useState } from 'react'
import { Spinner } from '@blueprintjs/core'
import { useSettings } from '../lib/components/auth/SettingsHook'
import { trpc } from '../utils/trpc'
import Head from 'next/head'
import Link from 'next/link'
import { People } from '../lib/components/People'
import { Layers } from '../lib/components/Layers'
import { Flyover } from '../lib/components/Flyover'
import { EnvelopeIcon } from '@heroicons/react/20/solid'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
const Home: NextPage = () => {
	const { data: settingsData, isLoading } = useSettings()
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
	return (
		<>
			<Head>
				<title>Event Collaboration Structure</title>
				<meta name="description" content="Event Collaboration Structure Committee" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#051379] to-[#161122]">
				<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
					<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[4rem]">
						Event <span className="text-[hsl(198,90%,77%)]">Collaboration</span> Structure
					</h1>
					<p className="text-center text-white sm:text-[1.5rem] md:w-[90vw] lg:w-[50vw]">
						We&apos;re a small committee of representatives from different companies within the broadcast,
						music and entertainment industry aiming to make it easier for everyone to create, collaborate
						and merge technical drawings using a standardized set of layers/classes and best practices based
						on collective experience.
					</p>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[50vw]">
						<div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
							<h3 className="text-2xl font-bold">Vectorworks ⤵</h3>
							<div className="text-lg">
								<ul className="ml-6 mt-0 list-disc">
									<li>v1.0.0-rc1 - Coming soon</li>
								</ul>
							</div>
						</div>
						<div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
							<h3 className="text-2xl font-bold">AutoCAD ⤵</h3>
							<div className="text-lg">
								<ul className="ml-6 mt-0 list-disc">
									<li>v1.0.0-rc1 - Coming soon</li>
								</ul>
							</div>
						</div>

						<div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
							<h3 className="text-2xl font-bold">WYSIWYG ⤵</h3>
							<div className="text-lg">
								<ul className="ml-6 mt-0 list-disc">
									<li>v1.0.0-rc1 - Coming soon</li>
								</ul>
							</div>
						</div>

						<div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
							<h3 className="text-2xl font-bold">SketchUp ⤵</h3>
							<div className="text-lg">
								<ul className="ml-6 mt-0 list-disc">
									<li>v1.0.0-rc1 - Coming soon</li>
								</ul>
							</div>
						</div>
					</div>

					<button
						type="button"
						onClick={ () => {
							setDrawerOpen(!drawerOpen)
						}}
						className="inline-flex items-center rounded-md border border-transparent bg-cyan-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-0 focus:ring-cyan-500 focus:ring-offset-1"
					>
						{drawerOpen ? (
							<ArrowLeftIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
						) : (
							<ArrowRightIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
						)}
						Click here for a quick overview
					</button>

					<h2 className="mt-16 text-3xl font-extrabold tracking-tight text-white sm:text-[2.5rem]">
						Contributors
					</h2>

					<People />

					<Flyover isOpen={drawerOpen} onClose={() => setDrawerOpen(!drawerOpen)}>
						<Layers />
					</Flyover>
				</div>
			</main>
		</>
	)
}

export default Home
