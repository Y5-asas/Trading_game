// pages/history/history.js
const api = require('../../utils/api.js');
const app = getApp();

Page({
  data: {
    historyList: [],
    isEmpty: true  // 用于判断是否为空，避免在模板中使用 length
  },

  onLoad() {
    this.loadHistory();
  },

  onShow() {
    this.loadHistory();
  },

  // 加载历史记录
  async loadHistory() {
    wx.showLoading({ title: '加载中...' });
    try {
      const res = await api.getGameHistory(20);
      if (res.code === 200) {
        const sessions = res.data.sessions || [];
        this.setData({
          historyList: sessions.map(session => ({
            ...session,
            startTime: this.formatTime(session.start_time),
            returnColor: session.total_return >= 0 ? 'text-success' : 'text-danger',
            returnText: session.total_return >= 0 ? '+' : '',
            // 格式化数值，避免在模板中调用方法
            totalReturnFormatted: session.total_return ? session.total_return.toFixed(2) : '0.00',
            winRateFormatted: session.win_rate ? (session.win_rate * 100).toFixed(1) : '0.0',
            finalBalanceFormatted: session.final_balance ? session.final_balance.toFixed(2) : '0.00',
            totalTrades: session.total_trades || 0
          })),
          isEmpty: sessions.length === 0
        });
      }
    } catch (err) {
      console.error('加载历史失败:', err);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 格式化时间
  formatTime(timeStr) {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  },

  // 查看详情
  viewDetail(e) {
    const sessionId = e.currentTarget.dataset.sessionId;
    wx.navigateTo({
      url: `/pages/trading/trading?sessionId=${sessionId}`
    });
  }
});




