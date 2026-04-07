import { prisma } from './prisma'

const CURRENT_YEAR = 2026
const ADULT_START_AGE = 22 // age we consider "career" to begin

interface BarnacleInput {
  id: string
  name: string
  birthYear: number | null
  firstElectedYear: number | null
  since: number
  estimatedNetWorth: number | null
  prePoliticsCareer: string | null
}

// Tenure score: 0–25, accelerating curve (not linear)
// Year 10 = ~10pts, Year 20 = ~18pts, Year 30 = 25pts
function calcTenureScore(tenureYears: number): number {
  const raw = Math.pow(tenureYears, 1.4) / Math.pow(40, 1.4) * 25
  return Math.min(25, Math.round(raw * 10) / 10)
}

// Citizen ratio score: 0–20
// privateCareerYears / totalAdultYears — higher ratio = lower score (better)
function calcCitizenRatioScore(citizenRatio: number): number {
  // citizenRatio 0 = career politician = 20pts (bad)
  // citizenRatio 1 = entirely private sector = 0pts (good)
  const score = (1 - citizenRatio) * 20
  return Math.round(score * 10) / 10
}

// Wealth gap score: 0–25
// Compares estimated net worth to maximum plausible government salary accumulation
function calcWealthGapScore(
  estimatedNetWorth: number | null,
  tenureYears: number
): number {
  if (!estimatedNetWorth) return 0

  // Approximate cumulative government salary ceiling over career
  // US federal salary ~$175k/yr average, UK ~£85k, assume $150k average across all
  const salaryPerYear = 150000
  const salaryCeiling = salaryPerYear * tenureYears

  if (estimatedNetWorth <= salaryCeiling) return 0

  const gap = estimatedNetWorth - salaryCeiling
  const gapRatio = gap / salaryCeiling

  // Logarithmic scale: 2x salary = ~8pts, 5x = ~16pts, 10x+ = 25pts
  const raw = Math.log10(gapRatio + 1) / Math.log10(11) * 25
  return Math.min(25, Math.round(raw * 10) / 10)
}

// Revolving door score: 0–15
// Placeholder — in production this would pull from staff/lobbying data
// For now we use prePoliticsCareer as a signal
function calcRevolvingDoorScore(prePoliticsCareer: string | null): number {
  if (!prePoliticsCareer) return 5 // unknown = moderate penalty

  const career = prePoliticsCareer.toLowerCase()

  // High revolving door signals
  if (career.includes('lobbyist') || career.includes('pac')) return 15
  if (career.includes('staffer') || career.includes('aide')) return 12

  // Moderate signals — finance/law adjacent to regulated industries
  if (career.includes('investment bank') || career.includes('hedge fund')) return 10
  if (career.includes('attorney') && career.includes('corporate')) return 8

  // Low signals — genuinely outside politics
  if (
    career.includes('teacher') ||
    career.includes('nurse') ||
    career.includes('military') ||
    career.includes('small business') ||
    career.includes('nonprofit')
  ) return 2

  return 5 // default moderate
}

// Entrenchment score: 0–15
// Based on tenure length as proxy for electoral entrenchment
// In production: would use actual electoral margin data
function calcEntrenchmentScore(tenureYears: number, since: number): number {
  // Long tenure + recent uninterrupted service = high entrenchment
  const tenureComponent = Math.min(10, tenureYears / 4)
  const continuityComponent = (CURRENT_YEAR - since) > 15 ? 5 : (CURRENT_YEAR - since) / 3
  return Math.round(Math.min(15, tenureComponent + continuityComponent) * 10) / 10
}

export async function calculateBarnacleScore(politician: BarnacleInput) {
  const birthYear = politician.birthYear ?? 1960 // fallback estimate
  const firstElectedYear = politician.firstElectedYear ?? politician.since
  const adultYears = CURRENT_YEAR - (birthYear + ADULT_START_AGE)
  const tenureYears = CURRENT_YEAR - firstElectedYear
  const privateCareerYears = Math.max(0, firstElectedYear - (birthYear + ADULT_START_AGE))
  const citizenRatio = adultYears > 0 ? privateCareerYears / adultYears : 0

  // Calculate sub-scores
  const tenureScore = calcTenureScore(tenureYears)
  const citizenRatioScore = calcCitizenRatioScore(citizenRatio)
  const wealthGapScore = calcWealthGapScore(politician.estimatedNetWorth, tenureYears)
  const revolvingDoorScore = calcRevolvingDoorScore(politician.prePoliticsCareer)
  const entrenchmentScore = calcEntrenchmentScore(tenureYears, politician.since)

  // Composite barnacle score (0–100)
  const barnacleScore = Math.round(
    (tenureScore + citizenRatioScore + wealthGapScore + revolvingDoorScore + entrenchmentScore) * 10
  ) / 10

  // Citizen statesman score is the inverse, normalized to 0–100
  const citizenStatesmanScore = Math.round((100 - barnacleScore) * 10) / 10

  // Upsert into database
  const existing = await prisma.barnacleScore.findFirst({
    where: { politicianId: politician.id },
    orderBy: { calculatedAt: 'desc' },
  })

  if (existing) {
    await prisma.barnacleScore.update({
      where: { id: existing.id },
      data: {
        barnacleScore,
        citizenStatesmanScore,
        tenureYears,
        privateCareerYears,
        citizenRatio,
        tenureScore,
        citizenRatioScore,
        wealthGapScore,
        revolvingDoorScore,
        entrenchmentScore,
      },
    })
  } else {
    await prisma.barnacleScore.create({
      data: {
        politicianId: politician.id,
        barnacleScore,
        citizenStatesmanScore,
        tenureYears,
        privateCareerYears,
        citizenRatio,
        tenureScore,
        citizenRatioScore,
        wealthGapScore,
        revolvingDoorScore,
        entrenchmentScore,
      },
    })
  }

  return {
    barnacleScore,
    citizenStatesmanScore,
    tenureYears,
    privateCareerYears,
    citizenRatio,
    tenureScore,
    citizenRatioScore,
    wealthGapScore,
    revolvingDoorScore,
    entrenchmentScore,
  }
}