import { Link } from 'react-router-dom'
import WeatherWidget from '../../components/WeatherWidget'

interface PortalAppItem {
  title: string
  description: string
  icon: string
  path?: string
  href?: string
  color: string
}

export default function PortalHome() {
  const apps: PortalAppItem[] = [
    {
      title: 'お天気・気圧・防災情報',
      description:
        '大阪市のリアルタイム気象情報、気圧変化、発令中の警報・注意報、週間天気予報を確認できます。',
      icon: '⛅',
      path: '/weather',
      color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    },
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
    {
      title: '資格学習ナビ',
      description:
        'IT資格や簿記・MOSなどの公式概要、申し込みページ、無料過去問・学習サイトをまとめて確認できます。',
      icon: '🎓',
      path: '/certifications',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      title: 'エアレジCSV統合（経理・オフィスコンビニ用）',
      description:
        '単日ごとのエアレジ売上CSV（最大12ファイル）を、スマート利益管理アプリ取込用の日別統合CSVへブラウザ内のみで変換します。',
      icon: '🧾',
      href: `${import.meta.env.BASE_URL}airregi-csv/index.html`,
      color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    },
    {
      title: 'ポートフォリオ一覧',
      description:
        '事業所で制作したWebアプリやサイトなどのポートフォリオ作品をサムネイル・リンク付きで紹介しています。',
      icon: '💼',
      path: '/portfolios',
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    },
    // 将来他のアプリを追加する場合はここに追記
  ]

  return (
    <div className="w-full space-y-6 animation-fade-in">
      {/* 大阪市のお天気ミニウィジェット */}
      <WeatherWidget />

      <div>
        <h2 className="text-xl font-bold mb-4 opacity-80 pl-2">アプリ一覧</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app, index) => {
          const cardClassName = `glass-panel rounded-3xl p-6 flex flex-col items-start transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group border border-white/40 dark:border-white/10 ${app.color.split(' ')[0]}`
          const cardContent = (
            <>
              <div className="flex justify-between items-start w-full mb-4">
                <div className={`text-4xl p-4 rounded-2xl ${app.color}`}>{app.icon}</div>
                {app.href && (
                  <span
                    aria-hidden="true"
                    className="text-xs font-bold opacity-50 group-hover:opacity-100 transition-opacity"
                  >
                    ↗
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">
                {app.title}
                {app.href && <span className="sr-only">（新しいタブで開く）</span>}
              </h3>
              <p className="text-sm opacity-70 leading-relaxed">{app.description}</p>
            </>
          )

          return app.href ? (
            <a
              key={index}
              href={app.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cardClassName}
            >
              {cardContent}
            </a>
          ) : (
            <Link key={index} to={app.path || '/'} className={cardClassName}>
              {cardContent}
            </Link>
          )
        })}

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
          className="glass-panel rounded-3xl p-6 flex flex-col items-start transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group border border-blue-500/30 dark:border-blue-500/20 bg-blue-500/5 relative overflow-hidden"
        >
          <div className="flex justify-between items-start w-full mb-3">
            <div className="text-4xl group-hover:scale-110 transition-transform origin-left">
              🏢
            </div>
            <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded font-bold">
              内部NW専用
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">
            システム情報部 総合ポータル
          </h3>
          <p className="text-sm opacity-70 leading-relaxed">
            メンバー専用・アプリデータ管理（※内部NW専用・要パスワード）
          </p>
        </a>
        </div>
      </div>
    </div>
  )
}
