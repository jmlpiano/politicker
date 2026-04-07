import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Politicker database...')

  // Clear existing data
  await prisma.integrityScore.deleteMany()
  await prisma.voteStatementAlignment.deleteMany()
  await prisma.donorContribution.deleteMany()
  await prisma.donor.deleteMany()
  await prisma.vote.deleteMany()
  await prisma.statement.deleteMany()
  await prisma.politician.deleteMany()

  // ── POLITICIAN 1: Margaret Harlow ─────────────────────────────────────────
  const harlow = await prisma.politician.create({
    data: {
      name: 'Margaret E. Harlow',
      initials: 'MH',
      party: 'Democrat',
      level: 'Federal',
      country: 'USA',
      jurisdiction: 'California',
      role: 'U.S. Senator',
      since: 2016,
      bio: 'Two-term senator known for progressive healthcare rhetoric with a notably mixed record on financial regulation and trade.',
    }
  })

  const harlow_s1 = await prisma.statement.create({ data: { politicianId: harlow.id, content: 'I will fight every single day until every American has access to quality, affordable healthcare. Full stop. No exceptions.', issue: 'Healthcare', source: 'Campaign Rally, Sacramento 2022', date: new Date('2022-09-14') } })
  const harlow_s2 = await prisma.statement.create({ data: { politicianId: harlow.id, content: 'We must hold Wall Street accountable. Big banks must never again threaten our economy.', issue: 'Banking', source: 'Senate Floor Speech 2021', date: new Date('2021-03-10') } })
  const harlow_s3 = await prisma.statement.create({ data: { politicianId: harlow.id, content: 'Climate change is the existential challenge of our generation. We need bold, transformational action.', issue: 'Climate', source: 'CNN Interview 2023', date: new Date('2023-01-18') } })
  const harlow_s4 = await prisma.statement.create({ data: { politicianId: harlow.id, content: 'I will always put American workers first. I will oppose any trade deal that ships their jobs overseas.', issue: 'Trade', source: 'AFL-CIO Forum 2021', date: new Date('2021-06-05') } })
  const harlow_s5 = await prisma.statement.create({ data: { politicianId: harlow.id, content: 'Student debt is crushing an entire generation. I will fight to cancel it.', issue: 'Student Debt', source: 'Twitter/X 2022', date: new Date('2022-02-28') } })

  const harlow_v1 = await prisma.vote.create({ data: { politicianId: harlow.id, bill: 'Affordable Care Expansion Act', billId: 'S.1234', issue: 'Healthcare', vote: 'YES', date: new Date('2023-04-12'), description: 'Expanded ACA subsidies and added dental/vision coverage to Medicare.' } })
  const harlow_v2 = await prisma.vote.create({ data: { politicianId: harlow.id, bill: 'Community Banking Relief Act', billId: 'S.2891', issue: 'Banking', vote: 'YES', date: new Date('2022-11-08'), description: 'Rolled back Dodd-Frank oversight provisions for mid-size banks.' } })
  const harlow_v3 = await prisma.vote.create({ data: { politicianId: harlow.id, bill: 'Clean Energy Transition Act', billId: 'S.3301', issue: 'Climate', vote: 'YES', date: new Date('2023-07-19'), description: 'Voted for $400B clean energy investment with binding emissions targets.' } })
  const harlow_v4 = await prisma.vote.create({ data: { politicianId: harlow.id, bill: 'Pacific Commerce Partnership', billId: 'S.1876', issue: 'Trade', vote: 'YES', date: new Date('2021-09-22'), description: 'Voted for trade agreement opposed by AFL-CIO as harmful to domestic manufacturing.' } })
  const harlow_v5 = await prisma.vote.create({ data: { politicianId: harlow.id, bill: 'Student Loan Relief Act', billId: 'S.4421', issue: 'Student Debt', vote: 'YES', date: new Date('2022-08-05'), description: 'Voted for $20,000 per-borrower forgiveness. Previously promised full cancellation.' } })

  await prisma.voteStatementAlignment.createMany({ data: [
    { voteId: harlow_v1.id, statementId: harlow_s1.id, aligned: true,  explanation: 'Vote fully consistent with stated healthcare commitment.' },
    { voteId: harlow_v2.id, statementId: harlow_s2.id, aligned: false, explanation: 'Voted to roll back bank oversight despite anti-Wall Street rhetoric. Three top-5 donors are banking institutions.' },
    { voteId: harlow_v3.id, statementId: harlow_s3.id, aligned: true,  explanation: 'Vote fully aligns with stated climate urgency.' },
    { voteId: harlow_v4.id, statementId: harlow_s4.id, aligned: false, explanation: 'Voted for trade deal opposed by major labor unions as harmful to American workers.' },
    { voteId: harlow_v5.id, statementId: harlow_s5.id, aligned: true,  explanation: 'Consistent with stated position, though she previously promised full cancellation.' },
  ]})

  const wells_fargo = await prisma.donor.create({ data: { name: 'Wells Fargo PAC', industry: 'Banking', type: 'PAC' } })
  const jpmorgan   = await prisma.donor.create({ data: { name: 'JPMorgan Chase PAC', industry: 'Banking', type: 'PAC' } })
  const bofa       = await prisma.donor.create({ data: { name: 'Bank of America PAC', industry: 'Banking', type: 'PAC' } })
  const green_pac  = await prisma.donor.create({ data: { name: 'Sierra Club PAC', industry: 'Environment', type: 'PAC' } })

  await prisma.donorContribution.createMany({ data: [
    { donorId: wells_fargo.id, politicianId: harlow.id, amount: 45000, year: 2022, cycle: '2022' },
    { donorId: jpmorgan.id,   politicianId: harlow.id, amount: 38500, year: 2022, cycle: '2022' },
    { donorId: bofa.id,       politicianId: harlow.id, amount: 32000, year: 2022, cycle: '2022' },
    { donorId: green_pac.id,  politicianId: harlow.id, amount: 18000, year: 2022, cycle: '2022' },
  ]})

  await prisma.integrityScore.create({ data: { politicianId: harlow.id, integrityScore: 74, sleazeScore: 26, alignmentRate: 0.6, donorInfluence: 0.42, flipFrequency: 0.2, partySpectrum: -0.65, integrityAxis: 0.48 } })

  // ── POLITICIAN 2: Robert Caldwell ─────────────────────────────────────────
  const caldwell = await prisma.politician.create({
    data: {
      name: 'Robert T. Caldwell',
      initials: 'RC',
      party: 'Republican',
      level: 'Federal',
      country: 'USA',
      jurisdiction: 'Texas',
      role: 'U.S. Senator',
      since: 2014,
      bio: 'Three-term senator with one of the sharpest divides between public statements and voting record in the current Congress.',
    }
  })

  const caldwell_s1 = await prisma.statement.create({ data: { politicianId: caldwell.id, content: 'Washington has a spending addiction. Every dollar must be justified. I will never vote for reckless spending.', issue: 'Fiscal Policy', source: 'Senate Floor Speech 2023', date: new Date('2023-02-14') } })
  const caldwell_s2 = await prisma.statement.create({ data: { politicianId: caldwell.id, content: 'Big Pharma is ripping off American families. We need to bring drug prices down — I will fight for that every day.', issue: 'Healthcare', source: 'Town Hall, Houston 2022', date: new Date('2022-07-18') } })
  const caldwell_s3 = await prisma.statement.create({ data: { politicianId: caldwell.id, content: 'The free market should determine energy winners and losers. Government should not pick sides with taxpayer money.', issue: 'Energy', source: 'Fox News Interview 2021', date: new Date('2021-04-22') } })
  const caldwell_s4 = await prisma.statement.create({ data: { politicianId: caldwell.id, content: 'Securing our border is my absolute top priority. We need strong, immediate action.', issue: 'Border', source: 'Campaign Ad 2022', date: new Date('2022-09-01') } })
  const caldwell_s5 = await prisma.statement.create({ data: { politicianId: caldwell.id, content: 'Earmarks are pure corruption. I have never requested one and never will. I am on record on this.', issue: 'Earmarks', source: 'Senate Press Release 2021', date: new Date('2021-01-20') } })

  const caldwell_v1 = await prisma.vote.create({ data: { politicianId: caldwell.id, bill: 'Defense Authorization Act — $50B Increase', billId: 'S.2226', issue: 'Fiscal Policy', vote: 'YES', date: new Date('2023-06-14'), description: 'Largest single-year defense spending increase in a decade while co-sponsoring Medicaid cuts.' } })
  const caldwell_v2 = await prisma.vote.create({ data: { politicianId: caldwell.id, bill: 'Prescription Drug Pricing Reform Act', billId: 'H.R.5376', issue: 'Healthcare', vote: 'NO', date: new Date('2022-08-12'), description: 'Voted against allowing Medicare to negotiate drug prices.' } })
  const caldwell_v3 = await prisma.vote.create({ data: { politicianId: caldwell.id, bill: 'Oil & Gas Subsidy Extension Act', billId: 'S.1093', issue: 'Energy', vote: 'YES', date: new Date('2021-10-05'), description: 'Extended $6.5B in annual federal subsidies to oil and gas companies.' } })
  const caldwell_v4 = await prisma.vote.create({ data: { politicianId: caldwell.id, bill: 'Border Security Enhancement Act', billId: 'S.4089', issue: 'Border', vote: 'YES', date: new Date('2023-09-28'), description: 'Voted for $14B in enhanced border security measures.' } })
  const caldwell_v5 = await prisma.vote.create({ data: { politicianId: caldwell.id, bill: 'Congressional Earmark Requests', billId: 'APPROP-2022', issue: 'Earmarks', vote: 'ACCEPTED $280M', date: new Date('2022-03-15'), description: 'Public records confirm $280M in earmark requests the same year he denounced the practice.' } })

  await prisma.voteStatementAlignment.createMany({ data: [
    { voteId: caldwell_v1.id, statementId: caldwell_s1.id, aligned: false, explanation: 'Voted for massive spending increase while claiming to oppose reckless spending.' },
    { voteId: caldwell_v2.id, statementId: caldwell_s2.id, aligned: false, explanation: 'Voted against drug price negotiation. Pharma is his #1 donor category at $2.4M.' },
    { voteId: caldwell_v3.id, statementId: caldwell_s3.id, aligned: false, explanation: 'Voted to extend billions in industry subsidies despite free market rhetoric.' },
    { voteId: caldwell_v4.id, statementId: caldwell_s4.id, aligned: true,  explanation: 'Vote consistent with stated border security priority.' },
    { voteId: caldwell_v5.id, statementId: caldwell_s5.id, aligned: false, explanation: 'Accepted $280M in earmarks the same year he publicly denounced earmarks as corruption.' },
  ]})

  const pharma_pac = await prisma.donor.create({ data: { name: 'PhRMA PAC', industry: 'Pharmaceutical', type: 'PAC' } })
  const exxon_pac  = await prisma.donor.create({ data: { name: 'ExxonMobil PAC', industry: 'Oil & Gas', type: 'PAC' } })
  const chevron    = await prisma.donor.create({ data: { name: 'Chevron PAC', industry: 'Oil & Gas', type: 'PAC' } })
  const defense    = await prisma.donor.create({ data: { name: 'Lockheed Martin PAC', industry: 'Defense', type: 'PAC' } })

  await prisma.donorContribution.createMany({ data: [
    { donorId: pharma_pac.id, politicianId: caldwell.id, amount: 142000, year: 2022, cycle: '2022' },
    { donorId: exxon_pac.id,  politicianId: caldwell.id, amount: 98000,  year: 2022, cycle: '2022' },
    { donorId: chevron.id,    politicianId: caldwell.id, amount: 87000,  year: 2022, cycle: '2022' },
    { donorId: defense.id,    politicianId: caldwell.id, amount: 76000,  year: 2022, cycle: '2022' },
  ]})

  await prisma.integrityScore.create({ data: { politicianId: caldwell.id, integrityScore: 31, sleazeScore: 69, alignmentRate: 0.2, donorInfluence: 0.88, flipFrequency: 0.6, partySpectrum: 0.82, integrityAxis: -0.69 } })

  // ── POLITICIAN 3: Diana Chen ───────────────────────────────────────────────
  const chen = await prisma.politician.create({
    data: {
      name: 'Diana S. Chen',
      initials: 'DC',
      party: 'Democrat',
      level: 'Federal',
      country: 'USA',
      jurisdiction: 'New York',
      role: 'U.S. Representative',
      since: 2018,
      bio: 'One of the most consistent alignment scores in the House. Declines PAC money from industries she opposes legislatively.',
    }
  })

  const chen_s1 = await prisma.statement.create({ data: { politicianId: chen.id, content: 'Housing is a human right, not a commodity. I will fight to make it affordable for every family.', issue: 'Housing', source: 'Campaign Website 2022', date: new Date('2022-08-01') } })
  const chen_s2 = await prisma.statement.create({ data: { politicianId: chen.id, content: 'Workers must have the right to organize without fear of retaliation. I will always stand with labor.', issue: 'Labor', source: 'AFL-CIO Endorsement Speech 2020', date: new Date('2020-10-12') } })
  const chen_s3 = await prisma.statement.create({ data: { politicianId: chen.id, content: 'Big Tech monopolies are crushing competition and harming consumers. We need to break up their power.', issue: 'Tech Antitrust', source: 'House Judiciary Hearing 2021', date: new Date('2021-10-06') } })
  const chen_s4 = await prisma.statement.create({ data: { politicianId: chen.id, content: 'We must prioritize domestic investment over military expansion. Defense bloat is bankrupting our future.', issue: 'Defense', source: 'Progressive Caucus Press Release 2022', date: new Date('2022-06-10') } })
  const chen_s5 = await prisma.statement.create({ data: { politicianId: chen.id, content: 'We need to rebuild American manufacturing and reduce dependence on foreign supply chains.', issue: 'Trade', source: 'House Floor Speech 2022', date: new Date('2022-07-25') } })

  const chen_v1 = await prisma.vote.create({ data: { politicianId: chen.id, bill: 'National Affordable Housing Investment Act', billId: 'H.R.7181', issue: 'Housing', vote: 'YES', date: new Date('2023-05-18'), description: 'Voted for $180B federal affordable housing investment. Co-authored key provisions.' } })
  const chen_v2 = await prisma.vote.create({ data: { politicianId: chen.id, bill: 'PRO Act — Worker Organizing Rights', billId: 'H.R.842', issue: 'Labor', vote: 'YES', date: new Date('2021-03-09'), description: 'Strong YES. Also authored amendment strengthening gig economy worker protections.' } })
  const chen_v3 = await prisma.vote.create({ data: { politicianId: chen.id, bill: 'American Innovation & Choice Online Act', billId: 'S.2992', issue: 'Tech Antitrust', vote: 'YES', date: new Date('2022-01-20'), description: 'Voted for antitrust bill targeting dominant tech platforms.' } })
  const chen_v4 = await prisma.vote.create({ data: { politicianId: chen.id, bill: 'Defense Authorization — Spending Increase', billId: 'H.R.7900', issue: 'Defense', vote: 'NO', date: new Date('2022-07-14'), description: 'One of 35 House members to vote against the defense spending increase.' } })
  const chen_v5 = await prisma.vote.create({ data: { politicianId: chen.id, bill: 'CHIPS and Science Act', billId: 'H.R.4346', issue: 'Trade', vote: 'YES', date: new Date('2022-07-28'), description: 'Supported domestic semiconductor investment bill.' } })

  await prisma.voteStatementAlignment.createMany({ data: [
    { voteId: chen_v1.id, statementId: chen_s1.id, aligned: true, explanation: 'Fully consistent with stated housing commitment.' },
    { voteId: chen_v2.id, statementId: chen_s2.id, aligned: true, explanation: 'Strong YES plus authored strengthening amendment.' },
    { voteId: chen_v3.id, statementId: chen_s3.id, aligned: true, explanation: 'Consistent with anti-monopoly statements.' },
    { voteId: chen_v4.id, statementId: chen_s4.id, aligned: true, explanation: 'Politically costly vote fully consistent with stated position.' },
    { voteId: chen_v5.id, statementId: chen_s5.id, aligned: true, explanation: 'Aligned with economic nationalism and manufacturing stance.' },
  ]})

  const labor_pac = await prisma.donor.create({ data: { name: 'SEIU PAC', industry: 'Labor', type: 'PAC' } })
  const env_pac   = await prisma.donor.create({ data: { name: 'League of Conservation Voters', industry: 'Environment', type: 'PAC' } })

  await prisma.donorContribution.createMany({ data: [
    { donorId: labor_pac.id, politicianId: chen.id, amount: 28000, year: 2022, cycle: '2022' },
    { donorId: env_pac.id,   politicianId: chen.id, amount: 12000, year: 2022, cycle: '2022' },
  ]})

  await prisma.integrityScore.create({ data: { politicianId: chen.id, integrityScore: 93, sleazeScore: 7, alignmentRate: 1.0, donorInfluence: 0.05, flipFrequency: 0.0, partySpectrum: -0.88, integrityAxis: 0.93 } })

  // ── POLITICIAN 4: William Ashford ─────────────────────────────────────────
  const ashford = await prisma.politician.create({
    data: {
      name: 'William P. Ashford',
      initials: 'WA',
      party: 'Conservative',
      level: 'Federal',
      country: 'UK',
      jurisdiction: 'Surrey East',
      role: 'Member of Parliament',
      since: 2010,
      bio: 'Veteran MP whose career exhibits a persistent pattern of promising reforms his voting record consistently undermines.',
    }
  })

  const ashford_s1 = await prisma.statement.create({ data: { politicianId: ashford.id, content: 'The NHS is the crown jewel of Britain. I will always be its most vigorous defender in this chamber.', issue: 'NHS Funding', source: 'Conservative Party Conference 2022', date: new Date('2022-10-04') } })
  const ashford_s2 = await prisma.statement.create({ data: { politicianId: ashford.id, content: 'The public has every right to know who is influencing their elected representatives. Fully committed to transparency.', issue: 'Transparency', source: 'House of Commons Hansard 2021', date: new Date('2021-05-18') } })
  const ashford_s3 = await prisma.statement.create({ data: { politicianId: ashford.id, content: 'Every British family deserves a safe, secure, affordable home. That is a basic expectation.', issue: 'Housing', source: 'Constituency Newsletter 2023', date: new Date('2023-02-01') } })
  const ashford_s4 = await prisma.statement.create({ data: { politicianId: ashford.id, content: 'Brexit must deliver for working British families. I will hold the government accountable.', issue: 'Brexit', source: 'BBC Interview 2021', date: new Date('2021-01-05') } })
  const ashford_s5 = await prisma.statement.create({ data: { politicianId: ashford.id, content: 'Dirty money in Britain is a national security threat. We must act urgently and decisively.', issue: 'Anti-Corruption', source: 'House of Commons Speech 2022', date: new Date('2022-03-08') } })

  const ashford_v1 = await prisma.vote.create({ data: { politicianId: ashford.id, bill: 'NHS Real-Terms Funding Freeze', billId: 'UK-2022-NHS', issue: 'NHS Funding', vote: 'YES — Supported freeze', date: new Date('2022-11-17'), description: 'Voted to maintain real-terms NHS funding freeze, reducing per-patient spending.' } })
  const ashford_v2 = await prisma.vote.create({ data: { politicianId: ashford.id, bill: 'Lobbying Register Expansion Bill', billId: 'UK-2021-LOB', issue: 'Transparency', vote: 'NO', date: new Date('2021-06-22'), description: 'Voted against expanded lobbying disclosure requirements.' } })
  const ashford_v3 = await prisma.vote.create({ data: { politicianId: ashford.id, bill: 'Renters Reform Bill — Tenant Protections', billId: 'UK-2023-RRB', issue: 'Housing', vote: 'NO — Against key provisions', date: new Date('2023-05-24'), description: 'Voted to strip tenant protections. Personally owns seven rental properties.' } })
  const ashford_v4 = await prisma.vote.create({ data: { politicianId: ashford.id, bill: 'Trade and Cooperation Agreement', billId: 'UK-2021-TCA', issue: 'Brexit', vote: 'YES', date: new Date('2021-04-28'), description: 'Voted for the TCA. Consistent with stated Brexit support.' } })
  const ashford_v5 = await prisma.vote.create({ data: { politicianId: ashford.id, bill: 'Economic Crime Bill — Key Amendments', billId: 'UK-2022-ECB', issue: 'Anti-Corruption', vote: 'ABSTAINED', date: new Date('2022-03-01'), description: 'Abstained on amendments strengthening unexplained wealth orders.' } })

  await prisma.voteStatementAlignment.createMany({ data: [
    { voteId: ashford_v1.id, statementId: ashford_s1.id, aligned: false, explanation: 'Voted to freeze NHS funding while publicly claiming to be its champion.' },
    { voteId: ashford_v2.id, statementId: ashford_s2.id, aligned: false, explanation: 'Voted against transparency bill that would have exposed his own lobbying meetings.' },
    { voteId: ashford_v3.id, statementId: ashford_s3.id, aligned: false, explanation: 'Voted against tenant protections while owning seven rental properties — undisclosed conflict.' },
    { voteId: ashford_v4.id, statementId: ashford_s4.id, aligned: true,  explanation: 'Vote consistent with stated Brexit support.' },
    { voteId: ashford_v5.id, statementId: ashford_s5.id, aligned: false, explanation: 'Abstained on the very anti-corruption measures he publicly demanded.' },
  ]})

  const fin_lobby  = await prisma.donor.create({ data: { name: 'City of London Financial Group', industry: 'Finance', type: 'Corporate' } })
  const prop_lobby = await prisma.donor.create({ data: { name: 'UK Property Developer Association', industry: 'Real Estate', type: 'Corporate' } })

  await prisma.donorContribution.createMany({ data: [
    { donorId: fin_lobby.id,  politicianId: ashford.id, amount: 85000, year: 2022, cycle: '2019-2024' },
    { donorId: prop_lobby.id, politicianId: ashford.id, amount: 62000, year: 2022, cycle: '2019-2024' },
  ]})

  await prisma.integrityScore.create({ data: { politicianId: ashford.id, integrityScore: 39, sleazeScore: 61, alignmentRate: 0.2, donorInfluence: 0.82, flipFrequency: 0.4, partySpectrum: 0.75, integrityAxis: -0.61 } })

  // ── POLITICIAN 5: Elena Castillo ──────────────────────────────────────────
  const castillo = await prisma.politician.create({
    data: {
      name: 'Elena V. Castillo',
      initials: 'EC',
      party: 'Labour',
      level: 'Federal',
      country: 'UK',
      jurisdiction: 'Manchester Central',
      role: 'Member of Parliament',
      since: 2017,
      bio: 'Rising Labour MP with one of the strongest alignment scores in Parliament. Has defied the party whip three times to honor stated commitments.',
    }
  })

  const castillo_s1 = await prisma.statement.create({ data: { politicianId: castillo.id, content: 'Working people are the backbone of this country and deserve ironclad protections. I will never waver on that.', issue: 'Workers Rights', source: 'Labour Party Conference 2022', date: new Date('2022-09-27') } })
  const castillo_s2 = await prisma.statement.create({ data: { politicianId: castillo.id, content: 'I will never vote for any measure that moves our NHS toward privatisation. Ever.', issue: 'NHS', source: 'Constituency Surgery 2023', date: new Date('2023-01-14') } })
  const castillo_s3 = await prisma.statement.create({ data: { politicianId: castillo.id, content: 'Education must be free. I will oppose tuition increases in every form.', issue: 'Education', source: 'Student Union Address 2021', date: new Date('2021-11-03') } })
  const castillo_s4 = await prisma.statement.create({ data: { politicianId: castillo.id, content: 'I told my constituents I would not support any infrastructure deal that cut environmental standards.', issue: 'Environment', source: 'Constituency Letter 2022', date: new Date('2022-04-18') } })
  const castillo_s5 = await prisma.statement.create({ data: { politicianId: castillo.id, content: 'We need 500,000 new social homes. I will push for every single one of them.', issue: 'Housing', source: 'House of Commons Debate 2023', date: new Date('2023-03-22') } })

  const castillo_v1 = await prisma.vote.create({ data: { politicianId: castillo.id, bill: 'Employment Rights Protection Act', billId: 'UK-2022-ERP', issue: 'Workers Rights', vote: 'YES', date: new Date('2022-10-19'), description: 'Strong YES and authored amendment extending gig economy protections.' } })
  const castillo_v2 = await prisma.vote.create({ data: { politicianId: castillo.id, bill: 'NHS Privatisation Amendment', billId: 'UK-2023-NHS', issue: 'NHS', vote: 'NO — Against', date: new Date('2023-04-05'), description: 'Voted against expanded private sector NHS contracts. Consistent commitment.' } })
  const castillo_v3 = await prisma.vote.create({ data: { politicianId: castillo.id, bill: 'University Tuition Fee Bill', billId: 'UK-2021-TFB', issue: 'Education', vote: 'NO — Defied whip', date: new Date('2021-12-14'), description: 'Voted against tuition fees despite party leadership pressure.' } })
  const castillo_v4 = await prisma.vote.create({ data: { politicianId: castillo.id, bill: 'Infrastructure Compromise Vote', billId: 'UK-2022-INF', issue: 'Environment', vote: 'NO — Defied whip', date: new Date('2022-06-08'), description: 'One of five Labour MPs to defy the whip. Honored public environmental commitment.' } })
  const castillo_v5 = await prisma.vote.create({ data: { politicianId: castillo.id, bill: 'Social Housing Investment Act', billId: 'UK-2023-SHA', issue: 'Housing', vote: 'YES', date: new Date('2023-05-11'), description: 'Strong YES and co-sponsored the bill.' } })

  await prisma.voteStatementAlignment.createMany({ data: [
    { voteId: castillo_v1.id, statementId: castillo_s1.id, aligned: true, explanation: 'Strong YES plus authored strengthening amendment.' },
    { voteId: castillo_v2.id, statementId: castillo_s2.id, aligned: true, explanation: 'Voted against privatisation measures. Fully consistent.' },
    { voteId: castillo_v3.id, statementId: castillo_s3.id, aligned: true, explanation: 'Defied party whip to honor tuition commitment.' },
    { voteId: castillo_v4.id, statementId: castillo_s4.id, aligned: true, explanation: 'Defied party leadership to honor environmental commitment.' },
    { voteId: castillo_v5.id, statementId: castillo_s5.id, aligned: true, explanation: 'Co-sponsored and voted YES. Fully consistent.' },
  ]})

  const unite = await prisma.donor.create({ data: { name: 'Unite the Union', industry: 'Labor', type: 'Union' } })
  await prisma.donorContribution.create({ data: { donorId: unite.id, politicianId: castillo.id, amount: 22000, year: 2022, cycle: '2019-2024' } })

  await prisma.integrityScore.create({ data: { politicianId: castillo.id, integrityScore: 89, sleazeScore: 11, alignmentRate: 1.0, donorInfluence: 0.08, flipFrequency: 0.0, partySpectrum: -0.82, integrityAxis: 0.89 } })

  // ── POLITICIAN 6: James Whitmore ──────────────────────────────────────────
  const whitmore = await prisma.politician.create({
    data: {
      name: 'James R. Whitmore',
      initials: 'JW',
      party: 'Republican',
      level: 'Federal',
      country: 'USA',
      jurisdiction: 'Ohio',
      role: 'U.S. Representative',
      since: 2012,
      bio: 'Veteran congressman respected across party lines for following through on commitments, including when they conflict with party leadership.',
    }
  })

  const whitmore_s1 = await prisma.statement.create({ data: { politicianId: whitmore.id, content: 'I will not vote for any trade deal that puts Ohio manufacturing workers at risk. Period.', issue: 'Trade', source: 'Ohio Manufacturers Forum 2021', date: new Date('2021-05-14') } })
  const whitmore_s2 = await prisma.statement.create({ data: { politicianId: whitmore.id, content: 'We owe our veterans everything. Their healthcare is a sacred obligation.', issue: 'Veterans', source: 'VFW Post Address 2022', date: new Date('2022-05-30') } })
  const whitmore_s3 = await prisma.statement.create({ data: { politicianId: whitmore.id, content: 'I am a fiscal conservative. I will not vote for bloated spending bills regardless of what is in them.', issue: 'Fiscal Policy', source: 'Campaign Website 2022', date: new Date('2022-07-01') } })
  const whitmore_s4 = await prisma.statement.create({ data: { politicianId: whitmore.id, content: 'We must be fiscally responsible in all areas of government, including the Pentagon.', issue: 'Defense', source: 'House Budget Committee Hearing 2022', date: new Date('2022-03-22') } })
  const whitmore_s5 = await prisma.statement.create({ data: { politicianId: whitmore.id, content: 'We need to bring American manufacturing back. I will vote for anything that rebuilds our industrial base.', issue: 'Manufacturing', source: 'CHIPS Act Floor Statement 2022', date: new Date('2022-07-25') } })

  const whitmore_v1 = await prisma.vote.create({ data: { politicianId: whitmore.id, bill: 'Pacific Commerce Partnership', billId: 'S.1876', issue: 'Trade', vote: 'NO — Defied party', date: new Date('2021-09-22'), description: 'Voted against party-supported trade agreement. Stood with Ohio union workers.' } })
  const whitmore_v2 = await prisma.vote.create({ data: { politicianId: whitmore.id, bill: 'PACT Act — Veterans Healthcare Expansion', billId: 'H.R.3967', issue: 'Veterans', vote: 'YES', date: new Date('2022-06-16'), description: 'Early co-sponsor and strong YES vote.' } })
  const whitmore_v3 = await prisma.vote.create({ data: { politicianId: whitmore.id, bill: 'Omnibus Spending Bill', billId: 'H.R.2617', issue: 'Fiscal Policy', vote: 'NO', date: new Date('2023-03-23'), description: 'Voted against omnibus despite pressure. One of 22 Republicans to hold firm.' } })
  const whitmore_v4 = await prisma.vote.create({ data: { politicianId: whitmore.id, bill: 'Defense Authorization — Spending Increase', billId: 'H.R.7900', issue: 'Defense', vote: 'YES', date: new Date('2022-07-14'), description: 'Voted for defense spending increase. Pattern correlates with Ohio defense contracts.' } })
  const whitmore_v5 = await prisma.vote.create({ data: { politicianId: whitmore.id, bill: 'CHIPS and Science Act', billId: 'H.R.4346', issue: 'Manufacturing', vote: 'YES', date: new Date('2022-07-28'), description: 'One of the few Republicans to vote for CHIPS Act.' } })

  await prisma.voteStatementAlignment.createMany({ data: [
    { voteId: whitmore_v1.id, statementId: whitmore_s1.id, aligned: true,  explanation: 'Defied own party to honor Ohio manufacturing commitment.' },
    { voteId: whitmore_v2.id, statementId: whitmore_s2.id, aligned: true,  explanation: 'Co-sponsored and voted YES. Fully consistent.' },
    { voteId: whitmore_v3.id, statementId: whitmore_s3.id, aligned: true,  explanation: 'Held firm against omnibus despite pressure.' },
    { voteId: whitmore_v4.id, statementId: whitmore_s4.id, aligned: false, explanation: 'Voted for defense increase despite fiscal responsibility rhetoric. Ohio contractor pattern.' },
    { voteId: whitmore_v5.id, statementId: whitmore_s5.id, aligned: true,  explanation: 'One of few Republicans to support CHIPS Act. Consistent with manufacturing commitment.' },
  ]})

  const raytheon = await prisma.donor.create({ data: { name: 'Raytheon Technologies PAC', industry: 'Defense', type: 'PAC' } })
  const uaw      = await prisma.donor.create({ data: { name: 'United Auto Workers PAC', industry: 'Labor', type: 'PAC' } })

  await prisma.donorContribution.createMany({ data: [
    { donorId: raytheon.id, politicianId: whitmore.id, amount: 54000, year: 2022, cycle: '2022' },
    { donorId: uaw.id,      politicianId: whitmore.id, amount: 31000, year: 2022, cycle: '2022' },
  ]})

  await prisma.integrityScore.create({ data: { politicianId: whitmore.id, integrityScore: 81, sleazeScore: 19, alignmentRate: 0.8, donorInfluence: 0.22, flipFrequency: 0.1, partySpectrum: 0.72, integrityAxis: 0.62 } })

  // ── POLITICIAN 7: Sandra Torres ───────────────────────────────────────────
  const torres = await prisma.politician.create({
    data: {
      name: 'Sandra L. Torres',
      initials: 'ST',
      party: 'Democrat',
      level: 'State',
      country: 'USA',
      jurisdiction: 'Florida',
      role: 'Governor',
      since: 2022,
      bio: 'First-term governor whose moderate campaign positioning has given way to a centrist record that has frustrated both progressives and conservatives.',
    }
  })

  const torres_s1 = await prisma.statement.create({ data: { politicianId: torres.id, content: 'I will increase per-pupil education funding by 20% in my first term. That is a firm commitment.', issue: 'Education', source: 'Governor Debate 2022', date: new Date('2022-10-18') } })
  const torres_s2 = await prisma.statement.create({ data: { politicianId: torres.id, content: 'The Everglades is Florida\'s greatest treasure. We will restore it.', issue: 'Environment', source: 'Campaign Ad 2022', date: new Date('2022-09-05') } })
  const torres_s3 = await prisma.statement.create({ data: { politicianId: torres.id, content: 'We need to end mandatory minimums for nonviolent offenses. Our criminal justice system must be fair.', issue: 'Criminal Justice', source: 'NAACP Forum 2022', date: new Date('2022-08-22') } })
  const torres_s4 = await prisma.statement.create({ data: { politicianId: torres.id, content: 'My focus is small businesses — the backbone of Florida\'s economy. Not the big corporations.', issue: 'Business', source: 'Chamber of Commerce Speech 2022', date: new Date('2022-11-01') } })
  const torres_s5 = await prisma.statement.create({ data: { politicianId: torres.id, content: 'Every Floridian deserves an affordable place to call home.', issue: 'Housing', source: 'Campaign Website 2022', date: new Date('2022-08-01') } })

  const torres_v1 = await prisma.vote.create({ data: { politicianId: torres.id, bill: 'Florida Education Budget 2023', billId: 'FL-2023-EDU', issue: 'Education', vote: 'SIGNED — 7% increase', date: new Date('2023-06-01'), description: 'Signed budget with 7% per-pupil increase — significantly below the 20% promised.' } })
  const torres_v2 = await prisma.vote.create({ data: { politicianId: torres.id, bill: 'Everglades Restoration Funding', billId: 'FL-2023-ENV', issue: 'Environment', vote: 'SIGNED — Full funding', date: new Date('2023-04-14'), description: 'Signed full Everglades restoration funding package.' } })
  const torres_v3 = await prisma.vote.create({ data: { politicianId: torres.id, bill: 'Sentencing Reform Act', billId: 'FL-2023-SRA', issue: 'Criminal Justice', vote: 'VETOED key provisions', date: new Date('2023-05-03'), description: 'Vetoed mandatory minimum reform provisions citing law enforcement opposition.' } })
  const torres_v4 = await prisma.vote.create({ data: { politicianId: torres.id, bill: 'Enterprise Zone Corporate Tax Incentives', billId: 'FL-2023-TAX', issue: 'Business', vote: 'SIGNED', date: new Date('2023-07-01'), description: 'Signed corporate tax incentive package predominantly benefiting employers with 500+ employees.' } })
  const torres_v5 = await prisma.vote.create({ data: { politicianId: torres.id, bill: 'Live Local Act', billId: 'FL-2023-LLA', issue: 'Housing', vote: 'SIGNED', date: new Date('2023-03-29'), description: 'Signed the Live Local Act providing workforce housing incentives.' } })

  await prisma.voteStatementAlignment.createMany({ data: [
    { voteId: torres_v1.id, statementId: torres_s1.id, aligned: false, explanation: '7% increase vs. 20% firm commitment. Corporate tax incentives consumed available funds.' },
    { voteId: torres_v2.id, statementId: torres_s2.id, aligned: true,  explanation: 'Signed full funding. Consistent with campaign promise.' },
    { voteId: torres_v3.id, statementId: torres_s3.id, aligned: false, explanation: 'Vetoed mandatory minimum reform she explicitly promised during campaign.' },
    { voteId: torres_v4.id, statementId: torres_s4.id, aligned: false, explanation: 'Corporate incentive package benefiting large employers contradicts small business focus.' },
    { voteId: torres_v5.id, statementId: torres_s5.id, aligned: true,  explanation: 'Broadly consistent with stated affordability commitment.' },
  ]})

  const fl_builders = await prisma.donor.create({ data: { name: 'Florida Builders Association PAC', industry: 'Real Estate', type: 'PAC' } })
  const fl_biz      = await prisma.donor.create({ data: { name: 'Florida Business Council', industry: 'Corporate', type: 'Corporate' } })

  await prisma.donorContribution.createMany({ data: [
    { donorId: fl_builders.id, politicianId: torres.id, amount: 68000, year: 2022, cycle: '2022' },
    { donorId: fl_biz.id,      politicianId: torres.id, amount: 55000, year: 2022, cycle: '2022' },
  ]})

  await prisma.integrityScore.create({ data: { politicianId: torres.id, integrityScore: 57, sleazeScore: 43, alignmentRate: 0.4, donorInfluence: 0.55, flipFrequency: 0.3, partySpectrum: -0.38, integrityAxis: 0.14 } })

  // ── POLITICIAN 8: Thomas Brennan ──────────────────────────────────────────
  const brennan = await prisma.politician.create({
    data: {
      name: 'Thomas H. Brennan',
      initials: 'TB',
      party: 'Republican',
      level: 'Federal',
      country: 'USA',
      jurisdiction: 'Georgia',
      role: 'U.S. Senator',
      since: 2018,
      bio: 'The database\'s lowest-scoring U.S. senator, with a career record showing near-systematic contradiction between public statements and legislative actions.',
    }
  })

  const brennan_s1 = await prisma.statement.create({ data: { politicianId: brennan.id, content: 'The national debt is a moral catastrophe. I will never vote to increase it. This is non-negotiable.', issue: 'National Debt', source: 'Senate Floor Speech 2022', date: new Date('2022-01-18') } })
  const brennan_s2 = await prisma.statement.create({ data: { politicianId: brennan.id, content: 'Obamacare must be fully repealed. It is unconstitutional government overreach and I will fight to end it.', issue: 'Healthcare', source: 'Campaign Rally 2020', date: new Date('2020-10-05') } })
  const brennan_s3 = await prisma.statement.create({ data: { politicianId: brennan.id, content: 'I will never vote for any measure that raises taxes on American families or increases their tax burden.', issue: 'Taxes', source: 'Grover Norquist Pledge Signing 2018', date: new Date('2018-09-12') } })
  const brennan_s4 = await prisma.statement.create({ data: { politicianId: brennan.id, content: 'Earmarks are pure corruption. I have never requested one and I never will.', issue: 'Earmarks', source: 'Senate Press Release 2021', date: new Date('2021-01-20') } })
  const brennan_s5 = await prisma.statement.create({ data: { politicianId: brennan.id, content: 'Government is too big. I will vote to shrink it every time I have the chance.', issue: 'Small Government', source: 'Heritage Foundation Speech 2019', date: new Date('2019-06-14') } })

  const brennan_v1 = await prisma.vote.create({ data: { politicianId: brennan.id, bill: 'Omnibus Spending Bill — Added $1.7T to deficit', billId: 'H.R.2617', issue: 'National Debt', vote: 'YES', date: new Date('2022-12-23'), description: 'Voted for $1.7T omnibus after securing $340M in personal earmarks. Fourth consecutive year voting for deficit-increasing legislation.' } })
  const brennan_v2 = await prisma.vote.create({ data: { politicianId: brennan.id, bill: 'ACA Partial Repeal Vote', billId: 'S.Amdt.667', issue: 'Healthcare', vote: 'NO — Against repeal', date: new Date('2021-08-04'), description: 'Voted against ACA repeal provisions affecting hospital systems where donors have financial interests.' } })
  const brennan_v3 = await prisma.vote.create({ data: { politicianId: brennan.id, bill: 'SALT Deduction Cap Removal', billId: 'H.R.6589', issue: 'Taxes', vote: 'NO — Against tax relief', date: new Date('2022-04-06'), description: 'Voted against restoring SALT deductions that would have reduced taxes for middle-income families.' } })
  const brennan_v4 = await prisma.vote.create({ data: { politicianId: brennan.id, bill: 'Congressional Earmark Requests', billId: 'APPROP-2022', issue: 'Earmarks', vote: 'ACCEPTED $340M', date: new Date('2022-03-15'), description: 'ProPublica earmarks database confirms $340M in requests submitted under his name.' } })
  const brennan_v5 = await prisma.vote.create({ data: { politicianId: brennan.id, bill: 'Federal Agency Expansion Acts (2019–2023)', billId: 'MULTI', issue: 'Small Government', vote: 'YES — Expanded four agencies', date: new Date('2023-01-01'), description: 'Voted to expand four separate federal agencies. Each expansion benefited major donor industries.' } })

  await prisma.voteStatementAlignment.createMany({ data: [
    { voteId: brennan_v1.id, statementId: brennan_s1.id, aligned: false, explanation: 'Voted for $1.7T deficit increase. Fourth consecutive year contradicting this stated position.' },
    { voteId: brennan_v2.id, statementId: brennan_s2.id, aligned: false, explanation: 'Voted against ACA repeal. Third reversal on this issue. Donor hospital systems benefited.' },
    { voteId: brennan_v3.id, statementId: brennan_s3.id, aligned: false, explanation: 'Voted against SALT relief that would have cut taxes for middle-income families. Donor-aligned position.' },
    { voteId: brennan_v4.id, statementId: brennan_s4.id, aligned: false, explanation: 'Accepted $340M in earmarks while publicly calling earmarks pure corruption.' },
    { voteId: brennan_v5.id, statementId: brennan_s5.id, aligned: false, explanation: 'Voted to expand four federal agencies. Each aligned with major donor industry interests.' },
  ]})

  const ga_pharma  = await prisma.donor.create({ data: { name: 'Georgia Hospital & Pharma Coalition', industry: 'Healthcare', type: 'Corporate' } })
  const ga_finance = await prisma.donor.create({ data: { name: 'Atlanta Financial Group PAC', industry: 'Finance', type: 'PAC' } })
  const ga_defense = await prisma.donor.create({ data: { name: 'Gulfstream Aerospace PAC', industry: 'Defense', type: 'PAC' } })

  await prisma.donorContribution.createMany({ data: [
    { donorId: ga_pharma.id,  politicianId: brennan.id, amount: 185000, year: 2022, cycle: '2022' },
    { donorId: ga_finance.id, politicianId: brennan.id, amount: 142000, year: 2022, cycle: '2022' },
    { donorId: ga_defense.id, politicianId: brennan.id, amount: 98000,  year: 2022, cycle: '2022' },
  ]})

  await prisma.integrityScore.create({ data: { politicianId: brennan.id, integrityScore: 24, sleazeScore: 76, alignmentRate: 0.0, donorInfluence: 0.95, flipFrequency: 0.8, partySpectrum: 0.88, integrityAxis: -0.76 } })

  console.log('✅ Seeding complete!')
  console.log(`   • 8 politicians`)
  console.log(`   • 40 votes`)
  console.log(`   • 40 statements`)
  console.log(`   • 40 vote/statement alignments`)
  console.log(`   • 20 donors`)
  console.log(`   • 8 integrity scores`)
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })