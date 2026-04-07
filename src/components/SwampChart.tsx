'use client'

import { useRouter } from 'next/navigation'

interface Politician {
  id: string
  name: string
  initials: string
  party: string
  integrityScore: {
    partySpectrum: number
    integrityAxis: number
    integrityScore: number
  } | null
}

interface SwampChartProps {
  politicians: Politician[]
}

const partyColors: Record<string, string> = {
  Democrat: '#4895ef',
  Republican: '#e63946',
  Labour: '#e63946',
  Conservative: '#4895ef',
  Independent: '#f4a261',
}

export default function SwampChart({ politicians }: SwampChartProps) {
  const router = useRouter()
  const width = 560
  const height = 400
  const pad = 48

  const plotW = width - pad * 2
  const plotH = height - pad * 2

  // Map -1..1 to pixel coordinates
  const toX = (v: number) => pad + ((v + 1) / 2) * plotW
  const toY = (v: number) => pad + ((1 - v) / 2) * plotH  // invert Y

  const withScores = politicians.filter(p => p.integrityScore)

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
          The Swamp Chart
        </h2>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          X axis: political spectrum (left → right) · Y axis: integrity (corrupt → clean)
        </p>
      </div>

      <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', overflow: 'visible' }}>
        {/* Background quadrants */}
        <rect x={pad} y={pad} width={plotW / 2} height={plotH / 2} fill="#52b78808" />
        <rect x={pad + plotW / 2} y={pad} width={plotW / 2} height={plotH / 2} fill="#52b78808" />
        <rect x={pad} y={pad + plotH / 2} width={plotW / 2} height={plotH / 2} fill="#e6394608" />
        <rect x={pad + plotW / 2} y={pad + plotH / 2} width={plotW / 2} height={plotH / 2} fill="#e6394612" />

        {/* Quadrant labels */}
        {[
          { x: pad + 8, y: pad + 16, label: 'Elder Statesman', color: '#52b78860' },
          { x: pad + plotW / 2 + 8, y: pad + 16, label: 'Citizen Statesman', color: '#52b78860' },
          { x: pad + 8, y: pad + plotH - 8, label: 'The Swamp', color: '#e6394660' },
          { x: pad + plotW / 2 + 8, y: pad + plotH - 8, label: 'Fresh Sleaze', color: '#e6394660' },
        ].map((q, i) => (
          <text key={i} x={q.x} y={q.y} fontSize="9" fill={q.color} fontFamily="var(--font-mono)" fontWeight="600" textAnchor="start">
            {q.label}
          </text>
        ))}

        {/* Grid lines */}
        {/* Center vertical */}
        <line x1={toX(0)} y1={pad} x2={toX(0)} y2={pad + plotH} stroke="#2a2a35" strokeWidth="1" strokeDasharray="4,4" />
        {/* Center horizontal */}
        <line x1={pad} y1={toY(0)} x2={pad + plotW} y2={toY(0)} stroke="#2a2a35" strokeWidth="1" strokeDasharray="4,4" />

        {/* Axis borders */}
        <rect x={pad} y={pad} width={plotW} height={plotH} fill="none" stroke="#2a2a35" strokeWidth="1" />

        {/* Axis labels */}
        <text x={pad} y={height - 10} fontSize="9" fill="#5a5870" fontFamily="var(--font-mono)">◀ Left</text>
        <text x={pad + plotW} y={height - 10} fontSize="9" fill="#5a5870" fontFamily="var(--font-mono)" textAnchor="end">Right ▶</text>
        <text x={12} y={pad + 4} fontSize="9" fill="#5a5870" fontFamily="var(--font-mono)" textAnchor="middle" transform={`rotate(-90, 12, ${pad + plotH / 2})`}>Clean</text>
        <text x={12} y={pad + plotH} fontSize="9" fill="#5a5870" fontFamily="var(--font-mono)" textAnchor="middle" transform={`rotate(-90, 12, ${pad + plotH / 2})`}>Corrupt</text>

        {/* Data points */}
        {withScores.map((p) => {
          const score = p.integrityScore!
          const cx = toX(score.partySpectrum)
          const cy = toY(score.integrityAxis)
          const color = partyColors[p.party] ?? '#9b9aaa'

          return (
            <g
              key={p.id}
              onClick={() => router.push(`/politicians/${p.id}`)}
              style={{ cursor: 'pointer' }}
            >
              {/* Glow ring */}
              <circle cx={cx} cy={cy} r={16} fill={`${color}15`} />
              {/* Dot */}
              <circle
                cx={cx}
                cy={cy}
                r={10}
                fill={`${color}30`}
                stroke={color}
                strokeWidth="1.5"
              />
              {/* Initials */}
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                fontSize="8"
                fontWeight="700"
                fill={color}
                fontFamily="var(--font-mono)"
                style={{ pointerEvents: 'none' }}
              >
                {p.initials}
              </text>
              {/* Tooltip on hover via title */}
              <title>{p.name} — Integrity: {Math.round(score.integrityScore)}</title>
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
        {[
          { party: 'Democrat / Labour', color: '#4895ef' },
          { party: 'Republican / Conservative', color: '#e63946' },
          { party: 'Independent', color: '#f4a261' },
        ].map(item => (
          <div key={item.party} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, opacity: 0.8 }} />
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.party}</span>
          </div>
        ))}
      </div>
    </div>
  )
}