// app.js
App({
  globalData: {
    userInfo: null,
    token: null,
    // API地址配置
    // 当前使用ngrok内网穿透地址（开发环境）
    // 注意：免费版ngrok地址每次重启会变化，需要重新配置
    apiBaseUrl: 'https://diffusibly-probusiness-avah.ngrok-free.dev/api',
    // 是否使用云开发（如果使用云开发，设置为true）
    useCloud: false, // 改为true则使用云函数代理
  },

  onLaunch() {
    // 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({
        // env: 'your-env-id', // 替换为你的云开发环境ID
        traceUser: true,
      });
    }
    
    // 检查本地存储的登录信息
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (token && userInfo) {
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
    }
  },

  // 设置用户信息
  setUserInfo(userInfo, token) {
    this.globalData.userInfo = userInfo;
    this.globalData.token = token;
    wx.setStorageSync('userInfo', userInfo);
    wx.setStorageSync('token', token);
  },

  // 清除用户信息
  clearUserInfo() {
    this.globalData.userInfo = null;
    this.globalData.token = null;
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('token');
  }
});

