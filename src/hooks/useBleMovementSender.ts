import { useEffect, useRef, useState } from 'react'
import { MoveVector } from '@/types/control'

interface Props {
  movement: MoveVector
  characteristic: BluetoothRemoteGATTCharacteristic | null
  intervalMs?: number
}

export function useBleMovementSender({
  movement,
  characteristic,
  intervalMs = 40
}: Props) {
  const [sentCommand, setSentCommand] = useState('')
  const movementRef = useRef(movement)

  // Always keep latest movement
  useEffect(() => {
    movementRef.current = movement
  }, [movement])

  useEffect(() => {
    if (!characteristic) return

    const encoder = new TextEncoder()

    const timer = setInterval(async () => {
      const m = movementRef.current
      const command = `MOVE:${m.x},${m.y},${m.break}\n`

      setSentCommand(command.trim())

      try {
        await characteristic.writeValueWithoutResponse(
          encoder.encode(command)
        )
      } catch (err) {
        console.error('BLE send failed', err)
      }
    }, intervalMs)

    return () => clearInterval(timer)
  }, [characteristic, intervalMs])

  return { sentCommand }
}
