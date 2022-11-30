import { ChevronForward } from '@blueprintjs/icons/lib/esm/generated/20px/paths'

import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { ChevronRightIcon } from '@heroicons/react/20/solid'

import { useState } from 'react'

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

export function Layers() {
	const [activeMain, setActiveMain] = useState<null | string>(null)
	return (
		<>
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
						{layer.children && layer.id === activeMain && (
							<div className="pl-10">
								{layer.children.map((child: any) => (
									<div key={child.id}>
										<div className="font-bold text-white">{child.label}</div>
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
