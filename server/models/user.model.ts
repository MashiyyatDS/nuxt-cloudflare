import type { Query } from '#shared/helpers/index.helper'
import hash from '#server/helpers/hash'

const userQuery: Query<'user'> = {
	async create({ args, query }) {
		args.data['password'] = await hash().hash(args.data.password)
		args.omit = { ...args.omit, deleted_at: true }
		return query(args)
	},
	update: ({ args, query }) => {
		args.omit = { ...args.omit, deleted_at: true }
		return query(args)
	},
	findMany: ({ args, query }) => {
		args.omit = {
			...args.omit,
			deleted_at: true,
			password: true,
		}
		args.where = { ...args.where, deleted_at: null }
		return query(args)
	},
	findFirstOrThrow: ({ args, query }) => {
		args.where = { ...args.where, deleted_at: null }
		return query(args)
	},
	findFirst: ({ args, query }) => {
		args.where = { ...args.where, deleted_at: null }
		return query(args)
	},
}

export { userQuery }
