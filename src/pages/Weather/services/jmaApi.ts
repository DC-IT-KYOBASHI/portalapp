import type {
  WeatherFullData,
  DailyForecast,
  WeeklyForecastItem,
  WeatherWarningItem,
  CurrentObservation,
  PopTimeSlot,
} from '../types'

/**
 * 気象庁 (JMA) API 設定および定数
 */
export const JMA_CONFIG = {
  BASE_URL: 'https://www.jma.go.jp/bosai',
  AREA: {
    OSAKA_PREF: '270000', // 大阪府（予報・警報共通）
    OSAKA_CITY: '2710000', // 大阪市（市町村細分）
    AMEDAS_OSAKA: '62078', // アメダス大阪観測所（大阪市中央区大手前）
  },
  CACHE: {
    KEY: 'jma_weather_osaka_cache_v4',
    TTL_MS: 30 * 60 * 1000, // 30分キャッシュ
  },
  PRESSURE_THRESHOLDS: {
    HIGH: 1016, // 高気圧
    NORMAL: 1008, // 平常
    LOW: 1000, // 低気圧（注意）
    // 1000未満: 警戒
  },
} as const

/**
 * 天気コード（Telops Code）から絵文字と簡易テキストを判定
 */
export function getWeatherEmoji(code: string): { emoji: string; shortText: string } {
  const c = code.trim()
  const first = c.charAt(0)

  // 晴れ系 (100番台)
  if (first === '1') {
    if (c.includes('2') || c.includes('3')) return { emoji: '⛅', shortText: '晴れのち曇り/雨' }
    return { emoji: '☀️', shortText: '晴れ' }
  }
  // 曇り系 (200番台)
  if (first === '2') {
    if (c.includes('1')) return { emoji: '🌤️', shortText: '曇りのち晴れ' }
    if (c.includes('3') || c.includes('4')) return { emoji: '🌧️', shortText: 'くもり時々雨' }
    return { emoji: '☁️', shortText: 'くもり' }
  }
  // 雨系 (300番台)
  if (first === '3') {
    if (c.includes('4') || c.includes('雷')) return { emoji: '⛈️', shortText: '雷雨' }
    if (c.includes('1')) return { emoji: '🌦️', shortText: '雨のち晴れ' }
    if (c.includes('2')) return { emoji: '🌧️', shortText: '雨時々くもり' }
    return { emoji: '🌧️', shortText: '雨' }
  }
  // 雪系 (400番台)
  if (first === '4') {
    return { emoji: '☃️', shortText: '雪' }
  }

  return { emoji: '⛅', shortText: 'くもり時々晴れ' }
}

/**
 * 警報・注意報コードから名称と種別を取得
 */
export function parseWarningCode(code: string): { name: string; type: 'special' | 'warning' | 'advisory' } {
  const codeNum = parseInt(code, 10)
  
  // 特別警報 (30番台)
  if (codeNum >= 30) {
    const specialNames: Record<string, string> = {
      '32': '大雪特別警報',
      '33': '大雨特別警報',
      '35': '暴風特別警報',
      '36': '波浪特別警報',
      '37': '高潮特別警報',
    }
    return { name: specialNames[code] || '特別警報', type: 'special' }
  }

  // 警報 (02〜08)
  const warningNames: Record<string, string> = {
    '02': '暴風雪警報',
    '03': '大雨警報',
    '04': '洪水警報',
    '05': '暴風警報',
    '06': '大雪警報',
    '07': '波浪警報',
    '08': '高潮警報',
  }
  if (warningNames[code]) {
    return { name: warningNames[code], type: 'warning' }
  }

  // 注意報 (10〜26)
  const advisoryNames: Record<string, string> = {
    '10': '大雨注意報',
    '12': '大雪注意報',
    '13': '風雪注意報',
    '14': '雷注意報',
    '15': '強風注意報',
    '16': '波浪注意報',
    '17': '融雪注意報',
    '18': '洪水注意報',
    '19': '高潮注意報',
    '20': '濃霧注意報',
    '21': '乾燥注意報',
    '22': 'なだれ注意報',
    '23': '低温注意報',
    '24': '霜注意報',
    '25': '着氷注意報',
    '26': '着雪注意報',
  }
  return { name: advisoryNames[code] || `注意報(${code})`, type: 'advisory' }
}

/**
 * 風向番号 (0-16) を日本語テキストに変換
 */
function getWindDirectionText(dirIndex: number | undefined): string {
  if (dirIndex === undefined || dirIndex === 0) return '静穏'
  const directions = [
    '静穏', '北北東', '北東', '東北東', '東', '東南東', '南東', '南南東',
    '南', '南南西', '南西', '西南西', '西', '西北西', '北西', '北北西', '北'
  ]
  return directions[dirIndex] || '北'
}

/**
 * 気圧値からステータス判定（気象病・体調管理目安）
 */
function getPressureStatus(hPa: number | null): 'high' | 'normal' | 'low' | 'very_low' {
  if (hPa === null) return 'normal'
  if (hPa >= JMA_CONFIG.PRESSURE_THRESHOLDS.HIGH) return 'high'
  if (hPa >= JMA_CONFIG.PRESSURE_THRESHOLDS.NORMAL) return 'normal'
  if (hPa >= JMA_CONFIG.PRESSURE_THRESHOLDS.LOW) return 'low'
  return 'very_low'
}

/**
 * 曜日を取得
 */
function getDayOfWeek(dateStr: string): string {
  const d = new Date(dateStr)
  const days = ['日', '月', '火', '水', '木', '金', '土']
  return days[d.getDay()] || ''
}

/**
 * 降水確率の開始時刻から「12-18時」等のラベルを生成
 */
function formatPopTimeRange(isoStr: string): string {
  const d = new Date(isoStr)
  const startH = d.getHours()
  const endH = (startH + 6) % 24
  const startStr = String(startH).padStart(2, '0')
  const endStr = String(endH === 0 ? 24 : endH).padStart(2, '0')
  return `${startStr}-${endStr}時`
}

/**
 * アメダス実況データのパース
 */
async function fetchAmedasObservation(): Promise<CurrentObservation | null> {
  try {
    const latestTimeUrl = `${JMA_CONFIG.BASE_URL}/amedas/data/latest_time.txt`
    const latestTimeRes = await fetch(latestTimeUrl)
    if (!latestTimeRes.ok) return null

    const latestTimeRaw = (await latestTimeRes.text()).trim()
    const timestampIso = new Date(latestTimeRaw)
    const y = timestampIso.getFullYear()
    const m = String(timestampIso.getMonth() + 1).padStart(2, '0')
    const d = String(timestampIso.getDate()).padStart(2, '0')
    const h = String(timestampIso.getHours()).padStart(2, '0')
    const min = String(timestampIso.getMinutes()).padStart(2, '0')
    const amedasTimeStr = `${y}${m}${d}${h}${min}00`

    const amedasMapUrl = `${JMA_CONFIG.BASE_URL}/amedas/data/map/${amedasTimeStr}.json`
    const amedasRes = await fetch(amedasMapUrl)
    if (!amedasRes.ok) return null

    const amedasMap = await amedasRes.json()
    const osakaAmedas = amedasMap[JMA_CONFIG.AREA.AMEDAS_OSAKA]
    if (!osakaAmedas) return null

    const temp = osakaAmedas.temp ? osakaAmedas.temp[0] : null
    const humidity = osakaAmedas.humidity ? osakaAmedas.humidity[0] : null
    const pressure = osakaAmedas.normalPressure
      ? osakaAmedas.normalPressure[0]
      : osakaAmedas.pressure
      ? osakaAmedas.pressure[0]
      : null
    const windSpeed = osakaAmedas.wind ? osakaAmedas.wind[0] : null
    const windDir = osakaAmedas.windDirection ? osakaAmedas.windDirection[0] : 0

    return {
      timestamp: `${h}:${min}`,
      temperature: temp,
      pressure: pressure,
      pressureStatus: getPressureStatus(pressure),
      humidity: humidity,
      windSpeed: windSpeed,
      windDirectionText: getWindDirectionText(windDir),
    }
  } catch (err) {
    console.warn('AMeDAS fetch warning:', err)
    return null
  }
}

/**
 * 予報JSON（短期予報）のパース処理
 */
function parseDailyForecast(shortForecast: any): { today: DailyForecast; tomorrow: DailyForecast | null; reportDatetime: string } {
  const reportDatetime = shortForecast.reportDatetime || new Date().toISOString()
  
  // 天気
  const weatherSeries = shortForecast.timeSeries[0]
  const osakaAreaWeather = weatherSeries.areas.find(
    (a: any) => a.area.code === JMA_CONFIG.AREA.OSAKA_PREF || a.area.name.includes('大阪')
  ) || weatherSeries.areas[0]
  
  const todayCode = osakaAreaWeather.weatherCodes?.[0] || '100'
  const todayWeatherText = osakaAreaWeather.weathers?.[0] || '晴れ'
  const todayWind = osakaAreaWeather.winds?.[0] || ''
  const todayWave = osakaAreaWeather.waves?.[0] || ''
  const todayEmoji = getWeatherEmoji(todayCode).emoji

  // 降水確率 (POP)
  const popSeries = shortForecast.timeSeries[1]
  const osakaAreaPop = popSeries
    ? popSeries.areas.find((a: any) => a.area.code === JMA_CONFIG.AREA.OSAKA_PREF || a.area.name.includes('大阪')) || popSeries.areas[0]
    : null
  const popTimeDefines: string[] = popSeries?.timeDefines || []
  
  const todayPops: PopTimeSlot[] = []
  const tomorrowPops: PopTimeSlot[] = []

  if (osakaAreaPop && osakaAreaPop.pops) {
    const now = new Date()
    const todayDateStr = now.toISOString().slice(0, 10)

    osakaAreaPop.pops.forEach((p: string, idx: number) => {
      const timeIso = popTimeDefines[idx]
      if (!timeIso) return
      const label = formatPopTimeRange(timeIso)
      const itemDateStr = new Date(timeIso).toISOString().slice(0, 10)

      if (itemDateStr === todayDateStr) {
        todayPops.push({ timeLabel: label, pop: `${p}%` })
      } else {
        tomorrowPops.push({ timeLabel: label, pop: `${p}%` })
      }
    })
  }

  // 気温
  const tempSeries = shortForecast.timeSeries[2]
  const osakaAreaTemp = tempSeries
    ? tempSeries.areas.find((a: any) => a.area.code === JMA_CONFIG.AREA.OSAKA_PREF || a.area.name.includes('大阪') || a.area.code === JMA_CONFIG.AREA.AMEDAS_OSAKA) || tempSeries.areas[0]
    : null
  const tempTimeDefines: string[] = tempSeries?.timeDefines || []
  
  let todayTempMax: string | null = null
  let todayTempMin: string | null = null
  let tomorrowTempMin: string | null = null
  let tomorrowTempMax: string | null = null

  if (osakaAreaTemp && osakaAreaTemp.temps && tempTimeDefines.length > 0) {
    const temps: string[] = osakaAreaTemp.temps
    const nowDateStr = new Date().toISOString().slice(0, 10)

    tempTimeDefines.forEach((tDef, idx) => {
      const tempVal = temps[idx]
      if (!tempVal) return
      const tDate = new Date(tDef)
      const tDateStr = tDate.toISOString().slice(0, 10)
      const tHours = tDate.getHours()

      if (tDateStr === nowDateStr) {
        if (tHours === 0 || tHours === 9) {
          todayTempMax = tempVal
        } else if (tHours === 6) {
          todayTempMin = tempVal
        } else {
          todayTempMax = tempVal
        }
      } else {
        if (tHours === 0 || tHours === 6) {
          if (!tomorrowTempMin) tomorrowTempMin = tempVal
        } else if (tHours === 9 || tHours === 12) {
          if (!tomorrowTempMax) tomorrowTempMax = tempVal
        }
      }
    })
  }

  const todayForecast: DailyForecast = {
    date: new Date().toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' }),
    weatherText: todayWeatherText,
    weatherCode: todayCode,
    weatherEmoji: todayEmoji,
    wind: todayWind,
    wave: todayWave,
    tempMin: todayTempMin,
    tempMax: todayTempMax,
    pops: todayPops,
  }

  let tomorrowForecast: DailyForecast | null = null
  if (osakaAreaWeather.weatherCodes && osakaAreaWeather.weatherCodes.length > 1) {
    const tomorrowCode = osakaAreaWeather.weatherCodes[1]
    const tomorrowText = osakaAreaWeather.weathers?.[1] || ''
    const tomorrowWind = osakaAreaWeather.winds?.[1] || ''
    const tomorrowWave = osakaAreaWeather.waves?.[1] || ''
    const tomorrowEmoji = getWeatherEmoji(tomorrowCode).emoji
    
    const tomorrowDate = new Date()
    tomorrowDate.setDate(tomorrowDate.getDate() + 1)

    tomorrowForecast = {
      date: tomorrowDate.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' }),
      weatherText: tomorrowText,
      weatherCode: tomorrowCode,
      weatherEmoji: tomorrowEmoji,
      wind: tomorrowWind,
      wave: tomorrowWave,
      tempMin: tomorrowTempMin,
      tempMax: tomorrowTempMax,
      pops: tomorrowPops,
    }
  }

  return { today: todayForecast, tomorrow: tomorrowForecast, reportDatetime }
}

/**
 * 週間天気予報のパース処理
 */
function parseWeeklyForecast(weeklyData: any): WeeklyForecastItem[] {
  const weeklyForecasts: WeeklyForecastItem[] = []
  const wSeries = weeklyData?.timeSeries?.[0]
  const wTempSeries = weeklyData?.timeSeries?.[1]

  const wArea = wSeries?.areas?.find(
    (a: any) => a.area.code === JMA_CONFIG.AREA.OSAKA_PREF || a.area.name.includes('大阪')
  ) || wSeries?.areas?.[0]
  const wTempArea = wTempSeries?.areas?.find(
    (a: any) => a.area.code === JMA_CONFIG.AREA.OSAKA_PREF || a.area.name.includes('大阪')
  ) || wTempSeries?.areas?.[0]

  if (wSeries && wArea && wArea.weatherCodes) {
    const timeDefines = wSeries.timeDefines || []
    wArea.weatherCodes.forEach((code: string, idx: number) => {
      const rawDate = timeDefines[idx]
      if (!rawDate) return
      const d = new Date(rawDate)
      const dateStr = `${d.getMonth() + 1}/${d.getDate()}`
      const dayStr = getDayOfWeek(rawDate)
      const emojiObj = getWeatherEmoji(code)

      const minT = wTempArea?.tempsMin?.[idx] || '-'
      const maxT = wTempArea?.tempsMax?.[idx] || '-'
      const pop = wArea.pops?.[idx] ? `${wArea.pops[idx]}%` : '-'
      const rel = wArea.reliabilities?.[idx] || ''

      weeklyForecasts.push({
        date: dateStr,
        dayOfWeek: dayStr,
        weatherCode: code,
        weatherEmoji: emojiObj.emoji,
        weatherText: emojiObj.shortText,
        tempMin: minT !== '-' ? `${minT}℃` : '-',
        tempMax: maxT !== '-' ? `${maxT}℃` : '-',
        pop: pop,
        reliability: rel,
      })
    })
  }
  return weeklyForecasts
}

/**
 * r8 警報・注意報データのパース処理
 * 
 * 気象庁のr8データは発表ごとのイベント差分履歴配列（[最新, 過去1, 過去2, ...]）で格納されているため、
 * 全履歴を走査して警報・注意報コードごとに最新ステータスを判定し、
 * 「解除」されていない有効な全注意報（大雨、雷など）を累積して抽出します。
 */
function parseWarningData(warningJson: any): { warnings: WeatherWarningItem[]; headlineText: string } {
  const warningList: WeatherWarningItem[] = []
  let warningHeadline = ''

  if (warningJson && Array.isArray(warningJson) && warningJson.length > 0) {
    // 最新の見出し文
    warningHeadline = warningJson[0].headlineText || ''

    // 各警報・注意報コードごとの最新ステータスを保持するマップ
    const warningStatusMap = new Map<string, { code: string; status: string; reportDatetime: string }>()

    // 最新（index 0）から過去へ走査
    for (let i = 0; i < warningJson.length; i++) {
      const doc = warningJson[i]
      const warningData = doc.warning

      if (warningData && warningData.class20Items) {
        const osakaCityItem = warningData.class20Items.find(
          (item: any) => item.areaCode === JMA_CONFIG.AREA.OSAKA_CITY
        )

        if (osakaCityItem && osakaCityItem.kinds) {
          osakaCityItem.kinds.forEach((k: any) => {
            // まだ未記録のコード（＝最新のステータス）のみを記録
            if (k.code && !warningStatusMap.has(k.code)) {
              warningStatusMap.set(k.code, {
                code: k.code,
                status: k.status,
                reportDatetime: doc.reportDatetime || '',
              })
            }
          })
        }
      }
    }

    // 「発表」「継続」「警報から注意報」の有効な警報・注意報のみを一覧化
    for (const [, info] of warningStatusMap.entries()) {
      if (info.status === '発表' || info.status === '継続' || info.status === '警報から注意報') {
        const parsed = parseWarningCode(info.code)
        warningList.push({
          code: info.code,
          name: parsed.name,
          type: parsed.type,
          status: info.status,
        })
      }
    }
  }

  // 警報・注意報を重要度順（特別警報 → 警報 → 注意報）にソート
  warningList.sort((a, b) => {
    const priority = { special: 0, warning: 1, advisory: 2 }
    return priority[a.type] - priority[b.type]
  })

  return { warnings: warningList, headlineText: warningHeadline }
}

/**
 * 気象庁 API より天気予報・最新警報(r8)・アメダス・概況を取得（キャッシュ付き）
 */
export async function fetchWeatherDataFromJMA(forceRefresh = false): Promise<WeatherFullData> {
  // 1. キャッシュチェック
  if (!forceRefresh) {
    try {
      const cachedStr = localStorage.getItem(JMA_CONFIG.CACHE.KEY)
      if (cachedStr) {
        const cachedData: WeatherFullData = JSON.parse(cachedStr)
        const age = Date.now() - cachedData.lastUpdated
        if (age < JMA_CONFIG.CACHE.TTL_MS) {
          return cachedData
        }
      }
    } catch {
      // ignore
    }
  }

  // 2. 気象庁APIへのリクエスト
  const forecastUrl = `${JMA_CONFIG.BASE_URL}/forecast/data/forecast/${JMA_CONFIG.AREA.OSAKA_PREF}.json`
  const warningUrl = `${JMA_CONFIG.BASE_URL}/warning/data/r8/${JMA_CONFIG.AREA.OSAKA_PREF}.json`
  const overviewUrl = `${JMA_CONFIG.BASE_URL}/forecast/data/overview_forecast/${JMA_CONFIG.AREA.OSAKA_PREF}.json`

  try {
    const [forecastRes, warningRes, overviewRes, currentObs] = await Promise.all([
      fetch(forecastUrl),
      fetch(warningUrl).catch(() => null),
      fetch(overviewUrl).catch(() => null),
      fetchAmedasObservation(),
    ])

    if (!forecastRes.ok) {
      throw new Error(`気象庁予報データの取得に失敗しました (Status: ${forecastRes.status})`)
    }

    const forecastJson = await forecastRes.json()
    const warningJson = warningRes && warningRes.ok ? await warningRes.json() : null
    const overviewJson = overviewRes && overviewRes.ok ? await overviewRes.json() : null

    // 3. 各モジュールパース処理の呼び出し
    const { today, tomorrow, reportDatetime } = parseDailyForecast(forecastJson[0])
    const weekly = forecastJson.length > 1 ? parseWeeklyForecast(forecastJson[1]) : []
    const { warnings, headlineText } = parseWarningData(warningJson)

    const fullResult: WeatherFullData = {
      lastUpdated: Date.now(),
      reportDatetime: reportDatetime,
      cityName: '大阪市（京橋・中央区周辺）',
      current: currentObs,
      today: today,
      tomorrow: tomorrow,
      weekly: weekly,
      warnings: warnings,
      warningHeadlineText: headlineText,
      overviewText: overviewJson?.text || '',
      hasWarnings: warnings.length > 0,
    }

    // キャッシュ保存
    try {
      localStorage.setItem(JMA_CONFIG.CACHE.KEY, JSON.stringify(fullResult))
    } catch {
      // ignore
    }

    return fullResult
  } catch (err: any) {
    console.error('Weather fetch error:', err)
    const cachedStr = localStorage.getItem(JMA_CONFIG.CACHE.KEY)
    if (cachedStr) {
      try {
        return JSON.parse(cachedStr)
      } catch {
        // ignore
      }
    }
    throw err
  }
}
