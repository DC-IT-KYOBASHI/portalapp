import type { WeatherWarningItem } from '../types'

interface Props {
  warnings: WeatherWarningItem[]
}

export default function WarningAlertBanner({ warnings }: Props) {
  const specials = warnings.filter((w) => w.type === 'special')
  const alerts = warnings.filter((w) => w.type === 'warning')
  const advisories = warnings.filter((w) => w.type === 'advisory')

  const hasAnyWarning = warnings.length > 0

  return (
    <div className="glass-panel p-5 rounded-3xl border border-white/40 dark:border-white/10 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          <h3 className="font-bold text-base">大阪市 気象警報・注意報 発表状況</h3>
        </div>
        <span className="text-xs opacity-60">気象庁 発表</span>
      </div>

      {!hasAnyWarning ? (
        <div className="flex items-center gap-3 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-700 dark:text-emerald-300">
          <span className="text-2xl">🟢</span>
          <div>
            <div className="text-sm font-bold">現在、大阪市に発表されている警報・注意報はありません。</div>
            <div className="text-xs opacity-80 mt-0.5">安全な気象状況です。</div>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {/* 特別警報 */}
          {specials.length > 0 && (
            <div className="p-3 bg-purple-500/15 border border-purple-500/40 rounded-2xl">
              <div className="text-xs font-bold text-purple-700 dark:text-purple-300 mb-1.5 flex items-center gap-1.5">
                <span className="animate-ping w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
                <span>【特別警報】ただちに身の安全を確保してください</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {specials.map((w, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-xs font-extrabold shadow-sm"
                  >
                    {w.name} ({w.status})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 警報 */}
          {alerts.length > 0 && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
              <div className="text-xs font-bold text-rose-700 dark:text-rose-300 mb-1.5">
                🔴 【警報】重大な災害に警戒してください
              </div>
              <div className="flex flex-wrap gap-2">
                {alerts.map((w, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-rose-500 text-white text-xs font-bold shadow-sm"
                  >
                    {w.name} ({w.status})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 注意報 */}
          {advisories.length > 0 && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
              <div className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-1.5">
                🟡 【注意報】気象災害にご注意ください
              </div>
              <div className="flex flex-wrap gap-1.5">
                {advisories.map((w, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/30 text-xs font-bold"
                  >
                    {w.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
