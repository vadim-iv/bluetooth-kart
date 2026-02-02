'use client'

import { useState } from 'react'
import { useBleMovementSender } from '@/hooks/useBleMovementSender'
import { useTiltControl } from '@/hooks/useTiltControl'

interface TiltControlProps {
    back: () => void
    characteristic: BluetoothRemoteGATTCharacteristic | null
}

function TouchableButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const { className = '', onTouchStart, onTouchEnd, onMouseDown, onMouseUp, children, ...rest } = props
    const [pressed, setPressed] = useState(false)

    const handleTouchStart: React.TouchEventHandler<HTMLButtonElement> = (e) => {
        setPressed(true)
        onTouchStart?.(e)
    }
    const handleTouchEnd: React.TouchEventHandler<HTMLButtonElement> = (e) => {
        setPressed(false)
        onTouchEnd?.(e)
    }
    const handleMouseDown: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        setPressed(true)
        onMouseDown?.(e)
    }
    const handleMouseUp: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        setPressed(false)
        onMouseUp?.(e)
    }

    const pressedClass = pressed ? 'bg-[#ffffff20]' : ''

    return (
        <button
            {...rest}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            className={`${className} ${pressedClass}`.trim()}
        >
            {children}
        </button>
    )
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
        <div className='flex flex-col items-center md:gap-4 gap-2'>
            <TouchableButton
                onClick={requestPermission}
                className='px-2 py-0.25 bg-[#ffffff10] hover:bg-[#ffffff20] text-[#ffffff85] cursor-pointer transition-colors duration-300 rounded-md'
            >
                Enable tilt control
            </TouchableButton>

            <div className='flex gap-6'>
                <TouchableButton
                    onTouchStart={forward}
                    onTouchEnd={stop}
                    onMouseDown={forward}
                    onMouseUp={stop}
                    className='px-3 py-1 bg-[#ffffff10] hover:bg-[#ffffff20] text-[#ffffff85] rounded-md transition-colors'
                >
                    Forward
                </TouchableButton>

                <TouchableButton
                    onTouchStart={backward}
                    onTouchEnd={stop}
                    onMouseDown={backward}
                    onMouseUp={stop}
                    className='px-3 py-1 bg-[#ffffff10] hover:bg-[#ffffff20] text-[#ffffff85] rounded-md transition-colors'
                >
                    Backward
                </TouchableButton>
            </div>

            <div className='flex flex-col items-center gap-1'>
                <p className='opacity-50 select-none'>Tilt phone to steer, buttons for throttle</p>
                <TouchableButton
                    className='px-2 py-0.25 bg-[#ffffff10] hover:bg-[#ffffff20] text-[#ffffff85] cursor-pointer transition-colors duration-300 rounded-md'
                    onClick={back}
                >
                    Back
                </TouchableButton>
            </div>
        </div>
    )
}