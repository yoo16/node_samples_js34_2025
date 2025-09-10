# 🚀 Node.js チャットアプリ環境構築手順
## 0. プロジェクト構成
```
mychat/
├─ public/            # 静的ファイル (JS, CSS, 画像など)
│   ├─ js/
│   │   └─ chat.js    # クライアント用プログラム（画面制御、チャット送受信など）
│   ├─ css/
│   └─ images/        # ログインアイコン、スタンプなど
├─ views/             # EJS テンプレート
│   ├─ chat_form.ejs  # チャットフォーム
│   ├─ index.ejs      # トップページ
│   ├─ login.ejs      # ログイン画面
│   ├─ main.ejs       # チャットメイン画面
│   └─ user_list.ejs  # ユーザ一覧
├─ server.js          # サーバープログラム（バックエンド）
├─ .env               # 環境変数ファイル
└─ package.json       # Node.js パッケージ管理
```

## 1. Node初期化
```bash
npm init -y
```

## 2. 依存パッケージのインストール
```bash
npm i
```
※ このコマンドで以下が入ります：

* `express` : Web サーバ
* `ejs` : テンプレートエンジン
* `socket.io` : リアルタイム通信
* `dotenv` : 環境変数の管理
* `uuid` : ユーザー識別用のユニークID
* `nodemon` : 開発用ホットリロード

## 3. スクリプトの確認

`package.json` の `scripts` に以下があるので：

```json
"scripts": {
  "dev": "nodemon server"
}
```

## 4. 環境変数設定（`.env`）
.env ファイルを作成

```env
HOST=localhost
PORT=3000
```

## 5. サーバー起動

```bash
npm run dev
```

アクセス確認し「Cannot GET /」が表示されれば成功

```bash
http://localhost:3000
```