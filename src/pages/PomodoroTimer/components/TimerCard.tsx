import React, { useState, useEffect } from 'react'
import type { TimerData } from '../../../types'

interface TimerCardProps {
  data: TimerData
  onDelete: (id: string) => void
  onUpdate: (id: string, newData: TimerData) => void
}

export const TimerCard: React.FC<TimerCardProps> = ({ data, onDelete, onUpdate }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    let initialTime = data.timeLeft ?? (data.workMinutes * 60)
    if (data.isActive && data.lastUpdated) {
      const elapsed = Math.floor((Date.now() - data.lastUpdated) / 1000)
      initialTime = Math.max(0, initialTime - elapsed)
    }
    return initialTime
  })
  const [isActive, setIsActive] = useState(data.isActive ?? false)
  const [isWorkMode, setIsWorkMode] = useState(data.isWorkMode ?? true)
  const [isEditing, setIsEditing] = useState(false)

  // 編集用の一時的な状態
  const [editWorkMinutes, setEditWorkMinutes] = useState(data.workMinutes)
  const [editBreakMinutes, setEditBreakMinutes] = useState(data.breakMinutes)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1
          onUpdate(data.id, {
            ...data,
            timeLeft: newTime,
            isActive: true,
            isWorkMode,
            lastUpdated: Date.now(),
          })
          return newTime
        })
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      setIsActive(false)
      const nextIsWorkMode = !isWorkMode
      alert(
        isWorkMode
          ? `「${data.taskName || 'タスク'}」の作業が終了しました！休憩しましょう。`
          : `休憩終了です！作業に戻りましょう。`
      )
      setIsWorkMode(nextIsWorkMode)
      const nextTime = nextIsWorkMode ? data.workMinutes * 60 : data.breakMinutes * 60
      setTimeLeft(nextTime)
      
      onUpdate(data.id, {
        ...data,
        timeLeft: nextTime,
        isActive: false,
        isWorkMode: nextIsWorkMode,
        lastUpdated: Date.now(),
      })
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, isWorkMode, data.workMinutes, data.breakMinutes, data.taskName])

  const toggleTimer = () => {
    const nextActive = !isActive
    setIsActive(nextActive)
    onUpdate(data.id, {
      ...data,
      isActive: nextActive,
      timeLeft,
      isWorkMode,
      lastUpdated: Date.now()
    })
  }

  const resetTimer = () => {
    setIsActive(false)
    const nextTime = isWorkMode ? data.workMinutes * 60 : data.breakMinutes * 60
    setTimeLeft(nextTime)
    onUpdate(data.id, {
      ...data,
      isActive: false,
      timeLeft: nextTime,
      isWorkMode,
      lastUpdated: Date.now()
    })
  }

  const switchMode = (toWorkMode: boolean) => {
    setIsActive(false)
    setIsWorkMode(toWorkMode)
    const nextTime = toWorkMode ? data.workMinutes * 60 : data.breakMinutes * 60
    setTimeLeft(nextTime)
    onUpdate(data.id, {
      ...data,
      isActive: false,
      timeLeft: nextTime,
      isWorkMode: toWorkMode,
      lastUpdated: Date.now()
    })
  }

  const handleSaveConfig = () => {
    const newData = {
      ...data,
      workMinutes: Math.max(1, editWorkMinutes),
      breakMinutes: Math.max(1, editBreakMinutes),
    }
    onUpdate(data.id, newData)

    // 現在のモードに合わせて残り時間も再設定
    if (isWorkMode) {
      setTimeLeft(newData.workMinutes * 60)
    } else {
      setTimeLeft(newData.breakMinutes * 60)
    }
    setIsEditing(false)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col items-center space-y-4 relative overflow-hidden transition-all duration-300 w-full max-w-sm">
      {/* 削除ボタン */}
      <button
        onClick={() => onDelete(data.id)}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
        title="タイマーを削除"
      >
        ✕
      </button>

      {/* 設定ボタン */}
      <button
        onClick={() => {
          setIsEditing(!isEditing)
          setIsActive(false)
        }}
        className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-500/10 text-slate-600 dark:text-slate-300 hover:bg-slate-500 hover:text-white transition-colors text-lg"
        title="時間の設定"
      >
        ⚙
      </button>

      {isEditing ? (
        // --- 設定モードUI ---
        <div className="w-full flex flex-col items-center space-y-4 pt-6">
          <h3 className="font-bold opacity-80">タイマー時間の設定 (分)</h3>

          <div className="flex w-full space-x-4">
            <div className="flex-1">
              <label className="block text-xs opacity-70 mb-1">集中時間</label>
              <input
                type="number"
                min="1"
                value={editWorkMinutes}
                onChange={(e) => setEditWorkMinutes(Number(e.target.value))}
                className="w-full bg-white/40 dark:bg-black/30 border border-white/30 dark:border-gray-600 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs opacity-70 mb-1">休憩時間</label>
              <input
                type="number"
                min="1"
                value={editBreakMinutes}
                onChange={(e) => setEditBreakMinutes(Number(e.target.value))}
                className="w-full bg-white/40 dark:bg-black/30 border border-white/30 dark:border-gray-600 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          <button
            onClick={handleSaveConfig}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors shadow-md mt-4"
          >
            保存する
          </button>
        </div>
      ) : (
        // --- 通常タイマーUI ---
        <>
          {/* タスク入力欄 */}
          <div className="w-full pt-6">
            <input
              type="text"
              placeholder="タスクを入力..."
              value={data.taskName}
              onChange={(e) => onUpdate(data.id, { ...data, taskName: e.target.value })}
              className="w-full bg-white/40 dark:bg-black/30 border border-white/30 dark:border-gray-600 rounded-xl px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-slate-500 dark:placeholder-slate-400 font-medium transition-all text-sm"
            />
          </div>

          {/* モード切替タブ */}
          <div className="flex bg-black/5 dark:bg-white/5 rounded-full p-1 text-xs w-full">
            <button
              onClick={() => !isWorkMode && switchMode(true)}
              className={`flex-1 py-1.5 rounded-full font-bold transition-all ${isWorkMode ? 'bg-white dark:bg-slate-700 shadow shadow-black/10' : 'opacity-60 hover:opacity-100'}`}
            >
              集中 ({data.workMinutes}分)
            </button>
            <button
              onClick={() => isWorkMode && switchMode(false)}
              className={`flex-1 py-1.5 rounded-full font-bold transition-all ${!isWorkMode ? 'bg-white dark:bg-slate-700 shadow shadow-black/10' : 'opacity-60 hover:opacity-100'}`}
            >
              休憩 ({data.breakMinutes}分)
            </button>
          </div>

          {/* タイマー表示 */}
          <div className="text-6xl font-black tracking-tighter tabular-nums drop-shadow-md py-4">
            {formatTime(timeLeft)}
          </div>

          {/* コントロールボタン */}
          <div className="flex space-x-3 w-full">
            <button
              onClick={toggleTimer}
              className={`flex-[2] py-3 rounded-2xl font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all text-white ${isActive ? 'bg-red-500/90 hover:bg-red-500' : 'bg-blue-600/90 hover:bg-blue-600'}`}
            >
              {isActive ? 'PAUSE' : 'START'}
            </button>
            <button
              onClick={resetTimer}
              className="flex-1 py-3 rounded-2xl font-bold text-sm bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700 shadow transition-all"
            >
              RESET
            </button>
          </div>
        </>
      )}
    </div>
  )
}
