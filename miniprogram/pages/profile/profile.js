// pages/profile/profile.js
const api = require('../../utils/api.js');
const app = getApp();

Page({
  data: {
    userInfo: null
  },

  onLoad() {
    this.loadUserInfo();
  },

  onShow() {
    this.loadUserInfo();
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

  // 退出登录
  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.clearUserInfo();
          wx.reLaunch({
            url: '/pages/login/login'
          });
        }
      }
    });
  }
});




