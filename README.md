# 🌟 DCITエキスパート京橋オフィス ポータルアプリ (フロントエンド)

本リポジトリは、就労移行支援の訓練や業務効率化に役立つ「便利アプリ」を集めたシングルページアプリケーション（SPA）のポータルサイトです。
React + TypeScript + Vite で構築されており、バックエンドAPI（`system-admin`）や気象庁オープンデータと連携して動作します。

---

## 🛠 技術スタック
- **言語・フレームワーク**: React 19 (TypeScript) + Vite
- **スタイリング**: Tailwind CSS (レスポンシブ・ダークモード対応・Glassmorphism)
- **ルーティング**: React Router (HashRouter / 静的ホスティング対応)
- **テスト・品質管理**: Node.js Native Test Runner, Oxlint, Prettier

---

## 🚀 1. 開発の始め方 (セットアップ手順)

初めてこのプロジェクトを自分のPCで触る際の手順です。

1. **VSCodeでこのフォルダを開く**
   * 推奨拡張機能（Prettier等）の通知が出たら「インストール」をクリックしてください。
2. **必要なパッケージをインストールする**
   * ターミナルを開き、以下のコマンドを実行します（初回のみ）。
     ```bash
     npm install
     ```
3. **ローカルサーバーを起動する（開発スタート！）**
   * 続いて以下のコマンドを実行します。
     ```bash
     npm run dev
     ```
   * 画面に表示されるURL（例: `http://localhost:5173/`）をブラウザで開くとアプリが確認できます。
4. **自動テストの実行**
   * お天気API連携やパースロジックの動作検証を行います。
     ```bash
     npm test
     ```

---

## 📁 2. フォルダの構成 (どこに何があるか)

* `src/` : ソースコード全般
  * `components/` : 全画面共通コンポーネント（Header, BackToHomeButton, WeatherWidget 等）
  * `pages/` : 各アプリや画面のプログラム
    * `PortalHome/` : ポータルホーム画面（アプリ一覧 & 天気ウィジェット）
    * `Weather/` : 大阪市 お天気・気圧・防災情報ページ
    * `PomodoroTimer/` : ポモドーロタイマー画面
    * `PromptDictionary/` : AIプロンプト逆引き辞典画面
    * `FeedbackForm/` : 不具合報告・ご要望送信フォーム
    * `Changelog/` : 更新履歴タイムライン
  * `hooks/` : 共通カスタムフック（API非同期通信を共通化する `useApi.ts`）
  * `utils/` : 共通ユーティリティ関数
  * `types/` : TypeScript 型定義ファイル
  * `config.ts` : アプリ全体のバージョン・サイト名・APIベースURL設定
  * `App.tsx` : アプリ全体のルーティング設定
  * `index.css` : 全体のデザイン・スタイル設定（Tailwind CSS）
* `public/` : 静的ファイル（`.htaccess` や `favicon.ico` など、ビルド時にそのまま出力されるファイル）
* `tests/` : 自動テストコード（`weather.test.mjs` 等）
* `.env` / `.env.production` : 環境変数設定

---

## 🛠️ 3. 新しいアプリを追加する手順

新しいアプリを作成してポータルに追加する手順です。

### ステップ1: 新しいアプリのフォルダと画面を作る
1. `src/pages/` の中に、新しいフォルダを作ります（例：`src/pages/MemoApp/`）。
2. その中に `index.tsx` を作成し、画面のデザインやロジックを書きます。
3. 画面上部には共通の `BackToHomeButton` を配置すると、統一した「← ホームに戻る」ナビゲーションが提供されます。
   ```tsx
   import BackToHomeButton from '../../components/BackToHomeButton';

   export default function MemoApp() {
     return (
       <div className="w-full animation-fade-in">
         <BackToHomeButton />
         <h2 className="text-2xl font-bold">📝 メモアプリ</h2>
         {/* ここにアプリの処理 */}
       </div>
     );
   }
   ```

### ステップ2: トップページのアプリ一覧に追加する
1. `src/pages/PortalHome/index.tsx` を開きます。
2. `const apps = [...]` 配列の中に、新しいアプリの情報を追記します。
   ```tsx
   {
     title: 'メモアプリ',
     description: '日々の学習メモやタスクを素早く記録できるアプリです。',
     icon: '📝',
     path: '/memo',
     color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
   },
   ```

### ステップ3: ルーティング（URL）を登録する
1. `src/App.tsx` を開きます。
2. 上部でコンポーネントをインポートし、`<Routes>` の中に `<Route>` を追加します。
   ```tsx
   import MemoApp from './pages/MemoApp';

   // <Routes> 内に追記:
   <Route path="/memo" element={<MemoApp />} />
   ```

### ステップ4: ヘッダーメニュー（ハンバーガーメニュー）に追加する
1. `src/components/Header.tsx` を開きます。
2. `const menuItems = [...]` 配列に新しい画面の名前とパスを追加します。
   ```tsx
   { name: 'メモアプリ', path: '/memo', icon: '📝' },
   ```

---

## 📡 4. バックエンドAPIとの通信について

このフロントエンドアプリは、データを読み書きする際に `src/hooks/useApi.ts` カスタムフックを使ってバックエンド（ロリポップサーバー上の PHP API）と通信します。

**使用例 (GETリクエスト):**
```tsx
import { useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import type { PromptData } from '../../types';

export default function MyComponent() {
  const { data, error, isLoading, execute } = useApi<PromptData[]>([]);

  useEffect(() => {
    execute('?api=true&module=PromptDictionary');
  }, [execute]);

  if (isLoading) return <p>読み込み中...</p>;
  return <div>{/* データ描画 */}</div>;
}
```

**使用例 (POSTリクエスト):**
```tsx
const { execute } = useApi(null);

await execute('?api=true&module=Feedback', {
  method: 'POST',
  body: JSON.stringify({ type: 'feature', title: '新機能要望', description: '〇〇機能が欲しいです' }),
});
```

※ APIへのリクエスト時、URLは `src/config.ts` の `API_BASE_URL` に自動結合されます。フロントコントローラパターンを採用しているため、`?api=true&module=XXX` というクエリパラメータでモジュールを呼び出します。

---

## 🔒 5. 内部ネットワーク専用の管理画面について

トップ画面のアプリ一覧や、ヘッダーメニュー内にある「🏢 システム情報部 総合ポータル」へのリンクは、**内部ネットワーク（社内環境）専用**の管理画面への直リンクとなっています。
外部（スマホの4G回線や自宅回線等）からアクセスした場合はIPアドレス制限により「403 Forbidden」となります。

---

## 🌍 6. サイトの公開 (ビルドとデプロイ)

本番環境向けにアプリを出力し、公開する手順です。

### ビルド（本番ファイルの生成）
ターミナルで以下のコマンドを実行します。
```bash
npm run build
```
型チェック（`tsc -b`）と Vite バンドルが実行され、`dist` フォルダに最適化された公開ファイルが一式生成されます。

### アップロード (デプロイ)

**【GitHub Pages への公開（推奨）】**
以下のコマンドを実行します。
```bash
npm run deploy
```
自動的にビルドが実行され、`gh-pages` ブランチにプッシュされて即座に Web 上へ公開されます。

**【ロリポップサーバー等の一般Webサーバーへ公開する場合】**
生成された `dist` フォルダの **中身すべて** を、FTPソフト等を使用してサーバーの公開ディレクトリ（ルート）にアップロードしてください。
※同梱されている `.htaccess` ファイルも必ずアップロードしてください（React Router の画面再読み込み時の404エラーを防ぐため）。
