import type { Prisma } from '#shared/types/prisma/client'
import type { H3Event } from 'h3'
import moment from 'moment'

type ParseTimestamp = {
	created_at: { gte: Date; lte: Date }
} | null

const parseTimestamp = (rawJson: string | undefined): ParseTimestamp => {
	if (!rawJson) return null

	try {
		const { from, to } = JSON.parse(rawJson)

		return {
			created_at: {
				gte: moment.utc(from).toDate(),
				lte: moment.utc(to).toDate(),
			},
		}
	} catch (e) {
		console.error('Invalid timestamp format', e)
		return null
	}
}

type RequestParams = 'page' | 'limit' | 'timestamp' | 'search' | 'args'
type PrismaTypeMapModel<PrismaModel extends Prisma.ModelName> = Prisma.TypeMap['model'][PrismaModel]['operations']['findMany']['args']
type PaginationParams<PrismaModel extends Prisma.ModelName> = {
	page?: number
	limit?: number
	args: PrismaTypeMapModel<PrismaModel>
}

export default function parsePaginationParams<PrismaModel extends Prisma.ModelName = any>(
	event: H3Event,
	fields: string[] = [],
): PaginationParams<PrismaModel> {
	const params: { [K in RequestParams]?: string } = getQuery(event)

	const timestamp = parseTimestamp(params?.timestamp)
	const page = Math.max(1, Number(params.page ?? 1))
	const limit = Math.max(1, Number(params.limit ?? 10))

	const skip = (page - 1) * limit
	const take = limit

	let args: PrismaTypeMapModel<PrismaModel> = params.args ? JSON.parse(params.args) : {}

	args = {
		skip,
		take,
		...args,
		where: {
			AND: {
				...(args?.where?.AND ?? {}),
				...(params?.search && {
					OR: fields.map((field) => ({
						[field]: { contains: params?.search, mode: 'insensitive' },
					})),
				}),
				...(timestamp?.created_at.gte &&
					timestamp.created_at?.lte && {
						created_at: {
							gte: new Date(timestamp?.created_at.gte),
							lte: new Date(timestamp?.created_at.lte),
						},
					}),
			},
		},
	}

	return {
		page,
		limit,
		args,
	}
}
