import {ApiError} from 'next/dist/server/api-utils'
import {Result} from 'typescript-result'
import Client from '@/api/client'
import {CraneDetails} from '@/types/crane'

export const loadCrane = async (id: string) => {
	try {
		const response = (await Client.get(`/v1/robot/${id}`)) as CraneDetails
		return Result.ok(response)
	} catch (e) {
		const err = e as ApiError
		return Result.error(err.message)
	}
}

export const loadAll = async () => {
	try {
		const response = (await Client.get(`/v1/robot`)) as Array<CraneDetails>
		return Result.ok(response)
	} catch (e) {
		const err = e as ApiError
		return Result.error(err.message)
	}
}
