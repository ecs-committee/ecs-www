import { type NextPage } from 'next'
import { useCallback, useEffect, useRef, useState } from 'react'
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

	const [search, setSearch] = useState<string>('')
	const searchRef = useRef<HTMLInputElement>(null)
	const descRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		searchRef.current?.focus()
	}, [])

	useEffect(() => {
		if (!drawerOpen && search !== '') {
			setDrawerOpen(true)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search])

	return (
		<>
			<Head>
				<title>Entertainment Collaboration Structure</title>
				<meta
					name="description"
					content="The Entertainment Collaboration Structure (ECS) is a comprehensive tool designed to help you structure your drawing in a simple and easy to understand manner. It is not designed to be a complete manual with every single item and aspect of a drawing defined, rather we aim to give you the building blocks needed and for you to expand upon when the project calls for specific solutions that are not defined in this structure."
				/>
				<meta
					name="keywords"
					content="vectorworks,vwx,skp,layers,classes,standard,entertainment,collaboration,structure,drawing,production,venue,rigging,scenic,lights,video,audio,effects,event,broadcast,drawing,software"
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
			<main className="from-[#051379] to-[#161122] flex min-h-screen flex-col items-center justify-center bg-gradient-to-b">
				<div className="container flex flex-col items-center justify-center gap-12 px-7 py-32">
					<input
						type="text"
						ref={searchRef}
						className="w-full max-w-4xl rounded-xl bg-white/10 p-4 text-xl text-white"
						placeholder="Search.."
						value={search}
						onChange={(e) => {
							setSearch(e.target.value)
						}}
					/>

					<h1 className="sm:text-[4rem] text-5xl font-extrabold tracking-tight text-white md:text-center">
						Entertainment <span className="text-[hsl(198,90%,77%)]">Collaboration</span> Structure
					</h1>
					<p className="text-[1.2rem] md:w-[90vw] md:text-[1.5rem] lg:w-[50vw] text-white md:text-center">
						We&apos;re a small committee of representatives from different companies within the broadcast,
						music and entertainment industry aiming to make it easier for everyone to create, collaborate
						and merge technical drawings using a standardized set of layers/classes and best practices based
						on collective experience.
					</p>
					<div className="w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[50vw] grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 md:py-5">
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
									<li>ecs-v1.0.0.vwx</li>
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
									<li>ecs-v1.0.0.wyg</li>
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
									<li>ecs-v1.0.0.skp</li>
								</ul>
							</div>
						</div>

						<div
							className="flex cursor-pointer flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
							onClick={() => {
								// window location
								window.location.href = '/v1/ecs-v1.0.0.c2p'
							}}
						>
							<h3 className="text-2xl font-bold">Capture ⤵</h3>
							<div className="text-lg">
								<ul className="ml-6 mt-0 list-disc">
									<li>ecs-v1.0.0.c2p</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="md:w-[90vw] px-0 text-lg text-white md:text-center lg:max-w-6xl">
						<p className="c1 mb-6">
							<span className="c0">
								The Entertainment Collaboration Structure (ECS) is a comprehensive tool designed to help
								you structure your drawing in a simple and easy to understand manner. It is not designed
								to be a complete manual with every single item and aspect of a drawing defined, rather
								we aim to give you the building blocks needed and for you to expand upon when the
								project calls for specific solutions that are not defined in this structure.
							</span>
						</p>
						<p className="c1 mb-6">
							<span className="c0">
								The project started as a tool to simplify the process of migrating data from one drawing
								software to another, centered around the needs of the lighting, sound, video and rigging
								departments in the live entertainment sector. The goal was to move items, symbols and
								objects from one file to another without losing track of where and to whom they belonged
								in the drawing. This has evolved into a more comprehensive tool for organizing the
								entirety of the drawing, including the broader spectrum of disciplines usually
								associated with live events and television productions. &nbsp;
							</span>
						</p>
						<p className="c1">
							<span className="c0">
								The structure is maintained by volunteer efforts by industry professionals. It is a
								not-for-profit initiative and all assets pertaining to this standard are licensed under
								a Creative Commons Attribution-ShareAlike license.
							</span>
						</p>
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

						<h2 className="sm:text-[2.5rem] mt-16 text-3xl font-extrabold tracking-tight text-white">
							Contributors
						</h2>

						<People />

						<Flyover
							isOpen={drawerOpen}
							onClose={() => {
								setDrawerOpen(!drawerOpen)
								setSearch('')
								setTimeout(() => {
									// only focus if we're at top of the page scroll
									if (window.scrollY === 0) {
										searchRef.current?.focus()
									}
								}, 200)
							}}
						>
							<Layers
								search={search}
								onClearSearch={() => setSearch('')}
								onSearch={(e) => {
									setSearch(e.target.value)
								}}
								descRef={descRef}
							/>
						</Flyover>

						<h2 className="sm:text-[2.5rem] mt-16 text-3xl font-extrabold tracking-tight text-white">
							Release Notes v1
						</h2>

						<div className="std-desc mx-auto max-w-6xl px-0 text-white" ref={descRef}>
							<V1Desc />
						</div>
					</>
				</div>
			</main>
		</>
	)
}

export default Home
