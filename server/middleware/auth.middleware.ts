import verifyToken from '#server/helpers/verifyToken'

/**
 * Global middleware or route handler to check for a valid authentication token
 * before allowing access to specified protected API routes.
 *
 * It iterates through a list of protected routes and calls `verifyToken(event)`
 * for any incoming request whose URL path starts with one of those protected routes.
 * Verification is performed concurrently using Promise.all.
 */
export default defineEventHandler(async (event) => {
	const routes = [
		'/api/user',
		'/api/permissions',
		//'/api/roles',
		'/api/branches',
		'/api/get-user',
		'/api/contacts',
		'/api/contact_requests',
		'/api/messages',
	]

	const verificationPromises = routes.filter((route) => getRequestURL(event).pathname.startsWith(route)).map(async () => await verifyToken(event))

	await Promise.all(verificationPromises)
})
