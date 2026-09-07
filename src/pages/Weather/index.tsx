import { useState, useEffect } from 'react'
import { fetchWeatherDataFromJMA } from './services/jmaApi'
import type { WeatherFullData } from './types'
import CurrentWeatherCard from './components/CurrentWeatherCard'
import WarningAlertBanner from './components/WarningAlertBanner'
import WeeklyForecastTable from './components/WeeklyForecastTable'
import BackToHomeButton from '../../components/BackToHomeButton'

export default function Weather() {
  const [data, setData] = useState<WeatherFullData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadData = async (force = false) => {
    try {
      if (force) {
        setIsRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)
      const res = await fetchWeatherDataFromJMA(force)
      setData(res)
    } catch (err: any) {
      setError(err.message || '天気情報の取得に失敗しました。')
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadData(false)
  }, [])

  // キャッシュ情報（最終取得時刻 & 次回自動更新目安）
  const formattedLastUpdated = data?.lastUpdated
    ? new Date(data.lastUpdated).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    : ''

  const nextUpdateTime = data?.lastUpdated
    ? new Date(data.lastUpdated + 30 * 60 * 1000).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <div className="w-full space-y-6 animation-fade-in">
      {/* ページヘッダー */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <BackToHomeButton />
          <h1 className="text-2xl font-bold flex items-center gap-2.5">
            <span className="text-3xl">⛅</span>
            <span>大阪市 お天気・気圧・防災情報</span>
          </h1>
        </div>

        {/* 更新ボタン & キャッシュステータス */}
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={() => loadData(true)}
            disabled={loading || isRefreshing}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <span className={isRefreshing ? 'animate-spin inline-block' : ''}>🔄</span>
            <span>{isRefreshing ? '気象庁から取得中...' : 'データを更新 (30分毎)'}</span>
          </button>
          {formattedLastUpdated && (
            <span className="text-[11px] opacity-60">
              最終取得: {formattedLastUpdated} (次回目安: {nextUpdateTime})
            </span>
          )}
        </div>
      </div>

      {/* ローディング状態 */}
      {loading && !data && (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
          <div className="animate-spin text-4xl inline-block">⏳</div>
          <p className="font-bold text-base opacity-80">気象庁より最新の天気・気圧・警報データを取得しています...</p>
        </div>
      )}

      {/* エラー状態 */}
      {error && !data && (
        <div className="glass-panel p-8 rounded-3xl border border-red-500/20 bg-red-500/5 text-center space-y-4">
          <div className="text-4xl">⚠️</div>
          <p className="text-sm text-red-600 dark:text-red-400 font-bold">{error}</p>
          <button
            onClick={() => loadData(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-red-700 transition-all"
          >
            再試行する
          </button>
        </div>
      )}

      {/* メイン表示コンテンツ */}
      {data && (
        <div className="space-y-6">
          {/* 1. 現在の実況＆今日の天気・気圧 */}
          <CurrentWeatherCard
            current={data.current}
            today={data.today}
            cityName={data.cityName}
          />

          {/* 2. 警報・注意報バナー */}
          <WarningAlertBanner
            warnings={data.warnings}
            headlineText={data.warningHeadlineText}
          />

          {/* 3. 今日・明日の降水確率 ＆ 週間天気予報 */}
          <WeeklyForecastTable
            today={data.today}
            tomorrow={data.tomorrow}
            weekly={data.weekly}
          />

          {/* 4. 大阪府 気象概況（気象台発表） */}
          {data.overviewText && (
            <div className="glass-panel p-5 rounded-3xl border border-white/40 dark:border-white/10 shadow-md">
              <h3 className="font-bold text-base mb-3 flex items-center gap-2">
                <span>📜</span>
                <span>大阪府 気象概況（大阪管区気象台 発表）</span>
              </h3>
              <p className="text-xs leading-relaxed opacity-85 whitespace-pre-line bg-black/5 dark:bg-white/5 p-4 rounded-2xl">
                {data.overviewText}
              </p>
            </div>
          )}

          {/* 出典クレジット */}
          <div className="text-center pt-4 text-xs opacity-50 space-y-1">
            <p>データ出典: <a href="https://www.jma.go.jp/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-100">気象庁公式オープンデータ (JMA)</a></p>
            <p>※ サーバー負荷軽減のため、30分間に1回のペースで自動キャッシュ更新を行っています。</p>
          </div>
        </div>
      )}
    </div>
  )
}
