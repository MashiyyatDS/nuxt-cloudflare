export default defineWebSocketHandler({
	open: (peer) => {
		peer.send('Connection Established')
	},
	message: (peer) => {
		peer.send('Message Received')
	},
})
