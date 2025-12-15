# 项目结构说明

## 一、项目定位

**项目名称：** 黄金交易游戏（模拟金融交易小程序）

**项目类型：** 微信小程序（普通小程序，非游戏引擎）

**关键说明：**
- 虽然注册时选择了"游戏"分类，但项目使用**普通小程序框架**
- `compileType` 设置为 `"miniprogram"`（不是 `"game"`）
- **需要** `game.json` 文件（真机调试时，游戏分类的小程序会检查此文件）
- **不能使用** `app.wxss`（游戏分类小程序不支持，已改为 `styles/common.wxss`）
- 使用标准的 `app.json` + `app.js` + `styles/common.wxss` 结构
- `game.json` 仅作为配置文件存在，不影响普通小程序功能

---

## 二、项目结构

```
miniprogram/
├── app.js                    # 小程序入口文件
│   ├── globalData           # 全局数据（用户信息、token、API地址）
│   ├── onLaunch()           # 启动时初始化（检查登录状态、初始化云开发）
│   ├── setUserInfo()        # 设置用户信息（保存到本地存储）
│   └── clearUserInfo()      # 清除用户信息（退出登录）
│
├── app.json                  # 小程序配置文件
│   ├── pages                # 页面路由列表（第一个是首页）
│   ├── window               # 窗口样式配置
│   └── tabBar               # 底部导航栏（4个tab）
│
├── styles/                   # 样式目录
│   └── common.wxss          # 公共样式文件（替代 app.wxss）
│       ├── 页面基础样式
│       ├── 通用组件样式（按钮、卡片、输入框等）
│       └── 工具类样式（间距、布局等）
│
├── game.json                 # 游戏配置文件（真机调试需要）
│   ├── deviceOrientation     # 设备方向（竖屏）
│   ├── showStatusBar         # 是否显示状态栏
│   └── networkTimeout        # 网络超时配置
│
├── project.config.json       # 项目配置
│   ├── compileType: "miniprogram"  # 关键：普通小程序类型
│   ├── appid                 # 小程序AppID
│   └── 编译设置
│
├── sitemap.json              # 站点地图配置
│
├── pages/                    # 页面目录
│   ├── login/               # 登录/注册页
│   │   ├── login.js         # 页面逻辑（登录/注册功能）
│   │   ├── login.wxml       # 页面结构
│   │   └── login.wxss       # 页面样式
│   │
│   ├── index/               # 首页（游戏入口）
│   │   ├── index.js         # 显示账户概览、开始/继续游戏
│   │   ├── index.wxml
│   │   └── index.wxss
│   │
│   ├── trading/             # 交易页（核心功能）
│   │   ├── trading.js       # 交易逻辑（买入/卖出/持仓）
│   │   ├── trading.wxml     # 价格显示、交易操作界面
│   │   └── trading.wxss
│   │
│   ├── history/             # 历史记录页
│   │   ├── history.js       # 显示所有游戏历史
│   │   ├── history.wxml
│   │   └── history.wxss
│   │
│   └── profile/             # 个人中心页
│       ├── profile.js       # 用户信息、退出登录
│       ├── profile.wxml
│       └── profile.wxss
│
└── utils/                    # 工具类
    ├── api.js               # API请求封装（直接请求后端）
    │   ├── request()        # 统一请求方法（带token、错误处理）
    │   ├── login()          # 用户登录
    │   ├── register()       # 用户注册
    │   ├── getUserInfo()    # 获取用户信息
    │   ├── getMarketData()  # 获取市场数据
    │   ├── startGame()      # 开始游戏
    │   ├── executeAction()  # 执行交易
    │   ├── getGameState()   # 获取游戏状态
    │   └── getGameHistory() # 获取游戏历史
    │
    └── api-cloud.js          # 云函数API封装（备用，当前未使用）
```

---

## 三、核心功能模块

### 1. 用户认证模块

**文件位置：** `pages/login/login.js`

**功能：**
- 用户登录（POST /api/auth/login）
- 用户注册（POST /api/auth/register）
- 自动跳转（已登录用户直接进入首页）
- Token 管理（保存到本地存储）

**数据流：**
```
登录成功 → app.setUserInfo() → 保存到 globalData 和本地存储 → 跳转首页
```

---

### 2. 游戏会话模块

**文件位置：** `pages/index/index.js` + `pages/trading/trading.js`

**功能：**
- **开始新游戏：** 创建新的交易会话（POST /api/game/start）
- **继续游戏：** 恢复已有会话（GET /api/game/state/{session_id}）
- **获取游戏状态：** 实时查询账户、持仓、盈亏

**数据流：**
```
首页 → 开始新游戏 → 创建会话 → 跳转交易页
首页 → 继续游戏 → 加载会话状态 → 跳转交易页
```

---

### 3. 交易操作模块

**文件位置：** `pages/trading/trading.js`

**功能：**
- **买入：** 执行买入操作（POST /api/game/action）
- **卖出：** 执行卖出操作
- **持仓：** 跳过当前时间点，不操作
- **实时价格：** 显示当前市场价格
- **账户信息：** 余额、持仓、未实现盈亏、总资产

**数据流：**
```
加载市场数据 → 显示价格 → 用户操作 → 发送交易请求 → 更新游戏状态
```

---

### 4. 数据展示模块

**文件位置：** `pages/history/history.js`

**功能：**
- 显示所有游戏历史记录（GET /api/game/history）
- 显示收益率、交易次数、胜率等统计信息
- 点击查看历史详情（跳转到交易页）

---

### 5. 个人中心模块

**文件位置：** `pages/profile/profile.js`

**功能：**
- 显示用户信息（GET /api/auth/userinfo）
- 退出登录（清除本地数据，跳转登录页）

---

## 四、API 接口说明

### 后端地址配置

**位置：** `app.js` → `globalData.apiBaseUrl`

**当前配置：**
```javascript
apiBaseUrl: 'https://diffusibly-probusiness-avah.ngrok-free.dev/api'
```

**注意：** ngrok 免费版地址每次重启会变化，需要更新

---

### API 接口列表

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 用户登录 | POST | `/auth/login` | 用户名+密码登录 |
| 用户注册 | POST | `/auth/register` | 注册新用户 |
| 获取用户信息 | GET | `/auth/userinfo` | 需要token |
| 获取市场数据 | GET | `/game/market-data` | 获取K线数据 |
| 开始游戏 | POST | `/game/start` | 创建新会话 |
| 执行交易 | POST | `/game/action` | 买入/卖出/持仓 |
| 获取游戏状态 | GET | `/game/state/{session_id}` | 查询会话状态 |
| 获取游戏历史 | GET | `/game/history` | 查询历史记录 |

---

## 五、关键配置说明

### 1. project.config.json

```json
{
  "compileType": "miniprogram",  // 关键：必须是 "miniprogram"
  "appid": "wxda7c5efe869c01c2",
  "libVersion": "2.19.4"
}
```

**重要：** 
- `compileType` 必须是 `"miniprogram"`（普通小程序）
- 不要设置为 `"game"`（游戏引擎类型）
- 虽然后台分类是"游戏"，但项目类型是普通小程序

---

### 2. app.json

```json
{
  "pages": [
    "pages/login/login",      // 第一个是首页（未登录时）
    "pages/index/index",      // 登录后的首页
    "pages/trading/trading",
    "pages/history/history",
    "pages/profile/profile"
  ],
  "tabBar": {
    "list": [
      { "pagePath": "pages/index/index", ... },
      { "pagePath": "pages/trading/trading", ... },
      { "pagePath": "pages/history/history", ... },
      { "pagePath": "pages/profile/profile", ... }
    ]
  }
}
```

**注意：** tabBar 中的图标路径需要存在对应的图片文件

---

### 3. game.json 说明

**重要：** 虽然项目是普通小程序，但由于后台分类选择了"游戏"，真机调试时会检查 `game.json` 文件。

- ✅ `game.json` - **需要**（真机调试要求）
- ❌ `game.js` - **不需要**（普通小程序使用 app.js）

---

## 六、数据流说明

### 登录流程

```
1. 用户输入用户名密码
2. 调用 api.login()
3. 后端返回 token 和用户信息
4. app.setUserInfo() 保存到 globalData 和本地存储
5. 跳转到首页
```

### 游戏流程

```
1. 首页点击"开始新游戏"
2. 调用 api.startGame() 创建会话
3. 跳转到交易页，传入 sessionId
4. 交易页加载市场数据和游戏状态
5. 用户执行交易操作
6. 调用 api.executeAction() 提交交易
7. 更新游戏状态，显示最新余额和盈亏
```

---

## 七、常见问题

### Q1: 为什么需要 game.json？

**A:** 虽然项目是普通小程序，但由于后台分类选择了"游戏"，真机调试时会强制检查 `game.json` 文件。这是微信平台的限制，即使项目类型是 `miniprogram`，也需要提供 `game.json` 作为配置文件。`game.json` 仅用于配置，不影响普通小程序的功能。

### Q2: 为什么不能使用 app.wxss？

**A:** 当存在 `game.json` 时，系统会按游戏类小程序处理，而游戏类小程序不支持 `app.wxss` 文件。解决方案是将全局样式移到 `styles/common.wxss`，然后在每个页面的 `.wxss` 文件中通过 `@import '../../styles/common.wxss';` 引入。

### Q2: 注册时选择了"游戏"分类，有影响吗？

**A:** 没有影响。后台分类只是分类标签，不影响项目类型。项目类型由 `compileType` 决定。

### Q3: API 地址如何配置？

**A:** 在 `app.js` 的 `globalData.apiBaseUrl` 中配置。开发环境使用 ngrok，生产环境使用正式域名。

### Q4: tabBar 图标不显示？

**A:** 检查 `app.json` 中的 `iconPath` 和 `selectedIconPath` 路径是否正确，图片文件是否存在。

---

## 八、开发调试步骤

1. **启动后端服务**
   ```bash
   python run_api.py
   ```

2. **配置 ngrok（如果需要）**
   ```bash
   ngrok http 8000
   ```

3. **更新 API 地址**
   - 修改 `app.js` 中的 `apiBaseUrl`

4. **打开微信开发者工具**
   - 导入项目
   - 选择 AppID
   - 编译运行

5. **真机调试**
   - 点击"真机调试"
   - 扫码在手机上测试

---

## 九、下一步优化建议

1. ✅ 完善错误处理（网络错误、业务错误）
2. ✅ 添加加载状态提示
3. ✅ 优化用户体验（动画、交互反馈）
4. ✅ 添加数据缓存机制
5. ✅ 实现微信登录（code2Session）
6. ✅ 添加图表展示（K线图）
7. ✅ 性能优化（减少请求次数、数据缓存）

---

**最后更新：** 2025-12-12

