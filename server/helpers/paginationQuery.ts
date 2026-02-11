import { type H3Event, getQuery } from 'h3'
import moment from 'moment'

type PaginationQuery = {
	page: number
	limit: number
	args: string
	timestamp: string
}

type ParseTimestamp = {
	created_at: {
		gte: Date
		lte: Date
	}
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

export default function (event: H3Event) {
	const query = getQuery<PaginationQuery>(event)

	const page = Math.max(1, Number(query.page ?? 1))
	const limit = Math.max(1, Number(query.limit ?? 10))

	const skip = (page - 1) * limit
	const take = limit

	const args = query.args ? JSON.parse(query.args) : {}

	const timestamp = parseTimestamp(query.timestamp) ?? {}

	return { skip, take, page, limit, args, timestamp }
}
