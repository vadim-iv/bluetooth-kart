'use client'

import { useBleMovementSender } from '@/hooks/useBleMovementSender'
import { useTiltControl } from '@/hooks/useTiltControl'
import { ArrowBigUp } from 'lucide-react'

interface TiltControlProps {
	back: () => void
	characteristic: BluetoothRemoteGATTCharacteristic | null
}

export function TiltControl({ back, characteristic }: TiltControlProps) {
	const { movement, forward, backward, stop } = useTiltControl()

	useBleMovementSender({
		movement,
		characteristic
	})

	const requestPermission = async () => {
		// iOS permission
		// @ts-expect-error Requesting permission is only necessary on iOS 13+ devices
		if (typeof DeviceMotionEvent?.requestPermission === 'function') {
			// @ts-expect-error Requesting permission is only necessary on iOS 13+ devices
			await DeviceMotionEvent.requestPermission()
		}
	}

	return (
		<div className='flex flex-col items-center gap-4'>
			<button
				onClick={requestPermission}
				className='px-2 py-0.25 bg-[#ffffff10] hover:bg-[#ffffff20] text-[#ffffff85] cursor-pointer transition-colors duration-300 rounded-md'
			>
				Enable tilt control
			</button>

			<div className='flex gap-4'>
				<div
					className={`transition-opacity duration-300 size-4 bg-[#ffffff20] ${
						movement.x < 0 ? 'opacity-100' : 'opacity-65'
					} rounded-lg flex items-center justify-center`}
				>
					<ArrowBigUp className='size-1.25 rotate-270' />
				</div>

				<div
					className={`transition-opacity duration-300 size-4 bg-[#ffffff20] ${
						movement.x > 0 ? 'opacity-100' : 'opacity-65'
					} rounded-lg flex items-center justify-center`}
				>
					<ArrowBigUp className='size-1.25 rotate-90' />
				</div>
			</div>

			<div className='flex gap-3'>
				<button
					onTouchStart={forward}
					onTouchEnd={stop}
					onMouseDown={forward}
					onMouseUp={stop}
					className='px-3 py-1 bg-[#ffffff10] hover:bg-[#ffffff20] text-[#ffffff85] rounded-md transition-colors'
				>
					Forward
				</button>

				<button
					onTouchStart={backward}
					onTouchEnd={stop}
					onMouseDown={backward}
					onMouseUp={stop}
					className='px-3 py-1 bg-[#ffffff10] hover:bg-[#ffffff20] text-[#ffffff85] rounded-md transition-colors'
				>
					Backward
				</button>
			</div>

			<div className='flex flex-col items-center gap-1'>
				<p className='opacity-50 select-none'>Tilt phone to steer, buttons for throttle</p>
				<button
					className='px-2 py-0.25 bg-[#ffffff10] hover:bg-[#ffffff20] text-[#ffffff85] cursor-pointer transition-colors duration-300 rounded-md'
					onClick={back}
				>
					Back
				</button>
			</div>
		</div>
	)
}
