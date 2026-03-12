# Wiki Template

MkDocs + GitHub Pages によるWikiテンプレートです。

## Markdownファイルの置き場所

すべての記事は **`docs/` フォルダ配下** に `.md` ファイルとして置いてください。

```
docs/
├── index.md          # トップページ（必須）
├── your-page.md      # 任意の記事
└── your-category/    # カテゴリを作る場合はフォルダを切る
    └── your-page.md
```

記事を追加したら `mkdocs.yml` の `nav:` セクションにも追記するとナビゲーションに表示されます。

### タグの使い方

記事のFrontmatterに `tags:` を追記すると、タグが付与されます。

```markdown
---
tags:
  - ガイド
  - 初心者向け
---

# 記事タイトル
```

付与したタグは **タグ一覧ページ**（`docs/tags.md`）に自動的に集約されます。

## 編集方法

1. GitHub.com 上でファイルを直接編集してコミット
2. または `git clone` → ローカルで編集 → `git push`

`main` ブランチへの push が検知されると、GitHub Actions が自動的にサイトをビルド・公開します。

## GitHub Pages の初期設定

リポジトリを作成後、**一度だけ**以下の設定が必要です。

1. リポジトリの **Settings** を開く
2. 左メニューの **Pages** を選択
3. **Build and deployment → Source** を `GitHub Actions` に変更して保存

以降は `main` への push で自動的に公開・更新されます。

## GitHub Actions について

本リポジトリのCIは **GitHub hosted runner** (`ubuntu-latest`) を使用します。  
セルフホストランナーは使用しないため、別途ランナーの用意は不要です。

## ローカルプレビュー

```bash
pip install -r requirements.txt
mkdocs serve
```

ブラウザで `http://127.0.0.1:8000` を開くとプレビューできます。
