// utils/api-cloud.js
// 使用云函数调用服务器API的工具类

const app = getApp();

/**
 * 调用云函数代理
 */
function callCloudFunction(action, data = {}) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'proxy',
      data: {
        action: action,
        ...data
      },
      success: (res) => {
        if (res.result && res.result.code === 200) {
          resolve(res.result);
        } else {
          wx.showToast({
            title: res.result?.message || '请求失败',
            icon: 'none'
          });
          reject(res.result);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
}

/**
 * 用户登录
 */
function login(username, password) {
  return callCloudFunction('login', { username, password });
}

/**
 * 用户注册
 */
function register(username, password, email = '') {
  return callCloudFunction('register', { username, password, email });
}

/**
 * 获取用户信息
 */
function getUserInfo() {
  return callCloudFunction('getUserInfo');
}

/**
 * 获取市场数据
 */
function getMarketData(symbol = 'XAUUSD', days = 7, barInterval = '15T') {
  return callCloudFunction('getMarketData', { 
    symbol, 
    days, 
    bar_interval: barInterval 
  });
}

/**
 * 开始游戏
 */
function startGame(symbol = 'XAUUSD', days = 7, barInterval = '15T', gameDurationPoints = null) {
  return callCloudFunction('startGame', { 
    symbol, 
    days, 
    bar_interval: barInterval, 
    game_duration_points: gameDurationPoints 
  });
}

/**
 * 执行交易动作
 */
function executeAction(sessionId, currentTimeIdx, action, symbol, quantity = null, leverage = 1) {
  return callCloudFunction('executeAction', {
    session_id: sessionId,
    current_time_idx: currentTimeIdx,
    action,
    symbol,
    quantity,
    leverage
  });
}

/**
 * 获取游戏状态
 */
function getGameState(sessionId) {
  return callCloudFunction('getGameState', { session_id: sessionId });
}

/**
 * 获取游戏历史
 */
function getGameHistory(limit = 10) {
  return callCloudFunction('getGameHistory', { limit });
}

module.exports = {
  login,
  register,
  getUserInfo,
  getMarketData,
  startGame,
  executeAction,
  getGameState,
  getGameHistory
};


