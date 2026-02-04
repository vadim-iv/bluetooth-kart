import { useEffect, useState } from 'react'
import { MoveVector } from '@/types/control'

export interface KeyState {
	up: boolean
	down: boolean
	left: boolean
	right: boolean
	break: boolean
}

const INITIAL_KEYS: KeyState = {
	up: false,
	down: false,
	left: false,
	right: false,
	break: false
}

export function useKeyboardControl() {
	const [keys, setKeys] = useState<KeyState>(INITIAL_KEYS)
	const [movement, setMovement] = useState<MoveVector>({ x: 0, y: 0, break: 0 })

	useEffect(() => {
		const updateMovement = (state: KeyState) => {
			const x = (state.right ? 1 : 0) - (state.left ? 1 : 0)
			const y = (state.up ? 1 : 0) - (state.down ? 1 : 0)
			const brk = state.break ? 1 : 0
			setMovement({
				x: x * 100,
				y: y * 100,
				break: brk
			})
		}

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key.startsWith('Arrow') || e.key === " ") e.preventDefault()

			setKeys(prev => {
				const next = { ...prev }

				switch (e.key) {
					case 'ArrowUp':
						next.up = true
						break
					case 'ArrowDown':
						next.down = true
						break
					case 'ArrowLeft':
						next.left = true
						break
					case 'ArrowRight':
						next.right = true
						break
					case ' ':
						next.break = true
						break
					default:
						return prev
				}

				updateMovement(next)
				return next
			})
		}

		const onKeyUp = (e: KeyboardEvent) => {
			setKeys(prev => {
				const next = { ...prev }

				switch (e.key) {
					case 'ArrowUp':
						next.up = false
						break
					case 'ArrowDown':
						next.down = false
						break
					case 'ArrowLeft':
						next.left = false
						break
					case 'ArrowRight':
						next.right = false
						break
					case ' ':
						next.break = false
						break
					default:
						return prev
				}

				updateMovement(next)
				return next
			})
		}

		window.addEventListener('keydown', onKeyDown)
		window.addEventListener('keyup', onKeyUp)

		return () => {
			window.removeEventListener('keydown', onKeyDown)
			window.removeEventListener('keyup', onKeyUp)
		}
	}, [])

	return {
		movement,
		up: keys.up,
        down: keys.down,
        left: keys.left,
        right: keys.right,
        break: keys.break
	}
}
