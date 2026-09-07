import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchWeatherDataFromJMA } from '../pages/Weather/services/jmaApi'
import type { WeatherFullData } from '../pages/Weather/types'

export default function WeatherWidget() {
  const [data, setData] = useState<WeatherFullData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    fetchWeatherDataFromJMA(false)
      .then((res) => {
        if (isMounted) {
          setData(res)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.warn('WeatherWidget fetch warning:', err)
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-4 flex items-center justify-between border border-white/40 dark:border-white/10 animate-pulse">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⛅</span>
          <span className="text-xs opacity-60 font-bold">大阪市の天気を読み込み中...</span>
        </div>
      </div>
    )
  }

  if (!data) return null

  // 警報・注意報の件数
  const warningCount = data.warnings.length

  return (
    <Link
      to="/weather"
      className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border border-sky-500/20 hover:border-sky-500/40 bg-sky-500/5 hover:bg-sky-500/10 transition-all duration-300 shadow-sm hover:shadow-md group"
      title="クリックしてお天気・気圧・警報の詳細を見る"
    >
      {/* 左側：エリアと天気・気温 */}
      <div className="flex items-center gap-3.5">
        <div className="text-3xl p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
          {data.today.weatherEmoji}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400">
              大阪市
            </span>
            <span className="text-xs font-bold opacity-80">
              {data.today.weatherText}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            {data.current?.temperature !== null && data.current?.temperature !== undefined ? (
              <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
                {data.current.temperature}℃
              </span>
            ) : null}
            {(data.today.tempMax || data.today.tempMin) && (
              <span className="text-xs opacity-75">
                {data.today.tempMax && <span className="text-red-500 font-bold mr-1">{data.today.tempMax}℃</span>}
                {data.today.tempMin && <span className="text-blue-500 font-bold">{data.today.tempMin}℃</span>}
              </span>
            )}
            {data.current?.pressure && (
              <span className="text-[11px] opacity-60">
                🎈 {data.current.pressure}hPa
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 右側：警報ステータス ＆ 詳細リンク */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        {warningCount > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {data.warnings.map((w, idx) => (
              <span
                key={idx}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shadow-sm ${
                  w.type === 'special'
                    ? 'bg-purple-600 text-white animate-pulse'
                    : w.type === 'warning'
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/30'
                }`}
              >
                <span>⚠️</span>
                <span>{w.name}</span>
              </span>
            ))}
          </div>
        ) : (
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
            🟢 警報・注意報なし
          </span>
        )}

        <span className="text-xs font-bold text-sky-600 dark:text-sky-400 group-hover:translate-x-0.5 transition-transform flex items-center">
          詳細 →
        </span>
      </div>
    </Link>
  )
}
