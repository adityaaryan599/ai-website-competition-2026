export default function AdminStatCard({
  title,
  value,
  subtitle,
  badge,
  badgeColor = 'cyan',
  icon,
  onClick,
}) {
  const badgeStyles = {
    cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    blue: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    red: 'bg-red-500/15 text-red-300 border-red-500/30',
  }

  const iconBgStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
  }

  return (
    <div
      onClick={onClick}
      className={`glass-card-interactive rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group ${
        onClick ? 'cursor-pointer hover:border-cyan-400/40' : ''
      }`}
    >
      {/* Top light reflection */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Header with Title & Icon */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            {value}
          </div>
        </div>

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner ${
            iconBgStyles[badgeColor] || iconBgStyles.cyan
          }`}
        >
          {icon}
        </div>
      </div>

      {/* Footer / Subtitle & Badge */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
        <span className="text-slate-400 truncate">{subtitle}</span>
        {badge && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              badgeStyles[badgeColor] || badgeStyles.cyan
            }`}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  )
}
