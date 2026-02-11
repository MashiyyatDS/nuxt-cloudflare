import crypto from 'crypto-js'
import pako from 'pako'

export default function (secretKey: string) {
	const u8array = {
		stringify: function (wordArray: any) {
			const words = wordArray.words
			const len = wordArray.sigBytes
			const u8s = new Uint8Array(len)
			for (let i = 0; i < len; i++) u8s[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
			return u8s
		},
		parse: function (u8arr: Uint8Array) {
			const words: any[] = []
			const len = u8arr.length
			for (let i = 0; i < len; i++) words[i >>> 2] |= (u8arr[i] & 0xff) << (24 - (i % 4) * 8)
			return crypto.lib.WordArray.create(words, len)
		},
	}

	const key = crypto.enc.Base64.parse(secretKey)

	const config = {
		iv: key,
		mode: crypto.mode.OFB,
		padding: crypto.pad.NoPadding,
	}

	const decrypt = <M>(data: ArrayBuffer | Buffer<ArrayBuffer>): M => {
		const words = u8array.parse(new Uint8Array(data))
		const decryptedMessage = crypto.AES.decrypt(words.toString(crypto.enc.Base64), key, config)
		const decryptedUint8Array = u8array.stringify(decryptedMessage)
		return JSON.parse(pako.inflate(decryptedUint8Array, { to: 'string' }))
	}

	const encrypt = (payload: any) => {
		const words = crypto.enc.Hex.parse(
			Array.from(pako.gzip(JSON.stringify(payload)))
				.map((byte: any) => (byte & 0xff).toString(16).padStart(2, `0`))
				.join(``),
		)
		const encryptedWords = crypto.AES.encrypt(words, key, config).ciphertext
		const encryptedUint8s = u8array.stringify(encryptedWords)
		return encryptedUint8s
	}

	const receiveUint8Array = (stringUint8Array: string | Record<string, number>) => {
		const encParams = new Uint8Array(
			typeof stringUint8Array === 'string' ? Object.values(JSON.parse(stringUint8Array)) : Object.values(stringUint8Array),
		)
		const decryptedStatic = `${decrypt(encParams.buffer)}`
		const response = JSON.parse(decryptedStatic)

		return response
	}

	const generateUint8String = (payload: any): any => {
		const encryptedData = encrypt(JSON.stringify(payload))

		return JSON.stringify(encryptedData)
	}

	return {
		decrypt,
		encrypt,
		receiveUint8Array,
		generateUint8String,
	}
}
