// game.js - 小游戏入口文件
// 使用 Canvas 渲染，实现游戏循环

const app = {
  globalData: {
    userInfo: null,
    token: null,
    apiBaseUrl: 'https://diffusibly-probusiness-avah.ngrok-free.dev/api',
    useCloud: false,
    env: 'cloud1-6gw4tm7u5e2183c4'
  },

  onLaunch() {
    // 初始化云开发
    if (wx && wx.cloud) {
      wx.cloud.init({
        env: this.globalData.env,
        traceUser: true,
      });
    }
    
    // 检查本地存储的登录信息
    if (wx && wx.getStorageSync) {
      const token = wx.getStorageSync('token');
      const userInfo = wx.getStorageSync('userInfo');
      
      if (token && userInfo) {
        this.globalData.token = token;
        this.globalData.userInfo = userInfo;
      }
    }
  },

  setUserInfo(userInfo, token) {
    this.globalData.userInfo = userInfo;
    this.globalData.token = token;
    if (wx && wx.setStorageSync) {
      wx.setStorageSync('userInfo', userInfo);
      wx.setStorageSync('token', token);
    }
  },

  clearUserInfo() {
    this.globalData.userInfo = null;
    this.globalData.token = null;
    if (wx && wx.removeStorageSync) {
      wx.removeStorageSync('userInfo');
      wx.removeStorageSync('token');
    }
  }
};

// 初始化应用
function initApp() {
  if (typeof Game !== 'undefined') {
    Game(app);
  } else if (typeof App !== 'undefined') {
    App(app);
  } else {
    // 降级方案
    if (app.onLaunch) {
      app.onLaunch();
    }
  }
}

// 延迟初始化
if (typeof wx !== 'undefined') {
  initApp();
} else {
  setTimeout(() => {
    initApp();
  }, 100);
}

// 导出全局对象
if (typeof global !== 'undefined') {
  global.app = app;
} else if (typeof window !== 'undefined') {
  window.app = app;
}

// 兼容 getApp()
(function() {
  const getAppFunc = function() {
    return app;
  };
  
  if (typeof getApp === 'undefined') {
    if (typeof global !== 'undefined') {
      global.getApp = getAppFunc;
    }
    if (typeof window !== 'undefined') {
      window.getApp = getAppFunc;
    }
    if (typeof globalThis !== 'undefined') {
      globalThis.getApp = getAppFunc;
    }
  }
})();

// 启动游戏主循环
require('./js/main.js');
