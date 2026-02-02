import { useEffect, useState } from 'react'

export function useTiltControl() {
  const [movement, setMovement] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // baseline gravity vector for landscape (y, z)
    let baseY: number | null = null
    let baseZ: number | null = null

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity
      if (!acc) return

      const { y, z } = acc

	  if (y === null || z === null) return

      // on first event, store the baseline for landscape flat
      if (baseY === null || baseZ === null) {
        baseY = y
        baseZ = z
        return
      }

      // calculate roll relative to baseline
      const dy = y - baseY
      const dz = z - baseZ

      let roll = Math.atan2(dy, dz) * (180 / Math.PI) // degrees

      // clamp roll to [-30, 30]
      if (roll > 30) roll = 30
      if (roll < -30) roll = -30

      // map [-30, 30] → [-100, 100]
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
