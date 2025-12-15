// pages/trading/trading.js
const api = require('../../utils/api.js');
const app = getApp();

Page({
  data: {
    sessionId: null,
    currentTimeIdx: 0,
    marketData: [],
    currentPrice: 0,
    balance: 10000,
    positions: {},
    unrealizedPnl: 0,
    totalValue: 10000,
    chartData: [],
    action: 'new', // 'new' 或 'continue'
    // 格式化后的数值
    currentPriceFormatted: '0.00',
    balanceFormatted: '10000.00',
    totalValueFormatted: '10000.00',
    unrealizedPnlFormatted: '0.00'
  },

  onLoad(options) {
    if (options.sessionId) {
      this.setData({
        sessionId: parseInt(options.sessionId),
        action: 'continue'
      });
      this.loadGameState();
    } else {
      this.startNewGame();
    }
    this.loadMarketData();
  },

  // 加载市场数据
  async loadMarketData() {
    wx.showLoading({ title: '加载数据...' });
    try {
      const res = await api.getMarketData('XAUUSD', 7, '15T');
      if (res.code === 200) {
        const data = res.data.data;
        this.setData({
          marketData: data,
          chartData: data.map(item => ({
            time: item.time,
            value: item.close
          }))
        });
        if (data.length > 0) {
          const price = data[0].close;
          this.setData({
            currentPrice: price,
            currentPriceFormatted: price.toFixed(2)
          });
        }
      }
    } catch (err) {
      console.error('加载市场数据失败:', err);
      wx.showToast({
        title: '加载数据失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 开始新游戏
  async startNewGame() {
    wx.showLoading({ title: '开始游戏...' });
    try {
      const res = await api.startGame('XAUUSD', 7, '15T');
      if (res.code === 200) {
        const balance = res.data.balance || 10000;
        const price = res.data.current_price || 0;
        this.setData({
          sessionId: res.data.session_id,
          balance: balance,
          currentTimeIdx: res.data.current_time_idx,
          currentPrice: price,
          balanceFormatted: balance.toFixed(2),
          currentPriceFormatted: price.toFixed(2)
        });
      }
    } catch (err) {
      console.error('开始游戏失败:', err);
      wx.showToast({
        title: '开始游戏失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 加载游戏状态
  async loadGameState() {
    if (!this.data.sessionId) return;
    
    try {
      const res = await api.getGameState(this.data.sessionId);
      if (res.code === 200) {
        const balance = res.data.balance || 10000;
        const totalValue = res.data.total_value || balance;
        const unrealizedPnl = res.data.unrealized_pnl || 0;
        this.setData({
          balance: balance,
          totalReturn: res.data.total_return || 0,
          totalValue: totalValue,
          unrealizedPnl: unrealizedPnl,
          balanceFormatted: balance.toFixed(2),
          totalValueFormatted: totalValue.toFixed(2),
          unrealizedPnlFormatted: unrealizedPnl.toFixed(2)
        });
      }
    } catch (err) {
      console.error('加载游戏状态失败:', err);
    }
  },

  // 执行交易
  async executeTrade(action) {
    if (!this.data.sessionId) {
      wx.showToast({
        title: '请先开始游戏',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '执行中...' });
    try {
      const res = await api.executeAction(
        this.data.sessionId,
        this.data.currentTimeIdx,
        action,
        'XAUUSD'
      );
      
      if (res.code === 200) {
        wx.showToast({
          title: '操作成功',
          icon: 'success'
        });
        // 刷新游戏状态
        this.loadGameState();
      }
    } catch (err) {
      console.error('执行交易失败:', err);
    } finally {
      wx.hideLoading();
    }
  },

  // 买入
  handleBuy() {
    this.executeTrade('buy');
  },

  // 卖出
  handleSell() {
    this.executeTrade('sell');
  },

  // 持仓
  handleHold() {
    this.executeTrade('hold');
  }
});




