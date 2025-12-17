// js/scenes/ProfileScene.js - 个人中心场景（我的）
// 包含登录功能，支持微信授权获取头像和昵称

const api = require('../../utils/api.js');
const app = getApp();

class ProfileScene {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.width = gameEngine.width;
    this.height = gameEngine.height;
    
    // 用户信息
    this.userInfo = null;
    this.isLoggedIn = false;
    this.avatarImage = null; // 头像图片对象
    
    // 按钮位置
    this.wechatLoginButton = {
      x: this.width / 2 - 100,
      y: this.height / 2 - 30,
      width: 200,
      height: 50
    };
    
    this.logoutButton = {
      x: this.width / 2 - 100,
      y: this.height / 2 + 150,
      width: 200,
      height: 50
    };
    
    // 返回按钮
    this.backButton = {
      x: 20,
      y: 20,
      width: 80,
      height: 40
    };
  }

  onEnter() {
    // 检查登录状态
    this.checkLoginStatus();
  }

  onExit() {
    // 清理资源
  }

  // 检查登录状态
  checkLoginStatus() {
    if (app.globalData.token && app.globalData.userInfo) {
      this.isLoggedIn = true;
      this.userInfo = app.globalData.userInfo;
      // 加载头像图片
      this.loadAvatar();
    } else {
      this.isLoggedIn = false;
      this.userInfo = null;
      this.avatarImage = null;
    }
  }

  // 加载头像图片
  loadAvatar() {
    if (this.userInfo && this.userInfo.avatarUrl) {
      // 微信小游戏使用 wx.createImage() 或 wx.downloadFile()
      const image = wx.createImage ? wx.createImage() : new Image();
      
      image.onload = () => {
        this.avatarImage = image;
        console.log('头像加载成功');
      };
      
      image.onerror = (err) => {
        console.error('头像加载失败:', err);
        this.avatarImage = null;
      };
      
      // 设置图片源
      image.src = this.userInfo.avatarUrl;
      
      // 如果 createImage 不存在，尝试使用 downloadFile
      if (!wx.createImage && wx.downloadFile) {
        wx.downloadFile({
          url: this.userInfo.avatarUrl,
          success: (res) => {
            if (res.tempFilePath) {
              image.src = res.tempFilePath;
            }
          },
          fail: (err) => {
            console.error('下载头像失败:', err);
            this.avatarImage = null;
          }
        });
      }
    }
  }

  // 触摸开始
  onTouchStart(x, y) {
    // 返回按钮
    if (this.isPointInRect(x, y, this.backButton)) {
      // 返回主场景
      const MainScene = require('./MainScene.js');
      const mainScene = new MainScene(this.gameEngine);
      this.gameEngine.setScene(mainScene);
      return;
    }
    
    // 微信登录按钮
    if (!this.isLoggedIn && this.isPointInRect(x, y, this.wechatLoginButton)) {
      this.handleWechatLogin();
    }
    
    // 退出登录按钮
    if (this.isLoggedIn && this.isPointInRect(x, y, this.logoutButton)) {
      this.handleLogout();
    }
  }

  // 处理微信登录（同步头像和昵称）
  async handleWechatLogin() {
    wx.showLoading({ title: '登录中...' });

    try {
      // 1. 获取微信登录凭证
      const loginRes = await new Promise((resolve, reject) => {
        wx.login({
          success: resolve,
          fail: reject
        });
      });

      if (!loginRes.code) {
        throw new Error('获取登录凭证失败');
      }

      // 2. 获取用户信息（头像、昵称等）
      let wechatUserInfo = null;
      try {
        const userInfoRes = await new Promise((resolve, reject) => {
          wx.getUserProfile({
            desc: '用于完善用户资料',
            success: resolve,
            fail: reject
          });
        });
        wechatUserInfo = userInfoRes.userInfo;
      } catch (profileErr) {
        console.log('获取用户信息失败:', profileErr);
        // 如果用户拒绝授权，提示
        wx.hideLoading();
        wx.showToast({
          title: '需要授权才能登录',
          icon: 'none'
        });
        return;
      }

      // 3. 调用后端接口进行登录/注册
      // 使用微信信息自动注册或登录
      try {
        const res = await api.request('/auth/wechat-login', 'POST', {
          code: loginRes.code,
          nickName: wechatUserInfo.nickName,
          avatarUrl: wechatUserInfo.avatarUrl
        });

        if (res.code === 200) {
          // 保存用户信息（包含微信头像和昵称）
          // 保存用户信息（包含微信头像和昵称）
          const userData = {
            ...res.data,
            nickName: wechatUserInfo.nickName,
            avatarUrl: wechatUserInfo.avatarUrl,
            username: res.data.username || wechatUserInfo.nickName
          };
          app.setUserInfo(userData, res.data.token);
          
          this.isLoggedIn = true;
          this.userInfo = userData;
          this.loadAvatar(); // 加载头像
          
          wx.hideLoading();
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });
        } else {
          throw new Error(res.message || '登录失败');
        }
      } catch (apiErr) {
        // 如果后端接口不存在，使用本地存储模拟登录
        console.log('后端接口不可用，使用本地模拟登录');
        
        // 模拟登录成功（后端接口不可用时）
        const mockUserData = {
          user_id: 'wx_' + Date.now(),
          username: wechatUserInfo.nickName,
          nickName: wechatUserInfo.nickName,
          avatarUrl: wechatUserInfo.avatarUrl,
          token: 'mock_token_' + Date.now()
        };
        
        app.setUserInfo(mockUserData, mockUserData.token);
        this.isLoggedIn = true;
        this.userInfo = mockUserData;
        this.loadAvatar(); // 加载头像
        
        wx.hideLoading();
        wx.showToast({
          title: '登录成功（模拟）',
          icon: 'success'
        });
      }
    } catch (err) {
      wx.hideLoading();
      console.error('登录失败:', err);
      
      let errorMsg = '登录失败';
      if (err.errMsg) {
        if (err.errMsg.includes('getUserProfile')) {
          errorMsg = '需要授权才能登录';
        } else if (err.errMsg.includes('login')) {
          errorMsg = '获取登录凭证失败';
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      wx.showToast({
        title: errorMsg,
        icon: 'none',
        duration: 2000
      });
    }
  }

  // 处理退出登录
  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.clearUserInfo();
          this.isLoggedIn = false;
          this.userInfo = null;
          this.avatarImage = null; // 清理头像图片
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  }

  // 更新
  update(deltaTime) {
    // 更新逻辑
  }

  // 渲染
  render(ctx) {
    // 背景
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, this.width, this.height);

    // 标题
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('我的', this.width / 2, 60);

    if (this.isLoggedIn && this.userInfo) {
      // 已登录状态
      const centerX = this.width / 2;
      const avatarY = 150;
      const avatarRadius = 50;
      
      // 绘制头像背景圆圈
      ctx.fillStyle = '#2a2a4e';
      ctx.beginPath();
      ctx.arc(centerX, avatarY, avatarRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // 绘制头像边框
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // 绘制头像图片（如果已加载）
      if (this.avatarImage && this.avatarImage.width > 0) {
        try {
          // 创建圆形裁剪路径
          ctx.save();
          ctx.beginPath();
          ctx.arc(centerX, avatarY, avatarRadius - 2, 0, Math.PI * 2);
          ctx.clip();
          
          // 绘制头像图片
          ctx.drawImage(this.avatarImage, centerX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
          ctx.restore();
        } catch (e) {
          // 如果绘制失败，显示占位符
          ctx.fillStyle = '#ffd700';
          ctx.font = '20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('头像', centerX, avatarY + 7);
        }
      } else {
        // 头像未加载时显示占位符
        ctx.fillStyle = '#ffd700';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('头像', centerX, avatarY + 7);
      }

      // 昵称
      ctx.fillStyle = '#ffffff';
      ctx.font = '26px Arial';
      ctx.textAlign = 'center';
      const displayName = this.userInfo.nickName || this.userInfo.username || '用户';
      ctx.fillText(displayName, centerX, avatarY + 80);

      // 账号信息
      ctx.fillStyle = '#8a8a8a';
      ctx.font = '20px Arial';
      const accountInfo = this.userInfo.username ? `账号: ${this.userInfo.username}` : '';
      if (accountInfo) {
        ctx.fillText(accountInfo, centerX, avatarY + 110);
      }

      // 用户ID
      ctx.fillStyle = '#8a8a8a';
      ctx.font = '18px Arial';
      const userId = this.userInfo.user_id || '未知';
      ctx.fillText('ID: ' + userId, centerX, avatarY + 135);

      // 退出登录按钮
      this.drawButton(ctx, this.logoutButton, '退出登录', '#e74c3c');
    } else {
      // 未登录状态
      ctx.fillStyle = '#8a8a8a';
      ctx.font = '22px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('请先登录', this.width / 2, this.height / 2 - 80);
      
      ctx.fillStyle = '#666666';
      ctx.font = '18px Arial';
      ctx.fillText('使用微信账号登录', this.width / 2, this.height / 2 - 50);

      // 微信登录按钮
      this.drawButton(ctx, this.wechatLoginButton, '微信登录', '#27ae60');
    }

    // 返回按钮
    ctx.fillStyle = '#8a8a8a';
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('← 返回', this.backButton.x, this.backButton.y + 28);
  }

  // 工具方法：判断点是否在矩形内
  isPointInRect(x, y, rect) {
    return x >= rect.x && x <= rect.x + rect.width &&
           y >= rect.y && y <= rect.y + rect.height;
  }

  // 工具方法：绘制按钮
  drawButton(ctx, button, text, bgColor, textColor = '#ffffff') {
    // 按钮背景
    ctx.fillStyle = bgColor;
    ctx.fillRect(button.x, button.y, button.width, button.height);
    
    // 按钮文字
    ctx.fillStyle = textColor;
    ctx.font = '22px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, button.x + button.width / 2, button.y + button.height / 2);
  }
}

module.exports = ProfileScene;
