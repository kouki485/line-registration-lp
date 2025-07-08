# 動作確認用テストURL

## 基本情報
- **ベースURL**: `http://localhost:3000` (ローカル開発サーバー)
- **本番URL**: `https://your-domain.com` (実際のドメインに置き換え)

## テストパターン

### 1. ✅ 両方のパラメータが有効な場合
```
http://localhost:3000/?AD_CODE=0001_00001&elinktag=testTag123
http://localhost:3000/?AD_CODE=0001_00050&elinktag=customTag
http://localhost:3000/?AD_CODE=0001_00661&elinktag=3viiRysL
```
**期待動作**: 両方のパラメータを使用してリンクが構築される

### 2. ✅ AD_CODEのみ有効（elinktagはデフォルト使用）
```
http://localhost:3000/?AD_CODE=0001_00001
http://localhost:3000/?AD_CODE=0001_00025
http://localhost:3000/?AD_CODE=0001_00661
```
**期待動作**: AD_CODEとデフォルトのelinktag（3viiRysL）でリンクが構築される

### 3. ✅ elinktagのみ有効
```
http://localhost:3000/?elinktag=testTag123
http://localhost:3000/?elinktag=customElink
http://localhost:3000/?elinktag=specialTag
```
**期待動作**: elinktagのみでリンクが構築される

### 4. ⚠️ 無効なAD_CODE（範囲外）
```
http://localhost:3000/?AD_CODE=0001_00000&elinktag=testTag
http://localhost:3000/?AD_CODE=0001_00662&elinktag=testTag
http://localhost:3000/?AD_CODE=0002_00001&elinktag=testTag
http://localhost:3000/?AD_CODE=invalid_code&elinktag=testTag
```
**期待動作**: AD_CODEが無効なため、elinktagのみでリンクが構築される

### 5. ❌ パラメータなし（リンク無効化）
```
http://localhost:3000/
http://localhost:3000/?other_param=value
http://localhost:3000/?AD_CODE=&elinktag=
```
**期待動作**: リンクが無効化（透明度50%、クリック不可）

### 6. 🔍 エッジケース
```
http://localhost:3000/?AD_CODE=0001_00001&elinktag=
http://localhost:3000/?AD_CODE=&elinktag=testTag
http://localhost:3000/?AD_CODE=0001_00001&elinktag=日本語タグ
```
**期待動作**: 空文字列は無効として扱われる

## 動作確認手順

1. **ローカルサーバー起動**
   ```bash
   # 簡単なHTTPサーバーを起動
   python -m http.server 3000
   # または
   npx serve -p 3000
   ```

2. **ブラウザでテスト**
   - 各URLにアクセス
   - 開発者ツールのコンソールでログを確認
   - LINEボタンの外観とクリック可否を確認
   - LocalStorageの計測データを確認（F12 → Application → Local Storage）

3. **確認ポイント**
   - [ ] リンクのhref属性が正しく設定されているか
   - [ ] 無効時にボタンが半透明になっているか
   - [ ] 無効時にクリックできないか
   - [ ] 日本語や特殊文字が正しくエンコードされているか

## 生成されるリンクの例

### 有効な場合
```
https://ideaofficial.link-lc.com/adoptin/1/?AD_CODE=0001_00001&elinktag=testTag123
https://ideaofficial.link-lc.com/adoptin/1/?AD_CODE=0001_00050&elinktag=3viiRysL
https://ideaofficial.link-lc.com/adoptin/1/?elinktag=customTag
```

### 無効な場合
```
# (リンクが "#" に設定され、クリック不可状態)
```

## 🔧 登録反映の改善点

### 1. **計測スクリプトの初期化待機**
- elink計測スクリプトの読み込み完了を待つ仕組みを追加
- 初期化完了後にリンクを書き換え

### 2. **リンククリック時の事前計測**
- ボタンクリック時に `elink.conversion()` を事前実行
- カスタム計測ピクセルによる追加計測
- 登録完了前の計測で確実性を向上

### 3. **デバッグ情報の強化**
- 詳細なコンソールログを追加
- 計測の各段階での状態確認
- エラーハンドリングの強化

### 4. **クリック検出の確認ポイント**
- [ ] "🔥 リンククリック検出" のログが表示されるか
- [ ] "📱 モバイル環境: Yes/No" の表示確認
- [ ] "🤖 使用中のBOT ID" の表示確認
- [ ] "📊 クリック情報をlocalStorageに保存" のログが表示されるか
- [ ] "📊 クリック計測ピクセル送信" のログが表示されるか
- [ ] "✅ クリック計測完了（登録完了計測は実際の登録後に実行）" のログが表示されるか
- [ ] Network タブで click.gif リクエストが確認できるか

### 5. **モバイル環境での特別テスト**
モバイル環境でのテストが重要です：

```
# モバイル環境でのテスト推奨
http://localhost:3000/?AD_CODE=0001_00001&elinktag=testTag123
```

**モバイル確認方法**:
1. Chrome DevTools → Device Toolbar でモバイル表示
2. 実際のスマートフォンでアクセス
3. コンソールログで "📱 モバイル環境: Yes" の確認

### 6. **計測タイミングの最適化**

#### **修正前の問題**
- ❌ `elink.conversion()` をクリック時に早期実行
- ❌ 実際の登録完了前に計測が走る
- ❌ 複数エンドポイントへの重複送信

#### **修正後の改善**
- ✅ クリック時は軽量なクリック計測のみ
- ✅ 登録完了計測は elink側の自動実行に任せる
- ✅ 二重処理を回避

#### **正しい計測の流れ**
1. **ユーザーがクリック** → クリック計測実行
2. **LINE公式アカウントに移動** → 遷移
3. **友だち追加完了** → elink側が自動的に登録完了計測実行

### 7. **追加の強化ポイント**
- **適切な計測タイミング**: クリック時は軽量計測、登録完了は自動実行
- **LocalStorageフォールバック**: クリック計測データの保存
- **BOT ID自動検出**: 現在のBOT IDを自動確認
- **デバイス情報記録**: モバイル/デスクトップ環境の判定

## 注意事項

- AD_CODEの有効範囲: `0001_00001` ～ `0001_00661`
- URLエンコーディングが自動的に適用される
- 日本語文字列も正しく処理される
- 大文字小文字は区別される
- **モバイル環境での計測が登録反映の鍵**
- 適切な計測タイミングで二重処理を回避
- elinkの自動計測システムを活用
- `&euid=###uid###` パラメータで個別ユーザー識別 