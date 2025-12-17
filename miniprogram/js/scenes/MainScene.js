// js/scenes/MainScene.js - 主场景（游戏主界面）

const app = getApp();

class MainScene {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.width = gameEngine.width;
    this.height = gameEngine.height;
    
    // 币种颜色映射（用于显示）
    this.symbolColors = {
      // 金属
      'XAUUSD': '#ffd700',  // 黄金
      'XAGUSD': '#c0c0c0',  // 白银
      
      // 主要货币对
      'EURUSD': '#4a90e2',  // 欧元/美元
      'GBPUSD': '#e74c3c',  // 英镑/美元
      'USDJPY': '#9b59b6',  // 美元/日元
      'USDCHF': '#3498db',  // 美元/瑞郎
      
      // 交叉货币对
      'GBPJPY': '#e67e22',  // 英镑/日元
      'EURGBP': '#1abc9c',  // 欧元/英镑
      'EURJPY': '#16a085',  // 欧元/日元
      
      // 商品货币
      'AUDUSD': '#3498db',   // 澳元/美元
      'NZDUSD': '#27ae60',  // 纽元/美元
      'USDCAD': '#1abc9c'   // 美元/加元
    };
    
    // 分类标题
    this.categoryTitles = {
      metals: '金属',
      majors: '主要货币对',
      crosses: '交叉货币对',
      commodities: '商品货币'
    };
    
    // 固定币种分类列表（无需后端）
    this.symbolCategories = {
      metals: [
        { code: 'XAUUSD', name: '黄金/美元', color: this.symbolColors['XAUUSD'] },
        { code: 'XAGUSD', name: '白银/美元', color: this.symbolColors['XAGUSD'] }
      ],
      majors: [
        { code: 'EURUSD', name: '欧元/美元', color: this.symbolColors['EURUSD'] },
        { code: 'GBPUSD', name: '英镑/美元', color: this.symbolColors['GBPUSD'] },
        { code: 'USDJPY', name: '美元/日元', color: this.symbolColors['USDJPY'] },
        { code: 'USDCHF', name: '美元/瑞郎', color: this.symbolColors['USDCHF'] }
      ],
      crosses: [
        { code: 'GBPJPY', name: '英镑/日元', color: this.symbolColors['GBPJPY'] },
        { code: 'EURGBP', name: '欧元/英镑', color: this.symbolColors['EURGBP'] },
        { code: 'EURJPY', name: '欧元/日元', color: this.symbolColors['EURJPY'] }
      ],
      commodities: [
        { code: 'AUDUSD', name: '澳元/美元', color: this.symbolColors['AUDUSD'] },
        { code: 'NZDUSD', name: '纽元/美元', color: this.symbolColors['NZDUSD'] },
        { code: 'USDCAD', name: '美元/加元', color: this.symbolColors['USDCAD'] }
      ]
    };

    this.symbolCards = [];
    this.isLoading = false; // 保留字段，未来如需异步可再用

    // 滚动控制
    this.scrollOffset = 0;
    this.maxScroll = 0;
    this.touchStartY = 0;
    this.touchStartOffset = 0;
    this.isScrolling = false;
    
    // "我的"按钮位置（右下角）
    this.profileButton = {
      x: this.width - 100,
      y: this.height - 60,
      width: 80,
      height: 40
    };
  }

  // 计算币种卡片的位置（按分类）
  calculateSymbolCards() {
    const cols = 2; // 每行2个
    const cardWidth = (this.width - 60) / cols; // 减去左右边距
    const cardHeight = 100;
    const startX = 20;
    let currentY = 150; // 起始Y位置
    const gapX = 20;
    const gapY = 15;
    const categoryGap = 30; // 分类之间的间距
    const titleHeight = 30; // 分类标题高度

    this.symbolCards = [];
    this.contentHeight = 0;
    
    // 按分类顺序处理
    const categoryOrder = ['metals', 'majors', 'crosses', 'commodities'];
    
    for (const category of categoryOrder) {
      const symbols = this.symbolCategories[category] || [];
      if (symbols.length === 0) continue;
      
      // 添加分类标题卡片（用于显示）
      const categoryTitle = {
        type: 'title',
        category: category,
        text: this.categoryTitles[category],
        x: startX,
        y: currentY,
        width: this.width - 40,
        height: titleHeight
      };
      this.symbolCards.push(categoryTitle);
      currentY += titleHeight + 10;
      
      // 添加该分类下的币种卡片
      symbols.forEach((symbol, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const card = {
          type: 'symbol',
          code: symbol.code,
          name: symbol.name,
          color: symbol.color,
          x: startX + col * (cardWidth + gapX),
          y: currentY + row * (cardHeight + gapY),
          width: cardWidth,
          height: cardHeight
        };
        this.symbolCards.push(card);
      });
      
      // 更新当前Y位置（考虑该分类的行数）
      const rows = Math.ceil(symbols.length / cols);
      currentY += rows * (cardHeight + gapY) + categoryGap;
    }

    this.contentHeight = currentY;
    this.updateScrollBounds();
  }

  // 更新滚动范围
  updateScrollBounds() {
    // 额外保留底部 80px 让“我的”按钮不被遮挡
    this.maxScroll = Math.max(0, this.contentHeight - this.height + 80);
    // 防止越界
    this.scrollOffset = Math.max(0, Math.min(this.scrollOffset, this.maxScroll));
  }

  // 工具方法：判断点是否在矩形内
  isPointInRect(x, y, rect) {
    return x >= rect.x && x <= rect.x + rect.width &&
           y >= rect.y && y <= rect.y + rect.height;
  }

  onEnter() {
    console.log('进入主场景');
    // 直接使用固定币种列表（无网络请求）
    this.loadSymbols();
  }

  // 使用固定币种列表（无需请求后端）
  loadSymbols() {
    this.isLoading = false;
    this.symbols = [
      { code: 'XAUUSD', name: '黄金/美元', color: this.symbolColors['XAUUSD'] },
      { code: 'XAGUSD', name: '白银/美元', color: this.symbolColors['XAGUSD'] },
      { code: 'EURUSD', name: '欧元/美元', color: this.symbolColors['EURUSD'] },
      { code: 'GBPUSD', name: '英镑/美元', color: this.symbolColors['GBPUSD'] },
      { code: 'USDJPY', name: '美元/日元', color: this.symbolColors['USDJPY'] },
      { code: 'USDCHF', name: '美元/瑞郎', color: this.symbolColors['USDCHF'] },
      { code: 'GBPJPY', name: '英镑/日元', color: this.symbolColors['GBPJPY'] },
      { code: 'EURGBP', name: '欧元/英镑', color: this.symbolColors['EURGBP'] },
      { code: 'EURJPY', name: '欧元/日元', color: this.symbolColors['EURJPY'] },
      { code: 'AUDUSD', name: '澳元/美元', color: this.symbolColors['AUDUSD'] },
      { code: 'NZDUSD', name: '纽元/美元', color: this.symbolColors['NZDUSD'] },
      { code: 'USDCAD', name: '美元/加元', color: this.symbolColors['USDCAD'] }
    ];
    // 计算币种卡片位置
    this.calculateSymbolCards();
  }

  onExit() {
    console.log('退出主场景');
  }

  onTouchStart(x, y) {
    // 记录触摸起点用于滚动
    this.touchStartY = y;
    this.touchStartOffset = this.scrollOffset;
    this.isScrolling = false;
  }

  onTouchMove(x, y) {
    const deltaY = y - this.touchStartY;
    if (Math.abs(deltaY) > 8) {
      this.isScrolling = true;
    }
    if (this.isScrolling) {
      const target = this.touchStartOffset - deltaY; // 上滑内容上移
      this.scrollOffset = Math.max(0, Math.min(target, this.maxScroll));
    }
  }

  onTouchEnd(x, y) {
    // 如果是滚动操作，结束即可
    if (this.isScrolling) {
      this.isScrolling = false;
      return;
    }

    // 点击"我的"按钮（固定在底部，不随滚动）
    if (this.isPointInRect(x, y, this.profileButton)) {
      const ProfileScene = require('./ProfileScene.js');
      const profileScene = new ProfileScene(this.gameEngine);
      this.gameEngine.setScene(profileScene);
      return;
    }
    
    // 检查点击了哪个币种卡片（考虑滚动偏移）
    for (const card of this.symbolCards) {
      if (card.type === 'symbol') {
        const displayRect = { ...card, y: card.y - this.scrollOffset };
        if (this.isPointInRect(x, y, displayRect)) {
          const TradingScene = require('./TradingScene.js');
          const tradingScene = new TradingScene(this.gameEngine, card.code);
          this.gameEngine.setScene(tradingScene);
          return;
        }
      }
    }
  }

  update(deltaTime) {
    // 更新逻辑
  }

  render(ctx) {
    // 背景
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, this.width, this.height);

    // 标题区域（随内容一起滚动）
    const headerY = 60 - this.scrollOffset;
    const subtitleY = 90 - this.scrollOffset;
    const welcomeY = 120 - this.scrollOffset;

    if (headerY > -60 && headerY < this.height + 60) {
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('交易游戏', this.width / 2, headerY);
    }

    if (subtitleY > -40 && subtitleY < this.height + 40) {
      ctx.fillStyle = '#8a8a8a';
      ctx.font = '20px Arial';
      ctx.fillText('选择交易币种', this.width / 2, subtitleY);
    }
    
    // 显示登录状态
    if (app.globalData.userInfo && welcomeY > -40 && welcomeY < this.height + 40) {
      ctx.fillStyle = '#8a8a8a';
      ctx.font = '16px Arial';
      const displayName = app.globalData.userInfo.nickName || app.globalData.userInfo.username || '用户';
      ctx.fillText('欢迎，' + displayName, this.width / 2, welcomeY);
    }

    // 绘制币种卡片和分类标题（支持滚动偏移）
    for (const card of this.symbolCards) {
      if (card.type === 'title') {
        // 绘制分类标题
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'left';
        const drawY = card.y - this.scrollOffset;
        if (drawY > -40 && drawY < this.height + 40) {
          ctx.fillText(card.text, card.x, drawY + 22);
        }
      } else if (card.type === 'symbol') {
        // 绘制币种卡片
        const drawY = card.y - this.scrollOffset;
        // 简单可视区裁剪，避免超出屏幕仍绘制
        if (drawY + card.height < -20 || drawY > this.height + 20) {
          continue;
        }
        // 卡片背景
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(card.x, drawY, card.width, card.height);
        
        // 卡片边框
        ctx.strokeStyle = card.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(card.x, drawY, card.width, card.height);
        
        // 币种名称
        ctx.fillStyle = card.color;
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(card.name, card.x + card.width / 2, drawY + 30);
        
        // 币种代码
        ctx.fillStyle = '#8a8a8a';
        ctx.font = '18px Arial';
        ctx.fillText(card.code, card.x + card.width / 2, drawY + 55);
        
        // 提示文字
        ctx.fillStyle = '#666666';
        ctx.font = '14px Arial';
        ctx.fillText('点击进入', card.x + card.width / 2, drawY + 80);
      }
    }

    // "我的"按钮（右下角）
    ctx.fillStyle = '#2a2a4e';
    ctx.fillRect(this.profileButton.x, this.profileButton.y, this.profileButton.width, this.profileButton.height);
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.profileButton.x, this.profileButton.y, this.profileButton.width, this.profileButton.height);
    
    ctx.fillStyle = '#ffd700';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('我的', this.profileButton.x + this.profileButton.width / 2, this.profileButton.y + this.profileButton.height / 2 + 7);
  }
}

module.exports = MainScene;
