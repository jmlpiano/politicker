import SwampChart from '@/components/SwampChart'
import PoliticianCard from '@/components/PoliticianCard'
import EntrenchmentChart from '@/components/EntrenchmentChart'

async function getPoliticians() {
const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/politicians`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch politicians')
  return res.json()
}

export default async function HomePage() {
  const politicians = await getPoliticians()

  const withScores = politicians.filter((p: any) => p.integrityScore)
  const avgIntegrity = withScores.length
    ? Math.round(withScores.reduce((sum: number, p: any) => sum + p.integrityScore.integrityScore, 0) / withScores.length)
    : null

  const mostBarnacled = politicians.reduce((max: any, p: any) =>
    p.barnacleScore && (!max.barnacleScore || p.barnacleScore.barnacleScore > max.barnacleScore.barnacleScore) ? p : max
  , politicians[0])

  const sleaziest = withScores.reduce((max: any, p: any) =>
    p.integrityScore.sleazeScore > (max.integrityScore?.sleazeScore ?? 0) ? p : max
  , withScores[0])

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid var(--border)',
          padding: '0 32px',
          background: 'var(--bg-secondary)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.8rem',
                fontWeight: 900,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              PoliticianGrader
            </h1>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--red)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  fontWeight: 600,
                  border: '1px solid var(--red-dim)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                Beta
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Government accountability — votes, donors, integrity scores
            </p>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
            {politicians.length} politicians tracked
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>

        {/* Stats bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          {[
            {
              label: 'Avg Integrity Score',
              value: avgIntegrity ?? '—',
              sub: 'across all tracked politicians',
              color: avgIntegrity && avgIntegrity >= 60 ? 'var(--green)' : 'var(--amber)',
            },
            {
              label: 'Most Barnacled',
              value: mostBarnacled?.name?.split(' ').pop() ?? '—',
              sub: mostBarnacled?.barnacleScore ? `${mostBarnacled.barnacleScore.barnacleScore}/100 barnacle score` : '',
              color: 'var(--amber)',
            },
            {
              label: 'Highest Sleaze',
              value: sleaziest?.name?.split(' ').pop() ?? '—',
              sub: sleaziest?.integrityScore ? `${sleaziest.integrityScore.sleazeScore}/100 sleaze score` : '',
              color: 'var(--red)',
            },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '20px',
              }}
            >
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                {stat.label}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: stat.color, marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
          <SwampChart politicians={politicians} />
          <EntrenchmentChart politicians={politicians} />
        </div>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          >
            All Politicians
          </h2>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {politicians.map((p: any, i: number) => (
            <PoliticianCard
              key={p.id}
              id={p.id}
              name={p.name}
              initials={p.initials}
              party={p.party}
              role={p.role}
              jurisdiction={p.jurisdiction}
              country={p.country}
              since={p.since}
              integrityScore={p.integrityScore}
              barnacleScore={p.barnacleScore}
              index={i}
            />
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: '60px',
            paddingTop: '24px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            POLITICIANGRADER.COM — DEMO DATA
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Powered by Claude AI
          </span>
        </div>
      </div>
    </main>
  )
}