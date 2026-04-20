import { useRef, useEffect } from 'react'

interface Point { x: number; y: number }

interface Props {
  from: Point
  to: Point
  onComplete: () => void
}

const SPARK_COLORS = ['#fbbf24', '#f97316', '#ef4444', '#fde047', '#fb923c', '#facc15']

function explode(cx: number, cy: number, onDone: () => void): () => void {
  const els: HTMLElement[] = []
  const DURATION = 650

  const append = (el: HTMLElement) => {
    document.body.appendChild(el)
    els.push(el)
    return el
  }

  // Central flash — radial burst that expands and fades
  const flash = append(document.createElement('div'))
  Object.assign(flash.style, {
    position: 'fixed', pointerEvents: 'none', zIndex: '9999',
    width: '90px', height: '90px', borderRadius: '50%',
    top: `${cy - 45}px`, left: `${cx - 45}px`,
    background: 'radial-gradient(circle, rgba(255,235,80,1) 0%, rgba(255,110,0,0.75) 40%, transparent 70%)',
  })
  flash.animate(
    [{ transform: 'scale(0.1)', opacity: 1 }, { transform: 'scale(2.2)', opacity: 0 }],
    { duration: 340, easing: 'ease-out', fill: 'forwards' },
  )

  // Shockwave rings — 3 expanding concentric circles
  for (let i = 0; i < 3; i++) {
    const ring = append(document.createElement('div'))
    const sz = 8
    Object.assign(ring.style, {
      position: 'fixed', pointerEvents: 'none', zIndex: '9999',
      width: `${sz}px`, height: `${sz}px`, borderRadius: '50%',
      top: `${cy - sz / 2}px`, left: `${cx - sz / 2}px`,
      border: `2.5px solid ${SPARK_COLORS[i]}`,
    })
    ring.animate(
      [{ transform: 'scale(1)', opacity: 0.95 }, { transform: `scale(${13 + i * 5})`, opacity: 0 }],
      { duration: DURATION - i * 40, delay: i * 65, easing: 'ease-out', fill: 'forwards' },
    )
  }

  // Sparks — 10 particles flying outward at evenly-spaced angles
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2
    const dist = 48 + Math.random() * 38
    const px = Math.cos(angle) * dist
    const py = Math.sin(angle) * dist
    const sz = 5 + Math.random() * 5

    const spark = append(document.createElement('div'))
    Object.assign(spark.style, {
      position: 'fixed', pointerEvents: 'none', zIndex: '9999',
      width: `${sz}px`, height: `${sz}px`, borderRadius: '50%',
      top: `${cy - sz / 2}px`, left: `${cx - sz / 2}px`,
      background: SPARK_COLORS[i % SPARK_COLORS.length],
    })
    spark.animate(
      [
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${px}px,${py}px) scale(0)`, opacity: 0 },
      ],
      { duration: 380 + Math.random() * 200, easing: 'ease-out', fill: 'forwards' },
    )
  }

  const tid = setTimeout(() => {
    els.forEach(el => el.remove())
    onDone()
  }, DURATION + 120)

  return () => {
    clearTimeout(tid)
    els.forEach(el => el.remove())
  }
}

export default function DartAnimation({ from, to, onComplete }: Props) {
  const dartRef = useRef<HTMLDivElement>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const dart = dartRef.current
    if (!dart) return

    const dx = to.x - from.x
    const dy = to.y - from.y
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    const arcOffset = Math.min(len * 0.25, 130)
    const midX = (from.x + to.x) / 2 + (-dy / len) * arcOffset
    const midY = (from.y + to.y) / 2 + (dx / len) * arcOffset

    const half = 16
    const t = (x: number, y: number, scale: number, rot: number) =>
      `translate(${x - half}px, ${y - half}px) scale(${scale}) rotate(${rot}deg)`

    const dartAnim = dart.animate(
      [
        { transform: t(from.x, from.y, 2.2, 0),    opacity: 1 },
        { transform: t(midX,   midY,   2.8, -200),  opacity: 1, offset: 0.45 },
        { transform: t(to.x,   to.y,   1.6, -390),  opacity: 1 },
      ],
      { duration: 700, easing: 'cubic-bezier(0.15, 0, 0.55, 1)', fill: 'forwards' },
    )

    let cancelExplosion: (() => void) | null = null

    dartAnim.onfinish = () => {
      dart.style.opacity = '0'
      cancelExplosion = explode(to.x, to.y, () => onCompleteRef.current())
    }

    return () => {
      dartAnim.cancel()
      cancelExplosion?.()
    }
  }, [from.x, from.y, to.x, to.y])

  return (
    <div
      ref={dartRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        fontSize: '2rem', lineHeight: 1,
        pointerEvents: 'none', zIndex: 9999,
        willChange: 'transform', userSelect: 'none',
      }}
    >
      🎯
    </div>
  )
}
