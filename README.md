# 黄金交易游戏 - 微信小程序

一个模拟金融交易的微信小程序，支持用户注册、登录、交易操作和历史记录查看。

## 📋 项目简介

这是一个模拟黄金（XAUUSD）交易的小程序，用户可以：
- 注册/登录账户
- 开始新的交易游戏
- 执行买入/卖出/持仓操作
- 查看交易历史和账户统计
- 管理个人资料

## 🏗️ 项目结构

```
Trading_game/
├── miniprogram/          # 微信小程序前端代码
│   ├── app.js           # 小程序入口文件
│   ├── app.json         # 小程序配置
│   ├── game.json        # 游戏配置文件（真机调试需要）
│   ├── pages/           # 页面目录
│   │   ├── login/       # 登录/注册页
│   │   ├── index/       # 首页
│   │   ├── trading/     # 交易页
│   │   ├── history/     # 历史记录页
│   │   └── profile/     # 个人中心页
│   ├── utils/           # 工具类
│   │   ├── api.js       # API 请求封装
│   │   └── api-cloud.js # 云函数 API（备用）
│   └── styles/          # 样式文件
│       └── common.wxss  # 公共样式
└── README.md            # 项目说明
```

## 🚀 快速开始

### 前置要求

- 微信开发者工具
- 微信小程序账号（AppID）
- 后端 API 服务（FastAPI）

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/Y5-asas/Trading_game.git
   cd Trading_game
   ```

2. **打开微信开发者工具**
   - 选择"导入项目"
   - 选择 `miniprogram` 目录
   - 输入 AppID：`wxda7c5efe869c01c2`

3. **配置 API 地址**
   - 编辑 `miniprogram/app.js`
   - 修改 `apiBaseUrl` 为你的后端 API 地址

4. **启动后端服务**
   ```bash
   # 确保后端服务运行在 8000 端口
   python run_api.py
   ```

5. **编译运行**
   - 在微信开发者工具中点击"编译"
   - 开始测试

## 📱 功能模块

### 1. 用户认证
- 用户注册
- 用户登录
- Token 管理
- 自动登录

### 2. 游戏会话
- 开始新游戏
- 继续游戏
- 游戏状态查询

### 3. 交易操作
- 买入操作
- 卖出操作
- 持仓操作
- 实时价格显示
- 账户信息（余额、持仓、盈亏）

### 4. 历史记录
- 查看所有游戏历史
- 显示收益率、交易次数、胜率等统计

### 5. 个人中心
- 用户信息展示
- 退出登录

## 🔧 技术栈

### 前端
- 微信小程序原生框架
- JavaScript (ES6+)
- WXML + WXSS

### 后端
- FastAPI
- SQLite（用户数据）
- ClickHouse（市场数据）

### 部署
- ngrok（开发环境内网穿透）

## ⚙️ 配置说明

### API 地址配置

在 `miniprogram/app.js` 中配置：

```javascript
globalData: {
  apiBaseUrl: 'https://your-api-domain.com/api',
  useCloud: false  // 是否使用云函数
}
```

### 项目类型

- **compileType**: `miniprogram`（普通小程序）
- **后台分类**: 游戏（仅分类标签）
- **特殊配置**: 需要 `game.json`（真机调试要求）

## 📝 开发注意事项

### 游戏类小程序兼容性

由于后台分类选择了"游戏"，需要注意：

1. **不能使用 `app.wxss`**
   - 已改为 `styles/common.wxss`
   - 各页面通过 `@import` 引入

2. **模板中不能调用 JavaScript 方法**
   - 所有数值格式化在 JS 中完成
   - 模板只使用格式化后的字符串

3. **需要 `game.json` 文件**
   - 真机调试时会检查此文件
   - 仅作为配置文件，不影响功能

详细说明请查看：[PROJECT_STRUCTURE.md](miniprogram/PROJECT_STRUCTURE.md)

## 🔗 API 接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 用户登录 | POST | `/auth/login` | 用户名+密码登录 |
| 用户注册 | POST | `/auth/register` | 注册新用户 |
| 获取用户信息 | GET | `/auth/userinfo` | 需要 token |
| 获取市场数据 | GET | `/game/market-data` | 获取 K 线数据 |
| 开始游戏 | POST | `/game/start` | 创建新会话 |
| 执行交易 | POST | `/game/action` | 买入/卖出/持仓 |
| 获取游戏状态 | GET | `/game/state/{session_id}` | 查询会话状态 |
| 获取游戏历史 | GET | `/game/history` | 查询历史记录 |

## 🐛 常见问题

### Q: 真机调试报错 "game.json 未找到"？
A: 确保项目根目录存在 `game.json` 文件。

### Q: 真机调试报错 "app.wxss 非法文件"？
A: 游戏类小程序不支持 `app.wxss`，已改为使用 `styles/common.wxss`。

### Q: 模板中调用方法报错？
A: 游戏类小程序不支持在模板中调用 JavaScript 方法，需要在 JS 中预处理数据。

### Q: tabBar 图标不显示？
A: 检查 `app.json` 中的图标路径是否正确，图片文件是否存在。

## 📄 许可证

本项目仅供学习和研究使用。

## 👤 作者

Y5-asas

## 🙏 致谢

感谢微信小程序平台提供的开发支持。

---

**最后更新**: 2025-12-15



