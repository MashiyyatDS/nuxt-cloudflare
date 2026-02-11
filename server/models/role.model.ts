import type { Query } from '#shared/helpers/index.helper'

const roleQuery: Query<'role'> = {
	async create({ args, query }) {
		//args.omit = { ...args.omit, deleted_at: true }
		return query(args)
	},
	update: ({ args, query }) => {
		//args.omit = { ...args.omit, deleted_at: true }
		return query(args)
	},
	findMany: ({ args, query }) => {
		//args.omit = { ...args.omit, deleted_at: true }
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

export { roleQuery }
