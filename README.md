# SIP.js SimpleUser SIP Client Example

## ソースコード
- [Githubリポジトリ: denwaya34/sipjs-simple-user-react-example](https://github.com/denwaya34/sipjs-simple-user-react-example)

## Demo
- [Github Pages](https://denwaya34.github.io/sipjs-simple-user-react-example/)

**[注意事項]**
使用を開始する前に一度`SIP WebSocket URL`に指定のホスト名にブラウザでhttpsでアクセスしてください。  
※例)https://{AsteriskのIPアドレス}:8089  

アクセスしてプライバシーエラーの表示が出た場合、詳細設定にある`アクセスする(安全ではありません)`ボタンを押下してください。  
その後、Not Found表示のエラーが出れば問題ありません。  
※これは自己証明書エラーの回避手順です。  

## Copy

下記コマンドでリポジトリを複製できます。
```shell
npx degit denwaya34/sipjs-simple-user-react-example my-sipjs-example
```

## 作成プロンプト

本コードのベースとなるコードを生成する時に使用したプロンプト.

### Cursor(Claude-4-sonnet opus: MAX Mode) 作成プロンプト

```markdown
SIP.jsのSimpleUserクラスを用いて、下記の仕様に基づいて実装してください。
遠慮せずに、全力を尽くしてください。

- UI
  下記のUIを配置してください。
  - SIP WebSocket URL テキストボックス
    SIP WebSocketサーバーのURLを入力するテキストボックス
  - SIP User テキストボックス
    SIPのユーザー名を入力するテキストボックス
  - SIP Password テキストボックス
    SIPのパスワードを入力するテキストボックス
  - 接続ボタン
    SimpleUserのconnectメソッドを呼び出すボタン
    `SIP WebSocket URL テキストボックス`,`SIP User テキストボックス`,`SIP Password テキストボックス`が一文字以上入力されている場合のみ押下できる
  - 発信番号テキストボックス
    発信先の電話番号を入力するテキストボックス
  - 発信ボタン
    発信ボタンを押下すると、SimpleUserのcallメソッドを呼び出すボタン
    待機中の場合のみ押下できる
  - 切断ボタン
    切断ボタンを押下すると、SimpleUserのhangupメソッドを呼び出すボタン
    通話中の場合のみ押下できる
  - 応答ボタン
    着信があった場合に、SimpleUserのanswerメソッドを呼び出すボタン
    着信中の場合のみ押下できる
    通話中、待機中の場合は押下できない
- SIP.jsのSimpleUserクラスを用いて、下記の機能を実装してください。
  - SIP WebSocketサーバーへの接続
    `SIP WebSocket URL テキストボックス`に入力されたURLに接続する
  - 発信
    `発信番号テキストボックス`に入力された電話番号に発信する
  - 着信応答
    着信中に応答ボタンを押下した場合、応答する
  - 切断
    通話中の場合に、切断する
  - 状態表示
    現在の状態を表示する（待機中、通話中、着信中、発信中のいづれかを表示）
- 必要に応じてreactのカスタムフックでロジック部分を分離してください
- メソッドは参照透過となる事を意識して実装してください
```

## 備考

### .envファイルについて

.env.exampleを.evnにリネームするとファイル中の環境変数が設定されます。
環境変数によって設定される内容はファイルのコメントを確認してください。
