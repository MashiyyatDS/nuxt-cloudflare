import prisma from '../libs/prisma'

export default defineEventHandler(async () => {
	const roles = await prisma().role.findMany()

	return roles
})
