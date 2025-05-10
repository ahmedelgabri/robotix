import {Http} from '@/api/http'
import getConfig from 'next/config'

class APIError {
	message: string

	constructor(message: string) {
		this.message = message
	}
}

export class APIClient {
	private http: Http

	constructor(http: Http) {
		this.http = http
	}

	get = async (url = '', params = {}) => {
		try {
			return await this.http.get(url, params)
		} catch (err) {
			throw this.handle(err)
		}
	}

	put = async (url = '', data = {}) => {
		try {
			return await this.http.put(url, data)
		} catch (err) {
			throw this.handle(err)
		}
	}

	private handle = (err: unknown): APIError => {
		let message = 'unable to reach the internet'

		if (err instanceof Error) {
			console.log(err.message)
			message = err.message.match('fetch failed')
				? 'Failed to connect to the server. Are you sure it is running?'
				: err.message
		}

		return new APIError(message)
	}
}

const {publicRuntimeConfig} = getConfig()
const apiUrl =
	publicRuntimeConfig.API_SERVER_PATH || process.env.API_SERVER_PATH
const Client = new APIClient(
	new Http({
		http: fetch,
		baseUrl: apiUrl,
		headers: {
			accept: 'application/json',
		},
		validateStatus: (response) => {
			if (!response.ok) {
				throw new APIError(
					`Failed to do request to ${response.url} with status ${response.status}`,
				)
			}

			return response.status >= 200 && response.status < 300
		},
	}),
)

export default Client
