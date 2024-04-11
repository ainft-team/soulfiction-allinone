import axios, { AxiosRequestConfig } from 'axios'

type RequestType = {
	path: string
	params?: AxiosRequestConfig<any> | any
}

const getRequest = async ({ path, params }: RequestType) => {
	const baseURL = process.env.NEXT_PUBLIC_DOMAIN
	const customAxios = axios.create({ baseURL })
	try {
		const res = await customAxios.get(path, params)
		return res.data
	} catch (e) {
		console.log(e)
	}
}

export default getRequest
