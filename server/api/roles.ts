import prisma from '#server/libs/prisma'

export default defineEventHandler(async () => {
	const roles = await prisma().role.findMany()

	return roles
})
