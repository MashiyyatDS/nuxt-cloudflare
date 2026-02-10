<template>
	<div>
		<span class="font-bold">Index Page</span>

		<small>
			<pre>{{ data }}</pre>
		</small>
	</div>
</template>

<script setup lang="ts">
const { data } = await useAsyncData('fetch-test', async () => {
	const response = $fetch('/api/test')

	return response
})

const websocket = new WebSocket('ws://localhost:3000/websocket')
websocket.onmessage = (wsResponse) => {
	console.log('Websocket:', wsResponse.data)
}

useHead({
	title: 'Nuxt Cloudflare',
})
</script>
