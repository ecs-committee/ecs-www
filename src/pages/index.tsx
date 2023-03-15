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
import { useRouter } from 'next/router'
import { V1Desc } from '../lib/components/V1'
const Home: NextPage = () => {
	const { data: settingsData, isLoading } = useSettings()
	// get query parasms
	const { query } = useRouter()
	const { magi } = query
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
	return (
		<>
			<Head>
				<title>Entertainment Collaboration Structure</title>
				<meta
					name="description"
					content="The Entertainment Collaboration Structure (ECS) is a comprehensive tool designed to help you structure your drawing in a simple and easy to understand manner. It is not designed to be a complete manual with every single item and aspect of a drawing defined, rather we aim to give you the building blocks needed and for you to expand upon when the project calls for specific solutions that are not defined in this structure."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="theme-color" content="#282b6e" />
				<meta name="apple-mobile-web-app-status-bar-style" content="#282b6e" />
				<meta name="msapplication-navbutton-color" content="#282b6e" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-title" content="Entertainment Collaboration Structure" />
				<meta name="application-name" content="Entertainment Collaboration Structure" />

				<meta property="og:title" content="Entertainment Collaboration Structure" />
				<meta
					property="og:description"
					content="The Entertainment Collaboration Structure (ECS) is a comprehensive tool designed to help you structure your drawing in a simple and easy to understand manner. It is not designed to be a complete manual with every single item and aspect of a drawing defined, rather we aim to give you the building blocks needed and for you to expand upon when the project calls for specific solutions that are not defined in this structure."
				/>
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://layerstructure.com" />
				<meta property="og:site_name" content="Entertainment Collaboration Structure" />
				<meta property="og:image" content="/some.png" />
				<meta property="og:image:width" content="512" />
				<meta property="og:image:height" content="512" />
				<meta property="og:image:alt" content="Entertainment Collaboration Structure" />

				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#051379] to-[#161122]">
				<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
					<h1 className="text-center text-5xl font-extrabold tracking-tight text-white sm:text-[4rem]">
						Entertainment <span className="text-[hsl(198,90%,77%)]">Collaboration</span> Structure
					</h1>
					<p className="text-center text-white sm:text-[1.5rem] md:w-[90vw] lg:w-[50vw]">
						We&apos;re a small committee of representatives from different companies within the broadcast,
						music and entertainment industry aiming to make it easier for everyone to create, collaborate
						and merge technical drawings using a standardized set of layers/classes and best practices based
						on collective experience.
					</p>

					<div className="grid w-[90vw] grid-cols-1 gap-4 sm:grid-cols-3 md:w-[80vw] md:gap-8 lg:w-[70vw] xl:w-[50vw]">
						<div
							className="flex cursor-pointer flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
							onClick={() => {
								// window location
								window.location.href = '/v1/ecs-v1.0.0.vwx'
							}}
						>
							<h3 className="text-2xl font-bold">Vectorworks ⤵</h3>
							<div className="text-lg">
								<ul className="ml-6 mt-0 list-disc">
									<li>v1.0.0</li>
								</ul>
							</div>
						</div>

						<div
							className="flex cursor-pointer flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
							onClick={() => {
								// window location
								window.location.href = '/v1/ecs-v1.0.0.wyg'
							}}
						>
							<h3 className="text-2xl font-bold">WYSIWYG ⤵</h3>
							<div className="text-lg">
								<ul className="ml-6 mt-0 list-disc">
									<li>v1.0.0</li>
								</ul>
							</div>
						</div>

						<div
							className="flex cursor-pointer flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
							onClick={() => {
								// window location
								window.location.href = '/v1/ecs-v1.0.0.skp'
							}}
						>
							<h3 className="text-2xl font-bold">SketchUp ⤵</h3>
							<div className="text-lg">
								<ul className="ml-6 mt-0 list-disc">
									<li>v1.0.0</li>
								</ul>
							</div>
						</div>
					</div>
					<>
						<button
							type="button"
							onClick={() => {
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

						<h2 className="mt-16 text-3xl font-extrabold tracking-tight text-white sm:text-[2.5rem]">
							Release Notes v1
						</h2>

						<div className="std-desc mx-auto max-w-6xl px-3 text-white">
							<V1Desc />
						</div>
					</>
				</div>
			</main>
		</>
	)
}

export default Home
