// components/ChatComponent.js
'use client'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import TextareaAutosize from 'react-textarea-autosize'
import { useAccount } from 'wagmi'

import postRequest from '@/app/api/postRequest'
// import ScrollToBottom from 'react-scroll-to-bottom'
import { Message } from '@/components/Message'
import SendIcon from '@/components/SendIcon'
import Spinner from '@/components/Spinner'

interface Message {
	name: 'User' | 'Assistant'
	text: string
}
interface AppState {
	messages: Message[] | []
	flattenedMessages: string[] | []
	assistantThinking: boolean
	isWriting: boolean
	controller: AbortController | null
}

type AddMessage = {
	type: 'addMessage'
	payload: { prompt: string; controller: AbortController }
}
type FlattenMessages = { type: 'flattenMessages' }
type UpdatePromptAnswer = {
	type: 'updatePromptAnswer'
	payload: { content: string; controller: AbortController }
}
type Abort = { type: 'abort' }
type Clear = { type: 'clear' }
type Done = { type: 'done' }
type AppActions = AddMessage | FlattenMessages | UpdatePromptAnswer | Abort | Clear | Done

function reducer(state: AppState, action: AppActions): AppState {
	switch (action.type) {
		case 'addMessage':
			return {
				...state,
				assistantThinking: true,
				messages: [...state.messages, { name: 'User', text: action.payload.prompt }],
				controller: action.payload.controller,
			}
		case 'flattenMessages':
			return {
				...state,
				flattenedMessages: state.messages.map(msg => `${msg.name}: ${msg.text}`),
			}
		case 'updatePromptAnswer':
			// const conversationListCopy = [...state.messages]
			// const lastIndex = conversationListCopy.length - 1
			// conversationListCopy[lastIndex] = {
			// 	name: conversationListCopy[lastIndex].name,
			// 	text: action.payload.content,
			// }

			return {
				...state,
				assistantThinking: false,
				isWriting: true,
				messages: [...state.messages, { name: 'Assistant', text: action.payload.content }],
				controller: action.payload.controller,
			}
		case 'abort':
			state.controller?.abort()
			return {
				...state,
				isWriting: false,
				assistantThinking: false,
				controller: null,
			}
		case 'clear':
			state.controller?.abort()
			return {
				messages: [],
				flattenedMessages: [],
				assistantThinking: false,
				isWriting: false,
				controller: null,
			}
		case 'done':
			return {
				...state,
				isWriting: false,
				assistantThinking: false,
				controller: null,
			}
		default:
			return state
	}
}

const Chat = () => {
	// const [messages, setMessages] = useState<Message[]>([])
	// const [newMessage, setNewMessage] = useState('')
	const { address, isConnected } = useAccount()
	const { open } = useWeb3Modal()

	const [state, dispatch] = useReducer(reducer, {
		messages: [],
		flattenedMessages: [],
		assistantThinking: false,
		isWriting: false,
		controller: null,
	})

	const promptInput = useRef<HTMLTextAreaElement>(null)

	const handlePrompt = async () => {
		if (promptInput && promptInput.current) {
			const prompt = promptInput.current.value
			if (prompt !== '') {
				const controller = new AbortController()
				dispatch({ type: 'addMessage', payload: { prompt, controller } })
				promptInput.current.value = ''

				const res = await postRequest({
					path: `/onepager/mock_reply`,
					params: {
						params: {
							content: prompt,
							evm_address: address,
							prev_messages: state.flattenedMessages,
						},
					},
				})

				console.log(res.type, res.content)
				const { content, type } = res
				if (!content) {
					return
				}
				if (type === 'request_reward') {
					dispatch({ type: 'updatePromptAnswer', payload: { content, controller } })

					const rewardsRes = await postRequest({
						path: `/onepager/evaluate_conversation`,
						params: {
							params: {
								evm_address: address,
								messages: state.flattenedMessages,
							},
						},
					})

					dispatch({
						type: 'updatePromptAnswer',
						payload: {
							content: rewardsRes.reason,
							controller,
						},
					})
					dispatch({ type: 'done' })
				} else {
					let done = false

					while (!done) {
						dispatch({ type: 'updatePromptAnswer', payload: { content, controller } })
						done = !state.assistantThinking
					}
					if (done) {
						dispatch({ type: 'done' })
					}
				}
			}
		}
	}

	const handlePromptKey = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		e.stopPropagation()
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handlePrompt()
		}
	}

	const handleAbort = () => {
		dispatch({ type: 'abort' })
	}

	const handleClear = () => {
		dispatch({ type: 'clear' })
	}

	// focus input on page load
	useEffect(() => {
		if (promptInput && promptInput.current) {
			promptInput.current.focus()
		}
	}, [])

	useEffect(() => {
		dispatch({ type: 'flattenMessages' })
	}, [state.messages])

	// const handleSendMessage = () => {
	// 	if (newMessage.trim() !== '') {
	// 		setMessages([...messages, newMessage])
	// 		setNewMessage('')
	// 	}
	// }

	// const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
	// 	if (e.key === 'Enter') {
	// 		handleSendMessage()
	// 	}
	// }

	return (
		<div className="flex h-full relative flex-1">
			<main className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch max-w-3xl ml-auto mr-auto pb-12 font-default">
				<div className="flex-1 overflow-hidden">
					<ScrollToBottom className="relative h-full pb-14 pt-6" scrollViewClassName="h-full overflow-y-auto">
						<div className="w-full transition-width flex flex-col items-stretch flex-1">
							<div className="flex-1">
								<div className="flex flex-col prose prose-lg prose-invert">
									{state.messages.map((message, i) => (
										<Message key={i} name={message.name} text={message.text} thinking={state.assistantThinking} />
									))}
								</div>
							</div>
						</div>
					</ScrollToBottom>
				</div>

				<div className="absolute bottom-0 w-full px-1">
					{state.assistantThinking || state.isWriting ? (
						<div className="flex mx-auto justify-center mb-2">
							<button
								type="button"
								className="rounded bg-indigo-50 py-1 px-1 text-xs font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
								onClick={handleAbort}
							>
								Stop generating
							</button>
						</div>
					) : (
						<div className="flex mx-auto justify-center mb-2">
							<button
								type="button"
								className="rounded bg-indigo-50 py-1 px-1 text-xs font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
								onClick={handleClear}
							>
								Clear Chat
							</button>
						</div>
					)}
					<div className="relative bottom-0 w-full px-1">
						<div className="relative flex flex-col w-full p-3 bg-gray-800 rounded-md shadow ring-1 ring-gray-200 dark:ring-gray-600 focus-within:ring-2 focus-within:ring-inset dark:focus-within:ring-indigo-600 focus-within:ring-indigo-600">
							<label htmlFor="prompt" className="sr-only">
								Prompt
							</label>
							<TextareaAutosize
								ref={promptInput}
								name="prompt"
								id="prompt"
								rows={1}
								maxRows={6}
								onKeyDown={handlePromptKey}
								className="m-0 w-full resize-none border-0 bg-transparent pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent text-gray-800 dark:text-gray-50 text-base"
								placeholder="Hi Mars, how are you?"
								defaultValue="Hi Mars, how are you?"
							/>
							<div className="absolute right-3 top-[calc(50%_-_10px)]">
								{state.assistantThinking || state.isWriting ? (
									<Spinner cx="animate-spin w-5 h-5 text-gray-400" />
								) : (
									<button
										onClick={handlePrompt}
										className="w-5 h-5 text-gray-400 hover:text-gray-500 hover:cursor-pointer"
									>
										<SendIcon />
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}

export default Chat
