import { useCallback, useEffect, useState } from 'react'

interface IUseKartBLEProps {
	deviceName: string
	serviceUUID: BluetoothServiceUUID
	characteristicUUID: BluetoothCharacteristicUUID
}

export function useKartBLE({ deviceName, serviceUUID, characteristicUUID }: IUseKartBLEProps) {
	const [device, setDevice] = useState<BluetoothDevice | null>(null)
	const [server, setServer] = useState<BluetoothRemoteGATTServer | null>(null)
	const [service, setService] = useState<BluetoothRemoteGATTService | null>(null)
	const [characteristic, setCharacteristic] = useState<BluetoothRemoteGATTCharacteristic | null>(
		null
	)
	const [isConnected, setIsConnected] = useState(false)
	const [isConnecting, setIsConnecting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const connect = useCallback(async () => {
		if (!navigator.bluetooth) {
			setError('Web Bluetooth API is not available in this browser.')
			return
		}

		setIsConnecting(true)
		setError(null)

		try {
			const device = await navigator.bluetooth.requestDevice({
				filters: [{ name: deviceName }],
				optionalServices: [serviceUUID]
			})
			setDevice(device)

			device.addEventListener('gattserverdisconnected', () => {
				setIsConnected(false)
				setServer(null)
				setService(null)
				setCharacteristic(null)
			})

			const server = await device.gatt!.connect()
			setServer(server)

			const service = await server.getPrimaryService(serviceUUID)
			setService(service)

			const characteristic = await service.getCharacteristic(characteristicUUID)
			setCharacteristic(characteristic)
			setIsConnected(true)
		} catch (error) {
			setError((error as Error).message)
		} finally {
			setIsConnecting(false)
		}
	}, [deviceName, serviceUUID, characteristicUUID])

	const sendCommand = useCallback(
		async (command: string) => {
			if (!characteristic) {
				console.error('Characteristic is not available. Please connect first.')
				return
			}

			try {
				const encoder = new TextEncoder()
				await characteristic.writeValue(encoder.encode(command))
				console.log('Sent command:', command)
			} catch (err) {
				console.error('Failed to send command:', err)
			}
		},
		[characteristic]
	)

	useEffect(() => {
		return () => {
			if (device?.gatt?.connected) {
				device.gatt.disconnect()
				console.log('Disconnected on unmount')
			}
		}
	}, [device])

	return { device, server, service, characteristic, connect, sendCommand, isConnected, isConnecting, error }
}
