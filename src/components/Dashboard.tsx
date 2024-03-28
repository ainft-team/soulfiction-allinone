'use client'
import { Button, Grid, Paper, Typography } from '@mui/material'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useState } from 'react'
import { useAccount } from 'wagmi'

import { useContract } from '@/components/ContractProvider'

const styles = {
	paper: {
		p: 4,
		textAlign: 'center',
	},
	button: {
		display: 'block',
		my: 2,
		mx: 'auto',
	},
}

const Dashboard: React.FC = () => {
	// State
	const [nftName, setNftName] = useState<string>('')
	const [tokenUri, setTokenUri] = useState<string>('')
	const [balanceOfSoullink, setBalanceOfSoullink] = useState<number>()

	// Hooks
	const { nft, executeContractRead, executeContractWrite } = useContract()
	const { address, isConnected } = useAccount()
	const { open } = useWeb3Modal()

	// Handlers
	const handleMint = async () => {
		try {
			if (!isConnected) return open()

			const [result, hash] = await executeContractWrite({
				address: nft.address,
				abi: nft.abi,
				functionName: 'mint',
				args: ['exampleTokenURI'],
			})

			console.log({ result, hash })
		} catch (e) {
			console.error(e)
		}
	}

	const handleGetName = async () => {
		try {
			setNftName('')
			const result = (await executeContractRead({ address: nft.address, abi: nft.abi, functionName: 'name' })) as string
			setNftName(result)
		} catch (e) {
			console.error(e)
		}
	}

	const handleGetTokenURI = async (tokenId: number) => {
		try {
			setTokenUri('')
			const result = (await executeContractRead({
				address: nft.address,
				abi: nft.abi,
				functionName: 'tokenURI',
				args: [tokenId],
			})) as string
			setTokenUri(result)
		} catch (e) {
			console.error(e)
		}
	}

	const handleGetBalanceOf = async (owner: string) => {
		try {
			const result = (await executeContractRead({
				address: nft.address,
				abi: nft.abi,
				functionName: 'balanceOf',
				args: [owner],
			})) as number
			setBalanceOfSoullink(result)
		} catch (e) {
			console.error(e)
		}
	}

	return (
		<>
			<Grid container spacing={4}>
				<Grid item xs={12} md={6}>
					<Paper sx={styles.paper}>
						<Typography variant="h4" gutterBottom>
							Shortcuts
						</Typography>
						{/* change from handleMint to handleChat */}
						<Button onClick={handleMint} variant="outlined" sx={styles.button}>
							Chat with Mars
						</Button>
						{address && (
							<>
								<Button onClick={() => handleGetBalanceOf(address)} variant="outlined" sx={styles.button}>
									Soullinker Verification
								</Button>
							</>
						)}
						<Button onClick={handleMint} variant="outlined" sx={styles.button}>
							Transfer Soulstone
						</Button>
						{nft.address && (
							<>
								<Button onClick={handleGetName} variant="outlined" sx={styles.button}>
									Get NFT Name
								</Button>
								<Button onClick={() => handleGetTokenURI(1)} variant="outlined" sx={styles.button}>
									Get TokenURI
								</Button>
							</>
						)}
					</Paper>
				</Grid>
				<Grid item xs={12} md={6}>
					<Paper sx={styles.paper}>
						<Typography variant="h4" gutterBottom>
							SoulStone
						</Typography>
						<Typography gutterBottom>Connected: {address || 'Not Connected Yet'}</Typography>
						<Typography gutterBottom>SoulStone Balance: {nftName || 'n/a'} $SS</Typography>
						<Typography gutterBottom>SoulLink Balance: {balanceOfSoullink?.toString()} soullinks</Typography>
						<Typography gutterBottom>Chat Mining Multiplier: {tokenUri || 'n/a'}x</Typography>
						<Typography gutterBottom>Today Earned $SS: {tokenUri || 'n/a'}</Typography>
					</Paper>
				</Grid>
			</Grid>
		</>
	)
}

export default Dashboard
