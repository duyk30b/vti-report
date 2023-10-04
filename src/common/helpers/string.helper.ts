export const formatNumber = (number: number, fixed = 0, part = 3, sec = ',', dec = '.') => {
	number = number || 0
	const regex = '\\d(?=(\\d{' + part + '})+' + (fixed > 0 ? '\\D' : '$') + ')'
	return number
		.toFixed(fixed)
		.replace('.', dec)
		.replace(new RegExp(regex, 'g'), '$&' + sec)
}