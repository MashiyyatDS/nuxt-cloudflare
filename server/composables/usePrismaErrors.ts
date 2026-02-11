import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'

export default function (errors: PrismaErrors) {
	if (errors.type === 'PrismaClientKnownRequestError') {
		const { code, meta } = errors.data
		const constraint = meta?.driverAdapterError?.cause?.constraint
		const fields: string[] = constraint?.fields ?? []

		console.log('Working...')

		const errorFields = fields.length ? fields.map((field) => `${code}.${field}`) : [`${code}.error-message`]

		return errorFields
	}

	return []
}

interface BaseError {
	type: 'PrismaClientKnownRequestError'
}

interface PClientKnownRequestError extends BaseError {
	type: 'PrismaClientKnownRequestError'
	data: PrismaClientKnownRequestError & {
		meta: {
			modelName: string
			driverAdapterError: {
				name: string
				cause: {
					originalCode: string
					originalMessage: string
					kind: string
					constraint: { fields: string[] }
				}
			}
		}
	}
}

type PrismaErrors = PClientKnownRequestError
