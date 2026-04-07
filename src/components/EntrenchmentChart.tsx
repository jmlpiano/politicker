'use client'

import { useRouter } from 'next/navigation'

interface Politician {
  id: string
  name: string
  initials: string
  party: string
  integrityScore: {
    integrityScore: number
  } | null
  barnacleScore: {
    citizenStatesmanScore: number
    barnacleScore: number
  } | null
}

interface EntrenchmentChartProps {
  politicians: Politician[]
}

const partyColors: Record<string, string> = {
  Democrat: '#4895ef',
  Republican: '#e63946',
  Labour: '#e63946',
  Conservative: '#4895ef',
  Independent: '#f4a261',
}

export default function EntrenchmentChart({ politicians }: EntrenchmentChartProps) {
  const router = useRouter()
  const width = 560
  const height = 400
  const pad = 48

  const plotW = width - pad * 2
  const plotH = height - pad * 2

  // X: citizenStatesmanScore 0–100, Y: integrityScore 0–100
  const toX = (v: number) => pad + (v / 100) * plotW
  const toY = (v: number) => pad + ((100 - v) / 100) * plotH

  const withScores = politicians.filter(p => p.integrityScore && p.barnacleScore)

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
          The Swamp Chart
        </h2>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          X axis: citizen statesman score (career politician → citizen statesman) · Y axis: integrity (corrupt → clean)
        </p>
      </div>

      <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', overflow: 'visible' }}>
        {/* Quadrant backgrounds */}
        {/* Top-left: Elder Statesman (career but clean) */}
        <rect x={pad} y={pad} width={plotW / 2} height={plotH / 2} fill="#52b78810" />
        {/* Top-right: Citizen Statesman (best) */}
        <rect x={pad + plotW / 2} y={pad} width={plotW / 2} height={plotH / 2} fill="#52b78818" />
        {/* Bottom-left: The Swamp (worst) */}
        <rect x={pad} y={pad + plotH / 2} width={plotW / 2} height={plotH / 2} fill="#e6394618" />
        {/* Bottom-right: Fresh Sleaze (new but corrupt) */}
        <rect x={pad + plotW / 2} y={pad + plotH / 2} width={plotW / 2} height={plotH / 2} fill="#e6394610" />

        {/* Quadrant labels */}
        <text x={pad + 8} y={pad + 16} fontSize="9" fill="#52b78870" fontFamily="var(--font-mono)" fontWeight="600">ELDER STATESMAN</text>
        <text x={pad + plotW / 2 + 8} y={pad + 16} fontSize="9" fill="#52b78870" fontFamily="var(--font-mono)" fontWeight="600">CITIZEN STATESMAN ★</text>
        <text x={pad + 8} y={pad + plotH - 8} fontSize="9" fill="#e6394670" fontFamily="var(--font-mono)" fontWeight="600">THE SWAMP ⚓</text>
        <text x={pad + plotW / 2 + 8} y={pad + plotH - 8} fontSize="9" fill="#e6394670" fontFamily="var(--font-mono)" fontWeight="600">FRESH SLEAZE</text>

        {/* Center grid lines */}
        <line x1={toX(50)} y1={pad} x2={toX(50)} y2={pad + plotH} stroke="#2a2a35" strokeWidth="1" strokeDasharray="4,4" />
        <line x1={pad} y1={toY(50)} x2={pad + plotW} y2={toY(50)} stroke="#2a2a35" strokeWidth="1" strokeDasharray="4,4" />
        <rect x={pad} y={pad} width={plotW} height={plotH} fill="none" stroke="#2a2a35" strokeWidth="1" />

        {/* Axis labels */}
        <text x={pad} y={height - 10} fontSize="9" fill="#5a5870" fontFamily="var(--font-mono)">◀ Career Politician</text>
        <text x={pad + plotW} y={height - 10} fontSize="9" fill="#5a5870" fontFamily="var(--font-mono)" textAnchor="end">Citizen Statesman ▶</text>
        <text x={14} y={pad} fontSize="9" fill="#5a5870" fontFamily="var(--font-mono)" textAnchor="middle" transform={`rotate(-90, 14, ${pad + plotH / 2})`}>▲ Clean</text>
        <text x={14} y={pad + plotH} fontSize="9" fill="#5a5870" fontFamily="var(--font-mono)" textAnchor="middle" transform={`rotate(-90, 14, ${pad + plotH / 2})`}>Corrupt ▼</text>

        {/* Data points */}
        {withScores.map((p) => {
          const cx = toX(p.barnacleScore!.citizenStatesmanScore)
          const cy = toY(p.integrityScore!.integrityScore)
          const color = partyColors[p.party] ?? '#9b9aaa'

          return (
            <g key={p.id} onClick={() => router.push(`/politicians/${p.id}`)} style={{ cursor: 'pointer' }}>
              <circle cx={cx} cy={cy} r={16} fill={`${color}15`} />
              <circle cx={cx} cy={cy} r={10} fill={`${color}30`} stroke={color} strokeWidth="1.5" />
              <text x={cx} y={cy + 4} textAnchor="middle" fontSize="8" fontWeight="700" fill={color} fontFamily="var(--font-mono)" style={{ pointerEvents: 'none' }}>
                {p.initials}
              </text>
              <title>{p.name} — Integrity: {Math.round(p.integrityScore!.integrityScore)} · Citizen: {Math.round(p.barnacleScore!.citizenStatesmanScore)}</title>
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
        {[
          { label: 'Democrat / Labour', color: '#4895ef' },
          { label: 'Republican / Conservative', color: '#e63946' },
          { label: 'Independent', color: '#f4a261' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, opacity: 0.8 }} />
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}