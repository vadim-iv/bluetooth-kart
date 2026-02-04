import { useState } from 'react';
import { MoveVector } from '@/types/control';
import { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick';

export function useJoystickControl() {
  const [movement, setMovement] = useState<MoveVector>({ x: 0, y: 0, break: 0 });

  const handleMove = (event: IJoystickUpdateEvent) => {
    if (!event?.x || !event?.y) return;

    setMovement({
      x: Math.round(event.x * 100),
      y: Math.round(event.y * 100),
      break: 0
    });
  };

  const handleStop = () => {
    setMovement({ x: 0, y: 0, break: 1 });
  };

  return {
    movement,
    handleMove,
    handleStop,
  };
}
