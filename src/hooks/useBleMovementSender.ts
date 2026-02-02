import { useEffect, useRef } from 'react'
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
	const lastSent = useRef<MoveVector>({ x: 0, y: 0 })

	useEffect(() => {
		if (!characteristic) return

		const encoder = new TextEncoder()

		const timer = setInterval(async () => {
			// skip if unchanged
			if (movement.x === lastSent.current.x && movement.y === lastSent.current.y) {
				return
			}

			const command = `MOVE:${movement.x},${movement.y}\n`

			try {
				await characteristic.writeValue(encoder.encode(command))
				lastSent.current = movement
			} catch (err) {
				console.error('BLE send failed', err)
			}
		}, intervalMs)

		return () => clearInterval(timer)
	}, [movement, characteristic, intervalMs])
}
