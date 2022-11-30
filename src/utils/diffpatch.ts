import { create } from 'jsondiffpatch'

const diffpatch = create({
	objectHash: (obj: any, index: number) => {
		return obj.id || 'idx:' + index
	},
})
export default diffpatch
