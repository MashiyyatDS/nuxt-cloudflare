import type { H3Event } from 'h3'
import prisma from '#server/libs/prisma'
import verifyToken from '#server/helpers/verifyToken'

export default async function (event: H3Event, permission: string | string[]) {
	const payload = await verifyToken(event)

	if (!payload.email) {
		throw createError({
			statusCode: 401,
			data: { forbidden: { message: 'Authentication required.' } },
		})
	}

	const user = await prisma().user.findFirstOrThrow({
		where: { email: `${payload.email}` },
		select: {
			roles: {
				select: {
					name: true,
					permissions: {
						select: {
							name: true,
						},
					},
				},
			},
			permissions: {
				select: {
					name: true,
				},
			},
		},
	})

	const userPermissions = user.permissions.map((p) => p.name)
	const rolesPermissions = user.roles.flatMap((role) => role.permissions.map((p) => p.name))

	const permissions = [...new Set([...userPermissions, ...rolesPermissions])]

	const can = (policy: string | string[]) => (Array.isArray(policy) ? policy.some((p) => permissions.includes(p)) : permissions.includes(policy))

	const allowed = can(permission) || user.roles.some((role) => role.name === 'Super Admin')

	if (!allowed) {
		throw createError({
			statusCode: 403,
			message: 'Action is not authorized.',
		})
	}

	return allowed
}
