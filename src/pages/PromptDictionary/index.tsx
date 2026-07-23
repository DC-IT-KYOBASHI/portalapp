import { useEffect, useState, useMemo } from 'react'
import { promptCategories, type PromptCategory } from './data/prompts'
import type { PromptData } from '../../types'
import { fetchPromptsFromWP } from './data/api'
import PromptModal from './components/PromptModal'

export default function PromptDictionary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | 'すべて'>('すべて')
  const [selectedPrompt, setSelectedPrompt] = useState<PromptData | null>(null)

  const [prompts, setPrompts] = useState<PromptData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 初期ロード時にWP（またはモック）からデータを取得する
  useEffect(() => {
    fetchPromptsFromWP().then((data) => {
      setPrompts(data)
      setIsLoading(false)
    })
  }, [])

  // 検索とカテゴリによる絞り込み
  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      const matchCategory = selectedCategory === 'すべて' || prompt.category === selectedCategory
      const matchSearch =
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.goal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase())

      return matchCategory && matchSearch
    })
  }, [searchQuery, selectedCategory, prompts])

  return (
    <div className="w-full animation-fade-in flex flex-col md:flex-row gap-8">
      {/* 左サイドバー: カテゴリナビゲーション */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="glass-panel p-6 rounded-3xl sticky top-6">
          <h3 className="font-bold mb-4 opacity-70">📂 カテゴリ</h3>
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setSelectedCategory('すべて')}
              className={`text-left px-4 py-2 rounded-xl transition-colors ${
                selectedCategory === 'すべて'
                  ? 'bg-blue-500 text-white font-bold'
                  : 'hover:bg-white/20 dark:hover:bg-white/10'
              }`}
            >
              すべて
            </button>
            {promptCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-left px-4 py-2 rounded-xl transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-500 text-white font-bold'
                    : 'hover:bg-white/20 dark:hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* 右メインエリア: 検索と結果一覧 */}
      <section className="flex-1">
        {/* ヘッダーと検索ボックス */}
        <div className="mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-2">
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
              🤖 AIプロンプト逆引き辞典
            </h2>
            <a 
              href="https://dcitex-kyobashi-se.joinus-dc-kyobashi.com/?module=PromptDictionary" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors font-bold w-fit border border-blue-500/20"
            >
              ✏️ プロンプトの追加・編集ページへ <span className="text-[10px] bg-red-500/10 text-red-500 px-1 rounded ml-1 border border-red-500/20">内部NW専用</span>
            </a>
          </div>
          <p className="opacity-70 mb-6">
            やりたい事から、効果的なAIへの指示（プロンプト）を探せます。
          </p>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">🔍</span>
            <input
              type="text"
              placeholder="例: 要約、エラーチェック、キャッチコピー..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl glass-panel border border-white/40 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
            />
          </div>
        </div>

        {/* 検索結果（カードグリッド） */}
        <div className="mb-4 text-sm font-bold opacity-70 flex justify-between items-center">
          <span>全 {filteredPrompts.length} 件</span>
          {isLoading && <span className="text-blue-500 animate-pulse">データを読み込み中...</span>}
        </div>

        {isLoading ? (
          <div className="glass-panel rounded-3xl p-12 flex flex-col items-center justify-center opacity-70">
            <div className="animate-spin text-4xl mb-4">⚙️</div>
            <p className="font-bold">WordPressからプロンプトを取得しています...</p>
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 flex flex-col items-center justify-center opacity-50">
            <span className="text-4xl mb-4">🥲</span>
            <p className="font-bold">該当するプロンプトが見つかりませんでした。</p>
            <p className="text-sm mt-2">
              別のキーワードで検索するか、カテゴリを「すべて」にしてください。
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredPrompts.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => setSelectedPrompt(prompt)}
                className="text-left glass-panel rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group border border-white/40 dark:border-white/10 flex flex-col h-full"
              >
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    {prompt.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">
                  {prompt.title}
                </h3>
                <p className="text-sm opacity-70 mb-4 flex-1 line-clamp-2">{prompt.goal}</p>
                <div className="text-blue-500 text-sm font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  詳細を見る →
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* モーダル表示領域 */}
      <PromptModal prompt={selectedPrompt} onClose={() => setSelectedPrompt(null)} />
    </div>
  )
}
