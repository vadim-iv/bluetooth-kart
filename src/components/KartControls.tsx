'use client'

import { useKartBLE } from '@/hooks/useKartBLE'
import { Bluetooth } from 'lucide-react'
import { Controller } from './Controller/Controller'

export function KartControls() {
	const { connect, isConnecting, characteristic, isConnected } = useKartBLE({
		deviceName: 'Kart-BLE',
		serviceUUID: '0000ffe0-0000-1000-8000-00805f9b34fb',
		characteristicUUID: '0000ffe1-0000-1000-8000-00805f9b34fb'
	})
	return (
		<div>
			{!isConnected ? (
				<button
					className={
						'group size-8 cursor-pointer transition-colors border-[#ffffff50] duration-300 hover:border-[#ffffff80] border rounded-full flex justify-center items-center' +
						` ${!isConnecting && 'ping-animation'} `
					}
					onClick={connect}
					disabled={isConnecting}
				>
					<Bluetooth
						className={`opacity-50 size-2 group-hover:opacity-70 transition-opacity duration-300`}
					/>
					{isConnecting && (
						<div className='spinner absolute opacity-50 group-hover:opacity-70 transition-opacity duration-300' />
					)}
				</button>
			) : (
				<Controller characteristic={characteristic} />
			)}
		</div>
	)
}
