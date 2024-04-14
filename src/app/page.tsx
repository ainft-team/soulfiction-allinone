import { Link, Paper, Typography } from '@mui/material'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Next DApp',
	description:
		'A template for building Ethereum-based dApps using Next.js, Material UI, Wagmi/Viem, and WalletConnect.',
}

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

const DefaultPage = () => {
	return (
		<Paper sx={styles.paper}>
			<Typography variant="h4" gutterBottom>
				Soul Fiction One-Pager
			</Typography>
			<Link
				variant="body2"
				href="https://docs.google.com/spreadsheets/d/1Y2Hex0o9hUqWXYjsZFvYKFDknn8GcHwNJS46B6Z2pnQ/edit?usp=sharing"
			>
				{'Craft instruction of Mars'}
			</Link>
		</Paper>
	)
}

export default DefaultPage
