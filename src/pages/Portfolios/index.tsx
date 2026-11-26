import { useEffect, useMemo, useState } from 'react'
import { initialPortfolios } from './data/portfolios'
import type { PortfolioData } from '../../types'
import { useApi } from '../../hooks/useApi'
import { API_BASE_URL } from '../../config'
import BackToHomeButton from '../../components/BackToHomeButton'

function isSafeHttpUrl(url?: string): url is string {
  return typeof url === 'string' && /^https?:\/\//i.test(url.trim())
}

function resolveThumbnailUrl(thumbnail?: string): string {
  const value = (thumbnail || '').trim()
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value
  if (value.startsWith('uploads/portfolios/')) {
    const base = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`
    return `${base}${value}`
  }
  return ''
}

export default function Portfolios() {
  const [searchQuery, setSearchQuery] = useState('')

  const { data, error, isLoading, execute } =
    useApi<PortfolioData[]>(initialPortfolios)
  const portfolios = Array.isArray(data) ? data : initialPortfolios

  useEffect(() => {
    execute('?api=true&module=Portfolios')
  }, [execute])

  const filteredPortfolios = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return portfolios
    return portfolios.filter(
      (item) =>
        (item.title || '').toLowerCase().includes(q) ||
        (item.author || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q)
    )
  }, [portfolios, searchQuery])

  return (
    <div className="w-full animation-fade-in pb-12">
      <div className="mb-8">
        <BackToHomeButton className="mb-3" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-2">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            💼 ポートフォリオ一覧
          </h1>
          <a
            href={`${API_BASE_URL}?module=Portfolios`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 px-3 py-2 rounded-lg transition-colors font-bold w-fit border border-blue-500/20"
          >
            ✏️ ポートフォリオの追加・編集ページへ{' '}
            <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded ml-1 border border-red-500/20">
              内部NW専用
            </span>
          </a>
        </div>

        <p className="opacity-75 mb-6 leading-relaxed">
          事業所で制作したWebアプリ・Webサイトなどのポートフォリオ作品を紹介しています。公開サイトやGitHubリポジトリをぜひご覧ください。
        </p>

        <div className="relative max-w-2xl">
          <label htmlFor="portfolio-search" className="sr-only">
            作品タイトル・制作者名・キーワードで検索
          </label>
          <span
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50"
          >
            🔍
          </span>
          <input
            id="portfolio-search"
            type="search"
            placeholder="例: アプリ名、制作者名、React、業務ツール..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-panel border border-white/40 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
          />
        </div>
      </div>

      <div className="mb-4 text-sm font-bold opacity-70 flex justify-between items-center">
        <span>全 {filteredPortfolios.length} 件</span>
        {isLoading && (
          <span className="text-blue-500 animate-pulse">
            データを読み込み中...
          </span>
        )}
      </div>

      {error && (
        <div
          role="status"
          className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center gap-3 text-sm font-bold"
        >
          <span aria-hidden="true">⚠️</span>
          <span>
            サーバーとの通信に失敗したため、アプリ内蔵の標準データを表示しています。（{error}）
          </span>
        </div>
      )}

      {isLoading ? (
        <div className="glass-panel rounded-3xl p-12 flex flex-col items-center justify-center opacity-70">
          <div aria-hidden="true" className="animate-spin text-4xl mb-4">
            ⚙️
          </div>
          <p className="font-bold">データを読み込み中...</p>
        </div>
      ) : filteredPortfolios.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 flex flex-col items-center justify-center opacity-60">
          <span aria-hidden="true" className="text-4xl mb-4">
            💼
          </span>
          <p className="font-bold">該当するポートフォリオが見つかりませんでした。</p>
          <p className="text-sm mt-2">
            別のキーワードで検索するか、検索欄をクリアしてください。
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolios.map((item) => {
            const thumbUrl = resolveThumbnailUrl(item.thumbnail)
            const safeDemo = isSafeHttpUrl(item.demoUrl) ? item.demoUrl.trim() : ''
            const safeGithub = isSafeHttpUrl(item.githubUrl) ? item.githubUrl.trim() : ''

            return (
              <article
                key={item.id}
                className="glass-panel rounded-3xl overflow-hidden border border-white/40 dark:border-white/10 flex flex-col hover:shadow-xl transition-shadow"
              >
                {thumbUrl ? (
                  <img
                    src={thumbUrl}
                    alt={`${item.title}のサムネイル`}
                    loading="lazy"
                    decoding="async"
                    className="w-full aspect-video object-cover bg-slate-100 dark:bg-slate-800 border-b border-black/5 dark:border-white/10"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="w-full aspect-video bg-gradient-to-br from-indigo-500/15 via-sky-500/15 to-teal-500/15 border-b border-black/5 dark:border-white/10 flex items-center justify-center text-5xl"
                  >
                    💻
                  </div>
                )}

                <div className="p-6 flex flex-col gap-3 flex-1">
                  <header className="flex flex-col gap-1.5">
                    {item.author && (
                      <span className="inline-flex items-center gap-1 w-fit px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                        <span aria-hidden="true">👤</span>
                        <span>{item.author}</span>
                      </span>
                    )}
                    <h2 className="text-lg font-black tracking-tight leading-snug">
                      {item.title}
                    </h2>
                  </header>

                  {item.description && (
                    <p className="text-sm opacity-80 leading-relaxed whitespace-pre-wrap flex-1">
                      {item.description}
                    </p>
                  )}

                  {(safeDemo || safeGithub) && (
                    <footer className="pt-3 mt-auto border-t border-black/10 dark:border-white/10 flex flex-wrap gap-2">
                      {safeDemo && (
                        <a
                          href={safeDemo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          <span aria-hidden="true">🌐</span>
                          <span>公開サイトを見る</span>
                          <span className="sr-only">（{item.title}）</span>
                          <span aria-hidden="true" className="opacity-80">
                            ↗
                          </span>
                        </a>
                      )}
                      {safeGithub && (
                        <a
                          href={safeGithub}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white transition-colors"
                        >
                          <span aria-hidden="true">🐙</span>
                          <span>GitHubを見る</span>
                          <span className="sr-only">（{item.title}）</span>
                          <span aria-hidden="true" className="opacity-80">
                            ↗
                          </span>
                        </a>
                      )}
                    </footer>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
