// js/main.js - 游戏主入口
// 负责创建 Canvas、初始化游戏循环、管理场景切换

const GameEngine = require('./engine/GameEngine.js');
const MainScene = require('./scenes/MainScene.js');

let gameEngine = null;

// 获取系统信息
const systemInfo = wx.getSystemInfoSync();
const screenWidth = systemInfo.windowWidth;
const screenHeight = systemInfo.windowHeight;

// 创建 Canvas
const canvas = wx.createCanvas();
const ctx = canvas.getContext('2d');

// 设置 Canvas 尺寸
canvas.width = screenWidth;
canvas.height = screenHeight;

// 初始化游戏引擎
gameEngine = new GameEngine(canvas, ctx, screenWidth, screenHeight);

// 初始化主场景（不再需要登录场景）
const mainScene = new MainScene(gameEngine);
gameEngine.setScene(mainScene);

// 启动游戏循环
gameEngine.start();

// 导出到全局，方便调试
if (typeof global !== 'undefined') {
  global.gameEngine = gameEngine;
  global.canvas = canvas;
  global.ctx = ctx;
}
