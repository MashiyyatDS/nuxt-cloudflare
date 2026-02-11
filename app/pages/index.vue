<template>
	<UApp>
		<div class="flex flex-col gap-3 p-3">
			<span class="font-bold">Index Page</span>

			<span v-if="status === 'OPEN'">{{ status }}</span>

			<UButton label="Send Data" class="self-start" @click="send('Test')" />
		</div>

		<small>
			<pre>{{ data }}</pre>
		</small>
	</UApp>
</template>

<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'

const { data } = await useAsyncData('fetch-test', async () => {
	const response = $fetch('/api/roles')

	return response
})

const toast = useToast()
const { status, send } = useWebSocket('/websocket', {
	onMessage: (wsSocket, wsMessage) => {
		toast.add({
			title: 'Websocket',
			description: wsMessage.data,
		})
	},
})

useHead({
	title: 'Nuxt Cloudflare',
})
</script>
