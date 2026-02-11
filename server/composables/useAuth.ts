import verifyToken from '#server/helpers/verifyToken'
import prisma from '#server/libs/prisma'
import type { H3Event } from 'h3'

export default async function (event: H3Event) {
	const payload = await verifyToken(event)

	const user = await prisma().user.findFirstOrThrow({
		where: { email: payload.email },
		omit: {
			deleted_at: true,
			password: true,
		},
	})

	return user
}
