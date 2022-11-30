import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export function Flyover({
	isOpen,
	onClose,
	children,
}: {
	isOpen: boolean
	onClose: () => void
	children: React.ReactNode
}) {
	const [open, setOpen] = useState(isOpen)

	useEffect(() => {
		if (isOpen !== open) setOpen(isOpen)
	}, [isOpen, open])

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={() => onClose()}>
				<div className="fixed inset-0" />

				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
							<Transition.Child
								as={Fragment}
								enter="transform transition ease-in-out duration-500 sm:duration-400"
								enterFrom="translate-x-full"
								enterTo="translate-x-0"
								leave="transform transition ease-in-out duration-500 sm:duration-200"
								leaveFrom="translate-x-0"
								leaveTo="translate-x-full"
							>
								<Dialog.Panel className="pointer-events-auto w-screen max-w-md border-indigo-200 border-l-indigo-500 border-l-[rgba(255,255,255,0.2)] border-l-2 border-b-0 border-t-0 border-r-0">
									<div className="flex h-full flex-col overflow-y-scroll bg-gray-900 shadow-xl ">
										<div className="bg-gray-800 py-6 px-4 sm:px-6">
											<div className="flex items-center justify-between">
												<Dialog.Title className="text-lg font-medium text-white">
													Classes
												</Dialog.Title>

											</div>
											<div className="mt-1">
												<p className="text-sm text-gray-300">v1.0.0 Proposals / Draft</p>
											</div>
										</div>
										<div className="relative flex-1 py-6 px-4 text-white sm:px-6">{children}</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}
