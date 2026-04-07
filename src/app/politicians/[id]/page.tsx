import Link from 'next/link'
import ScoreBadge from '@/components/ScoreBadge'
import AIAnalysis from '@/components/AIAnalysis'

async function getPolitician(id: string) {
  const res = await fetch(`http://localhost:3000/api/politicians/${id}`, {
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json()
}

export default async function PoliticianPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const p = await getPolitician(id)

  if (!p) {
    return (
      <main style={{ padding: '60px 32px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Politician not found.</p>
        <Link href="/" style={{ color: 'var(--blue)', fontSize: '0.85rem' }}>← Back</Link>
      </main>
    )
  }

  const score = p.integrityScore
  const barnacle = p.barnacleScore
  const yearsInOffice = p.firstElectedYear ? 2026 - p.firstElectedYear : null

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', padding: '0 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            href="/"
            style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}
          >
            ← Politicker
          </Link>
          <span style={{ color: 'var(--border-accent)' }}>·</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.name}</span>
        </div>
      </header>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 32px' }}>

        {/* Hero */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '32px', marginBottom: '40px', alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
              {p.party} · {p.role} · {p.jurisdiction} · {p.country}
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '12px', lineHeight: 1.1 }}>
              {p.name}
            </h1>
            {p.bio && (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '600px' }}>
                {p.bio}
              </p>
            )}
            {p.prePoliticsCareer && (
              <div style={{ marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Before politics:</span> {p.prePoliticsCareer}
              </div>
            )}
          </div>

          {/* Score cluster */}
          {score && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <ScoreBadge score={score.integrityScore} type="integrity" size="lg" />
                <ScoreBadge score={score.sleazeScore} type="sleaze" size="lg" />
              </div>
              {barnacle && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <ScoreBadge score={barnacle.barnacleScore} type="barnacle" size="lg" />
                  <ScoreBadge score={barnacle.citizenStatesmanScore} type="citizen" size="lg" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Barnacle breakdown */}
        {barnacle && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
              Barnacle Score Breakdown
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
              {[
                { label: 'Tenure', value: barnacle.tenureScore, max: 25, detail: `${barnacle.tenureYears} years in office` },
                { label: 'Citizen Ratio', value: barnacle.citizenRatioScore, max: 20, detail: `${barnacle.privateCareerYears} yrs private sector` },
                { label: 'Wealth Gap', value: barnacle.wealthGapScore, max: 25, detail: p.estimatedNetWorth ? `Est. $${(p.estimatedNetWorth / 1000000).toFixed(1)}M net worth` : 'No data' },
                { label: 'Revolving Door', value: barnacle.revolvingDoorScore, max: 15, detail: 'Staff/lobbyist signal' },
                { label: 'Entrenchment', value: barnacle.entrenchmentScore, max: 15, detail: `In current role since ${p.since}` },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                      {item.value}/{item.max}
                    </span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden', marginBottom: '4px' }}>
                    <div style={{
                      height: '100%',
                      width: `${(item.value / item.max) * 100}%`,
                      background: (item.value / item.max) > 0.66 ? 'var(--red)' : (item.value / item.max) > 0.33 ? 'var(--amber)' : 'var(--green)',
                      borderRadius: '3px',
                    }} />
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{item.detail}</div>
                </div>
              ))}
            </div>

            {/* Wealth context */}
            {p.estimatedNetWorth && yearsInOffice && (
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  Wealth Context
                </div>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Govt Salary Ceiling', value: `$${((yearsInOffice * 150000) / 1000000).toFixed(1)}M`, sub: `${yearsInOffice} yrs × $150k/yr` },
                    { label: 'Estimated Net Worth', value: `$${(p.estimatedNetWorth / 1000000).toFixed(1)}M`, sub: 'Public disclosure estimate' },
                    { label: 'Unexplained Gap', value: `$${(Math.max(0, p.estimatedNetWorth - yearsInOffice * 150000) / 1000000).toFixed(1)}M`, sub: 'Above salary ceiling', highlight: p.estimatedNetWorth > yearsInOffice * 150000 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '2px' }}>{item.label}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 600, color: item.highlight ? 'var(--red)' : 'var(--text-primary)' }}>
                        {item.value}
                      </div>
                      <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Analysis */}
        <div style={{ marginBottom: '24px' }}>
          <AIAnalysis politicianId={p.id} politicianName={p.name} />
        </div>

        {/* Two column: votes + donors */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>

          {/* Votes */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
              Voting Record
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {p.votes.map((v: any) => (
                <div key={v.id} style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.3 }}>
                      {v.bill}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: v.vote === 'YES' ? 'var(--green)' : v.vote === 'NO' ? 'var(--red)' : 'var(--amber)',
                      flexShrink: 0,
                    }}>
                      {v.vote}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    {v.issue} · {new Date(v.date).getFullYear()}
                  </div>
                  {v.alignments.map((a: any) => (
                    <div key={a.id} style={{ fontSize: '0.68rem', color: a.aligned ? 'var(--green)' : 'var(--red)', marginTop: '4px' }}>
                      {a.aligned ? '✓' : '✗'} {a.explanation}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Donors */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
              Donor Contributions
            </h2>
            {p.contributions.length === 0 ? (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No donor data available.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {p.contributions.map((c: any) => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 500 }}>{c.donor.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.donor.industry} · {c.donor.type} · {c.year}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--amber)' }}>
                      ${c.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Statements */}
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, margin: '24px 0 16px', color: 'var(--text-primary)' }}>
              Public Statements
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {p.statements.map((s: any) => (
                <div key={s.id} style={{ paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '4px', fontStyle: 'italic' }}>
                    "{s.content}"
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    {s.issue} · {s.source} · {s.date ? new Date(s.date).getFullYear() : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}