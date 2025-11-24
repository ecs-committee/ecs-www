import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { ChevronRightIcon } from '@heroicons/react/20/solid'

import { RefObject, useEffect, useRef, useState } from 'react'

let json = require('./layers.json')

// Helper function to generate anchor ID from category label (same as in V1.tsx)
function generateAnchorId(label: string): string {
	return label
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
}

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
	const [activeItem, setActiveItem] = useState<string | null>(null)
	const searchRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (searchRef.current) {
			searchRef.current.focus()
		}
	})

	// Handle hash on page load
	useEffect(() => {
		const handleHashChange = () => {
			const hash = window.location.hash.slice(1) // Remove #
			if (hash) {
				setActiveItem(hash)
				// Wait a bit for the DOM to be ready
				setTimeout(() => {
					// Find and highlight the element
					const element = document.getElementById(hash)
					if (element && element.tagName === 'H4') {
						element.scrollIntoView({
							behavior: 'smooth',
							block: 'center',
							inline: 'center',
						})
						// Highlight the entire block (h4 + description)
						highlightCategoryBlock(element as HTMLElement)
					}
				}, 300)
			} else {
				setActiveItem(null)
			}
		}

		// Check hash on mount (with delay to ensure DOM is ready)
		setTimeout(handleHashChange, 500)

		// Listen for hash changes
		window.addEventListener('hashchange', handleHashChange)
		return () => window.removeEventListener('hashchange', handleHashChange)
	}, [descRef])

	// Helper function to highlight h4 and its following description paragraphs
	const highlightCategoryBlock = (h4Element: HTMLElement) => {
		// Add highlight class to h4 (already has invisible border, so no layout shift)
		h4Element.classList.add('highlight-active')
		
		// Find and highlight following paragraphs until next h4
		let nextSibling = h4Element.nextElementSibling
		const paragraphsToHighlight: HTMLElement[] = []
		
		while (nextSibling) {
			// Stop if we hit another h4 tag
			if (nextSibling.tagName === 'H4') {
				break
			}
			// Collect paragraph elements
			if (nextSibling.tagName === 'P') {
				paragraphsToHighlight.push(nextSibling as HTMLElement)
			}
			nextSibling = nextSibling.nextElementSibling
		}
		
		// Add highlight class to paragraphs (just background color, no layout change)
		paragraphsToHighlight.forEach((p) => {
			p.classList.add('highlight-active-description')
		})
		
		// Remove highlights after 2 seconds
		setTimeout(() => {
			h4Element.classList.remove('highlight-active')
			paragraphsToHighlight.forEach((p) => {
				p.classList.remove('highlight-active-description')
			})
		}, 2000)
	}

	// Function to navigate to a category and highlight it
	const navigateToCategory = (layerLabel: string, childLabel: string) => {
		const fullLabel = `${layerLabel}-${childLabel}`
		const anchorId = generateAnchorId(fullLabel)
		const hash = `#${anchorId}`

		// Update URL hash
		window.location.hash = hash

		// Find the element and scroll to it
		const element = document.getElementById(anchorId)
		if (element && element.tagName === 'H4') {
			setActiveItem(anchorId)
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center',
			})

			// Highlight the entire block (h4 + description)
			highlightCategoryBlock(element as HTMLElement)
		} else {
			// Fallback: try to find by text content
			// @ts-ignore
			const h4s = descRef.current?.querySelectorAll('h4')
			if (h4s) {
				h4s.forEach((h4: any) => {
					if (h4.textContent?.includes(childLabel)) {
						const id = h4.id || generateAnchorId(h4.textContent)
						setActiveItem(id)
						window.location.hash = `#${id}`
						h4.scrollIntoView({
							behavior: 'smooth',
							block: 'center',
							inline: 'center',
						})
						highlightCategoryBlock(h4)
					}
				})
			}
		}
	}

	// Helper function to get description text for a child item
	const getDescriptionText = (layerLabel: string, childLabel: string): string => {
		if (!descRef.current) return ''
		
		// Find the h4 tag that matches the child label
		const h4s = descRef.current.querySelectorAll('h4')
		
		for (const h4 of Array.from(h4s)) {
			if (h4.textContent?.includes(childLabel)) {
				// Get all paragraph elements after this h4 until the next h4
				const descriptionParts: string[] = []
				let nextSibling = h4.nextElementSibling
				
				while (nextSibling) {
					// Stop if we hit another h4 tag
					if (nextSibling.tagName === 'H4') {
						break
					}
					// Collect text from paragraph elements
					if (nextSibling.tagName === 'P') {
						const text = nextSibling.textContent?.trim() || ''
						if (text) {
							descriptionParts.push(text)
						}
					}
					nextSibling = nextSibling.nextElementSibling
				}
				
				return descriptionParts.join(' ')
			}
		}
		return ''
	}

	// Helper function to check if search matches label or description
	const matchesSearch = (layerLabel: string, childLabel: string, searchTerm: string): boolean => {
		if (searchTerm.length === 0) return true
		
		const lowerSearch = searchTerm.toLowerCase()
		const lowerLabel = childLabel.toLowerCase()
		
		// Check label first
		if (lowerLabel.includes(lowerSearch)) {
			return true
		}
		
		// Check description
		const description = getDescriptionText(layerLabel, childLabel)
		if (description.toLowerCase().includes(lowerSearch)) {
			return true
		}
		
		return false
	}

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
				{json
					.filter((layer: any) => {
						// When searching, only show layers that have matching children
						if (search.length > 0) {
							return layer.children?.some((child: any) =>
								matchesSearch(layer.label, child.label, search)
							)
						}
						return true
					})
					.map((layer: any) => {
						// Filter children to only show matches when searching
						const matchingChildren = layer.children?.filter((child: any) =>
							matchesSearch(layer.label, child.label, search)
						) || []

						// Auto-expand when searching and there are matches
						const shouldShowChildren =
							search.length > 0
								? matchingChildren.length > 0
								: layer.id === activeMain

						return (
							<div key={layer.id}>
								<div
									className="cursor-pointer text-white"
									onClick={() => {
										if (search.length === 0) {
											// Only toggle when not searching
											if (activeMain === layer.id) {
												setActiveMain(null)
											} else {
												setActiveMain(layer.id)
											}
										}
									}}
								>
									<span>
										{shouldShowChildren ? (
											<ChevronDownIcon className="float-left -ml-1 mr-1 h-5 w-5" aria-hidden="true" />
										) : (
											<ChevronRightIcon className="float-left -ml-1 mr-1 h-5 w-5" aria-hidden="true" />
										)}
									</span>
									{layer.label}
								</div>
								{shouldShowChildren && matchingChildren.length > 0 && (
									<div className="pl-10">
										{matchingChildren.map((child: any) => {
											const fullLabel = `${layer.label}-${child.label}`
											const anchorId = generateAnchorId(fullLabel)
											const isActive = activeItem === anchorId

											return (
												<div key={child.id}>
													<div
														className={
															'font-bold text-white cursor-pointer transition-all duration-200 ' +
															(search.length > 1 ? 'text-xl text-blue-400' : '') +
															(isActive ? ' bg-blue-500/30 px-2 py-1 rounded' : ' hover:bg-white/10 px-2 py-1 rounded')
														}
														onClick={() => {
															navigateToCategory(layer.label, child.label)
														}}
													>
														{child.label}
													</div>
												</div>
											)
										})}
									</div>
								)}
							</div>
						)
					})}
			</div>

			<h3 className="my-2 text-xl">Flat view</h3>
			<div className="border-l-4 border-l-gray-500 pl-3">
				{json
					.filter((layer: any) => {
						// When searching, only show layers that have matching children
						if (search.length > 0) {
							return layer.children?.some((child: any) =>
								matchesSearch(layer.label, child.label, search)
							)
						}
						return true
					})
					.map((layer: any) => (
						<div key={layer.id}>
							{layer.children
								.filter((child: any) => matchesSearch(layer.label, child.label, search))
								.map((child: any) => {
									const fullLabel = `${layer.label}-${child.label}`
									const anchorId = generateAnchorId(fullLabel)
									const isActive = activeItem === anchorId

									return (
										<div
											key={child.id}
											className={
												'cursor-pointer transition-all duration-200 ' +
												(isActive ? 'bg-blue-500/30 px-2 py-1 rounded' : 'hover:bg-white/10 px-2 py-1 rounded')
											}
											onClick={() => {
												navigateToCategory(layer.label, child.label)
											}}
										>
											{layer.label}-{child.label}
										</div>
									)
								})}
						</div>
					))}
			</div>
		</>
	)
}
