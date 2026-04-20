import type { City } from '../types'

const C = '#00f0ff'        // primary neon cyan
const C_DIM = 'rgba(0,240,255,0.35)'
const C_FAINT = 'rgba(0,240,255,0.12)'
const BG = 'rgba(2,6,20,0.93)'

const corner = (pos: string) => {
  const isTop = pos.includes('top')
  const isLeft = pos.includes('left')
  return (
    <div
      style={{
        position: 'absolute',
        top: isTop ? -4 : undefined,
        bottom: isTop ? undefined : -4,
        left: isLeft ? -4 : undefined,
        right: isLeft ? undefined : -4,
        width: 16, height: 16,
        borderTop:    isTop    ? `2px solid ${C}` : undefined,
        borderBottom: !isTop   ? `2px solid ${C}` : undefined,
        borderLeft:   isLeft   ? `2px solid ${C}` : undefined,
        borderRight:  !isLeft  ? `2px solid ${C}` : undefined,
      }}
    />
  )
}

interface Props {
  selectedCity: City | null
  cityCount: number
  isDisabled: boolean
  isAnimating: boolean
  onLaunch: () => void
}

export default function HudCard({ selectedCity, cityCount, isDisabled, isAnimating, onLaunch }: Props) {
  const statusText = isAnimating
    ? 'CALCUL EN COURS…'
    : selectedCity
    ? selectedCity.name.toUpperCase()
    : 'EN ATTENTE'

  const statusColor = isAnimating ? '#ffd700' : selectedCity ? C : C_DIM

  return (
    <div
      style={{
        position: 'relative',
        background: BG,
        border: `1px solid ${C_DIM}`,
        boxShadow: `0 0 24px rgba(0,240,255,0.15), 0 0 60px rgba(0,240,255,0.06), inset 0 0 20px ${C_FAINT}`,
        backdropFilter: 'blur(14px)',
        minWidth: 300,
        pointerEvents: 'auto',
        fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
        overflow: 'hidden',
      }}
    >
      {/* corner brackets */}
      {corner('top-left')}
      {corner('top-right')}
      {corner('bottom-left')}
      {corner('bottom-right')}

      {/* animated scanline sweep */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 40,
          background: 'linear-gradient(to bottom, transparent, rgba(0,240,255,0.04), transparent)',
          animation: 'hud-scanline 3.5s linear infinite',
        }} />
      </div>

      {/* static scanline texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)',
      }} />

      {/* ── Content ── */}
      <div style={{ position: 'relative', padding: '14px 18px 12px' }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: C, boxShadow: `0 0 8px ${C}`,
            animation: 'hud-blink 2s ease-in-out infinite',
            flexShrink: 0,
          }} />
          <span style={{ color: C, fontSize: 10, letterSpacing: '0.18em', animation: 'hud-flicker 8s linear infinite' }}>
            SYSTÈME DE CIBLAGE&nbsp;&nbsp;v3.0
          </span>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${C_DIM}, transparent)` }} />
        </div>

        {/* Main button */}
        <button
          onClick={onLaunch}
          disabled={isDisabled}
          style={{
            width: '100%',
            background: isDisabled ? C_FAINT : `linear-gradient(135deg, rgba(0,240,255,0.08), rgba(0,240,255,0.03))`,
            border: `1px solid ${isDisabled ? C_DIM : C}`,
            color: isDisabled ? C_DIM : C,
            padding: '10px 0',
            fontFamily: 'inherit',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.12em',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.25s',
            boxShadow: isDisabled ? 'none' : `0 0 16px rgba(0,240,255,0.25), inset 0 0 10px rgba(0,240,255,0.06)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
          onMouseEnter={e => {
            if (!isDisabled) {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 28px rgba(0,240,255,0.45), inset 0 0 16px rgba(0,240,255,0.12)`
              ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,240,255,0.1)'
            }
          }}
          onMouseLeave={e => {
            if (!isDisabled) {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 16px rgba(0,240,255,0.25), inset 0 0 10px rgba(0,240,255,0.06)`
              ;(e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(0,240,255,0.08), rgba(0,240,255,0.03))'
            }
          }}
        >
          {isAnimating
            ? <><span style={{ display: 'inline-block', animation: 'hud-spin 1s linear infinite', fontSize: 15 }}>◎</span> CALCUL…</>
            : <>🎯 LANCER LA FLÉCHETTE</>
          }
        </button>

        {/* Divider */}
        <div style={{ height: 1, background: C_FAINT, margin: '10px 0 8px' }} />

        {/* Status bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 5, height: 5, borderRadius: '50%',
              background: statusColor,
              boxShadow: `0 0 5px ${statusColor}`,
              animation: isAnimating ? 'hud-blink 0.6s ease-in-out infinite' : undefined,
            }} />
            <span style={{ color: statusColor, fontSize: 10, letterSpacing: '0.14em' }}>
              CIBLE: {statusText}
            </span>
          </div>
          <span style={{ color: C_DIM, fontSize: 10, letterSpacing: '0.12em' }}>
            {cityCount}&nbsp;VILLES
          </span>
        </div>

      </div>
    </div>
  )
}
