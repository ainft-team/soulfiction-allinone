/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
	},
	headers: async () => {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'Content-Security-Policy',
						value: `frame-ancestors verify.walletconnect.org verify.walletconnect.com;`,
					},
				],
			},
		]
	},
	webpack: config => {
		config.experiments = {
			asyncWebAssembly: true,
			layers: true,
		}
		config.externals.push('pino-pretty', 'lokijs', 'encoding')
		return config
	},
	rewrites: async () => {
		return [
			{
				source: '/onepager/:path*', //api request path
				destination: 'http://35.193.150.114:8101/onepager/:path*', //목적 path
			},
		]
	},
}

module.exports = nextConfig
