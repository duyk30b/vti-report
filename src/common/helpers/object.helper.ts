export const mergeObject = (...params: Record<string, any>[]) => {
	const mergeTwoObject = (source: Record<string, any>, target: Record<string, any>) => {
		for (const key in target) {
			if (target[key] === undefined) continue

			if (typeof target[key] !== 'object'
				|| Array.isArray(target[key])
				|| target[key] instanceof Date) {
				source[key] = target[key]
			}
			else {
				if (typeof source[key] !== 'object'
					|| Array.isArray(target[key])
					|| target[key] instanceof Date) {
					source[key] = {}
				}
				mergeTwoObject(source[key], target[key])
			}
		}
	}

	for (let i = 1; i < params.length; i++) {
		mergeTwoObject(params[0], params[i])
	}
}