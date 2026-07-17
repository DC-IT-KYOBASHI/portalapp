import type { PromptData } from '../data/prompts'
import { useState } from 'react'

interface PromptModalProps {
  prompt: PromptData | null
  onClose: () => void
}

export default function PromptModal({ prompt, onClose }: PromptModalProps) {
  const [copied, setCopied] = useState(false)

  if (!prompt) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animation-fade-in">
      {/* 背景の半透明レイヤー (クリックで閉じる) */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

      {/* モーダル本体 */}
      <div className="relative w-full max-w-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col max-h-[90vh] overflow-hidden">
        {/* ヘッダーエリア */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-3">
              {prompt.category}
            </span>
            <h2 className="text-2xl font-bold">{prompt.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            ✖
          </button>
        </div>

        {/* スクロール可能なコンテンツエリア */}
        <div className="overflow-y-auto pr-2 flex-1 space-y-6">
          {/* 目的 */}
          <div>
            <h3 className="text-sm font-bold opacity-70 mb-2">🎯 やりたい事（目的）</h3>
            <p className="text-slate-800 dark:text-slate-200">{prompt.goal}</p>
          </div>

          {/* プロンプト本体 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold opacity-70">📝 プロンプト文</h3>
              <button
                onClick={handleCopy}
                className={`text-xs px-3 py-1 rounded-full font-bold transition-colors ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20'
                }`}
              >
                {copied ? '✓ コピーしました' : '📋 コピーする'}
              </button>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-sm whitespace-pre-wrap">
              {prompt.prompt}
            </div>
          </div>

          {/* 解説 */}
          <div>
            <h3 className="text-sm font-bold opacity-70 mb-2">
              💡 なぜこの書き方が良いのか（解説）
            </h3>
            <p className="text-slate-800 dark:text-slate-200 bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">
              {prompt.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
