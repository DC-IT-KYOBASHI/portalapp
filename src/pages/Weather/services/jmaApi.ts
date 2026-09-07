import type {
  WeatherFullData,
  DailyForecast,
  WeeklyForecastItem,
  WeatherWarningItem,
  CurrentObservation,
  PopTimeSlot,
} from '../types'

const CACHE_KEY = 'jma_weather_osaka_cache_v1'
const CACHE_TTL_MS = 30 * 60 * 1000 // 30分

// 気象庁 エリアコード
const AREA_OSAKA_PREF = '270000' // 大阪府
const AMEDAS_OSAKA_STATION = '62078' // アメダス観測所：大阪（大阪市中央区大手前）

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
    if (c.includes('3')) return { emoji: '🌧️', shortText: '曇りのち雨' }
    return { emoji: '☁️', shortText: 'くもり' }
  }
  // 雨系 (300番台)
  if (first === '3') {
    if (c.includes('4') || c.includes('雷')) return { emoji: '⛈️', shortText: '雷雨' }
    if (c.includes('1')) return { emoji: '🌦️', shortText: '雨のち晴れ' }
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
function parseWarningCode(code: string): { name: string; type: 'special' | 'warning' | 'advisory' } {
  const codeNum = parseInt(code, 10)
  
  // 特別警報 (20番台後半〜30番台など)
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

  // 警報
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

  // 注意報
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
  if (hPa >= 1016) return 'high'
  if (hPa >= 1008) return 'normal'
  if (hPa >= 1000) return 'low'
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
 * 気象庁 API より天気予報・警報・アメダスを取得
 */
export async function fetchWeatherDataFromJMA(forceRefresh = false): Promise<WeatherFullData> {
  // 1. キャッシュチェック
  if (!forceRefresh) {
    try {
      const cachedStr = localStorage.getItem(CACHE_KEY)
      if (cachedStr) {
        const cachedData: WeatherFullData = JSON.parse(cachedStr)
        const age = Date.now() - cachedData.lastUpdated
        if (age < CACHE_TTL_MS) {
          return cachedData
        }
      }
    } catch (e) {
      console.warn('Weather cache read error:', e)
    }
  }

  // 2. 気象庁APIへのリクエスト（並列取得）
  const forecastUrl = `https://www.jma.go.jp/bosai/forecast/data/forecast/${AREA_OSAKA_PREF}.json`
  const warningUrl = `https://www.jma.go.jp/bosai/warning/data/warning/${AREA_OSAKA_PREF}.json`
  const latestTimeUrl = `https://www.jma.go.jp/bosai/amedas/data/latest_time.txt`

  try {
    const [forecastRes, warningRes, latestTimeRes] = await Promise.all([
      fetch(forecastUrl),
      fetch(warningUrl),
      fetch(latestTimeUrl).catch(() => null),
    ])

    if (!forecastRes.ok) {
      throw new Error(`気象庁予報データの取得に失敗しました (Status: ${forecastRes.status})`)
    }

    const forecastJson = await forecastRes.json()
    const warningJson = warningRes.ok ? await warningRes.json() : null

    // 3. アメダス最新実況データの取得
    let currentObs: CurrentObservation | null = null
    if (latestTimeRes && latestTimeRes.ok) {
      try {
        const latestTimeRaw = (await latestTimeRes.text()).trim()
        // Format: 2026-09-07T10:30:00+09:00 -> 20260907103000
        const timestampIso = new Date(latestTimeRaw)
        const y = timestampIso.getFullYear()
        const m = String(timestampIso.getMonth() + 1).padStart(2, '0')
        const d = String(timestampIso.getDate()).padStart(2, '0')
        const h = String(timestampIso.getHours()).padStart(2, '0')
        const min = String(timestampIso.getMinutes()).padStart(2, '0')
        const amedasTimeStr = `${y}${m}${d}${h}${min}00`

        const amedasMapUrl = `https://www.jma.go.jp/bosai/amedas/data/map/${amedasTimeStr}.json`
        const amedasRes = await fetch(amedasMapUrl)
        if (amedasRes.ok) {
          const amedasMap = await amedasRes.json()
          const osakaAmedas = amedasMap[AMEDAS_OSAKA_STATION]
          if (osakaAmedas) {
            const temp = osakaAmedas.temp ? osakaAmedas.temp[0] : null
            const humidity = osakaAmedas.humidity ? osakaAmedas.humidity[0] : null
            // normalPressure (海面気圧) または pressure (現地気圧)
            const pressure = osakaAmedas.normalPressure
              ? osakaAmedas.normalPressure[0]
              : osakaAmedas.pressure
              ? osakaAmedas.pressure[0]
              : null
            const windSpeed = osakaAmedas.wind ? osakaAmedas.wind[0] : null
            const windDir = osakaAmedas.windDirection ? osakaAmedas.windDirection[0] : 0

            currentObs = {
              timestamp: `${h}:${min}`,
              temperature: temp,
              pressure: pressure,
              pressureStatus: getPressureStatus(pressure),
              humidity: humidity,
              windSpeed: windSpeed,
              windDirectionText: getWindDirectionText(windDir),
            }
          }
        }
      } catch (amedasErr) {
        console.warn('AMeDAS fetch error:', amedasErr)
      }
    }

    // 4. 予報データ（今日・明日）のパース
    const shortForecast = forecastJson[0]
    const reportDatetime = shortForecast.reportDatetime || new Date().toISOString()
    
    // timeSeries[0]: 天気
    const weatherSeries = shortForecast.timeSeries[0]
    const osakaAreaWeather = weatherSeries.areas.find((a: any) => a.area.code === AREA_OSAKA_PREF || a.area.name.includes('大阪')) || weatherSeries.areas[0]
    
    const todayCode = osakaAreaWeather.weatherCodes?.[0] || '100'
    const todayWeatherText = osakaAreaWeather.weathers?.[0] || '晴れ'
    const todayWind = osakaAreaWeather.winds?.[0] || ''
    const todayWave = osakaAreaWeather.waves?.[0] || ''
    const todayEmoji = getWeatherEmoji(todayCode).emoji

    // timeSeries[1]: 降水確率
    const popSeries = shortForecast.timeSeries[1]
    const osakaAreaPop = popSeries ? popSeries.areas.find((a: any) => a.area.code === AREA_OSAKA_PREF || a.area.name.includes('大阪')) || popSeries.areas[0] : null
    const popTimeDef = popSeries?.timeDefines || []
    
    const todayPops: PopTimeSlot[] = []
    if (osakaAreaPop && osakaAreaPop.pops) {
      osakaAreaPop.pops.slice(0, 4).forEach((p: string, idx: number) => {
        const tDef = popTimeDef[idx] ? new Date(popTimeDef[idx]) : null
        const label = tDef ? `${String(tDef.getHours()).padStart(2, '0')}時` : `${idx * 6}-${(idx + 1) * 6}時`
        todayPops.push({ timeLabel: label, pop: `${p}%` })
      })
    }

    // timeSeries[2]: 気温
    const tempSeries = shortForecast.timeSeries[2]
    const osakaAreaTemp = tempSeries ? tempSeries.areas.find((a: any) => a.area.code === AREA_OSAKA_PREF || a.area.name.includes('大阪')) || tempSeries.areas[0] : null
    let tempMin: string | null = null
    let tempMax: string | null = null
    if (osakaAreaTemp && osakaAreaTemp.temps) {
      if (osakaAreaTemp.temps.length >= 2) {
        tempMin = osakaAreaTemp.temps[0]
        tempMax = osakaAreaTemp.temps[1]
      } else if (osakaAreaTemp.temps.length === 1) {
        tempMax = osakaAreaTemp.temps[0]
      }
    }

    const todayForecast: DailyForecast = {
      date: new Date().toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' }),
      weatherText: todayWeatherText,
      weatherCode: todayCode,
      weatherEmoji: todayEmoji,
      wind: todayWind,
      wave: todayWave,
      tempMin: tempMin,
      tempMax: tempMax,
      pops: todayPops,
    }

    // 明日の予報
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
        tempMin: null,
        tempMax: null,
        pops: [],
      }
    }

    // 5. 週間天気予報 (forecastJson[1])
    const weeklyForecasts: WeeklyForecastItem[] = []
    if (forecastJson.length > 1) {
      const weeklyData = forecastJson[1]
      const wSeries = weeklyData.timeSeries?.[0]
      const wTempSeries = weeklyData.timeSeries?.[1]

      const wArea = wSeries?.areas.find((a: any) => a.area.code === AREA_OSAKA_PREF || a.area.name.includes('大阪')) || wSeries?.areas?.[0]
      const wTempArea = wTempSeries?.areas.find((a: any) => a.area.code === AREA_OSAKA_PREF || a.area.name.includes('大阪')) || wTempSeries?.areas?.[0]

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
    }

    // 6. 警報・注意報のパース（大阪市対象）
    const warningList: WeatherWarningItem[] = []
    if (warningJson && warningJson.areaTypes) {
      // 市町村別 areaTypes (通常 index 1)
      const cityAreaType = warningJson.areaTypes.find((at: any) => at.areaType === 'class20s') || warningJson.areaTypes[1]
      if (cityAreaType && cityAreaType.areas) {
        // 大阪市（エリアコード 2710000 または 2712800 等）
        const osakaCityArea = cityAreaType.areas.find(
          (a: any) => a.code === '2710000' || a.name === '大阪市' || a.name?.includes('大阪市')
        )
        if (osakaCityArea && osakaCityArea.warnings) {
          osakaCityArea.warnings.forEach((w: any) => {
            // status が "発表" または "継続" のもの
            if (w.status === '発表' || w.status === '継続' || w.status === '警報から注意報') {
              const info = parseWarningCode(w.code)
              warningList.push({
                code: w.code,
                name: info.name,
                type: info.type,
                status: w.status,
              })
            }
          })
        }
      }
    }

    const fullResult: WeatherFullData = {
      lastUpdated: Date.now(),
      reportDatetime: reportDatetime,
      cityName: '大阪市（京橋・中央区周辺）',
      current: currentObs,
      today: todayForecast,
      tomorrow: tomorrowForecast,
      weekly: weeklyForecasts,
      warnings: warningList,
      hasWarnings: warningList.length > 0,
    }

    // キャッシュ保存
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(fullResult))
    } catch (e) {
      console.warn('Failed to save weather cache:', e)
    }

    return fullResult
  } catch (err: any) {
    console.error('Weather fetch error:', err)
    // エラー時は既存キャッシュがあれば返す
    const cachedStr = localStorage.getItem(CACHE_KEY)
    if (cachedStr) {
      try {
        return JSON.parse(cachedStr)
      } catch (e) {
        // ignore
      }
    }
    throw err
  }
}
