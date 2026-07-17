import { API_BASE_URL } from '../config';

/**
 * カスタムのエラークラス（ステータスコードを保持）
 */
export class ApiError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

/**
 * 共通のAPIフェッチ関数
 * @param endpoint '/changelog.php' のようなエンドポイント
 * @param options fetchのオプション
 * @returns レスポンスのJSONデータ（Promise）
 */
export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // CSRF対策用のデフォルトヘッダーを設定
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'X-App-Client': 'React-Portal',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      if (response.status === 429) {
        throw new ApiError('通信回数が多すぎます。しばらく時間をおいてから再度お試しください。', 429);
      }
      throw new ApiError('ネットワークエラーが発生しました。', response.status);
    }

    // レスポンスが空の場合はnullを返すなど適宜調整
    const text = await response.text();
    if (!text) return null as T;

    return JSON.parse(text) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error; // そのまま投げる
    }
    console.error('fetchApi Error:', error);
    throw new ApiError('サーバーとの通信に失敗しました。', 500);
  }
}
