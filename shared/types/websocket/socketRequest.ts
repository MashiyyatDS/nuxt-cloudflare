const WsRequestType = {
	addContact: 'addContact',
	declineContact: 'declineContact',
	acceptContact: 'acceptContact',
	sendMessage: 'sendMessage',
} as const

export type WsRequestType = (typeof WsRequestType)[keyof typeof WsRequestType]

export type WsRequestPayload = {
	sendMessage: {
		message: string
		contact_id: number
		reply_to?: number
	}
	addContact: {
		contact_user_id: number
	}
	declineContact: {
		contact_user_id: number
	}
	acceptContact: {
		contact_user_id: number
	}
	getUser: {
		_refId: number
	}
}

export type WsRequest<T extends WsRequestType> = WsRequestPayload[T] & { type: T; _refId: number }

export const useSocketSend = <T extends WsRequestType = any>(payload: WsRequest<T>) => {
	return payload
}

useSocketSend({
	type: 'sendMessage',
	_refId: new Date().getDate(),
	contact_id: 1,
	message: 'Hello Niggers',
})
