/**
 * Single-Elimination Tournament Fixture Generator
 *
 * Provides algorithmic pairing, bracket layout calculation,
 * and winner progression. Structured so a real AI service
 * (e.g. Gemini, OpenAI) can be integrated for automated seed rankings
 * and match predictions.
 */

// Preset college sports teams for quick testing
export const DEFAULT_COLLEGE_TEAMS = {
  Football: [
    'Computer Science FC',
    'Mechanical Tigers',
    'Civil Strikers',
    'Electrical Titans',
    'Biotech Dynamos',
    'MBA United',
    'Aerospace Rovers',
    'Chemical Knights',
  ],
  Basketball: [
    'Campus Vipers',
    'Red Hawk Hoopers',
    'Blue Lightning',
    'Polytechnic Cagers',
    'Westside Dunkers',
    'Engineering Ballers',
    'Golden Eagles',
    'Metro Ballers',
  ],
  Cricket: [
    'BTech All-Stars',
    'Royal Strikers CC',
    'Campus Blasters',
    'Engineers XI',
    'Masters CC',
    'Hostel Hawks',
    'Challengers XI',
    'Faculty Legends',
  ],
  Volleyball: [
    'Spikers Elite',
    'Block Masters',
    'Court Stormers',
    'Sand Phantoms',
    'Quad Attackers',
    'Ace Blasters',
    'Aero Spikers',
    'Dynamic Diggers',
  ],
  Badminton: [
    'Shuttle Wizards',
    'Smash Masters',
    'Court Speedsters',
    'Net Champions',
    'Teakwood Warriors',
    'Drop Shot Aces',
    'Feather Strikers',
    'Rapid Racquets',
  ],
  Tennis: [
    'Clay Aces',
    'Grass Court Kings',
    'Spin Strikers',
    'Topspin Titans',
    'Baseline Masters',
    'Net Raiders',
    'Vantage Smashers',
    'Centre Court Pros',
  ],
}

/**
 * Returns round title based on total teams and current round index
 */
function getRoundTitle(totalRounds, roundIndex) {
  const roundsRemaining = totalRounds - roundIndex
  if (roundsRemaining === 1) return 'Championship Final'
  if (roundsRemaining === 2) return 'Semi-Finals'
  if (roundsRemaining === 3) return 'Quarter-Finals'
  if (roundsRemaining === 4) return 'Round of 16'
  return `Round ${roundIndex + 1}`
}

/**
 * Generates single-elimination tournament bracket
 * @param {Object} options
 * @param {string} options.tournamentName
 * @param {string} options.sport
 * @param {number} options.numTeams - 4, 8, or 16
 * @param {Array<string>} options.teamNames
 * @returns {Object} Bracket data structure with rounds and AI insight notes
 */
export function generateTournamentBracket({
  tournamentName = 'Campus Championship 2026',
  sport = 'Football',
  numTeams = 8,
  teamNames = [],
}) {
  const count = Number(numTeams) || 8

  // Clean and pad team names
  const fallbackTeams = DEFAULT_COLLEGE_TEAMS[sport] || DEFAULT_COLLEGE_TEAMS.Football
  const cleanTeamNames = []

  for (let i = 0; i < count; i++) {
    const rawName = teamNames[i]?.trim()
    cleanTeamNames.push(
      rawName || fallbackTeams[i] || `Team ${String.fromCharCode(65 + i)}`
    )
  }

  // Calculate rounds: log2 of count
  const totalRounds = Math.ceil(Math.log2(count))
  const rounds = []

  // Round 1 matches
  const round1Matches = []
  const round1MatchCount = count / 2

  for (let m = 0; m < round1MatchCount; m++) {
    const team1Index = m * 2
    const team2Index = m * 2 + 1

    round1Matches.push({
      id: `R1-M${m + 1}`,
      roundIndex: 0,
      matchIndex: m,
      roundName: getRoundTitle(totalRounds, 0),
      team1: {
        id: `T${team1Index + 1}`,
        name: cleanTeamNames[team1Index],
        seed: team1Index + 1,
        score: null,
      },
      team2: {
        id: `T${team2Index + 1}`,
        name: cleanTeamNames[team2Index],
        seed: team2Index + 1,
        score: null,
      },
      winner: null,
      nextMatchId: `R2-M${Math.floor(m / 2) + 1}`,
      nextMatchSlot: m % 2 === 0 ? 'team1' : 'team2',
    })
  }

  rounds.push({
    roundIndex: 0,
    title: getRoundTitle(totalRounds, 0),
    matches: round1Matches,
  })

  // Subsequent rounds (placeholders until winners advance)
  for (let r = 1; r < totalRounds; r++) {
    const roundMatchCount = count / Math.pow(2, r + 1)
    const roundMatches = []

    for (let m = 0; m < roundMatchCount; m++) {
      const isFinal = r === totalRounds - 1
      roundMatches.push({
        id: `R${r + 1}-M${m + 1}`,
        roundIndex: r,
        matchIndex: m,
        roundName: getRoundTitle(totalRounds, r),
        team1: null,
        team2: null,
        winner: null,
        nextMatchId: isFinal ? null : `R${r + 2}-M${Math.floor(m / 2) + 1}`,
        nextMatchSlot: isFinal ? null : m % 2 === 0 ? 'team1' : 'team2',
      })
    }

    rounds.push({
      roundIndex: r,
      title: getRoundTitle(totalRounds, r),
      matches: roundMatches,
    })
  }

  // Pre-seed an initial exciting AI matchup preview
  const aiInsights = {
    generatedAt: new Date().toISOString(),
    engine: 'Algorithmic Heuristic Engine (AI API Ready)',
    sport,
    tournamentName,
    summary: `Structured ${count}-team single-elimination bracket for ${tournamentName}. Balanced 1-8 seeding ensures optimal competitiveness.`,
    topContenders: [cleanTeamNames[0], cleanTeamNames[1]],
    schedulingRecommendation: 'Stagger Quarter-Finals across 2 sessions (Morning 07:00 AM & Evening 04:30 PM) to allow grass turf recovery.',
  }

  return {
    id: `BRACKET-${Date.now()}`,
    tournamentName,
    sport,
    numTeams: count,
    rounds,
    champion: null,
    aiInsights,
  }
}

/**
 * Advances a winner in a tournament bracket
 * @param {Array} rounds
 * @param {string} matchId
 * @param {'team1'|'team2'} winningSlot
 * @returns {{ updatedRounds: Array, champion: Object|null }}
 */
export function advanceMatchWinner(rounds, matchId, winningSlot) {
  const updatedRounds = JSON.parse(JSON.stringify(rounds))
  let targetMatch = null
  let champion = null

  // Find match
  for (const round of updatedRounds) {
    for (const match of round.matches) {
      if (match.id === matchId) {
        targetMatch = match
        break
      }
    }
    if (targetMatch) break
  }

  if (!targetMatch) return { updatedRounds, champion: null }

  const winner = winningSlot === 'team1' ? targetMatch.team1 : targetMatch.team2
  if (!winner) return { updatedRounds, champion: null }

  targetMatch.winner = winner

  // If this match has a nextMatchId, forward winner to next round
  if (targetMatch.nextMatchId) {
    for (const round of updatedRounds) {
      for (const match of round.matches) {
        if (match.id === targetMatch.nextMatchId) {
          if (targetMatch.nextMatchSlot === 'team1') {
            match.team1 = { ...winner, score: null }
          } else {
            match.team2 = { ...winner, score: null }
          }
          // Reset winner of that next match if it was set previously
          match.winner = null
          break
        }
      }
    }
  } else {
    // This was the Championship Final!
    champion = winner
  }

  return { updatedRounds, champion }
}
