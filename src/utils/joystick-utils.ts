import { MoveVector } from "@/types/control";

export function normalizeJoystick(
  rawX: number,
  rawY: number,
  deadZone = 0.1
): MoveVector {
  // rawX, rawY are in range [-1, 1]
  const magnitude = Math.sqrt(rawX * rawX + rawY * rawY);

  if (magnitude < deadZone) {
    return { x: 0, y: 0 };
  }

  const scaledMagnitude =
    (magnitude - deadZone) / (1 - deadZone);

  const nx = (rawX / magnitude) * scaledMagnitude;
  const ny = (rawY / magnitude) * scaledMagnitude;

  return {
    x: Math.round(nx * 100),
    y: Math.round(ny * 100),
  };
}
