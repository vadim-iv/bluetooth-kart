import { useEffect, useState } from 'react'
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
	const [ sentCommand, setSentCommand ] = useState<string>('')
	useEffect(() => {
		if (!characteristic) return

		const encoder = new TextEncoder()

		const timer = setInterval(async () => {
			const command = `MOVE:${movement.x},${movement.y},${movement.break}\n`
			console.log('Sending BLE command:', command.trim())
			setSentCommand(command.trim())
			
			try {
				await characteristic.writeValueWithoutResponse(encoder.encode(command))
			} catch (err) {
				console.error('BLE send failed', err)
			}
		}, intervalMs)

		return () => clearInterval(timer)
	}, [movement, characteristic, intervalMs])

	return { sentCommand }
}
