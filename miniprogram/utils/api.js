// utils/api.js
// API请求工具类

const app = getApp();

/**
 * 发起网络请求
 */
function request(url, method = 'GET', data = {}, header = {}) {
  return new Promise((resolve, reject) => {
    // 添加token到请求头
    const token = app.globalData.token;
    if (token) {
      header['Authorization'] = `Bearer ${token}`;
    }
    
    header['Content-Type'] = 'application/json';

    wx.request({
      url: app.globalData.apiBaseUrl + url,
      method: method,
      data: data,
      header: header,
      success(res) {
        if (res.statusCode === 200) {
          if (res.data.code === 200) {
            resolve(res.data);
          } else {
            // 业务错误
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            });
            reject(res.data);
          }
        } else if (res.statusCode === 401) {
          // 未授权，清除登录信息并跳转到登录页
          app.clearUserInfo();
          wx.reLaunch({
            url: '/pages/login/login'
          });
          reject(res);
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          });
          reject(res);
        }
      },
      fail(err) {
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
 * GET请求
 */
function get(url, data = {}) {
  return request(url, 'GET', data);
}

/**
 * POST请求
 */
function post(url, data = {}) {
  return request(url, 'POST', data);
}

/**
 * 用户登录
 */
function login(username, password) {
  return post('/auth/login', { username, password });
}

/**
 * 用户注册
 */
function register(username, password, email = '') {
  return post('/auth/register', { username, password, email });
}

/**
 * 获取用户信息
 */
function getUserInfo() {
  return get('/auth/userinfo');
}

/**
 * 获取市场数据
 */
function getMarketData(symbol = 'XAUUSD', days = 7, barInterval = '15T') {
  return get('/game/market-data', { symbol, days, bar_interval: barInterval });
}

/**
 * 开始游戏
 */
function startGame(symbol = 'XAUUSD', days = 7, barInterval = '15T', gameDurationPoints = null) {
  return post('/game/start', { symbol, days, bar_interval: barInterval, game_duration_points: gameDurationPoints });
}

/**
 * 执行交易动作
 */
function executeAction(sessionId, currentTimeIdx, action, symbol, quantity = null, leverage = 1) {
  return post('/game/action', {
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
  return get(`/game/state/${sessionId}`);
}

/**
 * 获取游戏历史
 */
function getGameHistory(limit = 10) {
  return get('/game/history', { limit });
}

module.exports = {
  request,
  get,
  post,
  login,
  register,
  getUserInfo,
  getMarketData,
  startGame,
  executeAction,
  getGameState,
  getGameHistory
};




