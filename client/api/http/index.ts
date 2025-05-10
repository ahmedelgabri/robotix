// This Http class wraps a provider (in this case fetch)
// which should be used to make network requests in the app

type Fetch = typeof fetch
type ValidateStatus = (response: Response) => boolean

export class Http {
	#http: Fetch
	#baseUrl: string
	#extraHeaders: HeadersInit
	#validateStatus: ValidateStatus

	constructor({
		http,
		baseUrl,
		headers,
		validateStatus,
	}: {
		http: Fetch
		baseUrl: string
		headers: HeadersInit
		validateStatus: ValidateStatus
	}) {
		this.#http = http
		this.#baseUrl = baseUrl
		this.#extraHeaders = headers
		this.#validateStatus = validateStatus
	}

	#headers(contentType: string): Headers {
		return new Headers({
			...this.#extraHeaders,
			'Content-Type': contentType,
			'Custom-User-Agent': `orimboard/v0.1.0`,
		})
	}

	#config(params = {}, contentType = 'application/json'): RequestInit {
		return {
			...params,
			headers: this.#headers(contentType),
		}
	}

	#getUrl(url: string): string {
		return new URL(url, this.#baseUrl).toString()
	}

	async get(url = '', params = {}): Promise<ReturnType<Response['json']>> {
		const request = await this.#http(
			this.#getUrl(url),
			this.#config({...params, method: 'get'}),
		)

		this.#validateStatus(request)

		return await request.json()
	}

	async post(url = '', data = {}): Promise<ReturnType<Response['json']>> {
		const request = await this.#http(
			this.#getUrl(url),
			this.#config({body: JSON.stringify(data), method: 'post'}),
		)

		this.#validateStatus(request)

		return await request.json()
	}

	async put(url = '', data = {}): Promise<ReturnType<Response['json']>> {
		const request = await this.#http(
			this.#getUrl(url),
			this.#config({body: JSON.stringify(data), method: 'put'}),
		)
		this.#validateStatus(request)
		return await request.json()
	}

	async patch(url = '', data = {}): Promise<ReturnType<Response['json']>> {
		const request = await this.#http(
			this.#getUrl(url),
			this.#config({body: JSON.stringify(data), method: 'patch'}),
		)
		this.#validateStatus(request)
		return await request.json()
	}

	async delete(url = ''): Promise<ReturnType<Response['json']>> {
		const request = await this.#http(
			this.#getUrl(url),
			this.#config({method: 'delete'}),
		)
		this.#validateStatus(request)
		return await request.json()
	}
}
