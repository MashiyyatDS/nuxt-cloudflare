//import branchPolicy from '../policies/branch.policy'
//import rolePolicy from '../policies/role.policy'

type GateMiddleware = {
	[key: string]: {
		GET?: () => Promise<boolean>
		POST?: () => Promise<boolean>
		PUT?: () => Promise<boolean>
		DELETE?: () => Promise<boolean>
	}
}

export default defineEventHandler(async (event) => {
	const requestRoute: any = getRequestURL(event).pathname
	const requestMethod = event.method as keyof GateMiddleware[string]

	const gates: GateMiddleware = {
		//...branchPolicy(event),
		//...rolePolicy(event),
	}

	const gate = gates?.[requestRoute]?.[requestMethod]
	if (gate) {
		await gate()
	}
})
