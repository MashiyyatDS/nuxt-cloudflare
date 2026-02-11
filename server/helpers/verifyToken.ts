import { type H3Event, getHeader, createError } from 'h3'
import { jwtVerify } from 'jose'

/**
 * Utility function to verify a JSON Web Token (JWT) provided in the
 * 'Authorization: Bearer <token>' header of an incoming request.
 *
 * It uses the 'jose' library to decode and validate the token against a
 * configured secret. If valid, the token payload is attached to the request
 * context under `event.context.user`. If invalid, missing, or expired,
 * it throws an H3 error with a 401 Unauthorized status.
 */

const jwtSecret = new TextEncoder().encode(process.env.NUXT_JWT_SECRET)

type JWTPayload = { email: string; name: string }

export default async function (event: H3Event): Promise<JWTPayload> {
	const authHeader = getHeader(event, 'authorization')

	if (!authHeader || !authHeader.startsWith('Bearer '))
		throw createError({
			statusCode: 401,
			statusMessage: 'Unauthorized',
			message: 'Bearer token required',
		})

	const token = authHeader.slice(7)
	try {
		const { payload } = await jwtVerify<JWTPayload>(token, jwtSecret, {})

		event.context.user = payload

		return payload
	} catch (error) {
		let errorMessage = 'Invalid or expired token'

		if (error instanceof Error && error.name === 'JWTExpired') {
			errorMessage = 'Token has expired'
		}

		throw createError({
			statusCode: 401,
			statusMessage: 'Unauthorized',
			message: errorMessage,
		})
	}
}
