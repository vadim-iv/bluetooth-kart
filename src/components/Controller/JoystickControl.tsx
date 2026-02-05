'use client'

import { Joystick } from 'react-joystick-component'
import { useJoystickControl } from '@/hooks/useJoystickControl'
import { Triangle } from 'lucide-react'
import { useBleMovementSender } from '@/hooks/useBleMovementSender'

interface JoystickControlProps {
	back: () => void
	characteristic: BluetoothRemoteGATTCharacteristic | null
}

export function JoystickControl({ back, characteristic }: JoystickControlProps) {
	const { movement, handleMove, handleStop } = useJoystickControl()

	const { sentCommand } = useBleMovementSender({
		movement,
		characteristic
	})

	return (
		<div className='flex flex-col items-center gap-6'>
			<div className='relative'>
				<Joystick
					size={150}
					stickSize={65}
					baseColor='#444'
					stickColor='#777'
					move={handleMove}
					stop={handleStop}
					throttle={40}
				/>
				<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none'>
					<Triangle
						fill='white'
						className={`transition-[opacity_transform] duration-300 ${movement.y > 0 ? 'opacity-50 -translate-y-0.25' : 'opacity-20'} size-1 absolute -top-3 left-1/2 -translate-x-1/2`}
					/>
					<Triangle
						fill='white'
						className={`transition-[opacity_transform] duration-300 ${movement.y < 0 ? 'opacity-50 translate-y-0.25' : 'opacity-20'} size-1 absolute -bottom-3 left-1/2 -translate-x-1/2 rotate-180`}
					/>
					<Triangle
						fill='white'
						className={`transition-[opacity_transform] duration-300 ${movement.x < 0 ? 'opacity-50 -translate-x-0.25' : 'opacity-20'} size-1 absolute top-1/2 -left-3 -translate-y-1/2 rotate-270`}
					/>
					<Triangle
						fill='white'
						className={`transition-[opacity_transform] duration-300 ${movement.x > 0 ? 'opacity-50 translate-x-0.25' : 'opacity-20'} size-1 absolute top-1/2 -right-3 -translate-y-1/2 rotate-90`}
					/>
				</div>
			</div>
			<p>Sent Command: {sentCommand}</p>
			<div className='flex flex-col items-center gap-1'>
				<p className='opacity-50 select-none'>Control the stick using your mouse or touch</p>
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
