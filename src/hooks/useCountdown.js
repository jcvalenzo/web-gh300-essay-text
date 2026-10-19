import { useEffect, useRef, useState } from 'react'

// Remaining ms until `endsAt` (0 disables it); calls `onExpire` once when it reaches zero.
export function useCountdown(endsAt, onExpire) {
  const [now, setNow] = useState(Date.now)
  const onExpireRef = useRef(onExpire)

  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  useEffect(() => {
    if (!endsAt) return
    const tick = () => {
      const t = Date.now()
      setNow(t)
      if (t >= endsAt) onExpireRef.current()
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [endsAt])

  return endsAt ? Math.max(0, endsAt - now) : 0
}
