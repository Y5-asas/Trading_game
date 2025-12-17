// js/scenes/TradingScene.js - 交易场景（关卡页面）
// 根据选择的币种显示不同的交易界面

class TradingScene {
  constructor(gameEngine, symbol) {
    this.gameEngine = gameEngine;
    this.width = gameEngine.width;
    this.height = gameEngine.height;
    this.symbol = symbol; // 币种符号，如 'BTC', 'ETH', 'XAUUSD'
    
    // 币种信息（与 MainScene 保持一致）
    this.symbolInfo = {
      // 金属
      'XAUUSD': { name: '黄金/美元', color: '#ffd700' },
      'XAGUSD': { name: '白银/美元', color: '#c0c0c0' },
      
      // 主要货币对
      'EURUSD': { name: '欧元/美元', color: '#4a90e2' },
      'GBPUSD': { name: '英镑/美元', color: '#e74c3c' },
      'USDJPY': { name: '美元/日元', color: '#9b59b6' },
      'USDCHF': { name: '美元/瑞郎', color: '#3498db' },
      
      // 交叉货币对
      'GBPJPY': { name: '英镑/日元', color: '#e67e22' },
      'EURGBP': { name: '欧元/英镑', color: '#1abc9c' },
      'EURJPY': { name: '欧元/日元', color: '#16a085' },
      
      // 商品货币
      'AUDUSD': { name: '澳元/美元', color: '#3498db' },
      'NZDUSD': { name: '纽元/美元', color: '#27ae60' },
      'USDCAD': { name: '美元/加元', color: '#1abc9c' }
    };
    
    // 退出按钮
    this.backButton = {
      x: 20,
      y: 20,
      width: 80,
      height: 40
    };
  }

  onEnter() {
    console.log('进入交易场景，币种:', this.symbol);
  }

  onExit() {
    console.log('退出交易场景');
  }

  onTouchStart(x, y) {
    // 退出按钮
    if (this.isPointInRect(x, y, this.backButton)) {
      const MainScene = require('./MainScene.js');
      const mainScene = new MainScene(this.gameEngine);
      this.gameEngine.setScene(mainScene);
    }
  }

  onTouchMove(x, y) {
    // 处理触摸移动
  }

  onTouchEnd(x, y) {
    // 处理触摸结束
  }

  update(deltaTime) {
    // 更新逻辑
  }

  render(ctx) {
    // 背景
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, this.width, this.height);

    // 获取币种信息
    const info = this.symbolInfo[this.symbol] || { name: this.symbol, color: '#8a8a8a' };

    // 标题
    ctx.fillStyle = info.color;
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(info.name, this.width / 2, 100);

    // 币种代码
    ctx.fillStyle = '#8a8a8a';
    ctx.font = '24px Arial';
    ctx.fillText(this.symbol, this.width / 2, 140);

    // 提示信息
    ctx.fillStyle = '#666666';
    ctx.font = '20px Arial';
    ctx.fillText('交易界面（开发中）', this.width / 2, this.height / 2);

    // 退出按钮
    ctx.fillStyle = '#2a2a4e';
    ctx.fillRect(this.backButton.x, this.backButton.y, this.backButton.width, this.backButton.height);
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.backButton.x, this.backButton.y, this.backButton.width, this.backButton.height);
    
    ctx.fillStyle = '#ffd700';
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('← 退出', this.backButton.x + 5, this.backButton.y + 28);
  }

  // 工具方法：判断点是否在矩形内
  isPointInRect(x, y, rect) {
    return x >= rect.x && x <= rect.x + rect.width &&
           y >= rect.y && y <= rect.y + rect.height;
  }
}

module.exports = TradingScene;
