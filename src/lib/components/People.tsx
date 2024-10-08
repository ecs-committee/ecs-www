import Image from 'next/image'

const people = [
	{
		name: 'Øyvind Rustad',
		email: 'oyvind@stgroup.no',
		role: 'System Tech Group',
		imageUrl: '/people/brum.png',
	},
	{
		name: 'Joakim Faxvaag',
		email: 'joakim.faxvaag@nrk.no',
		role: 'Norwegian broadcasting corporation',
		imageUrl: '/people/joakim.png',
	},
	{
		name: 'Hans Peter Jenssen',
		email: 'hanspeter.jenssen@ct-group.com',
		role: 'Creative Technology',
		imageUrl: '/people/hp.png',
	},
	{
		name: 'William Viker',
		email: 'william@trippelm.no',
		role: 'Bitfocus',
		imageUrl: '/people/william.png',
		insta: 'https://www.linkedin.com/in/williamviker/',
	},
	{
		name: 'Stefan Bahrawy',
		email: 'stefan.bahrawy@spectre.no',
		role: 'Spectre',
		imageUrl: '/people/stefan.png',
	},
	{
		name: 'Ola Bråten',
		email: 'ola.braaten@nrk.no',
		role: 'Norwegian broadcasting corporation',
		imageUrl: '/people/ola.png',
	},
]

export function People() {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
			{people.map((person) => (
				<a
					href={person.insta ? person.insta : `mailto:${person.email}`}
					key={person.email}
					className="relative flex cursor-pointer items-center space-x-3 rounded-lg border border-gray-300 bg-white px-5 py-4 pl-4 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400 hover:no-underline"
				>
					<div className="flex-shrink-0">
						<Image
							className="h-14 w-14 rounded-full"
							src={person.imageUrl}
							alt={person.name}
							width={128}
							height={128}
						/>
					</div>
					<div className="min-w-0 flex-1">
						<div className="focus:outline-none">
							<span className="absolute inset-0" aria-hidden="true" />
							<p className="text-sm font-medium text-gray-900">{person.name}</p>
							<p className="truncate text-sm text-gray-500">{person.role}</p>
						</div>
					</div>
				</a>
			))}
		</div>
	)
}
