import type { Peer } from 'crossws'
import { jwtVerify } from 'jose'

const config = useRuntimeConfig()
const jwtSecret = new TextEncoder().encode(config.jwtSecret)

type JWTPayload = { email: string; name: string }

export default async function (peer: Peer) {
	const queryString = peer.request.url.split('?')[1]

	const params = new URLSearchParams(queryString)
	const token = params.get('token') ?? ''

	if (!token.length) {
		peer.send({
			type: 'invalid-token',
			data: createError({
				statusCode: 401,
				statusMessage: 'Unauthorized',
				message: 'Token required',
			}),
		})

		peer.close()
	}

	try {
		const { payload } = await jwtVerify<JWTPayload>(token, jwtSecret, {})

		return payload
	} catch (error) {
		let errorMessage = 'Invalid or expired token'

		if (error instanceof Error && error.name === 'JWTExpired') {
			errorMessage = 'Token has expired'
		}

		peer.send({
			type: 'invalid-token',
			data: createError({
				statusCode: 401,
				statusMessage: 'Unauthorized',
				message: errorMessage,
			}),
		})

		peer.close()
	}
}
