import { Abi, Address, getAddress } from 'viem'
import { mainnet } from 'wagmi'

import { soullinkNftABI } from '../../abis/SoullinkNFT'

export type ContractABIPair = {
	ADDRESS: Address
	ABI: Abi
}

// TODO: Add in contract deployments and their ABIs for each network supported
type ContractDeployments = {
	NFT_COLLECTION: ContractABIPair
}

// const SEPOLIA: ContractDeployments = {
// 	// SoullinkNFT: https://sepolia.etherscan.io/address/0x1cfD246a218b35e359584979dDBeAD1f567d9C88
// 	NFT_COLLECTION: {
// 		ADDRESS: getAddress('0x1cfD246a218b35e359584979dDBeAD1f567d9C88', sepolia.id),
// 		ABI: soullinkNftABI,
// 	},
// }

const MAINNET: ContractDeployments = {
	// Soullink: https://etherscan.io/address/0xd6dbfb58c956949E3016151163ed6fD4301C4CE7
	NFT_COLLECTION: {
		ADDRESS: getAddress('0xd6dbfb58c956949E3016151163ed6fD4301C4CE7', mainnet.id),
		ABI: soullinkNftABI,
	},
}

const CONTRACTS = {
	// SEPOLIA,
	MAINNET,
}

export default CONTRACTS
