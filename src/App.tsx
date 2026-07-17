import { Routes, Route } from 'react-router-dom'
import PortalHome from './pages/PortalHome'
import PomodoroTimer from './pages/PomodoroTimer'
import PromptDictionary from './pages/PromptDictionary'
import FeedbackForm from './pages/FeedbackForm'
import Changelog from './pages/Changelog'
import Header from './components/Header'
import ScrollToTopButton from './components/ScrollToTopButton'

/**
 * Reactアプリのメインファイル (App.tsx)
 * 
 * [新しいアプリ画面を追加する手順]
 * 1. `src/pages/` フォルダの中に新しいアプリのフォルダ（例: MyNewApp）を作る。
 * 2. その中に `index.tsx` を作り、画面のデザインを書く。
 * 3. この App.tsx の上部で `import MyNewApp from './pages/MyNewApp'` のように読み込む。
 * 4. 下記の `<Routes>` の中に `<Route path="/mynewapp" element={<MyNewApp />} />` を足す。
 * 5. `src/components/Header.tsx` を開いて、メニューに追加する。
 */
function App() {
  return (
    <div className="min-h-screen flex flex-col p-6 max-w-7xl mx-auto relative">
      
      {/* 画面上部の共通ヘッダー（ハンバーガーメニュー含む） */}
      <Header />

      {/* 画面右下のトップへ戻るボタン */}
      <ScrollToTopButton />

      {/* 画面遷移エリア */}
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<PortalHome />} />
          <Route path="/pomodoro" element={<PomodoroTimer />} />
          <Route path="/prompts" element={<PromptDictionary />} />
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/changelog" element={<Changelog />} />
        </Routes>
      </main>
      
    </div>
  )
}

export default App
