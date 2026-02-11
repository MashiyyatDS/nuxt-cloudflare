import verifyPeerToken from '#server/helpers/verifyPeerToken'
import prisma from '#server/libs/prisma'
import type { Peer } from 'crossws'

export default async function (peer: Peer) {
	const payload = await verifyPeerToken(peer)

	const user = await prisma().user.findFirstOrThrow({
		where: { email: payload?.email },
		omit: {
			deleted_at: true,
			password: true,
		},
	})

	return user
}
