import { useEffect, useState } from 'react'

export function useTiltControl() {
  const [movement, setMovement] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity
      if (!acc) return

      const { x, y, z } = acc

	  if (x === null || y === null || z === null) return

      // compute tilt angle relative to horizontal plane
      const tiltX = Math.atan2(x, Math.sqrt(y * y + z * z)) // radians
      let steering = Math.round((tiltX * 180) / Math.PI) // convert to degrees

      // apply deadzone
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

  return {
    movement,
    forward,
    backward,
    stop
  }
}
