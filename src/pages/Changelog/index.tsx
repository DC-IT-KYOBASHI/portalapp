import { useEffect, useState } from 'react'
import { fetchApi } from '../../utils/api'
import type { Changelog as ChangelogType } from '../../types'

export default function Changelog() {
  const [changelogs, setChangelogs] = useState<ChangelogType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // APIから更新履歴を取得（共通のfetchApiを使用）
    const getChangelogs = async () => {
      try {
        const data = await fetchApi<ChangelogType[]>('?api=true&module=Changelog')
        setChangelogs(data)
      } catch (err: any) {
        setError(err.message || 'データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    getChangelogs()
  }, [])

  return (
    <div className="max-w-3xl mx-auto animation-fade-in pb-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
          <span className="text-4xl">📝</span>
          更新履歴
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          アプリ集のアップデートや修正履歴を確認できます。
        </p>
      </div>

      <div className="glass-panel p-6 md:p-10 rounded-3xl">
        {isLoading ? (
          <div className="text-center py-10 text-slate-500">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full mb-4"></div>
            <p>読み込み中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-2xl">
            <p className="font-bold">{error}</p>
          </div>
        ) : changelogs.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            <p>更新履歴はまだありません。</p>
          </div>
        ) : (
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">
            {changelogs.map((log) => (
              <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* タイムラインの丸ポチ */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-teal-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <span className="text-xs">✨</span>
                </div>
                
                {/* 履歴カード */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 text-sm font-bold rounded-full border border-teal-200 dark:border-teal-800">
                      {log.version}
                    </span>
                    <time className="text-sm font-bold text-slate-500 dark:text-slate-400">{log.date}</time>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                    {log.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
