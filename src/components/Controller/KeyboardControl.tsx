'use client'

import { useBleMovementSender } from '@/hooks/useBleMovementSender'
import { useKeyboardControl } from '@/hooks/useKeyboardControl'
import { ArrowBigUp, Space } from 'lucide-react'

interface KeyboardControlProps {
	back: () => void
	characteristic: BluetoothRemoteGATTCharacteristic | null
}

export function KeyboardControl({ back, characteristic }: KeyboardControlProps) {
	const { movement } = useKeyboardControl()
	useBleMovementSender({
		movement,
		characteristic
	})

	return (
		<div className='flex flex-col items-center gap-4'>
			<div className='grid grid-cols-3 grid-rows-2 gap-0.5'>
				<div className='col-span-3 col-start-2'>
					<div
						className={`transition-opacity duration-300 size-4 bg-[#ffffff20] ${movement.y > 0 ? 'opacity-100' : 'opacity-65'} rounded-lg flex items-center justify-center`}
					>
						<ArrowBigUp className='size-1.25' />
					</div>
				</div>
				<div>
					<div
						className={`transition-opacity duration-300 size-4 bg-[#ffffff20] ${movement.x < 0 ? 'opacity-100' : 'opacity-65'} rounded-lg flex items-center justify-center`}
					>
						<ArrowBigUp className='size-1.25 rotate-270' />
					</div>
				</div>
				<div>
					<div
						className={`transition-opacity duration-300 size-4 bg-[#ffffff20] ${movement.y < 0 ? 'opacity-100' : 'opacity-65'} rounded-lg flex items-center justify-center`}
					>
						<ArrowBigUp className='size-1.25 rotate-180' />
					</div>
				</div>
				<div>
					<div
						className={`transition-opacity duration-300 size-4 bg-[#ffffff20] ${movement.x > 0 ? 'opacity-100' : 'opacity-65'} rounded-lg flex items-center justify-center`}
					>
						<ArrowBigUp className='size-1.25 rotate-90' />
					</div>
				</div>
				<div className='col-span-3'>
					<div
						className={`transition-opacity w-full duration-300 size-4 bg-[#ffffff20] ${movement.break === 1 ? 'opacity-100' : 'opacity-65'} rounded-lg flex items-center justify-center`}
					>
						<Space className='size-1.25' />
					</div>
				</div>
			</div>

			<div className='flex flex-col items-center gap-1'>
				<p className='opacity-50 select-none'>Control the kart using your arrow keys</p>
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
