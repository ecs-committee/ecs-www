const fs = require('fs')

// read transposed.txt
fs.readFile('transposed.txt', 'utf8', (err, data) => {
	if (err) throw err
	process(data)
})

let withinMainID = null
let withinMainLabel = null

function process(text) {
	// split into lines
	var lines = text.split('\n')

	let build = []

	lines.forEach((line, index) => {
		if (line === '') {
			withinMainID = null
			withinMainLabel = null
		} else {
			const [num, label] = line.split('\t')

			if (withinMainID === null) {
				withinMainID = num
				withinMainLabel = label
			} else {
				if (label) {
					const nicelabel = `${withinMainID} ${withinMainLabel}-${num} ${label}`
					console.log(nicelabel)

					let existingRoot = build.find((b) => b.id === withinMainID)
					if (!existingRoot) {
						existingRoot = { id: withinMainID, label: withinMainID + ' ' + withinMainLabel, children: [
							{ id: num, label: num+" " +label }
						] }
						build.push(existingRoot)
					} else {
						existingRoot.children.push({ id: num, label: num + ' ' + label })
					}
				}
			}
		}
	})

	console.log('json', JSON.stringify(build))
}
