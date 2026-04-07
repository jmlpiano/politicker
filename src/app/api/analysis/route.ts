import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const body = await request.json()
    const { politicianId } = body

    if (!politicianId) {
      return NextResponse.json(
        { error: 'politicianId is required' },
        { status: 400 }
      )
    }

    const politician = await prisma.politician.findUnique({
      where: { id: politicianId },
      include: {
        votes: {
          include: {
            alignments: {
              include: { statement: true },
            },
          },
        },
        statements: true,
        contributions: {
          include: { donor: true },
        },
        scores: {
          orderBy: { calculatedAt: 'desc' },
          take: 1,
        },
        barnacleScores: {
          orderBy: { calculatedAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!politician) {
      return NextResponse.json(
        { error: 'Politician not found' },
        { status: 404 }
      )
    }

    const integrityScore = politician.scores[0] ?? null
    const barnacleScore = politician.barnacleScores[0] ?? null

    const votesSummary = politician.votes.map((v) => {
      const alignmentSummary = v.alignments.map((a) =>
        `Statement: "${a.statement.content}" — ${a.aligned ? 'ALIGNED' : 'MISALIGNED'}: ${a.explanation}`
      ).join('\n')
      return `- ${v.date.toISOString().split('T')[0]} | ${v.vote} | ${v.bill} (${v.issue})\n  ${v.description}\n  ${alignmentSummary}`
    }).join('\n\n')

    const statementsSummary = politician.statements.map((s) =>
      `- [${s.issue}] "${s.content}" (${s.source}, ${s.date?.toISOString().split('T')[0] ?? 'undated'})`
    ).join('\n')

    const donorSummary = politician.contributions.map((c) =>
      `- ${c.donor.name} (${c.donor.industry}, ${c.donor.type}): $${c.amount.toLocaleString()} in ${c.year}`
    ).join('\n')

    const scoresSummary = integrityScore ? `
Integrity Score: ${integrityScore.integrityScore}/100
Sleaze Score: ${integrityScore.sleazeScore}/100
Alignment Rate: ${(integrityScore.alignmentRate * 100).toFixed(0)}%
Donor Influence: ${(integrityScore.donorInfluence * 100).toFixed(0)}%
Flip Frequency: ${(integrityScore.flipFrequency * 100).toFixed(0)}%
Party Spectrum: ${integrityScore.partySpectrum} (-1 hard left, +1 hard right)
Integrity Axis: ${integrityScore.integrityAxis} (-1 corrupt, +1 integrity)
`.trim() : 'No integrity score calculated yet.'

    const barnacleContext = barnacleScore ? `
Barnacle Score: ${barnacleScore.barnacleScore}/100 (higher = more entrenched)
Citizen Statesman Score: ${barnacleScore.citizenStatesmanScore}/100
Years in Office: ${barnacleScore.tenureYears}
Years in Private Sector: ${barnacleScore.privateCareerYears}
Citizen Ratio: ${(barnacleScore.citizenRatio * 100).toFixed(0)}% of adult life in private sector
Wealth Gap Score: ${barnacleScore.wealthGapScore}/25
`.trim() : `
Pre-politics career: ${politician.prePoliticsCareer ?? 'Unknown'}
First elected: ${politician.firstElectedYear ?? 'Unknown'}
Estimated net worth: ${politician.estimatedNetWorth ? '$' + politician.estimatedNetWorth.toLocaleString() : 'Unknown'}
Years in office: ${politician.firstElectedYear ? 2026 - politician.firstElectedYear : 'Unknown'}
`.trim()

    const prompt = `You are a nonpartisan political analyst for Politicker.io, a government accountability platform. Analyze this politician's record and produce a sharp, evidence-based integrity assessment.

POLITICIAN: ${politician.name}
Role: ${politician.role}, ${politician.jurisdiction} (${politician.party})
In office since: ${politician.since}
Bio: ${politician.bio ?? 'None provided'}

SCORES:
${scoresSummary}

ENTRENCHMENT DATA:
${barnacleContext}

VOTING RECORD & STATEMENT ALIGNMENTS:
${votesSummary}

PUBLIC STATEMENTS:
${statementsSummary}

DONOR CONTRIBUTIONS:
${donorSummary || 'No donor data available.'}

Write a 3-paragraph analysis:

Paragraph 1 — VOTING RECORD: What does their actual voting record reveal? Call out specific votes. Note any pattern between donor money and vote direction.

Paragraph 2 — WORDS VS ACTIONS: How well do their public statements match their votes? Highlight the most striking alignments or contradictions with specific examples.

Paragraph 3 — THE BOTTOM LINE: A blunt, plain-English verdict on this politician. Factor in their entrenchment — how long they've been in office, what they did before politics, and whether their net worth trajectory raises questions. End with one sentence that a voter could remember.

Be direct. Name specific votes, specific donors, specific contradictions. Do not hedge. This is accountability journalism, not a press release.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const analysisText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('')

    return NextResponse.json({
      politicianId,
      name: politician.name,
      analysis: analysisText,
      model: message.model,
      usage: message.usage,
    })

  } catch (error) {
    console.error('[POST /api/analysis]', error)
    return NextResponse.json(
      {
        error: 'Failed to generate analysis',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}