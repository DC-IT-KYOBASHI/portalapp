import { useState, useEffect } from 'react'

/**
 * 【共通コンポーネント】 トップへ戻るボタン
 * 
 * ページを一定量スクロールした際に、画面右下に「↑」ボタンを表示します。
 * どの画面でも使えるように作られているため、App.tsx などの大元で1度呼び出すだけで全画面に適用されます。
 * 
 * [カスタマイズ方法]
 * - ボタンの色や形を変えたい場合: `className` 内のTailwindクラスを変更してください。
 * - ボタンが現れるスクロール位置を変えたい場合: `window.scrollY > 300` の数値を変更してください。
 */
export default function ScrollToTopButton() {
  // ボタンの表示状態を管理するステート（最初は非表示）
  const [isVisible, setIsVisible] = useState(false)

  // スクロールイベントを監視する処理
  useEffect(() => {
    const toggleVisibility = () => {
      // 縦のスクロール量が300pxを超えたらボタンを表示
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // イベントリスナーを登録
    window.addEventListener('scroll', toggleVisibility)

    // クリーンアップ関数（コンポーネントが破棄された時にリスナーを解除する）
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  // ページトップへ滑らかにスクロールする関数
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-4 bg-teal-600 hover:bg-teal-500 text-white rounded-full shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-white/20 backdrop-blur-sm"
          aria-label="ページトップへ戻る"
        >
          {/* 上向きの矢印アイコン */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </>
  )
}
