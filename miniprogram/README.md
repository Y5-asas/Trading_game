# 微信小程序开发说明

## 项目结构

```
miniprogram/
├── app.js              # 小程序入口文件
├── app.json            # 小程序配置文件
├── app.wxss            # 全局样式
├── project.config.json # 项目配置（包含AppID）
├── pages/              # 页面目录
│   ├── login/         # 登录/注册页面
│   ├── index/         # 首页
│   ├── trading/       # 交易页面
│   ├── history/       # 历史记录页面
│   └── profile/       # 个人中心页面
└── utils/             # 工具类
    └── api.js         # API请求封装
```

## 配置说明

### 1. AppID配置

AppID已配置在 `project.config.json` 中：
```json
{
  "appid": "wxe57f08447a8faee3"
}
```

### 2. API地址配置

在 `app.js` 中配置API基础地址：

```javascript
globalData: {
  apiBaseUrl: 'https://your-domain.com/api', // 替换为实际域名
}
```

**开发环境配置：**
- 使用内网穿透工具（如ngrok、frp）生成HTTPS地址
- 例如：`apiBaseUrl: 'https://xxxxx.ngrok.io/api'`

**生产环境配置：**
- 使用正式域名
- 例如：`apiBaseUrl: 'https://api.yourdomain.com/api'`

### 3. 微信小程序后台配置

1. 登录 [微信公众平台](https://mp.weixin.qq.com/)
2. 进入"开发" -> "开发管理" -> "开发设置"
3. 配置以下内容：
   - **服务器域名**：添加你的API域名到request合法域名
   - **业务域名**：添加你的前端域名（如果需要）
   - **AppID**：`wxe57f08447a8faee3`（已配置）

## 开发步骤

### 1. 安装微信开发者工具

下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

### 2. 导入项目

1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择 `miniprogram` 目录
4. AppID选择"使用测试号"或输入 `wxe57f08447a8faee3`

### 3. 配置API地址

修改 `app.js` 中的 `apiBaseUrl` 为你的实际API地址

### 4. 启动后端API

```bash
# 在trading_game目录下
python run_api.py
```

### 5. 测试

1. 在微信开发者工具中点击"编译"
2. 测试登录、注册、交易等功能
3. 查看控制台日志排查问题

## 页面说明

### 登录页面 (`pages/login/`)
- 用户登录
- 用户注册
- 自动跳转（已登录用户）

### 首页 (`pages/index/`)
- 显示账户统计信息
- 开始新游戏
- 继续游戏

### 交易页面 (`pages/trading/`)
- 显示当前价格
- 账户信息（余额、持仓、盈亏）
- 价格走势图表
- 交易操作（买入、卖出、持仓）

### 历史记录页面 (`pages/history/`)
- 显示所有游戏历史
- 查看游戏详情
- 统计信息（收益率、交易次数、胜率）

### 个人中心页面 (`pages/profile/`)
- 用户信息
- 退出登录

## API接口说明

所有API接口定义在 `utils/api.js` 中：

- `login(username, password)` - 登录
- `register(username, password, email)` - 注册
- `getUserInfo()` - 获取用户信息
- `getMarketData(symbol, days, barInterval)` - 获取市场数据
- `startGame(symbol, days, barInterval, gameDurationPoints)` - 开始游戏
- `executeAction(sessionId, currentTimeIdx, action, symbol, quantity, leverage)` - 执行交易
- `getGameState(sessionId)` - 获取游戏状态
- `getGameHistory(limit)` - 获取游戏历史

## 注意事项

1. **HTTPS要求**：微信小程序要求所有API请求必须使用HTTPS
2. **域名白名单**：需要在微信后台配置API域名
3. **AppID权限**：确保AppID有相应的开发权限
4. **数据安全**：生产环境应使用JWT等安全认证方式

## 下一步

1. 配置HTTPS域名（开发环境可用内网穿透）
2. 在微信后台配置域名白名单
3. 测试所有功能
4. 优化UI和用户体验
5. 添加更多功能（如K线图、技术指标等）




