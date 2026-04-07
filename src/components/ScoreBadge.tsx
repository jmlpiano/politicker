type ScoreType = 'integrity' | 'sleaze' | 'barnacle' | 'citizen'

interface ScoreBadgeProps {
  score: number
  type: ScoreType
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const labels: Record<ScoreType, string> = {
  integrity: 'Integrity',
  sleaze: 'Sleaze',
  barnacle: 'Barnacle',
  citizen: 'Citizen',
}

function getColor(score: number, type: ScoreType): string {
  // For integrity and citizen — higher is better (green)
  // For sleaze and barnacle — lower is better (green)
  const inverted = type === 'sleaze' || type === 'barnacle'
  const adjusted = inverted ? 100 - score : score

  if (adjusted >= 70) return 'var(--green)'
  if (adjusted >= 40) return 'var(--amber)'
  return 'var(--red)'
}

const sizes = {
  sm: { num: '1rem', label: '0.6rem', pad: '4px 8px', gap: '2px' },
  md: { num: '1.4rem', label: '0.65rem', pad: '6px 12px', gap: '2px' },
  lg: { num: '2.2rem', label: '0.7rem', pad: '10px 16px', gap: '4px' },
}

export default function ScoreBadge({
  score,
  type,
  size = 'md',
  showLabel = true,
}: ScoreBadgeProps) {
  const color = getColor(score, type)
  const s = sizes[size]

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: s.gap,
        padding: s.pad,
        background: `${color}18`,
        border: `1px solid ${color}40`,
        borderRadius: '6px',
        minWidth: size === 'lg' ? '80px' : '60px',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: s.num,
          fontWeight: 600,
          color,
          lineHeight: 1,
        }}
      >
        {Math.round(score)}
      </span>
      {showLabel && (
        <span
          style={{
            fontSize: s.label,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 600,
          }}
        >
          {labels[type]}
        </span>
      )}
    </div>
  )
}