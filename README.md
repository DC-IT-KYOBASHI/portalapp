# 🌟 DCITエキスパート京橋オフィス アプリ集 (フロントエンド)

このプロジェクトは、就労移行支援の訓練や業務効率化に役立つ「便利アプリ」を集めたSPA（シングルページアプリケーション）のポータルサイトです。
React + Vite で構築されており、バックエンドのAPI（`system-admin`）と通信して動作します。

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
   * 画面に表示されるURL（例: `http://localhost:5173/`）を開くとアプリが確認できます。

---

## 📂 2. フォルダの構成 (どこに何があるか)

* `src/` : ソースコード全般
  * `pages/` : 各アプリや画面のプログラム（PortalHome, PomodoroTimer, FeedbackForm など）
  * `utils/` : 共通の便利関数（API通信用の `fetchApi` など）
  * `App.tsx` : アプリ全体のルーティング設定
  * `index.css` : 全体のデザイン・スタイル設定（Tailwind CSS）
* `public/` : 静的ファイル（`.htaccess` や `favicon.ico` など、ビルド時にそのまま出力されるファイル）
* `.env` / `.env.production` : 環境変数（APIのURLやベースパスの設定）

---

## 🛠️ 3. 新しいアプリを追加する手順

### ステップ1: 新しいアプリのフォルダを作る
1. `src/pages/` の中に、新しいフォルダを作ります（例：`MemoApp/`）。
2. その中に `index.tsx` を作って、Reactコンポーネントを書きます。

### ステップ2: トップページにリンクを追加する
1. `src/pages/PortalHome/index.tsx` を開きます。
2. `const apps = [...]` のリストの中に、新しいアプリの情報を追記します。

### ステップ3: ルーティング（URL）を登録する
1. `src/App.tsx` を開きます。
2. 追加したコンポーネントをインポートし、`<Routes>` の中に `<Route path="/memo" element={<MemoApp />} />` のように追加します。

---

## 📡 4. バックエンドAPIとの通信について

このフロントエンドアプリは、データを読み書きする際に `src/utils/api.ts` の `fetchApi` 関数を使ってバックエンド（ロリポップサーバー上の `system-admin`）と通信します。

**使用例:**
```tsx
import { fetchApi } from '../../utils/api';

// データを取得する場合
const data = await fetchApi('?api=true&module=Changelog');

// データを送信する場合（POST）
await fetchApi('?api=true&module=Feedback', {
  method: 'POST',
  body: JSON.stringify({ type: 'bug', title: 'バグ発見' })
});
```

APIの通信先URLは、環境変数ファイル（`.env.production` またはローカルの `.env`）の `VITE_API_URL` によって切り替わります。

---

## 🌍 5. サイトの公開 (ビルドとデプロイ)

本番環境向けにアプリを出力し、公開する手順です。
現在、公開先に応じて `.env.production` の `VITE_BASE_PATH` を変更する必要があります。

### 事前準備: `.env.production` の確認
デプロイする場所に合わせて `VITE_BASE_PATH` が正しく設定されているか確認してください。
* **GitHub Pages 等のサブディレクトリ (`/portalapp/`) に公開する場合**: `VITE_BASE_PATH=/portalapp/`
* **独自ドメインのルート (`/`) に公開する場合**: `VITE_BASE_PATH=/`

### ビルド（本番ファイルの生成）
ターミナルで以下のコマンドを実行します。
```bash
npm run build
```
処理が完了すると、`dist` というフォルダが作成され、その中に公開用のファイル（HTML, CSS, JS）が一式生成されます。

### アップロード (デプロイ)
**【GitHub Pages の場合】**
`npm run deploy` を実行することで、自動的に `gh-pages` ブランチにプッシュされ公開されます。

**【ロリポップサーバー等の場合】**
生成された `dist` フォルダの **中身すべて** を、FTPソフト等を使用してサーバーの公開ディレクトリ（ルート）にアップロードしてください。
※同梱されている `.htaccess` ファイルも必ずアップロードしてください。（Reactルーターの404エラーを防ぐため）
