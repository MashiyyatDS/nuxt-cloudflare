import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '#shared/types/prisma/client'

export default function () {
	const config = useRuntimeConfig()
	const connectionString = config.database_url

	const adapter = new PrismaPg({ connectionString })
	const prisma = new PrismaClient({ adapter })

	return prisma
}
