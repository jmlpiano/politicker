'use client'

import Link from 'next/link'
import ScoreBadge from './ScoreBadge'

interface IntegrityScore {
  integrityScore: number
  sleazeScore: number
  partySpectrum: number
  integrityAxis: number
}

interface BarnacleScore {
  barnacleScore: number
  citizenStatesmanScore: number
  tenureYears: number
}

interface PoliticianCardProps {
  id: string
  name: string
  initials: string
  party: string
  role: string
  jurisdiction: string
  country: string
  since: number
  integrityScore: IntegrityScore | null
  barnacleScore: BarnacleScore | null
  index?: number
}

const partyColors: Record<string, string> = {
  Democrat: 'var(--blue)',
  Republican: 'var(--red)',
  Labour: 'var(--red)',
  Conservative: 'var(--blue)',
  Independent: 'var(--amber)',
}

export default function PoliticianCard({
  id,
  name,
  initials,
  party,
  role,
  jurisdiction,
  country,
  since,
  integrityScore,
  barnacleScore,
  index = 0,
}: PoliticianCardProps) {
  const partyColor = partyColors[party] ?? 'var(--text-muted)'
  const flag = country === 'UK' ? '🇬🇧' : '🇺🇸'

  return (
    <Link href={`/politicians/${id}`} style={{ textDecoration: 'none' }}>
      <div
        className="animate-fade-up"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '20px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          animationDelay: `${index * 60}ms`,
          opacity: 0,
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.background = 'var(--bg-card-hover)'
          el.style.borderColor = 'var(--border-accent)'
          el.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.background = 'var(--bg-card)'
          el.style.borderColor = 'var(--border)'
          el.style.transform = 'translateY(0)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
          {/* Avatar */}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: `${partyColor}22`,
              border: `2px solid ${partyColor}60`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: partyColor,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>

          {/* Name + meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '3px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {name}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
              {role} · {flag} {jurisdiction}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: partyColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {party}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                since {since}
              </span>
            </div>
          </div>
        </div>

        {/* Scores */}
        {integrityScore ? (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <ScoreBadge score={integrityScore.integrityScore} type="integrity" size="sm" />
            <ScoreBadge score={integrityScore.sleazeScore} type="sleaze" size="sm" />
            {barnacleScore && (
              <ScoreBadge score={barnacleScore.barnacleScore} type="barnacle" size="sm" />
            )}
          </div>
        ) : (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            No scores calculated yet
          </div>
        )}

        {/* Tenure bar */}
        {barnacleScore && (
          <div style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Barnacle Index
              </span>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {barnacleScore.tenureYears} yrs in office
              </span>
            </div>
            <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${barnacleScore.barnacleScore}%`,
                  background: barnacleScore.barnacleScore > 60
                    ? 'var(--red)'
                    : barnacleScore.barnacleScore > 35
                    ? 'var(--amber)'
                    : 'var(--green)',
                  borderRadius: '2px',
                  transition: 'width 0.8s ease',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}