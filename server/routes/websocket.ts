export default defineWebSocketHandler({
	open: (peer) => {
		peer.subscribe('websocket:channel')
		peer.send('Connection Established')
	},
	message: (peer) => {
		peer.send('Message Sent')
		peer.publish('websocket:channel', 'Someone sent a message')
	},
})
