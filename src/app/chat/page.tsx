import type { Metadata } from 'next'

import Chat from '@/components/Chat'

export const metadata: Metadata = {
	title: 'Next DApp',
	description:
		'A template for building Ethereum-based dApps using Next.js, Material UI, Wagmi/Viem, and WalletConnect.',
}

const ChatPage = () => {
	return <Chat />
}

export default ChatPage
