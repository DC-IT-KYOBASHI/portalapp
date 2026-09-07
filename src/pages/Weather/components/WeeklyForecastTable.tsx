import type { WeeklyForecastItem, DailyForecast } from '../types'

interface Props {
  today: DailyForecast
  tomorrow: DailyForecast | null
  weekly: WeeklyForecastItem[]
}

export default function WeeklyForecastTable({ today, tomorrow, weekly }: Props) {
  return (
    <div className="space-y-6">
      {/* 今日・明日の時間帯別降水確率 */}
      <div className="glass-panel p-5 rounded-3xl border border-white/40 dark:border-white/10 shadow-md">
        <h3 className="font-bold text-base mb-4 flex items-center gap-2">
          <span>⏱️</span>
          <span>今日・明日の降水確率と詳細</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 今日 */}
          <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold">今日 ({today.date})</span>
              <span className="text-lg">{today.weatherEmoji} {today.weatherText}</span>
            </div>
            
            {today.pops.length > 0 ? (
              <div className="grid grid-cols-4 gap-2 text-center mt-3 pt-3 border-t border-black/5 dark:border-white/10">
                {today.pops.map((slot, idx) => (
                  <div key={idx} className="bg-white/60 dark:bg-black/20 p-2 rounded-xl">
                    <div className="text-[11px] opacity-60 font-semibold">{slot.timeLabel}</div>
                    <div className="text-sm font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
                      {slot.pop}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs opacity-60 mt-2">時間帯別降水確率は発表されていません</div>
            )}
          </div>

          {/* 明日 */}
          {tomorrow && (
            <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold">明日 ({tomorrow.date})</span>
                <span className="text-lg">{tomorrow.weatherEmoji} {tomorrow.weatherText}</span>
              </div>
              
              {/* 気温表示 */}
              {(tomorrow.tempMax || tomorrow.tempMin) && (
                <div className="text-xs font-bold mb-2">
                  {tomorrow.tempMax && <span className="text-red-500 mr-2">予想最高 {tomorrow.tempMax}℃</span>}
                  {tomorrow.tempMin && <span className="text-blue-500">予想最低 {tomorrow.tempMin}℃</span>}
                </div>
              )}

              {/* 明日の時間帯別降水確率 */}
              {tomorrow.pops.length > 0 && (
                <div className="grid grid-cols-4 gap-2 text-center my-2 pt-2 border-t border-black/5 dark:border-white/10">
                  {tomorrow.pops.map((slot, idx) => (
                    <div key={idx} className="bg-white/60 dark:bg-black/20 p-1.5 rounded-xl">
                      <div className="text-[10px] opacity-60 font-semibold">{slot.timeLabel}</div>
                      <div className="text-xs font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
                        {slot.pop}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-2 pt-2 border-t border-black/5 dark:border-white/10 text-xs opacity-75 space-y-0.5">
                {tomorrow.wind && <div>🌬️ 風: {tomorrow.wind}</div>}
                {tomorrow.wave && <div>🌊 波: {tomorrow.wave}</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 週間天気予報（7日間） */}
      <div className="glass-panel p-5 rounded-3xl border border-white/40 dark:border-white/10 shadow-md">
        <h3 className="font-bold text-base mb-4 flex items-center gap-2">
          <span>📅</span>
          <span>週間天気予報（大阪府・大阪市）</span>
        </h3>

        {weekly.length === 0 ? (
          <div className="text-center py-6 text-sm opacity-60">週間予報データを読み込み中...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {weekly.map((item, idx) => {
              const isSunday = item.dayOfWeek === '日'
              const isSaturday = item.dayOfWeek === '土'

              return (
                <div
                  key={idx}
                  className="bg-black/5 dark:bg-white/5 p-3 rounded-2xl flex flex-col items-center text-center transition-all hover:bg-black/10 dark:hover:bg-white/10"
                >
                  {/* 日付・曜日 */}
                  <div className="text-xs font-bold mb-1">
                    <span>{item.date}</span>
                    <span
                      className={`ml-1 ${
                        isSunday
                          ? 'text-red-500'
                          : isSaturday
                          ? 'text-blue-500'
                          : 'opacity-70'
                      }`}
                    >
                      ({item.dayOfWeek})
                    </span>
                  </div>

                  {/* 天気アイコン */}
                  <div className="text-3xl my-2">{item.weatherEmoji}</div>

                  {/* 天気名 */}
                  <div className="text-xs font-semibold truncate w-full mb-2 opacity-80" title={item.weatherText}>
                    {item.weatherText}
                  </div>

                  {/* 気温 */}
                  <div className="w-full flex justify-center gap-1.5 text-xs font-bold my-1">
                    <span className="text-red-500">{item.tempMax}</span>
                    <span className="opacity-30">/</span>
                    <span className="text-blue-500">{item.tempMin}</span>
                  </div>

                  {/* 降水確率 */}
                  <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full mt-1 border border-blue-500/20">
                    ☂️ {item.pop}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
