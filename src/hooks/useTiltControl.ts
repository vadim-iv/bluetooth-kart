import { MoveVector } from '@/types/control'
import { useEffect, useRef, useState } from 'react'

const LERP_SPEED = 0.009
const MAX_Y = 50

export function useTiltControl() {
	const [movement, setMovement] = useState<MoveVector>({
		x: 0,
		y: 0,
		break: 0
	})

	const targetY = useRef(0)

	useEffect(() => {
		const handleMotion = (e: DeviceMotionEvent) => {
			const x = e.accelerationIncludingGravity?.y ?? 0

			let steering = Math.round(x * 20)
			if (Math.abs(steering) < 15) steering = 0

			steering = Math.max(-100, Math.min(100, steering))

			setMovement(m => ({ ...m, x: steering }))
		}

		window.addEventListener('devicemotion', handleMotion)
		return () => window.removeEventListener('devicemotion', handleMotion)
	}, [])

	/* ================= FORWARD / BACKWARD LERP ================= */
	useEffect(() => {
		let rafId: number

		const update = () => {
			setMovement(m => {
				const diff = targetY.current - m.y

				if (Math.abs(diff) < 0.5) {
					return { ...m, y: targetY.current }
				}

				let nextY = m.y + diff * LERP_SPEED

				// clamp output
				nextY = Math.max(-MAX_Y, Math.min(MAX_Y, nextY))

				return { ...m, y: nextY }
			})

			rafId = requestAnimationFrame(update)
		}

		rafId = requestAnimationFrame(update)
		return () => cancelAnimationFrame(rafId)
	}, [])

	const forward = () => {
		targetY.current = MAX_Y
	}

	const backward = () => {
		targetY.current = -MAX_Y
	}

	const stop = () => {
		targetY.current = 0
		setMovement(m => ({ ...m, break: 0 }))
	}

	const breakBtn = () => {
		targetY.current = 0
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
