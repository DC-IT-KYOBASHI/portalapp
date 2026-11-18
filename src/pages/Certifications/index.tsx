import { useEffect, useMemo, useState } from 'react'
import { certificationCategories, initialCertifications } from './data/certifications'
import type { CertificationData } from '../../types'
import { useApi } from '../../hooks/useApi'
import { API_BASE_URL } from '../../config'
import BackToHomeButton from '../../components/BackToHomeButton'

function isSafeHttpUrl(url?: string): url is string {
  return typeof url === 'string' && /^https?:\/\//i.test(url.trim())
}

const categoryBadgeColors: Record<string, string> = {
  'IPA・情報処理':
    'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
  'オフィス・事務・会計':
    'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
  'プログラミング':
    'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
  'AI・データサイエンス':
    'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
  'その他':
    'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
}

export default function Certifications() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('すべて')

  const { data, error, isLoading, execute } =
    useApi<CertificationData[]>(initialCertifications)
  const certifications =
    Array.isArray(data) && data.length > 0 ? data : initialCertifications

  useEffect(() => {
    execute('?api=true&module=Certifications')
  }, [execute])

  const availableCategories = useMemo(() => {
    const extra = certifications
      .map((c) => c.category)
      .filter((cat) => cat && !certificationCategories.includes(cat as never))
    return [...certificationCategories, ...Array.from(new Set(extra))]
  }, [certifications])

  const filteredCertifications = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return certifications.filter((cert) => {
      const matchCategory =
        selectedCategory === 'すべて' || cert.category === selectedCategory
      if (!matchCategory) return false
      if (!q) return true

      const inStudyLinks = (cert.studyLinks || []).some((link) =>
        link.label.toLowerCase().includes(q)
      )
      return (
        cert.title.toLowerCase().includes(q) ||
        cert.category.toLowerCase().includes(q) ||
        cert.description.toLowerCase().includes(q) ||
        cert.advice.toLowerCase().includes(q) ||
        cert.level.toLowerCase().includes(q) ||
        inStudyLinks
      )
    })
  }, [certifications, searchQuery, selectedCategory])

  return (
    <div className="w-full animation-fade-in flex flex-col md:flex-row gap-8 pb-12">
      {/* 左サイドバー: カテゴリ絞り込み */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="glass-panel p-6 rounded-3xl sticky top-6">
          <BackToHomeButton className="mb-4" />
          <h2 className="font-bold mb-4 opacity-70 text-base">📂 分野カテゴリ</h2>
          <nav aria-label="資格カテゴリ" className="flex flex-col gap-2">
            <button
              type="button"
              aria-pressed={selectedCategory === 'すべて'}
              onClick={() => setSelectedCategory('すべて')}
              className={`text-left px-4 py-2.5 rounded-xl transition-colors min-h-[40px] ${
                selectedCategory === 'すべて'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'hover:bg-white/20 dark:hover:bg-white/10'
              }`}
            >
              すべて
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-left px-4 py-2.5 rounded-xl transition-colors min-h-[40px] ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'hover:bg-white/20 dark:hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* 右メインエリア */}
      <section className="flex-1 min-w-0">
        {/* ヘッダーと検索ボックス */}
        <div className="mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-2">
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              🎓 資格学習ナビ
            </h1>
            <a
              href={`${API_BASE_URL}?module=Certifications`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 px-3 py-2 rounded-lg transition-colors font-bold w-fit border border-blue-500/20"
            >
              ✏️ 資格・リンクの追加・編集ページへ{' '}
              <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded ml-1 border border-red-500/20">
                内部NW専用
              </span>
            </a>
          </div>
          <p className="opacity-75 mb-6 leading-relaxed">
            IT資格・オフィス資格などの公式概要、受験申し込みページ、無料で使える過去問・学習サイトをまとめています。各ボタンからそのまま別タブで開けます。
          </p>

          <div className="relative">
            <label htmlFor="cert-search" className="sr-only">
              資格名やキーワードで検索
            </label>
            <span
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50"
            >
              🔍
            </span>
            <input
              id="cert-search"
              type="search"
              placeholder="例: ITパスポート、過去問道場、簿記、Python..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl glass-panel border border-white/40 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
            />
          </div>
        </div>

        {/* 件数表示 */}
        <div className="mb-4 text-sm font-bold opacity-70 flex justify-between items-center">
          <span>全 {filteredCertifications.length} 件</span>
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
        ) : filteredCertifications.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 flex flex-col items-center justify-center opacity-60">
            <span aria-hidden="true" className="text-4xl mb-4">
              📚
            </span>
            <p className="font-bold">該当する資格情報が見つかりませんでした。</p>
            <p className="text-sm mt-2">
              検索キーワードを変えるか、カテゴリを「すべて」にしてお試しください。
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredCertifications.map((cert) => {
              const badgeStyle =
                categoryBadgeColors[cert.category] ||
                categoryBadgeColors['その他']
              const safeOfficial = isSafeHttpUrl(cert.officialUrl)
                ? cert.officialUrl.trim()
                : ''
              const safeApply = isSafeHttpUrl(cert.applyUrl)
                ? cert.applyUrl.trim()
                : ''
              const safeStudyLinks = (cert.studyLinks || []).filter((link) =>
                isSafeHttpUrl(link.url)
              )

              return (
                <article
                  key={cert.id}
                  className="glass-panel rounded-3xl p-6 border border-white/40 dark:border-white/10 flex flex-col gap-4 hover:shadow-xl transition-shadow"
                >
                  {/* カードヘッダー */}
                  <header className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${badgeStyle}`}
                      >
                        {cert.category}
                      </span>
                      {cert.level && (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                          {cert.level}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-black tracking-tight">
                      {cert.title}
                    </h2>
                  </header>

                  {/* 試験方式・受験料 */}
                  {(cert.examInfo || cert.fee) && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-bold opacity-80 bg-black/5 dark:bg-white/5 px-3.5 py-2.5 rounded-xl">
                      {cert.examInfo && <span>🖥️ {cert.examInfo}</span>}
                      {cert.fee && <span>💰 {cert.fee}</span>}
                    </div>
                  )}

                  {/* 概要とワンポイント */}
                  <div className="flex flex-col gap-3 flex-1">
                    {cert.description && (
                      <p className="text-sm opacity-85 leading-relaxed">
                        {cert.description}
                      </p>
                    )}

                    {cert.advice && (
                      <div className="rounded-2xl bg-amber-500/10 border border-amber-500/25 p-3.5 text-xs leading-relaxed">
                        <div className="font-bold text-amber-800 dark:text-amber-300 mb-1">
                          💡 訓練生へのワンポイントアドバイス
                        </div>
                        <p className="opacity-90">{cert.advice}</p>
                      </div>
                    )}
                  </div>

                  {/* リンクボタン群 */}
                  <footer className="pt-3 border-t border-black/10 dark:border-white/10 flex flex-col gap-3">
                    {/* 公式・申し込みボタン */}
                    {(safeOfficial || safeApply) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {safeOfficial && (
                          <a
                            href={safeOfficial}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white transition-colors"
                          >
                            <span aria-hidden="true">🏛️</span>
                            <span>公式概要ページ</span>
                            <span className="sr-only">（{cert.title}）</span>
                            <span aria-hidden="true" className="text-xs opacity-75">
                              ↗
                            </span>
                          </a>
                        )}
                        {safeApply && (
                          <a
                            href={safeApply}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                          >
                            <span aria-hidden="true">📝</span>
                            <span>受験申し込み案内</span>
                            <span className="sr-only">（{cert.title}）</span>
                            <span aria-hidden="true" className="text-xs opacity-75">
                              ↗
                            </span>
                          </a>
                        )}
                      </div>
                    )}

                    {/* 無料学習・過去問サイト */}
                    {safeStudyLinks.length > 0 && (
                      <div>
                        <div className="text-xs font-bold opacity-70 mb-1.5">
                          📚 無料学習サイト・過去問演習
                        </div>
                        <ul className="flex flex-wrap gap-2">
                          {safeStudyLinks.map((link, idx) => (
                            <li key={`${cert.id}-study-${idx}`}>
                              <a
                                href={link.url.trim()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 transition-colors"
                              >
                                <span>{link.label}</span>
                                <span aria-hidden="true">↗</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </footer>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
