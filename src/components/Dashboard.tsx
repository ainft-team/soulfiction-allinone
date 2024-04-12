'use client'
import { Button, Grid, Paper, Typography } from '@mui/material'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { get } from 'http'
import { useState } from 'react'
import { useAccount } from 'wagmi'

import getRequest from '@/app/api/getRequest'
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
	const [soulstone, setSoulstone] = useState<number>()
	const [balanceOfSoullink, setBalanceOfSoullink] = useState<number>()
	const [multiplier, setMultiplier] = useState<number>()
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

	const handleGetSoulstone = async (evmAddress: string) => {
		try {
			setSoulstone(1)
			const res = await getRequest({
				path: `/onepager/soulstone?evm_address=${evmAddress}`,
			})
			const { value } = res
			setSoulstone(value)
		} catch (e) {
			console.error(e)
		}
	}

	const handleGetBalanceOf = async (owner: string) => {
		try {
			const res = await getRequest({
				path: `/onepager/soullink?evm_address=${owner}`,
			})
			const { value } = res
			setBalanceOfSoullink(value)
		} catch (e) {
			console.error(e)
		}
	}

	const handleGetMultiplier = async (numOfSoullink: number) => {
		try {
			const res = await getRequest({
				path: `/onepager/multiplier?soullink_balance=${numOfSoullink}`,
			})
			const { value } = res
			setMultiplier(value)
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
						{!address && (
							<Typography variant="h6" gutterBottom>
								First, connect your wallet to proceed
							</Typography>
						)}
						{address && (
							<>
								<Button onClick={() => handleGetBalanceOf(address)} variant="outlined" sx={styles.button}>
									1. Verify You are Soullinker
								</Button>
							</>
						)}
						{address && (
							<>
								<Button onClick={() => handleGetSoulstone(address)} variant="outlined" sx={styles.button}>
									2. Check your $SS
								</Button>
							</>
						)}
						{address && (
							<>
								<Button
									onClick={() => handleGetMultiplier(balanceOfSoullink ?? 0)}
									variant="outlined"
									sx={styles.button}
								>
									3. Check Mining Multiplier
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
						<Typography gutterBottom>SoulLink Balance: {balanceOfSoullink?.toString() || 'n/a'} soullinks</Typography>
						<Typography gutterBottom>SoulStone Balance: {soulstone || 'n/a'} $SS</Typography>
						<Typography gutterBottom>Chat Mining Multiplier: {multiplier?.toString() || 'n/a'} x</Typography>
					</Paper>
				</Grid>
			</Grid>
		</>
	)
}

export default Dashboard
