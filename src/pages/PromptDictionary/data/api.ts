import { type PromptData, initialPrompts } from './prompts'

// ロリポップに設置した自作CMS(api.php)のURL
const CMS_API_URL =
  'https://dcitex-kyobashi-se.joinus-dc-kyobashi.com/apps-config/prompt-dictionary/api.php'

/**
 * 自作CMSからプロンプト一覧を取得する関数
 */
export async function fetchPromptsFromWP(): Promise<PromptData[]> {
  // CMSのURLがまだ設定されていない場合は、仮の初期データを返す（テスト用）
  if (!CMS_API_URL) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(initialPrompts), 800) // 疑似ローディング時間
    })
  }

  try {
    const response = await fetch(CMS_API_URL)
    if (!response.ok) throw new Error('API fetch error')

    // CMS(api.php)はすでにPromptDataと同じ形式でJSONを返してくれるため、そのままマッピング可能
    const data: PromptData[] = await response.json()
    return data
  } catch (error) {
    console.error('CMSからのデータ取得に失敗しました:', error)
    // エラー時はローカルの初期データをフォールバックとして返す
    return initialPrompts
  }
}
