import type { CurrentObservation, DailyForecast } from '../types'

interface Props {
  current: CurrentObservation | null
  today: DailyForecast
  cityName: string
}

export default function CurrentWeatherCard({ current, today, cityName }: Props) {
  // 気圧状態に応じたバッジと説明
  const getPressureBadge = (status: CurrentObservation['pressureStatus'] | undefined) => {
    switch (status) {
      case 'high':
        return {
          label: '高気圧 (良好)',
          color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
          desc: '気圧が高く安定しています。',
        }
      case 'normal':
        return {
          label: '平常 (安定)',
          color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          desc: '標準的な気圧水準です。',
        }
      case 'low':
        return {
          label: 'やや低気圧 (注意)',
          color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          desc: '気圧が低下傾向です。頭痛や倦怠感にご注意ください。',
        }
      case 'very_low':
        return {
          label: '低気圧 (警戒)',
          color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse',
          desc: '低気圧が通過中です。気象病や偏頭痛等の体調変化に注意しましょう。',
        }
      default:
        return {
          label: '計測中',
          color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
          desc: '',
        }
    }
  }

  const pressureInfo = getPressureBadge(current?.pressureStatus)

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/40 dark:border-white/10 shadow-lg relative overflow-hidden">
      {/* 背景の装飾光 */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              エリア
            </span>
            <h2 className="text-xl font-bold">{cityName}</h2>
          </div>
          <p className="text-xs opacity-60">
            {today.date} {current?.timestamp ? `(${current.timestamp} アメダス観測実況)` : '予報'}
          </p>
        </div>

        {/* 気圧警戒ステータス */}
        {current?.pressure && (
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${pressureInfo.color}`}>
            <span>🎈 気圧:</span>
            <span>{current.pressure} hPa</span>
            <span className="opacity-80">({pressureInfo.label})</span>
          </div>
        )}
      </div>

      {/* メイン数値エリア */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 天気 */}
        <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl flex items-center gap-4">
          <div className="text-5xl">{today.weatherEmoji}</div>
          <div>
            <div className="text-xs opacity-60 font-semibold">今日の天気</div>
            <div className="text-lg font-bold leading-tight mt-0.5">{today.weatherText}</div>
          </div>
        </div>

        {/* 気温 */}
        <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl flex flex-col justify-center">
          <div className="text-xs opacity-60 font-semibold">気温 (実況 / 予想)</div>
          <div className="flex items-baseline gap-2 mt-1">
            {current?.temperature !== null && current?.temperature !== undefined ? (
              <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                {current.temperature}℃
              </span>
            ) : (
              <span className="text-2xl font-bold">--</span>
            )}
            {(today.tempMax || today.tempMin) && (
              <span className="text-xs opacity-80 font-bold">
                {today.tempMax && <span className="text-red-500 mr-1.5">最高 {today.tempMax}℃</span>}
                {today.tempMin && <span className="text-blue-500">最低 {today.tempMin}℃</span>}
              </span>
            )}
          </div>
        </div>

        {/* 気圧 & 湿度 */}
        <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl flex flex-col justify-center">
          <div className="text-xs opacity-60 font-semibold">気圧 & 湿度</div>
          <div className="mt-1 flex items-baseline justify-between text-sm">
            <span>
              気圧: <strong className="text-base">{current?.pressure ? `${current.pressure} hPa` : '--'}</strong>
            </span>
            <span>
              湿度: <strong className="text-base">{current?.humidity ? `${current.humidity}%` : '--'}</strong>
            </span>
          </div>
        </div>

        {/* 風速 & 風向 */}
        <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl flex flex-col justify-center">
          <div className="text-xs opacity-60 font-semibold">風向 & 風速</div>
          <div className="mt-1 text-sm font-bold flex items-center justify-between">
            <span>{current?.windDirectionText || '静穏'}</span>
            <span className="text-base text-slate-700 dark:text-slate-300">
              {current?.windSpeed !== null && current?.windSpeed !== undefined ? `${current.windSpeed} m/s` : '--'}
            </span>
          </div>
          {today.wind && (
            <div className="text-[11px] opacity-60 truncate mt-0.5">予報: {today.wind}</div>
          )}
        </div>
      </div>

      {/* 気圧健康アドバイス */}
      {current?.pressureStatus && current.pressureStatus !== 'normal' && (
        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-800 dark:text-amber-300 space-y-1">
          <div className="flex items-center gap-2">
            <span>💡</span>
            <span><strong>気圧と体調メモ:</strong> {pressureInfo.desc} こまめな水分補給や適度な休憩を心がけましょう。</span>
          </div>
          <p className="text-[10px] opacity-70 pl-6">
            ※ アメダス（大阪観測所）で観測されたリアルタイムの海面気圧値（標準 1013.25hPa）を元に、気象病（頭痛・倦怠感等）の予防目安として自動判定しています。
          </p>
        </div>
      )}
    </div>
  )
}
