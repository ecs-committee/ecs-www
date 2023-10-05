import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { ChevronRightIcon } from '@heroicons/react/20/solid'

import { RefObject, useEffect, useRef, useState } from 'react'

let json = require('./layers.json')

// sort json array by label
json.sort((a: any, b: any) => {
	var labelA = a.label.toUpperCase() // ignore upper and lowercase
	var labelB = b.label.toUpperCase() // ignore upper and lowercase
	if (labelA < labelB) {
		return -1
	} else {
		return 1
	}
})

export function Layers({
	search,
	onClearSearch,
	onSearch,
	descRef,
}: {
	search: string
	onClearSearch: () => void
	onSearch: (e: any) => void
	descRef: RefObject<HTMLDivElement>
}) {
	const [activeMain, setActiveMain] = useState<null | string>(null)
	const [currentSearchFocus, setCurrentSearchFocus] = useState<boolean>(false)
	const searchRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (searchRef.current) {
			searchRef.current.focus()
		}
	})

	return (
		<>
			<input
				ref={searchRef}
				type="text"
				className="w-full rounded p-2 text-black"
				placeholder="Search"
				value={search}
				onChange={onSearch}
			/>
			<h3 className="my-2 text-xl">Tree view</h3>
			<div className="">
				{json.map((layer: any) => (
					<div key={layer.id}>
						<div
							className="cursor-pointer text-white"
							onClick={() => {
								if (activeMain === layer.id) {
									setActiveMain(null)
								} else {
									setActiveMain(layer.id)
								}
							}}
						>
							<span>
								{activeMain === layer.id ? (
									<ChevronDownIcon className="float-left -ml-1 mr-1 h-5 w-5" aria-hidden="true" />
								) : (
									<ChevronRightIcon className="float-left -ml-1 mr-1 h-5 w-5" aria-hidden="true" />
								)}
							</span>
							{layer.label}
						</div>
						{layer.children && (layer.id === activeMain || search.length > 0) && (
							<div className="pl-10">
								{layer.children
									.filter((f: any) => {
										if (search.length > 0) {
											return f.label.toLowerCase().includes(search.toLowerCase())
										}
										return true
									})
									.map((child: any) => (
										<div key={child.id}>
											<div
												className={
													'font-bold text-white ' +
													(search.length > 1 ? 'text-xl text-blue-400' : '')
												}
												onClick={() => {
													// descRef is a reference to a div in the main page
													// that contains a lot of h4 tags. We want to scroll
													// to the tag that matches child.label as content

													// @ts-ignore
													const h4s = descRef.current.querySelectorAll('h4')
													h4s.forEach((h4: any) => {
														if (h4.innerText.includes(child.label)) {
															h4.scrollIntoView({
																behavior: 'smooth',
																block: 'center',
																inline: 'center',
															})
														}
													})
												}}
											>
												{child.label}
											</div>
										</div>
									))}
							</div>
						)}
					</div>
				))}
			</div>

			<h3 className="my-2 text-xl">Flat view</h3>
			<div className="border-l-4 border-l-gray-500 pl-3">
				{json.map((layer: any) => (
					<div key={layer.id}>
						{layer.children.map((child: any) => (
							<div key={child.id}>
								{layer.label}-{child.label}
							</div>
						))}
					</div>
				))}
			</div>
		</>
	)
}
