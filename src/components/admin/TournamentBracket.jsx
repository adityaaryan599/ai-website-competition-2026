import { useState, useId } from 'react'
import {
  generateTournamentBracket,
  advanceMatchWinner,
  DEFAULT_COLLEGE_TEAMS,
} from '../../utils/fixtureGenerator'

export default function TournamentBracket() {
  const sportSelectId = useId()
  const numTeamsSelectId = useId()
  const formatSelectId = useId()
  const [tournamentName, setTournamentName] = useState('Campus Inter-Department Championship 2026')
  const [sport, setSport] = useState('Football')
  const [numTeams, setNumTeams] = useState(8)
  const [teamNamesText, setTeamNamesText] = useState(
    DEFAULT_COLLEGE_TEAMS.Football.slice(0, 8).join('\n')
  )

  // Generated bracket state
  const [bracket, setBracket] = useState(() =>
    generateTournamentBracket({
      tournamentName: 'Campus Inter-Department Championship 2026',
      sport: 'Football',
      numTeams: 8,
      teamNames: DEFAULT_COLLEGE_TEAMS.Football.slice(0, 8),
    })
  )

  const [champion, setChampion] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [actionNotice, setActionNotice] = useState('')

  // When sport changes, update default team names text if not heavily modified
  const handleSportChange = (newSport) => {
    setSport(newSport)
    const defaults = DEFAULT_COLLEGE_TEAMS[newSport] || DEFAULT_COLLEGE_TEAMS.Football
    setTeamNamesText(defaults.slice(0, Number(numTeams)).join('\n'))
  }

  // When team count changes, adjust teams list
  const handleTeamCountChange = (count) => {
    const num = Number(count)
    setNumTeams(num)
    const defaults = DEFAULT_COLLEGE_TEAMS[sport] || DEFAULT_COLLEGE_TEAMS.Football
    setTeamNamesText(defaults.slice(0, num).join('\n'))
  }

  // Generate Fixtures handler
  const handleGenerate = (e) => {
    e.preventDefault()
    setIsGenerating(true)
    setChampion(null)

    setTimeout(() => {
      const parsedTeams = teamNamesText
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean)

      const newBracket = generateTournamentBracket({
        tournamentName,
        sport,
        numTeams,
        teamNames: parsedTeams,
      })

      setBracket(newBracket)
      setIsGenerating(false)
      setActionNotice(`Successfully generated ${numTeams}-team tournament bracket for ${tournamentName}!`)
      setTimeout(() => setActionNotice(''), 4000)
    }, 300)
  }

  // Handle advancing a winner in a match
  const handleAdvance = (matchId, winningSlot, teamName) => {
    const { updatedRounds, champion: newChamp } = advanceMatchWinner(
      bracket.rounds,
      matchId,
      winningSlot
    )

    setBracket((prev) => ({
      ...prev,
      rounds: updatedRounds,
    }))

    if (newChamp) {
      setChampion(newChamp)
      setActionNotice(`🏆 ${newChamp.name} has won the Championship Final!`)
    } else {
      setActionNotice(`${teamName} advanced to the next round!`)
    }
    setTimeout(() => setActionNotice(''), 3500)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>{actionNotice}</span>
          </div>
          <button type="button" onClick={() => setActionNotice('')} className="text-cyan-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Generator Configuration Panel */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-5 border border-cyan-500/20 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-semibold">
                Competition Highlight
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                AI Tournament Fixture Generator
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Algorithmic single-elimination tournament bracket engine with interactive match winner progression
            </p>
          </div>

          <div className="text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 self-start sm:self-auto">
            API Readiness: <span className="text-cyan-300 font-semibold">Gemini / Claude Pluggable</span>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Tournament Name */}
            <div className="md:col-span-2">
              <label className="block text-slate-300 mb-1 font-medium">Tournament / Cup Title</label>
              <input
                type="text"
                required
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
                placeholder="e.g. Spring Varsity Cup 2026"
                className="w-full px-3 py-2 rounded-xl glass-input font-medium"
              />
            </div>

            {/* Sport Selection */}
            <div>
              <label htmlFor={sportSelectId} className="block text-slate-300 mb-1 font-medium">Sport Category</label>
              <select
                id={sportSelectId}
                value={sport}
                onChange={(e) => handleSportChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input cursor-pointer"
              >
                <option value="Football" className="bg-slate-900">Football</option>
                <option value="Basketball" className="bg-slate-900">Basketball</option>
                <option value="Cricket" className="bg-slate-900">Cricket</option>
                <option value="Volleyball" className="bg-slate-900">Volleyball</option>
                <option value="Badminton" className="bg-slate-900">Badminton</option>
                <option value="Tennis" className="bg-slate-900">Tennis</option>
              </select>
            </div>

            {/* Number of Teams */}
            <div>
              <label htmlFor={numTeamsSelectId} className="block text-slate-300 mb-1 font-medium">Team Count</label>
              <select
                id={numTeamsSelectId}
                value={numTeams}
                onChange={(e) => handleTeamCountChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input cursor-pointer"
              >
                <option value="4" className="bg-slate-900">4 Teams (Semi & Final)</option>
                <option value="8" className="bg-slate-900">8 Teams (Quarter, Semi, Final)</option>
                <option value="16" className="bg-slate-900">16 Teams (Round of 16 to Final)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Team Names List */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-medium">
                  Competing Teams (One team per line)
                </label>
                <span className="text-[11px] text-slate-400">
                  {teamNamesText.split('\n').filter(Boolean).length} / {numTeams} configured
                </span>
              </div>
              <textarea
                rows="4"
                value={teamNamesText}
                onChange={(e) => setTeamNamesText(e.target.value)}
                placeholder="Enter team names, one per line..."
                className="w-full px-3 py-2 rounded-xl glass-input font-mono text-[11px]"
              />
            </div>

            {/* Format & Trigger */}
            <div className="flex flex-col justify-between space-y-3">
              <div>
                <label htmlFor={formatSelectId} className="block text-slate-300 mb-1 font-medium">Tournament Format</label>
                <select
                  id={formatSelectId}
                  disabled
                  value="single-elimination"
                  className="w-full px-3 py-2 rounded-xl glass-input opacity-80 cursor-not-allowed"
                >
                  <option value="single-elimination" className="bg-slate-900">
                    Single Elimination (Knockout)
                  </option>
                </select>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Double elimination & Round-Robin formats supported in modular schema.
                </span>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="glass-button-primary w-full py-2.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                {isGenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Calculating Bracket...</span>
                  </>
                ) : (
                  <>
                    <span>⚡ Generate Fixtures</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Champion Banner (Appears when tournament final is completed) */}
      {champion && (
        <div className="glass-panel rounded-2xl p-6 border-2 border-amber-400/50 bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-cyan-950/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
              🏆
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 block">
                Championship Winner Crowned
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {champion.name}
              </h3>
              <p className="text-xs text-slate-300">
                Triumphant in the {bracket.tournamentName} ({bracket.sport})
              </p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs font-semibold">
            Status: Champion Verified
          </div>
        </div>
      )}

      {/* Visual Tournament Bracket Workspace */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Interactive Tournament Bracket Tree
            </h3>
            <p className="text-xs text-slate-400">
              Click &quot;Advance&quot; on any team to progress them into the next round
            </p>
          </div>

          <span className="text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
            {bracket.rounds.length} Knockout Rounds
          </span>
        </div>

        {/* Horizontal Scrollable Bracket Grid */}
        <div className="glass-panel rounded-3xl p-6 overflow-x-auto shadow-2xl">
          <div className="min-w-[850px] flex items-stretch gap-8 pb-4">
            {bracket.rounds.map((round, rIndex) => (
              <div key={round.title} className="flex-1 flex flex-col">
                {/* Round Header */}
                <div className="p-3 mb-6 rounded-xl glass-card text-center border-b border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    {round.title}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {round.matches.length} {round.matches.length === 1 ? 'Match' : 'Matches'}
                  </span>
                </div>

                {/* Matches in this Round */}
                <div className="flex-1 flex flex-col justify-around gap-6">
                  {round.matches.map((match) => {
                    const isCompleted = Boolean(match.winner)

                    return (
                      <div
                        key={match.id}
                        className={`glass-card rounded-2xl p-3.5 border transition-all relative ${
                          isCompleted
                            ? 'border-emerald-500/30 bg-slate-900/60'
                            : 'border-white/15 bg-white/[0.04] hover:border-cyan-400/40 shadow-lg'
                        }`}
                      >
                        {/* Match ID Pill */}
                        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/5 text-[10px]">
                          <span className="font-mono text-cyan-400 font-bold">{match.id}</span>
                          <span className="text-slate-400 font-medium">
                            {rIndex === bracket.rounds.length - 1 ? 'Championship' : `Game ${match.matchIndex + 1}`}
                          </span>
                        </div>

                        {/* Team 1 Slot */}
                        <div
                          className={`p-2 rounded-xl mb-1.5 flex items-center justify-between transition-all ${
                            match.winner?.id === match.team1?.id
                              ? 'bg-emerald-500/25 border border-emerald-400/40 text-white font-bold'
                              : match.team1
                              ? 'bg-white/5 border border-white/5 text-slate-200'
                              : 'bg-white/[0.02] border border-dashed border-white/10 text-slate-500 italic'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            {match.team1?.seed && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-400 font-mono">
                                #{match.team1.seed}
                              </span>
                            )}
                            <span className="text-xs truncate">
                              {match.team1 ? match.team1.name : 'Awaiting Winner'}
                            </span>
                          </div>

                          {match.team1 && !isCompleted && (
                            <button
                              type="button"
                              onClick={() => handleAdvance(match.id, 'team1', match.team1.name)}
                              className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-400/30 transition shrink-0 ml-1"
                              title="Advance this team"
                            >
                              Advance
                            </button>
                          )}

                          {match.winner?.id === match.team1?.id && (
                            <span className="text-emerald-400 text-xs shrink-0">✓ Won</span>
                          )}
                        </div>

                        {/* VS Divider */}
                        <div className="text-center text-[9px] font-bold text-slate-500 my-0.5 uppercase tracking-widest">
                          vs
                        </div>

                        {/* Team 2 Slot */}
                        <div
                          className={`p-2 rounded-xl flex items-center justify-between transition-all ${
                            match.winner?.id === match.team2?.id
                              ? 'bg-emerald-500/25 border border-emerald-400/40 text-white font-bold'
                              : match.team2
                              ? 'bg-white/5 border border-white/5 text-slate-200'
                              : 'bg-white/[0.02] border border-dashed border-white/10 text-slate-500 italic'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            {match.team2?.seed && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-400 font-mono">
                                #{match.team2.seed}
                              </span>
                            )}
                            <span className="text-xs truncate">
                              {match.team2 ? match.team2.name : 'Awaiting Winner'}
                            </span>
                          </div>

                          {match.team2 && !isCompleted && (
                            <button
                              type="button"
                              onClick={() => handleAdvance(match.id, 'team2', match.team2.name)}
                              className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-400/30 transition shrink-0 ml-1"
                              title="Advance this team"
                            >
                              Advance
                            </button>
                          )}

                          {match.winner?.id === match.team2?.id && (
                            <span className="text-emerald-400 text-xs shrink-0">✓ Won</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Tournament Intelligence & Scheduling Insights */}
      {bracket.aiInsights && (
        <div className="glass-panel rounded-2xl p-5 space-y-3 border border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              AI Scheduling & Fixture Analytics
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-white/5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Pairing Logic</span>
              <p className="text-slate-300">{bracket.aiInsights.summary}</p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Projected Finalists</span>
              <p className="text-white font-semibold">
                {bracket.aiInsights.topContenders?.join(' vs ') || 'TBD'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Turf & Facility Tip</span>
              <p className="text-slate-300">{bracket.aiInsights.schedulingRecommendation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
