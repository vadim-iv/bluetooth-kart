import { useEffect, useState } from 'react'

export function useTiltControl() {
	const [movement, setMovement] = useState({ x: 0, y: 0 })

	useEffect(() => {
		const handleMotion = (e: DeviceMotionEvent) => {
			const acc = e.accelerationIncludingGravity
			if (!acc) return

			const { y, z } = acc

			if (y === null || z === null) return

			// roll relative to landscape (horizontal tilt)
			let roll = Math.atan2(y, z) * (180 / Math.PI) // degrees

			// clamp roll to [-30, 30]
			if (roll > 30) roll = 30
			if (roll < -30) roll = -30

			// map [-30,30] → [-100,100]
			const steering = Math.round((roll / 30) * 100)

			setMovement(m => ({ ...m, x: steering }))
		}

		window.addEventListener('devicemotion', handleMotion)
		return () => window.removeEventListener('devicemotion', handleMotion)
	}, [])

	const forward = () => setMovement(m => ({ ...m, y: 100 }))
	const backward = () => setMovement(m => ({ ...m, y: -100 }))
	const stop = () => setMovement(m => ({ ...m, y: 0 }))

	return { movement, forward, backward, stop }
}
