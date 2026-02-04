import { useRef, useState, useCallback, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

export default function TouchControls() {
  const setMobileInput = useGameStore((s) => s.setMobileInput)
  const craftBottle = useGameStore((s) => s.craftBottle)
  const fillBottle = useGameStore((s) => s.fillBottle)
  const giveBottle = useGameStore((s) => s.giveBottle)
  const plastic = useGameStore((s) => s.plastic)
  const emptyBottles = useGameStore((s) => s.emptyBottles)
  const filledBottles = useGameStore((s) => s.filledBottles)

  const joystickRef = useRef<HTMLDivElement>(null)
  const [joystickActive, setJoystickActive] = useState(false)
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 })
  const touchIdRef = useRef<number | null>(null)
  const centerRef = useRef({ x: 0, y: 0 })

  const JOYSTICK_SIZE = 120
  const KNOB_SIZE = 50
  const MAX_DISTANCE = (JOYSTICK_SIZE - KNOB_SIZE) / 2

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return
    const touch = e.touches[0]
    const rect = joystickRef.current?.getBoundingClientRect()
    if (!rect) return

    touchIdRef.current = touch.identifier
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
    setJoystickActive(true)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchIdRef.current === null) return

    const touch = Array.from(e.touches).find(t => t.identifier === touchIdRef.current)
    if (!touch) return

    const dx = touch.clientX - centerRef.current.x
    const dy = touch.clientY - centerRef.current.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const clampedDistance = Math.min(distance, MAX_DISTANCE)

    let normalizedX = 0
    let normalizedY = 0

    if (distance > 0) {
      normalizedX = (dx / distance) * clampedDistance
      normalizedY = (dy / distance) * clampedDistance
    }

    setJoystickPos({ x: normalizedX, y: normalizedY })

    // Convert to -1 to 1 range for game input
    const inputX = normalizedX / MAX_DISTANCE
    const inputY = normalizedY / MAX_DISTANCE
    setMobileInput(inputX, inputY)
  }, [setMobileInput, MAX_DISTANCE])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touch = Array.from(e.changedTouches).find(t => t.identifier === touchIdRef.current)
    if (!touch) return

    touchIdRef.current = null
    setJoystickActive(false)
    setJoystickPos({ x: 0, y: 0 })
    setMobileInput(0, 0)
  }, [setMobileInput])

  // Detect if device supports touch
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  if (!isTouchDevice) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      {/* Virtual Joystick - bottom left */}
      <div
        ref={joystickRef}
        className="pointer-events-auto absolute bottom-20 left-6 rounded-full bg-black/30 backdrop-blur-sm border-2 border-white/30"
        style={{ width: JOYSTICK_SIZE, height: JOYSTICK_SIZE }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {/* Joystick knob */}
        <div
          className={`absolute rounded-full bg-white/80 shadow-lg transition-transform ${joystickActive ? '' : 'transition-all duration-150'}`}
          style={{
            width: KNOB_SIZE,
            height: KNOB_SIZE,
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${joystickPos.x}px), calc(-50% + ${joystickPos.y}px))`,
          }}
        />
      </div>

      {/* Action Buttons - bottom right */}
      <div className="pointer-events-auto absolute bottom-20 right-6 flex flex-col gap-3">
        {/* Build bottle button */}
        <button
          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg active:scale-95 transition-transform ${
            plastic >= 5
              ? 'bg-green-500/80 text-white'
              : 'bg-gray-500/50 text-gray-300'
          }`}
          onTouchStart={(e) => {
            e.preventDefault()
            craftBottle()
          }}
        >
          <span className="flex flex-col items-center">
            <span>🔧</span>
            <span className="text-xs">B</span>
          </span>
        </button>

        {/* Fill bottle button */}
        <button
          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg active:scale-95 transition-transform ${
            emptyBottles > 0
              ? 'bg-blue-500/80 text-white'
              : 'bg-gray-500/50 text-gray-300'
          }`}
          onTouchStart={(e) => {
            e.preventDefault()
            fillBottle()
          }}
        >
          <span className="flex flex-col items-center">
            <span>💧</span>
            <span className="text-xs">F</span>
          </span>
        </button>

        {/* Give bottle button */}
        <button
          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg active:scale-95 transition-transform ${
            filledBottles > 0
              ? 'bg-cyan-500/80 text-white'
              : 'bg-gray-500/50 text-gray-300'
          }`}
          onTouchStart={(e) => {
            e.preventDefault()
            giveBottle()
          }}
        >
          <span className="flex flex-col items-center">
            <span>🤝</span>
            <span className="text-xs">G</span>
          </span>
        </button>
      </div>
    </div>
  )
}
