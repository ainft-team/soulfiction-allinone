import axios, { AxiosRequestConfig } from 'axios'

type RequestType = {
	path: string
	params?: AxiosRequestConfig<any>
}

const postRequest = async ({ path, params }: RequestType) => {
	const customAxios = axios.create({
		baseURL: process.env.NEXT_PUBLIC_DOMAIN,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': '*',
			'Access-Control-Allow-Credentials': 'true',
		},
		withCredentials: true,
	})
	try {
		const res = await customAxios.post(path, {}, params)
		return res.data
	} catch (e) {
		console.log(e)
	}
}

export default postRequest
