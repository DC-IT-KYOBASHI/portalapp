import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

/**
 * 【共通コンポーネント】 アプリ全画面共通ヘッダー
 * 
 * ダークモードの切り替え機能と、各アプリ画面へのナビゲーションリンク（スマホ時はハンバーガーメニュー）を提供します。
 * 
 * [新しいアプリを追加した際のメニュー登録方法]
 * 1. 新しい画面のコンポーネントを作成し、App.tsxの `<Routes>` に追加する。
 * 2. 下記の `menuItems` 配列に、新しい画面の名前とパス（URL）を追加する。
 *    （例: { name: '日報ジェネレーター', path: '/nippo', icon: '📝' }）
 * これだけで、PC版のリンクとスマホ版のハンバーガーメニューの両方に自動的に追加されます。
 */
export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // 現在のURLパスを取得（アクティブなメニューをハイライトするために使用）
  const location = useLocation()

  // --- ダークモードの切り替え処理 ---
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // --- ナビゲーションメニューの定義 ---
  // アプリが増えたら、ここに要素を追加するだけで自動的にメニューが拡張されます
  const menuItems = [
    { name: 'ホーム', path: '/', icon: '🏠' },
    { name: 'ポモドーロ', path: '/pomodoro', icon: '🍅' },
    { name: 'プロンプト辞典', path: '/prompts', icon: '📖' },
    { name: '不具合報告・要望', path: '/feedback', icon: '📮' },
    { name: '更新履歴', path: '/changelog', icon: '📝' },
  ]

  // メニューを開閉する関数
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // 画面遷移時にスマホメニューを自動で閉じる
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  return (
    <header className="relative w-full mb-8 z-40">
      <div className="glass-panel w-full flex justify-between items-center px-6 py-4 rounded-2xl">
        
        {/* 左側：サイトロゴとバージョン情報 */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold tracking-wider opacity-90 flex items-center gap-3 hover:opacity-100 transition-opacity"
          >
            <span className="text-3xl">✨</span>
            <span className="hidden sm:inline">
              {import.meta.env.VITE_SITE_TITLE || 'DCITエキスパート京橋オフィス アプリ集'}
            </span>
            <span className="sm:hidden">DCITアプリ集</span>
          </Link>
          <span className="bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 text-xs font-bold px-2 py-1 rounded-full border border-teal-200 dark:border-teal-800">
            v1.0.0
          </span>
        </div>

        {/* 右側：ボタン類（PC・スマホ問わず常にハンバーガーメニューを表示） */}
        <div className="flex gap-4 items-center">
          
          {/* ダークモード切り替えボタン */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
            title="テーマ切り替え"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {/* ハンバーガーボタン（常に表示） */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex flex-col justify-center gap-1.5 w-10 h-10"
            aria-label="メニューを開く"
          >
            {/* 3本線（メニューが開いているときはXになるアニメーション） */}
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* ドロップダウンメニュー（開いているときのみ表示） */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 glass-panel rounded-2xl flex flex-col gap-2 shadow-2xl border border-slate-200/50 dark:border-slate-700/50 animation-fade-in">
          <div className="text-xs font-bold text-slate-500 mb-2 px-2 uppercase tracking-widest">Menu</div>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`p-3 rounded-xl font-bold flex items-center gap-3 transition-colors
                ${location.pathname === item.path 
                  ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400' 
                  : 'hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          
          <div className="h-px w-full bg-slate-200 dark:bg-slate-700 my-2"></div>
          
          {/* 裏側の管理画面へのリンク */}
          <a 
            href="https://dcitex-kyobashi-se.joinus-dc-kyobashi.com/members/" 
            className="p-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-3 transition-colors"
          >
            <span className="text-xl">🔒</span>
            <span className="text-sm font-bold">システム情報部専用</span>
          </a>
        </div>
      )}
    </header>
  )
}
