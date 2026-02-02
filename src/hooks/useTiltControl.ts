import { useEffect, useState } from 'react'

export function useTiltControl() {
	const [movement, setMovement] = useState({ x: 0, y: 0 })

	useEffect(() => {
		let baselineX: number | null = null // store flat landscape X value

		const handleMotion = (e: DeviceMotionEvent) => {
			const x = e.accelerationIncludingGravity?.x ?? 0

			// initialize baseline on first reading
			if (baselineX === null) {
				baselineX = x
				return // skip first reading
			}

			// compute relative tilt from baseline
			let steering = Math.round((x - baselineX) * 20)

			// deadzone for small shakes
			if (Math.abs(steering) < 5) steering = 0

			// clamp to [-100, 100]
			steering = Math.max(-100, Math.min(100, steering))

			setMovement(m => ({
				...m,
				x: steering
			}))
		}

		window.addEventListener('devicemotion', handleMotion)
		return () => window.removeEventListener('devicemotion', handleMotion)
	}, [])

	const forward = () => setMovement(m => ({ ...m, y: 100 }))
	const backward = () => setMovement(m => ({ ...m, y: -100 }))
	const stop = () => setMovement(m => ({ ...m, y: 0 }))

	return { movement, forward, backward, stop }
}
