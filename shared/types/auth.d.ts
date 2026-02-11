import type { User as PrismaUser } from './types/prisma/client'

declare module '#auth-utils' {
	interface User extends PrismaUser {
		token: string
	}
}
