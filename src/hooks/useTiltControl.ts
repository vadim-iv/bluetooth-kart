import { useEffect, useRef, useState } from 'react'

export function useTiltControl() {
  const [movement, setMovement] = useState({ x: 0, y: 0 })
  const baselineRef = useRef<number>(0)
  const lastRollRef = useRef<number>(0)

  useEffect(() => {
    const handleMotion = (e: DeviceMotionEvent) => {
      const ag = e.accelerationIncludingGravity
      const ay = ag?.y ?? 0
      const az = ag?.z ?? 0

      const roll = Math.atan2(ay, az) * (180 / Math.PI)
      lastRollRef.current = roll

      let adjusted = roll - baselineRef.current
      if (adjusted > 180) adjusted -= 360
      if (adjusted < -180) adjusted += 360
      adjusted = Math.max(-90, Math.min(90, adjusted))

      let steering = Math.round((adjusted / 90) * 100)
      if (Math.abs(steering) < 5) steering = 0
      steering = Math.max(-100, Math.min(100, steering))

      setMovement(m => ({ ...m, x: steering }))
    }

    window.addEventListener('devicemotion', handleMotion)
    return () => window.removeEventListener('devicemotion', handleMotion)
  }, [])

  const setHorizontal = () => {
    baselineRef.current = lastRollRef.current
  }

  const forward = () => setMovement(m => ({ ...m, y: 100 }))
  const backward = () => setMovement(m => ({ ...m, y: -100 }))
  const stop = () => setMovement(m => ({ ...m, y: 0 }))

  return {
    movement,
    forward,
    backward,
    stop,
    setHorizontal
  }
}