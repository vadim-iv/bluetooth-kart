import { useEffect, useState } from 'react'

export function useTiltControl() {
  const [movement, setMovement] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMotion = (e: DeviceMotionEvent) => {
      const ag = e.accelerationIncludingGravity
    //   const ax = ag?.x ?? 0
      const ay = ag?.y ?? 0
      const az = ag?.z ?? 0

      // roll: rotation around the device's X-axis (degrees)
      const roll = Math.atan2(ay, az) * (180 / Math.PI)

      // map roll (-90..90) to steering (-100..100)
      let steering = Math.round((roll / 90) * 100)
      if (Math.abs(steering) < 5) steering = 0
      steering = Math.max(-100, Math.min(100, steering))

      setMovement(m => ({ ...m, x: steering }))
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