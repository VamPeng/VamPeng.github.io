# My Personal Blog

这是我的个人博客源代码仓库，使用 Hugo 构建，并部署在 GitHub Pages 上。

## 本地运行

1. 确保已安装 Hugo
```bash
brew install hugo
```

2. 克隆此仓库
```bash
git clone https://github.com/yourusername/blog
cd blog
```

3. 启动本地服务器
```bash
hugo server -D
```

4. 在浏览器中访问 http://localhost:1313

## 部署到 GitHub Pages

1. 创建新文章
```bash
hugo new content posts/my-new-post.md
```

2. 构建站点
```bash
hugo
```

3. 提交更改并推送到 GitHub
```bash
git add .
git commit -m "Add new post"
git push
```
