# 推送到 GitHub 的步骤

代码已经提交到本地 git 仓库，现在需要推送到 GitHub。

## 方法一：使用 HTTPS（推荐，最简单）

1. **在终端执行以下命令：**
   ```bash
   cd /Users/y5/Downloads/Trading_game
   git push -u origin main
   ```

2. **当提示输入用户名和密码时：**
   - 用户名：你的 GitHub 用户名
   - 密码：使用 **Personal Access Token**（不是 GitHub 密码）
     - 如果没有 Token，请访问：https://github.com/settings/tokens
     - 点击 "Generate new token (classic)"
     - 勾选 `repo` 权限
     - 生成后复制 Token，作为密码使用

## 方法二：使用 SSH

1. **检查是否有 SSH 密钥：**
   ```bash
   ls -la ~/.ssh/id_*.pub
   ```

2. **如果没有，生成 SSH 密钥：**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

3. **添加 SSH 密钥到 GitHub：**
   - 复制公钥：`cat ~/.ssh/id_ed25519.pub`
   - 访问：https://github.com/settings/keys
   - 点击 "New SSH key"，粘贴公钥

4. **更改远程仓库地址为 SSH：**
   ```bash
   cd /Users/y5/Downloads/Trading_game
   git remote set-url origin git@github.com:Y5-asas/Trading_game.git
   git push -u origin main
   ```

## 方法三：使用 GitHub CLI

如果你安装了 GitHub CLI：
```bash
gh auth login
cd /Users/y5/Downloads/Trading_game
git push -u origin main
```

## 当前状态

✅ 已初始化 git 仓库
✅ 已创建 .gitignore 文件
✅ 已提交所有代码（29 个文件）
✅ 已配置远程仓库地址

⚠️ 需要身份验证才能推送

## 提交的文件列表

- 微信小程序前端代码（miniprogram/）
- 项目配置文件
- 文档文件（README.md, PROJECT_STRUCTURE.md）
- .gitignore 文件

**注意：** private key 文件已被排除，不会上传到 GitHub。



