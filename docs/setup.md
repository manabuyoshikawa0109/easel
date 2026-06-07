# libs/canva-editor 環境構築手順
## 前提条件の確認
* node -v   # 20.x であること<br>
補足： v22.15.1 でも問題ありません。<br>
package.json の "engines": { "node": "20.x" } は推奨バージョンの記載であり、強制ではありません。Node.js は基本的に上位互換なので、v22 で v20 向けのコードは動きます。<br>
pnpm install 時に警告が出る可能性はありますが、インストール・起動ともに正常に動作します。
* pnpm -v   # インストール済みであること<br>
pnpm が入っていない場合：npm install -g pnpm
## 手順
① ルートで依存パッケージをインストール
```
cd /path/to/easel
pnpm install
```
② mock-api を起動（エディタがAPIデータを取得するために必要）
```
make mock_up
→ http://localhost:4000 で起動
```
③ 別のターミナルで canva-editor を起動
```
make editor_up
→ http://localhost:5173 で起動
```
## 確認
ブラウザで http://localhost:5173 を開いてエディタが表示されれば完了です。
補足： pnpm install はルートで1回だけ実行すれば libs/canva-editor の依存関係も含めてすべてインストールされます。libs/canva-editor 内で個別に npm install する必要はありません。