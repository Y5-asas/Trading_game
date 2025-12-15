// pages/index/index.js
const api = require('../../utils/api.js');
const app = getApp();

Page({
  data: {
    userInfo: null,
    currentSession: null,
    balance: 10000,
    totalReturn: 0,
    totalTrades: 0,
    winRate: 0,
    // 格式化后的数值
    balanceFormatted: '10000.00',
    totalReturnFormatted: '0.00',
    winRateFormatted: '0.0'
  },

  onLoad() {
    this.checkLogin();
    this.loadUserInfo();
    this.loadGameHistory();
  },

  onShow() {
    // 每次显示页面时刷新数据
    if (app.globalData.token) {
      this.loadUserInfo();
      this.loadGameHistory();
    }
  },

  // 检查登录状态
  checkLogin() {
    if (!app.globalData.token) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
    }
  },

  // 加载用户信息
  async loadUserInfo() {
    try {
      const res = await api.getUserInfo();
      if (res.code === 200) {
        this.setData({
          userInfo: res.data
        });
      }
    } catch (err) {
      console.error('获取用户信息失败:', err);
    }
  },

  // 加载游戏历史
  async loadGameHistory() {
    try {
      const res = await api.getGameHistory(1);
      if (res.code === 200 && res.data.sessions.length > 0) {
        const latest = res.data.sessions[0];
        const balance = latest.final_balance || latest.initial_balance || 10000;
        const totalReturn = latest.total_return || 0;
        const winRate = latest.win_rate || 0;
        this.setData({
          currentSession: latest,
          balance: balance,
          totalReturn: totalReturn,
          totalTrades: latest.total_trades || 0,
          winRate: winRate,
          // 格式化数值，避免在模板中调用方法
          balanceFormatted: balance.toFixed(2),
          totalReturnFormatted: totalReturn.toFixed(2),
          winRateFormatted: (winRate * 100).toFixed(1)
        });
      }
    } catch (err) {
      console.error('获取游戏历史失败:', err);
    }
  },

  // 开始新游戏
  startNewGame() {
    wx.navigateTo({
      url: '/pages/trading/trading?action=new'
    });
  },

  // 继续游戏
  continueGame() {
    if (this.data.currentSession) {
      wx.navigateTo({
        url: `/pages/trading/trading?sessionId=${this.data.currentSession.session_id}`
      });
    } else {
      this.startNewGame();
    }
  }
});




