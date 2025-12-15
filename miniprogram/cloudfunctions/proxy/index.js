// 云函数：代理服务器API请求
// 这个云函数会调用你服务器上的FastAPI接口

const cloud = require('wx-server-sdk');
const axios = require('axios');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 你的服务器API地址（可以是ngrok地址或正式域名）
// 注意：需要替换为实际的服务器地址
const SERVER_API_BASE = process.env.SERVER_API_BASE || 'https://your-server-domain.com/api';

/**
 * 代理请求到服务器
 */
async function proxyRequest(event) {
  const { path, method = 'GET', data = {}, headers = {} } = event;
  
  try {
    const url = `${SERVER_API_BASE}${path}`;
    const config = {
      method: method,
      url: url,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      timeout: 10000 // 10秒超时
    };
    
    if (method === 'GET') {
      config.params = data;
    } else {
      config.data = data;
    }
    
    const response = await axios(config);
    
    return {
      code: 200,
      message: '请求成功',
      data: response.data
    };
  } catch (error) {
    console.error('代理请求失败:', error);
    return {
      code: 500,
      message: error.message || '请求失败',
      data: null
    };
  }
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  
  // 根据不同的路径路由到不同的服务器接口
  const { action, ...params } = event;
  
  switch (action) {
    case 'login':
      return await proxyRequest({
        path: '/auth/login',
        method: 'POST',
        data: params
      });
      
    case 'register':
      return await proxyRequest({
        path: '/auth/register',
        method: 'POST',
        data: params
      });
      
    case 'getMarketData':
      return await proxyRequest({
        path: '/game/market-data',
        method: 'GET',
        data: params
      });
      
    case 'startGame':
      return await proxyRequest({
        path: '/game/start',
        method: 'POST',
        data: params
      });
      
    case 'executeAction':
      return await proxyRequest({
        path: '/game/action',
        method: 'POST',
        data: params
      });
      
    case 'getGameState':
      return await proxyRequest({
        path: `/game/state/${params.session_id}`,
        method: 'GET',
        data: {}
      });
      
    case 'getGameHistory':
      return await proxyRequest({
        path: '/game/history',
        method: 'GET',
        data: params
      });
      
    default:
      return {
        code: 400,
        message: '未知的操作',
        data: null
      };
  }
};

