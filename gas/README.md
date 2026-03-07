# COCOGRAM チャイム - GAS 仕様書

## 概要

教育現場（教室）向けの時刻表示・スケジュール管理・チャイム自動再生 Web アプリケーション。
Google Apps Script (GAS) の HTML Service を利用した Web アプリとしてデプロイされる。

## 動作環境

- Google Apps Script (V8 ランタイム)
- 対応ブラウザ: Chrome、Edge、Safari、Firefox（最新版）
- 対応 OS: Windows、macOS

## 機能一覧

### 1. 時刻表示

- 現在時刻を HH:MM 形式でリアルタイム表示（1 秒ごと更新）
- コロン（:）が 1 秒ごとに表示/非表示を切り替え（点滅効果）
- 画面サイズに応じてフォントサイズを動的に計算

### 2. スケジュール循環表示

- 1 時間を区切ったスケジュールを一覧表示
- 現在のタスクを先頭に配置する循環表示
- 現在のタスクは黄色背景・大きいフォント・太字で強調
- 各タスクに開始時刻と終了時刻を表示
- 相対位置に応じた透明度の段階的変化（中心: 1.0 → 末尾: 0.2）
- 相対位置に応じたスケール変化（現在: 1.05 → 次: 0.95 → それ以降: 0.9）
- 最後のアイテムに循環マーク表示

### 3. チャイム自動再生

- 指定した「分」に自動でチャイム音を再生
- 指定した時間帯（開始時〜終了時）に限定して再生
- 100ms 間隔のポーリングで再生タイミングを判定
- 秒数が 0 の瞬間にのみ再生（重複再生防止）
- チャイム音声は Base64 エンコードして HTML 内に埋め込み（外部依存なし）
- ブラウザの自動再生ポリシーに対応（ユーザー操作後に Audio を初期化）

### 4. 設定モーダル

- 歯車アイコンから設定画面を開く
- チャイムを鳴らす分の追加・削除（タグ形式の UI）
- チャイムを鳴らす時間帯の変更（セレクトボックス、0〜23 時）
- 初期値リセット機能
- 設定は localStorage に保存（端末ごとに個別管理）

### 5. 開始インタラクション

- 初回表示時は「画面をクリック・タップしてください」メッセージを表示
- 画面クリック/タップで時刻表示・チャイム再生を開始
- ブラウザの音声自動再生制限を回避するために必要

### 6. レスポンシブ対応

- 画面サイズに応じてフォントサイズを動的に計算
- 時計: `Math.min(幅 * 0.15, 高さ * 0.12)`
- ラベル: `Math.min(幅 * 0.05, 高さ * 0.04)`
- ウィンドウリサイズ時に自動再計算

## スケジュール定義

| 時間帯  | タスク名       |
| ------- | -------------- |
| 00〜09分 | タイピング     |
| 10〜44分 | プログラミング |
| 45〜48分 | かたづけ       |
| 49〜49分 | あいさつ       |
| 50〜59分 | 授業準備       |

## チャイム設定（初期値）

| 項目       | 値              |
| ---------- | --------------- |
| 鳴らす分   | 0, 10, 45, 50分 |
| 開始時     | 10時            |
| 終了時     | 16時            |

## データ保存

| キー                      | 保存先        | 内容                                           |
| ------------------------- | ------------- | ---------------------------------------------- |
| `cocogram-chime-settings` | localStorage  | `{ minutes: number[], startHour: number, endHour: number }` |

## ファイル構成

```
gas/
├── appsscript.json      GAS マニフェスト（タイムゾーン、デプロイ設定）
├── Code.js              サーバーサイド（doGet、include 関数）
├── index.html           メインテンプレート（HTML 構造 + include 指示）
├── styles.html          CSS（テーマカラー、レイアウト、モーダル）
├── script-data.html     スケジュールデータ、ユーティリティ関数、循環表示ロジック
├── script-settings.html 設定管理（localStorage 読み書き）
├── script-chime.html    チャイム音声（Base64）+ 再生ロジック
└── script-ui.html       DOM 更新、モーダル操作、メインロジック
```

## 各ファイルの責務

### appsscript.json

GAS プロジェクトのマニフェストファイル。

- タイムゾーン: `Asia/Tokyo`
- ランタイム: V8
- Web アプリ設定: デプロイユーザーとして実行、匿名アクセス可

### Code.js

GAS サーバーサイドスクリプト。

| 関数               | 役割                                                      |
| ------------------ | --------------------------------------------------------- |
| `doGet()`          | HTTP GET に対して index.html をテンプレート評価して返す    |
| `include(filename)`| 指定ファイルの内容を返す（テンプレート内インクルード用）   |

### index.html

メインの HTML テンプレート。`<?!= include('filename') ?>` で他ファイルをインクルードする。

構成要素:
- 設定ボタン（歯車 SVG アイコン）
- 開始前メッセージ画面
- メインコンテンツ（時計 + 区切り線 + スケジュール一覧）
- 設定モーダル（分設定、時間帯設定、リセット、閉じる）

### styles.html

全スタイルを定義する CSS。

テーマカラー（CSS 変数）:

| 変数名               | 色       | 用途             |
| -------------------- | -------- | ---------------- |
| `--color-primary`    | `#eab308`| 黄色（メイン）   |
| `--color-secondary`  | `#f97316`| オレンジ         |
| `--color-accent`     | `#84cc16`| 黄緑             |
| `--color-base-100`   | `#ffffff`| 白               |
| `--color-base-200`   | `#fefce8`| 黄色系背景       |
| `--color-base-300`   | `#fef08a`| 区切り線等       |
| `--color-base-content`| `#1c1917`| テキスト色      |

レイアウト:
- GAS iframe 対応: `html, body { height: 100% }` + `#app { min-height: 100% }`
- コンテンツはみ出し対応: `align-items: safe center` + `overflow-y: auto`

### script-data.html

データ定義とユーティリティ関数。

| 変数/関数                        | 役割                                           |
| -------------------------------- | ---------------------------------------------- |
| `minuteSchedule`                 | スケジュール配列（minute, do）                 |
| `getCurrentTask(minute)`         | 現在の分に対応するタスク名を返す               |
| `getTimeToNextTask(minute)`      | 次のタスクまでの残り分数を返す                 |
| `formatTime(h, m, showColon)`    | HH:MM / HH MM 形式でフォーマット              |
| `formatTimeDisplay(h, minStr)`   | 時と分文字列から HH:MM 形式を生成             |
| `isCurrentSchedule(range, min)`  | 分がスケジュール範囲内かを判定                 |
| `getCircularSchedule(sch, idx)`  | 現在タスクを先頭にした循環配列を生成           |
| `getOpacityByRelative(idx, total)`| 相対位置に応じた透明度（0.2〜1.0）を計算      |
| `getScaleByRelative(idx)`        | 相対位置に応じたスケール値を計算               |

### script-settings.html

チャイム設定の管理。

| 変数/関数                | 役割                                   |
| ------------------------ | -------------------------------------- |
| `STORAGE_KEY`            | localStorage キー名                   |
| `DEFAULT_SETTINGS`       | 初期設定値                             |
| `settings`               | 現在の設定（グローバル変数）           |
| `loadSettings()`         | localStorage から設定を読み込む        |
| `saveSettings()`         | localStorage に設定を保存する          |
| `addMinute(minute)`      | 指定分を追加（0-59、重複不可、ソート） |
| `removeMinute(minute)`   | 指定分を削除                           |
| `setStartHour(hour)`     | 開始時を設定（0-23）                   |
| `setEndHour(hour)`       | 終了時を設定（0-23）                   |
| `resetToDefault()`       | 設定を初期値に戻す                     |

### script-chime.html

チャイム音声の再生機能。

| 変数/関数              | 役割                                              |
| ---------------------- | ------------------------------------------------- |
| `CHIME_BASE64`         | チャイム音声の Base64 エンコードデータ             |
| `audio`                | Audio オブジェクト                                 |
| `initAudio()`          | Audio を初期化し自動再生ポリシーに対応             |
| `checkAndPlayChime()`  | 現在時刻が設定条件に一致すればチャイムを再生       |

再生条件（すべて満たす場合に再生）:
- 現在の「分」が `settings.minutes` に含まれる
- 現在の「時」が `settings.startHour` 以上
- 現在の「時」が `settings.endHour` 以下
- 現在の「秒」が 0

### script-ui.html

DOM 操作とイベントハンドラ。

| 変数/関数                    | 役割                                       |
| ---------------------------- | ------------------------------------------ |
| `isStarted`                  | 開始済みフラグ                             |
| `showColon`                  | コロン表示/非表示の切り替え状態            |
| `clockInterval`              | 時計更新の setInterval ID                  |
| `chimeInterval`              | チャイム判定の setInterval ID              |
| `updateClock()`              | 時計とスケジュール表示を更新（1秒ごと）    |
| `updateSchedule(min, hour)`  | スケジュール DOM を再構築                  |
| `updateFontSizes()`          | 画面サイズに応じてフォントサイズを更新     |
| `renderMinuteTags()`         | 設定モーダルの分タグを描画                 |
| `renderHourSelects()`        | 設定モーダルの時間帯セレクトを描画         |
| `handleMinuteKeyDown(event)` | 分入力の Enter キーハンドラ                |
| `handleAddMinute()`          | 分追加ボタンハンドラ                       |
| `handleStartHourChange(e)`   | 開始時変更ハンドラ                         |
| `handleEndHourChange(e)`     | 終了時変更ハンドラ                         |
| `handleReset()`              | リセットハンドラ                           |
| `handleSettingsClick(event)` | 設定ボタンクリックハンドラ                 |
| `closeModal(event)`          | モーダルを閉じる（オーバーレイクリック）   |
| `closeModalDirect()`         | モーダルを閉じる（ボタン）                 |
| `handleAppClick(event)`      | 画面クリックで開始                         |
| `init()`                     | 初期化（設定読込、フォントサイズ、リサイズリスナー）|

## 画面遷移

```
[初期表示]
  「画面をクリック・タップしてください」メッセージ
  設定ボタン（右上）
    ↓ 画面クリック/タップ
[メイン画面]
  時計表示（HH:MM、コロン点滅）
  区切り線
  スケジュール一覧（循環表示）
  設定ボタン（右上）
    ↓ 設定ボタンクリック
[設定モーダル]（オーバーレイ表示）
  チャイムを鳴らす分（タグ表示 + 追加/削除）
  チャイムを鳴らす時間帯（セレクトボックス）
  初期値に戻す / 閉じるボタン
```

## 更新ループ

```
[1秒ごと] updateClock()
  ├── コロン点滅切り替え
  ├── 時計テキスト更新
  └── updateSchedule()
        └── スケジュール DOM 再構築

[100msごと] checkAndPlayChime()
  └── 条件一致時にチャイム再生

[リサイズ時] updateFontSizes()
  └── フォントサイズ再計算
```

## 開発・デプロイ

### 前提条件

- Node.js / Bun
- clasp（`@google/clasp`）
- Biome（`@biomejs/biome`、フォーマッター）

### コマンド

| コマンド             | 説明                              |
| -------------------- | --------------------------------- |
| `clasp push --force` | ローカルのファイルを GAS にプッシュ |
| `clasp pull`         | GAS のファイルをローカルにプル      |
| `clasp deploy`       | Web アプリとしてデプロイ            |
| `clasp open`         | GAS エディタをブラウザで開く        |
| `bun run format`     | Biome でフォーマット実行            |
| `bun run format:check`| Biome でフォーマットチェック       |

### clasp 設定

`.clasp.json`（gitignore 対象）に以下を設定:

```json
{
    "scriptId": "<GAS プロジェクトの Script ID>",
    "rootDir": "gas"
}
```

### デプロイ手順

1. `clasp push --force` でファイルをアップロード
2. GAS エディタで「デプロイ」→「デプロイを管理」→ 対象デプロイの「編集」→「デプロイ」
