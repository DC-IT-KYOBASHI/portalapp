import { type PromptData, initialPrompts } from './prompts'
import { fetchApi } from '../../../utils/api'

/**
 * 自作CMSからプロンプト一覧を取得する関数
 */
export async function fetchPromptsFromWP(): Promise<PromptData[]> {
  try {
    const data = await fetchApi<PromptData[]>('?api=true&module=PromptDictionary')
    return data
  } catch (error) {
    console.error('CMSからのデータ取得に失敗しました:', error)
    // エラー時はローカルの初期データをフォールバックとして返す
    return initialPrompts
  }
}
