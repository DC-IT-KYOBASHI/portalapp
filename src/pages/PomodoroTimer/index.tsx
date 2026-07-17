import { useState, useEffect } from 'react'
import { TimerCard, type TimerData } from './components/TimerCard'

const LOCAL_STORAGE_KEY = 'lolipop_portal_timers'
const MAX_TIMERS = 4 // タイマーの最大数制限

export default function PomodoroTimer() {
  const [timers, setTimers] = useState<TimerData[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // 初回マウント時にローカルストレージから読み込み
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      try {
        setTimers(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved timers')
        setTimers([{ id: 'default-1', taskName: '', workMinutes: 25, breakMinutes: 5 }])
      }
    } else {
      setTimers([{ id: 'default-1', taskName: '', workMinutes: 25, breakMinutes: 5 }])
    }
    setIsLoaded(true)
  }, [])

  // タイマー状態が変わるたびに保存 (初期ロード後のみ)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(timers))
    }
  }, [timers, isLoaded])

  const addTimer = () => {
    if (timers.length >= MAX_TIMERS) return // 上限ガード

    const newTimer: TimerData = {
      id: `timer-${Date.now()}`,
      taskName: '',
      workMinutes: 25,
      breakMinutes: 5,
    }
    setTimers([...timers, newTimer])
  }

  const deleteTimer = (id: string) => {
    setTimers(timers.filter((t) => t.id !== id))
  }

  const updateTimer = (id: string, newData: TimerData) => {
    setTimers(timers.map((t) => (t.id === id ? newData : t)))
  }

  if (!isLoaded) return null

  const isMaxReached = timers.length >= MAX_TIMERS

  return (
    <div className="w-full animation-fade-in flex flex-col">
      {/* ページ内ヘッダー */}
      <div className="flex justify-between items-end mb-6 border-b border-slate-300 dark:border-slate-700 pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            🍅 ポモドーロタイマー
          </h2>
          <p className="text-sm opacity-70 mt-1">
            複数のタスクを並行して時間管理できます（最大{MAX_TIMERS}つまで）
          </p>
        </div>

        {/* 追加ボタン (上限時はグレーアウト・無効化) */}
        <button
          onClick={addTimer}
          disabled={isMaxReached}
          title={isMaxReached ? 'これ以上追加できません' : '新しいタイマーを追加'}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all
            ${
              isMaxReached
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-50 dark:bg-slate-700'
                : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-md hover:-translate-y-0.5'
            }
          `}
        >
          <span className="text-xl leading-none">+</span> 追加
        </button>
      </div>

      {/* タイマーグリッドエリア */}
      {timers.length === 0 ? (
        <div className="w-full h-64 flex flex-col items-center justify-center opacity-50 glass-panel rounded-3xl">
          <p className="text-xl mb-4 font-bold">タイマーがありません</p>
          <button
            onClick={addTimer}
            className="text-blue-500 font-bold underline hover:text-blue-600"
          >
            新しく追加する
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 auto-rows-max justify-items-center md:justify-items-stretch">
          {timers.map((timer) => (
            <div key={timer.id} className="flex justify-center w-full">
              <TimerCard data={timer} onDelete={deleteTimer} onUpdate={updateTimer} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
