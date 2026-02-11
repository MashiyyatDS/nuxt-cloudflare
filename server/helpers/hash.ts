import bcrypt from 'bcrypt'

export default function () {
	async function verify(password: string, hash: string) {
		return await bcrypt.compare(password, hash)
	}

	async function hash(password: string): Promise<string> {
		const saltRounds = 10
		const hash = await bcrypt.hash(password, saltRounds)
		return hash
	}

	return { verify, hash }
}
