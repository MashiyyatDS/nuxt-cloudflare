import type { GlobalOmitConfig, TypeMap, TypeMapCb } from '#shared/types/prisma/internal/prismaNamespace'
import type { DefaultArgs, DynamicModelExtensionArgs, DynamicQueryExtensionArgs, InternalArgs } from '@prisma/client/runtime/client'

export type Query<M extends string> = DynamicQueryExtensionArgs<
	Record<M, unknown>,
	TypeMap<InternalArgs & DefaultArgs, GlobalOmitConfig | undefined>
>[M]

export type Model<M extends string> = DynamicModelExtensionArgs<
	Record<M, unknown>,
	TypeMap<InternalArgs & DefaultArgs, GlobalOmitConfig | undefined>,
	TypeMapCb<GlobalOmitConfig | undefined>,
	DefaultArgs
>[M]

/**
 * Checks if a value is "empty" or a negative number.
 */
function isEmptyOrNegative(value: unknown): boolean {
	if (value === null || value === undefined) return true
	if (typeof value === 'string' && value.trim() === '') return true
	if (typeof value === 'number' && value < 0) return true
	if (Array.isArray(value)) return value.length === 0
	if (typeof value === 'object' && value !== null && value.constructor === Object) {
		return Object.keys(value).length === 0
	}
	return false
}

/**
 * Recursively removes properties that are empty or negative.
 */
export function compactObject<T>(val: T): T | Partial<T> | undefined {
	// Handle Arrays
	if (Array.isArray(val)) {
		const cleanedArray = val.map((item) => compactObject(item)).filter((item) => !isEmptyOrNegative(item))
		return cleanedArray.length > 0 ? (cleanedArray as unknown as T) : undefined
	}

	// Handle Objects
	if (typeof val === 'object' && val !== null && val.constructor === Object) {
		const result: Record<string, any> = {}

		Object.keys(val).forEach((key) => {
			const value = (val as Record<string, any>)[key]
			const cleanedValue = compactObject(value)

			if (!isEmptyOrNegative(cleanedValue)) {
				result[key] = cleanedValue
			}
		})

		return Object.keys(result).length > 0 ? (result as T) : undefined
	}

	// Handle primitives (strings, numbers, booleans)
	return val
}
