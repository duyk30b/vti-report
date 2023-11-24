// export type ComparisonType = 'LIKE' | 'EQUAL' | 'BETWEEN' | 'IS_NULL' | 'NOT_NULL' | '>' | '<'
export const ComparisonType = ['LIKE', 'BETWEEN', 'IS_NULL', 'NOT_NULL', '>', '<', '>=', '<=', '==', '!='] as const
export type ComparisonType = (typeof ComparisonType)[number]

export const escapeSearch = (str = '') => {
  return str.toLowerCase().replace(/[?%\\_]/gi, (x) => '\\' + x)
}
