# 项目规划 - 前后端整合

## 当前状态

### 前端（已完成）
- ✅ 小游戏基础框架（Canvas + 游戏循环）
- ✅ 登录界面（Canvas 绘制）
- ✅ 用户注册/登录功能（前端逻辑）
- ✅ API 请求封装

### 后端（需要添加）
- ❌ 后端服务器代码
- ❌ 数据库连接（SQLite/MySQL等）
- ❌ API 接口实现
- ❌ 用户认证系统

## 建议的项目结构

```
Trading_game/
├── miniprogram/              # 微信小游戏前端
│   ├── game.js
│   ├── game.json
│   ├── js/
│   │   ├── main.js
│   │   ├── engine/
│   │   └── scenes/
│   └── utils/
│       └── api.js           # 调用后端 API
│
├── backend/                  # 后端服务器（新建）
│   ├── app/
│   │   ├── main.py          # FastAPI 主文件
│   │   ├── models/          # 数据库模型
│   │   │   └── user.py
│   │   ├── routers/         # API 路由
│   │   │   ├── auth.py      # 登录/注册
│   │   │   └── game.py      # 游戏相关
│   │   ├── database.py      # 数据库连接
│   │   └── config.py        # 配置文件
│   ├── requirements.txt      # Python 依赖
│   └── run.py               # 启动脚本
│
├── database/                 # 数据库文件（可选）
│   └── trading_game.db      # SQLite 数据库
│
└── README.md
```

## 后端技术栈建议

### 方案 A：Python + FastAPI + SQLite（推荐，简单）
- **优点**：开发快速，SQLite 无需单独安装
- **适合**：中小型项目，单机部署

### 方案 B：Python + FastAPI + MySQL/PostgreSQL
- **优点**：性能更好，支持并发
- **适合**：大型项目，需要多用户

### 方案 C：Node.js + Express + SQLite
- **优点**：前后端都用 JavaScript
- **适合**：全栈 JavaScript 开发

## 需要实现的后端功能

### 1. 数据库模型
- 用户表（users）
- 游戏会话表（game_sessions）
- 交易记录表（trades）

### 2. API 接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/wechat-login` - 微信登录
- `GET /api/auth/userinfo` - 获取用户信息
- `POST /api/game/start` - 开始游戏
- `POST /api/game/action` - 执行交易
- `GET /api/game/state/{session_id}` - 获取游戏状态
- `GET /api/game/history` - 获取历史记录

## 下一步行动

1. **选择后端技术栈**（建议 FastAPI + SQLite）
2. **创建后端目录结构**
3. **实现数据库连接和模型**
4. **实现 API 接口**
5. **测试前后端联调**

## 问题

请告诉我：
1. 你希望使用哪种后端技术栈？（Python/FastAPI 还是 Node.js/Express？）
2. 你是否有现有的后端代码？
3. 你希望使用哪种数据库？（SQLite/MySQL/PostgreSQL？）

然后我可以帮你：
- 创建完整的后端项目结构
- 实现数据库连接
- 实现所有 API 接口
- 配置前后端连接
