'use client'

import { useState } from 'react'
import { JoystickControl } from './JoystickControl'
import { KeyboardControl } from './KeyboardControl'
import { Joystick, Keyboard, Rotate3D } from 'lucide-react'
import { TiltControl } from './TiltControl'
type ControlMode = 'none' | 'joystick' | 'keyboard' | 'tilt'

interface IControllerProps {
    characteristic: BluetoothRemoteGATTCharacteristic | null
}

export function Controller({ characteristic }: IControllerProps) {
	const [mode, setMode] = useState<ControlMode>('none')

    const back = () => setMode('none')

	if (mode === 'none') {
		return (
			<div className='flex gap-4 max-md:flex-col max-md:gap-2'>
				<button className='group md:size-10 size-8 md:rounded-4xl rounded-3xl border border-[#ffffff30] flex flex-col items-center justify-center gap-0.5 cursor-pointer hover:bg-[#ffffff10] transition-colors duration-300' onClick={() => setMode('joystick')}>
                    <Joystick className='opacity-70 group-hover:opacity-80 transition-opacity duration-300'/>
                    <p className='opacity-70 group-hover:opacity-80 transition-opacity duration-300'>Joystick</p>
                </button>
				<button className='group md:size-10 size-8 md:rounded-4xl rounded-3xl border border-[#ffffff30] flex flex-col items-center justify-center gap-0.5 cursor-pointer hover:bg-[#ffffff10] transition-colors duration-300' onClick={() => setMode('keyboard')}>
                    <Keyboard className='opacity-70 group-hover:opacity-80 transition-opacity duration-300'/>
                    <p className='opacity-70 group-hover:opacity-80 transition-opacity duration-300'>Keyboard</p>
                </button>
				<button className='group md:size-10 size-8 md:rounded-4xl rounded-3xl border border-[#ffffff30] flex flex-col items-center justify-center gap-0.5 cursor-pointer hover:bg-[#ffffff10] transition-colors duration-300' onClick={() => setMode('tilt')}>
                    <Rotate3D className='opacity-70 group-hover:opacity-80 transition-opacity duration-300'/>
                    <p className='opacity-70 group-hover:opacity-80 transition-opacity duration-300'>Tilt</p>
                </button>
			</div>
		)
	}

	return (
		<>
			{mode === 'joystick' && <JoystickControl back={back} characteristic={characteristic} />}
			{mode === 'keyboard' && <KeyboardControl back={back} characteristic={characteristic} />}
			{mode === 'tilt' && <TiltControl back={back} characteristic={characteristic} />}
		</>
	)
}
