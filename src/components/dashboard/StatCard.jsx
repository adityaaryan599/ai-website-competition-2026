export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  badgeText,
  badgeType = 'neutral',
  onClick,
}) {
  const badgeColors = {
    neutral: 'bg-white/[0.08] text-slate-300 border-white/15',
    primary: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    success: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    warning: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
  }

  return (
    <div
      onClick={onClick}
      className={`glass-card-interactive rounded-2xl p-5 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-cyan-400/40' : ''
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            {title}
          </span>
          {icon && (
            <div className="w-9 h-9 rounded-xl bg-white/[0.08] text-cyan-300 border border-white/15 flex items-center justify-center shadow-inner backdrop-blur-md">
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <div className="text-3xl font-extrabold text-white tracking-tight">{value}</div>
          {badgeText && (
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-sm ${
                badgeColors[badgeType] || badgeColors.neutral
              }`}
            >
              {badgeText}
            </span>
          )}
        </div>
      </div>

      {subtitle && <p className="text-[11px] text-slate-400 mt-2 font-medium">{subtitle}</p>}
    </div>
  )
}
