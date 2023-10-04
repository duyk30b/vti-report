// sử dụng khi không biết timezone hệ thống là bao nhiêu mà muốn output offset chính xác như UTC+7 => offset = -420

export const timeToText = (time?: Date | string | number | null, pattern = 'DD/MM/YYYY', offset?: number): string => {
	if (time == null || time === '') return ''
	if (typeof time !== 'object') time = new Date(time)
	if (time.toString() === 'Invalid Date') return 'Invalid Date'

	if (offset == null) offset = time.getTimezoneOffset()

	const date = new Date(time.getTime() - offset * 60 * 1000)
	const rules = {
		YYYY: `${date.getUTCFullYear()}`,
		YY: `${date.getUTCFullYear()}`.slice(-2),
		MM: `0${date.getUTCMonth() + 1}`.slice(-2),
		DD: `0${date.getUTCDate()}`.slice(-2),
		hh: `0${date.getUTCHours()}`.slice(-2),
		mm: `0${date.getUTCMinutes()}`.slice(-2),
		ss: `0${date.getUTCSeconds()}`.slice(-2),
		xxx: `00${date.getUTCMilliseconds()}`.slice(-3),
	}

	let text = pattern
	Object.entries(rules).forEach(([key, value]) => {
		const re = new RegExp(key, 'g')
		text = text.replace(re, value)
	})

	return text
}

export const startOfDay = (time: string | number | Date, offset?: number): Date => {
	if (typeof time !== 'object') time = new Date(time)                     // time: '2023-09-20T22:39:46.711Z'
	const offsetSystem = time.getTimezoneOffset()                           // offsetSystem: -420

	const timeMove = new Date(time.getTime() - offsetSystem * 60 * 1000)    // timeMove: '2023-09-21T05:39:46.711Z'
	timeMove.setUTCHours(0, 0, 0, 0)                                        // timeMove: '2023-09-21T00:00:00.000Z'

	offset = offset != null ? offset : offsetSystem
	const result = new Date(timeMove.getTime() + offset * 60 * 1000)        // result: '2023-09-20T17:00:00.000Z'

	return result
}

export const endOfDay = (time: string | number | Date, offset?: number): Date => {
	const startDay = startOfDay(time, offset)
	startDay.setDate(startDay.getDate() + 1)
	return new Date(startDay.getTime() - 1)
}