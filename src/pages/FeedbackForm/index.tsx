import { useState } from 'react'
import { fetchApi } from '../../utils/api'

export default function FeedbackForm() {
  const [type, setType] = useState<'bug' | 'feature'>('bug')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // 共通API関数を使用して送信
      await fetchApi('/feedback.php', {
        method: 'POST',
        body: JSON.stringify({ type, title, description }),
      })

      setSubmitStatus('success')
      // フォームをリセット
      setTitle('')
      setDescription('')
    } catch (err: any) {
      console.error(err)
      setSubmitStatus('error')
      setErrorMessage(err.message || '送信に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full animation-fade-in flex flex-col max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
          📮 不具合報告・ご要望
        </h2>
        <p className="text-sm opacity-70 mt-2 leading-relaxed">
          システム情報部へのアプリに関する不具合の報告や、新しい機能の要望などをお送りください。
          <br />
          頂いた内容はメンバーが確認し、今後の開発・改善の参考にさせていただきます。
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-6 md:p-8">
        {submitStatus === 'success' ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
              送信完了しました！
            </h3>
            <p className="opacity-80">
              貴重なご意見ありがとうございます。
              <br />
              システム情報部にて確認させていただきます。
            </p>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="mt-8 px-6 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              もう一度送る
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {submitStatus === 'error' && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 font-bold text-sm">
                ⚠️ {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold mb-2 opacity-80">
                送信の種類 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label
                  className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${type === 'bug' ? 'bg-red-500/10 border-red-500 text-red-700 dark:text-red-400 font-bold' : 'border-slate-300 dark:border-slate-600 opacity-70 hover:opacity-100'}`}
                >
                  <input
                    type="radio"
                    name="type"
                    value="bug"
                    checked={type === 'bug'}
                    onChange={() => setType('bug')}
                    className="hidden"
                  />
                  <span>🐛 不具合の報告</span>
                </label>
                <label
                  className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${type === 'feature' ? 'bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-400 font-bold' : 'border-slate-300 dark:border-slate-600 opacity-70 hover:opacity-100'}`}
                >
                  <input
                    type="radio"
                    name="type"
                    value="feature"
                    checked={type === 'feature'}
                    onChange={() => setType('feature')}
                    className="hidden"
                  />
                  <span>💡 機能のご要望</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 opacity-80">
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  type === 'bug'
                    ? '例: タイマーが動かなくなった'
                    : '例: ダークモードの色をもっと暗くしてほしい'
                }
                className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 opacity-80">
                詳細な内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder={
                  type === 'bug'
                    ? '発生した画面や、どのような操作をしたか詳しく教えてください。'
                    : 'どのような機能が欲しいか、なぜ欲しいのか教えてください。'
                }
                className="w-full p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !description.trim()}
              className={`mt-4 py-4 rounded-xl font-bold text-white text-lg transition-all shadow-md ${isSubmitting || !title.trim() || !description.trim() ? 'bg-slate-400 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg hover:-translate-y-1'}`}
            >
              {isSubmitting ? '送信中...' : 'システム情報部へ送信する'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
