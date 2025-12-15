// pages/login/login.js
const api = require('../../utils/api.js');
const app = getApp();

Page({
  data: {
    username: '',
    password: '',
    isLogin: true // true: 登录, false: 注册
  },

  onLoad() {
    // 如果已登录，跳转到首页
    if (app.globalData.token) {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },

  // 切换登录/注册
  switchMode() {
    this.setData({
      isLogin: !this.data.isLogin,
      password: ''
    });
  },

  // 输入用户名
  inputUsername(e) {
    this.setData({
      username: e.detail.value
    });
  },

  // 输入密码
  inputPassword(e) {
    this.setData({
      password: e.detail.value
    });
  },

  // 登录
  async handleLogin() {
    const { username, password } = this.data;
    
    if (!username || !password) {
      wx.showToast({
        title: '请输入用户名和密码',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '登录中...'
    });

    try {
      const res = await api.login(username, password);
      if (res.code === 200) {
        // 保存用户信息和token
        app.setUserInfo(res.data, res.data.token);
        
        wx.hideLoading();
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });
        
        // 跳转到首页
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }, 1000);
      }
    } catch (err) {
      wx.hideLoading();
      console.error('登录失败:', err);
    }
  },

  // 注册
  async handleRegister() {
    const { username, password } = this.data;
    
    if (!username || !password) {
      wx.showToast({
        title: '请输入用户名和密码',
        icon: 'none'
      });
      return;
    }

    if (password.length < 6) {
      wx.showToast({
        title: '密码长度至少6位',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '注册中...'
    });

    try {
      const res = await api.register(username, password);
      if (res.code === 200) {
        wx.hideLoading();
        wx.showToast({
          title: '注册成功，请登录',
          icon: 'success'
        });
        
        // 切换到登录模式
        this.setData({
          isLogin: true,
          password: ''
        });
      }
    } catch (err) {
      wx.hideLoading();
      console.error('注册失败:', err);
    }
  }
});




