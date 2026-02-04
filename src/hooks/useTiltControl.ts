import { MoveVector } from '@/types/control'
import { useEffect, useState } from 'react'

export function useTiltControl() {
	const [movement, setMovement] = useState<MoveVector>({ x: 0, y: 0, break: 0 })

	useEffect(() => {
		const handleMotion = (e: DeviceMotionEvent) => {
			const x = e.accelerationIncludingGravity?.y ?? 0


			// map tilt → steering
			let steering = Math.round(x * 20)
			if (Math.abs(steering) < 15) steering = 0

			steering = Math.max(-100, Math.min(100, steering))

			setMovement(m => ({
				...m,
				x: steering
			}))
		}

		window.addEventListener('devicemotion', handleMotion)
		return () => window.removeEventListener('devicemotion', handleMotion)
	}, [])

	const forward = () =>
		setMovement(m => ({ ...m, y: 100 }))

	const backward = () =>
		setMovement(m => ({ ...m, y: -100 }))

	const stop = () =>
		setMovement(m => ({ ...m, y: 0, break: 0 }))

	const breakBtn = () => {
		setMovement(m => ({ ...m, break: 1 }))
	}

	return {
		movement,
		forward,
		backward,
		stop,
		breakBtn
	}
}
