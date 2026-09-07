import { Link } from 'react-router-dom'

interface Props {
  className?: string
  label?: string
}

/**
 * 【共通コンポーネント】 ホームへ戻るリンクボタン
 * 
 * 各アプリ画面の上部に配置し、ワンタップでポータルホーム画面へ遷移できます。
 */
export default function BackToHomeButton({ className = '', label = 'ホームに戻る' }: Props) {
  return (
    <div className={`mb-2 ${className}`}>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors py-1 group"
        title="ポータルホーム画面へ戻る"
      >
        <span className="transition-transform group-hover:-translate-x-1">←</span>
        <span>{label}</span>
      </Link>
    </div>
  )
}
