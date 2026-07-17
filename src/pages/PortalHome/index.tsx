import { Link } from 'react-router-dom'

export default function PortalHome() {
  const apps = [
    {
      title: 'ポモドーロタイマー',
      description:
        '複数のタスクを並行管理できる、作業集中タイマー。就労訓練の模擬業務やタイムマネジメントに。',
      icon: '🍅',
      path: '/pomodoro',
      color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    },
    {
      title: 'AIプロンプト逆引き辞典',
      description:
        'やりたい事からAIへの効果的な指示出し（プロンプト）を検索・コピーできる辞典アプリです。',
      icon: '🤖',
      path: '/prompts',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    },
    // 将来他のアプリを追加する場合はここに追記
  ]

  return (
    <div className="w-full animation-fade-in">
      <h2 className="text-xl font-bold mb-6 opacity-80 pl-2">アプリ一覧</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app, index) => (
          <Link
            key={index}
            to={app.path}
            className={`glass-panel rounded-3xl p-6 flex flex-col items-start transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group border border-white/40 dark:border-white/10 ${app.color.split(' ')[0]}`}
          >
            <div className={`text-4xl mb-4 p-4 rounded-2xl ${app.color}`}>{app.icon}</div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">
              {app.title}
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">{app.description}</p>
          </Link>
        ))}

        {/* 不具合・要望フォーム リンク */}
        <Link
          to="/feedback"
          className="glass-panel rounded-3xl p-6 flex flex-col items-start transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group border border-teal-500/30 dark:border-teal-500/20 bg-teal-500/5"
        >
          <div className="text-4xl mb-4 p-4 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform origin-left">
            📮
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-teal-500 transition-colors">
            不具合報告・ご要望
          </h3>
          <p className="text-sm opacity-70 leading-relaxed">
            システム情報部へ、アプリの不具合や新しい機能の要望を直接送ることができます。
          </p>
        </Link>

        {/* Coming soon カード */}

        {/* システム情報部 総合ポータル カード（常に最後尾に固定） */}
        <a
          href="https://dcitex-kyobashi-se.joinus-dc-kyobashi.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-panel rounded-3xl p-6 flex flex-col items-start transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group border border-blue-500/30 dark:border-blue-500/20 bg-blue-500/5"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform origin-left">
            🏢
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">
            システム情報部 総合ポータル
          </h3>
          <p className="text-sm opacity-70 leading-relaxed">
            メンバー専用・アプリデータ管理（※要パスワード）
          </p>
        </a>
      </div>
    </div>
  )
}
