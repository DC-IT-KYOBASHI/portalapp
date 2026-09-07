/**
 * 気象庁APIおよびアプリ内で扱う天気・気圧・警報データの型定義
 */

// 発令中の警報・注意報
export interface WeatherWarningItem {
  code: string
  name: string
  type: 'special' | 'warning' | 'advisory' // 特別警報 / 警報 / 注意報
  status: string // 発表 / 継続
}

// 降水確率（時間帯別）
export interface PopTimeSlot {
  timeLabel: string
  pop: string // 例: "10%"
}

// 今日の詳細予報
export interface DailyForecast {
  date: string
  weatherText: string
  weatherCode: string
  weatherEmoji: string
  wind: string
  wave: string
  tempMin: string | null
  tempMax: string | null
  pops: PopTimeSlot[]
}

// 週間予報（1日分）
export interface WeeklyForecastItem {
  date: string
  dayOfWeek: string
  weatherCode: string
  weatherEmoji: string
  weatherText: string
  tempMin: string
  tempMax: string
  pop: string
  reliability?: string // 信頼度 A / B / C
}

// アメダス実況（大阪 62078）
export interface CurrentObservation {
  timestamp: string // 観測日時
  temperature: number | null // 気温 (℃)
  pressure: number | null // 現地気圧 or 海面気圧 (hPa)
  pressureStatus: 'high' | 'normal' | 'low' | 'very_low' // 気圧状態（気象病目安）
  humidity: number | null // 湿度 (%)
  windSpeed: number | null // 風速 (m/s)
  windDirectionText: string // 風向 (南西など)
}

// 天気総合データ（キャッシュ対象）
export interface WeatherFullData {
  lastUpdated: number // キャッシュ用タイムスタンプ (Date.now())
  reportDatetime: string // 気象庁発表日時
  cityName: string // "大阪市"
  current: CurrentObservation | null
  today: DailyForecast
  tomorrow: DailyForecast | null
  weekly: WeeklyForecastItem[]
  warnings: WeatherWarningItem[]
  hasWarnings: boolean
}
