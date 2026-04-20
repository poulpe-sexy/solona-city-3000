import { useEffect, useRef, useState } from 'react'
import type { City } from '../types'

const C      = '#00f0ff'
const C_DIM  = 'rgba(0,240,255,0.35)'
const C_FAINT = 'rgba(0,240,255,0.08)'
const BG     = 'rgba(2,6,20,0.97)'

function SectionCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: C_FAINT,
      border: `1px solid ${C_DIM}`,
      padding: '12px 16px',
      marginBottom: 8,
    }}>
      <div style={{
        color: C_DIM,
        fontSize: 10,
        letterSpacing: '0.16em',
        fontFamily: 'ui-monospace, monospace',
        marginBottom: 8,
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function Placeholder({ text }: { text: string }) {
  return (
    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, fontStyle: 'italic' }}>
      {text}
    </p>
  )
}

interface Props {
  city: City
  onClose: () => void
}

export default function CityModal({ city, onClose }: Props) {
  const [copied, setCopied] = useState(false)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const slackMessage = `🎯 La fléchette a atterri sur *${city.name}* (${city.postalCode}) — qui part en repérage ?`

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCloseRef.current() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function handleCopy() {
    navigator.clipboard.writeText(slackMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(5px)',
        animation: 'backdrop-enter 0.2s ease-out',
      }}
      onClick={onClose}
    >
      {/* Modal panel */}
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto"
        style={{
          background: BG,
          border: `1px solid ${C_DIM}`,
          boxShadow: `0 0 40px rgba(0,240,255,0.12), 0 24px 80px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,240,255,0.03)`,
          animation: 'modal-enter 0.25s cubic-bezier(0.16,1,0.3,1)',
          fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Scanline texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)',
        }} />

        {/* Corner brackets */}
        {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h]) => (
          <div key={`${v}-${h}`} style={{
            position: 'absolute', zIndex: 1,
            [v]: -4, [h]: -4,
            width: 18, height: 18,
            borderTop:    v === 'top'    ? `2px solid ${C}` : undefined,
            borderBottom: v === 'bottom' ? `2px solid ${C}` : undefined,
            borderLeft:   h === 'left'   ? `2px solid ${C}` : undefined,
            borderRight:  h === 'right'  ? `2px solid ${C}` : undefined,
          }} />
        ))}

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 12, right: 14, zIndex: 10,
            background: 'transparent',
            border: `1px solid ${C_DIM}`,
            color: C_DIM,
            width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            const b = e.currentTarget
            b.style.color = C
            b.style.borderColor = C
            b.style.boxShadow = `0 0 10px rgba(0,240,255,0.4)`
          }}
          onMouseLeave={e => {
            const b = e.currentTarget
            b.style.color = C_DIM
            b.style.borderColor = C_DIM
            b.style.boxShadow = 'none'
          }}
        >
          ×
        </button>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, padding: '24px 24px 20px' }}>

          {/* ── Section 1: City heading ── */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: C_DIM, fontSize: 10, letterSpacing: '0.18em', marginBottom: 6 }}>
              CIBLE IDENTIFIÉE
            </div>
            <h1 style={{
              color: C,
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: '-0.01em',
              margin: 0,
              textShadow: `0 0 30px rgba(0,240,255,0.5)`,
              lineHeight: 1.1,
              animation: 'hud-flicker 10s linear infinite',
            }}>
              {city.name}
            </h1>
            <div style={{ color: 'rgba(0,240,255,0.55)', fontSize: 14, marginTop: 4, letterSpacing: '0.08em' }}>
              {city.postalCode} · {city.population.toLocaleString('fr-FR')} hab.
            </div>
            <div style={{ height: 1, background: `linear-gradient(to right, ${C_DIM}, transparent)`, marginTop: 16 }} />
          </div>

          {/* ── Section 2: Attraction touristique ── */}
          <SectionCard label="Attraction touristique principale">
            <Placeholder text="Données en cours de chargement…" />
          </SectionCard>

          {/* ── Section 3: Météo ── */}
          <SectionCard label="Météo actuelle">
            <Placeholder text="Module météo non connecté." />
          </SectionCard>

          {/* ── Section 4: Le saviez-vous ? ── */}
          <SectionCard label="Le saviez-vous ?">
            <Placeholder text="Aucun fait disponible pour cette ville." />
          </SectionCard>

          {/* ── Section 5: Annonce Slack ── */}
          <SectionCard label="Annonce Slack">
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              border: `1px solid rgba(0,240,255,0.15)`,
              padding: '10px 12px',
              marginBottom: 10,
              color: 'rgba(255,255,255,0.55)',
              fontSize: 13,
              lineHeight: 1.5,
            }}>
              {slackMessage}
            </div>
            <button
              onClick={handleCopy}
              style={{
                background: copied ? 'rgba(0,240,255,0.15)' : 'transparent',
                border: `1px solid ${copied ? C : C_DIM}`,
                color: copied ? C : C_DIM,
                padding: '6px 16px',
                fontSize: 11,
                letterSpacing: '0.12em',
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: copied ? `0 0 12px rgba(0,240,255,0.3)` : 'none',
              }}
            >
              {copied ? '✓ COPIÉ' : 'COPIER'}
            </button>
          </SectionCard>

        </div>
      </div>
    </div>
  )
}
