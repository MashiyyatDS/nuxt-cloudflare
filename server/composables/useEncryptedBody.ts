import useCrypto from '#shared/helpers/crypto.helper'
import { type H3Event, readRawBody } from 'h3'

export default async function (event: H3Event, secretKey: string) {
	const body = await readRawBody(event, false)

	if (body) {
		const arrayBuffer = Buffer.from(body)

		const response = useCrypto(secretKey).decrypt(arrayBuffer)

		return response
	}
}
