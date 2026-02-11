import type { ContactSettings, Prisma } from '#shared/types/prisma'

const WsResponseType = {
	/**
	 * Response for websocket requests
	 */
	sendMessage: 'sendMessage',
	addContact: 'addContact',
	declineContact: 'declineContact',
	acceptContact: 'acceptContact',
	getUser: 'getUser',
	/**
	 * Realtime responses
	 */
	notification: 'notification',
	message: 'message',
	contacts: 'contacts',
} as const

export type WsResponseType = (typeof WsResponseType)[keyof typeof WsResponseType]

type ResponseResolver<D extends Record<string, any>> =
	| ({ success: true } & D)
	| ({ success: false; error: string; context?: string } & { _refId: number })

type ContactWithSetting = Prisma.ContactGetPayload<{
	include: {
		contactSettings: {
			include: { user: true }
		}
		contactRequests: {
			include: { user: true }
		}
		users: true
	}
}> & { setting: ContactSettings }

export type WsResponsePayload = {
	/**
	 * Response for websocket requests
	 */
	sendMessage: ResponseResolver<{
		success: boolean
		_refId: number
		data: Prisma.MessageGetPayload<{
			include: {
				user: true
				contact: true
			}
		}>
	}>
	addContact: {
		success: boolean
		_refId: number
	}
	declineContact: {
		success: boolean
		_refId: number
	}
	acceptContact: {
		success: boolean
		_refId: number
	}
	getUser: {
		success: boolean
		_refId: number
		data: Prisma.UserGetPayload<{
			include: {
				roles: true
				permissions: true
				contacts: true
				contactRequests: true
				contactSettings: true
			}
		}>
	}
	/**
	 * Realtime responses
	 */
	notification: {
		title: string
		description: string
		context: string
	}
	message: {
		message: string
		user: string
	}
	contacts: {
		data: ContactWithSetting[]
	}
}

export type WsResponse<T extends WsResponseType> = WsResponsePayload[T] & { type: T }

export const useSocketListener = <T extends WsResponseType>(type: T, callback: (p: WsResponse<T>) => void) => {
	const data = {} as WsResponse<T>

	callback(data)
}

useSocketListener('sendMessage', (response) => {
	if (!response.success) {
		console.log(response.error)
	}
})

//const response: WsResponse<'sendMessage'> = {}
