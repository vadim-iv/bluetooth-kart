import { useEffect, useRef, useState } from 'react'

export function useTiltControl() {
  const [movement, setMovement] = useState({ x: 0, y: 0 })
  const baselineRef = useRef(0)
  const lastBetaRef = useRef(0)

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const beta = e.beta ?? 0
      lastBetaRef.current = beta

      // adjusted: current beta minus baseline (calibrated horizontal)
      let adjusted = beta - baselineRef.current
      if (adjusted > 180) adjusted -= 360
      if (adjusted < -180) adjusted += 360
      adjusted = Math.max(-90, Math.min(90, adjusted))

      // map adjusted (-90..90) → steering (-100..100)
      let steering = Math.round((adjusted / 90) * 100)
      if (Math.abs(steering) < 5) steering = 0
      steering = Math.max(-100, Math.min(100, steering))

      setMovement(m => ({ ...m, x: steering }))
    }

    window.addEventListener('deviceorientation', handleOrientation)
    return () => window.removeEventListener('deviceorientation', handleOrientation)
  }, [])

  const setHorizontal = () => {
    baselineRef.current = lastBetaRef.current
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