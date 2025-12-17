# 项目架构文档

## 项目结构

```
miniprogram/
├── game.js                    # 小游戏入口文件
├── game.json                  # 小游戏配置文件
├── project.config.json        # 项目配置
├── js/
│   ├── main.js               # 游戏主入口（创建 Canvas、启动引擎）
│   ├── engine/
│   │   └── GameEngine.js    # 游戏引擎核心（循环、场景管理、事件）
│   └── scenes/
│       ├── BaseScene.js      # 场景基类
│       └── LoginScene.js     # 登录场景
└── utils/
    ├── api.js                # API 请求封装
    └── api-cloud.js          # 云函数 API（备用）
```

## 核心模块说明

### 1. GameEngine（游戏引擎）
**职责：**
- 管理游戏循环（requestAnimationFrame）
- 管理场景切换
- 处理触摸事件
- 计算 deltaTime

**主要方法：**
- `setScene(scene)` - 切换场景
- `start()` - 启动游戏循环
- `stop()` - 停止游戏循环

### 2. BaseScene（场景基类）
**职责：**
- 提供场景基础功能
- 定义场景生命周期方法
- 提供工具方法（按钮绘制、碰撞检测等）

**生命周期：**
- `onEnter()` - 场景进入时调用
- `onExit()` - 场景退出时调用
- `update(deltaTime)` - 每帧更新
- `render(ctx)` - 每帧渲染

**事件处理：**
- `onTouchStart(x, y)` - 触摸开始
- `onTouchMove(x, y)` - 触摸移动
- `onTouchEnd(x, y)` - 触摸结束

### 3. LoginScene（登录场景）
**功能：**
- Canvas 绘制登录界面
- 用户名/密码输入
- 登录/注册功能
- 微信登录功能

**UI 元素：**
- 用户名输入框
- 密码输入框
- 登录/注册按钮
- 微信登录按钮
- 模式切换按钮

## 数据流

### 登录流程
```
用户点击输入框 → 显示键盘 → 输入内容 → 点击登录按钮 
→ 调用 api.login() → 保存 token → 跳转到主场景
```

### 场景切换流程
```
当前场景 onExit() → GameEngine.setScene() → 新场景 onEnter()
```

## 下一步开发

1. ✅ 基础框架（GameEngine、BaseScene）
2. ✅ 登录场景（Canvas 绘制、输入处理）
3. ⏳ 主场景（游戏主界面）
4. ⏳ 交易场景（交易操作界面）
5. ⏳ 历史场景（历史记录界面）
6. ⏳ UI 组件库（按钮、输入框、卡片等）
