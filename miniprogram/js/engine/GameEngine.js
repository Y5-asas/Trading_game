// js/engine/GameEngine.js - 游戏引擎核心
// 负责游戏循环、场景管理、事件处理

class GameEngine {
  constructor(canvas, ctx, width, height) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    
    this.currentScene = null;
    this.isRunning = false;
    this.lastTime = 0;
    this.deltaTime = 0;
    
    // 触摸事件
    this.touches = [];
    this.setupTouchEvents();
  }

  // 设置当前场景
  setScene(scene) {
    if (this.currentScene && this.currentScene.onExit) {
      this.currentScene.onExit();
    }
    this.currentScene = scene;
    if (this.currentScene && this.currentScene.onEnter) {
      this.currentScene.onEnter();
    }
  }

  // 设置触摸事件（微信小游戏使用全局事件）
  setupTouchEvents() {
    // 保存回调函数引用，以便后续取消监听
    this.touchStartCallback = (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        // 使用 clientX/clientY 或 x/y，这些是相对于 Canvas 的坐标
        const x = touch.clientX !== undefined ? touch.clientX : (touch.x !== undefined ? touch.x : touch.screenX);
        const y = touch.clientY !== undefined ? touch.clientY : (touch.y !== undefined ? touch.y : touch.screenY);
        
        this.touches.push({ x, y, type: 'start' });
        
        if (this.currentScene && this.currentScene.onTouchStart) {
          this.currentScene.onTouchStart(x, y);
        }
      }
    };

    this.touchMoveCallback = (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const x = touch.clientX !== undefined ? touch.clientX : (touch.x !== undefined ? touch.x : touch.screenX);
        const y = touch.clientY !== undefined ? touch.clientY : (touch.y !== undefined ? touch.y : touch.screenY);
        
        if (this.currentScene && this.currentScene.onTouchMove) {
          this.currentScene.onTouchMove(x, y);
        }
      }
    };

    this.touchEndCallback = (e) => {
      if (e.changedTouches && e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        const x = touch.clientX !== undefined ? touch.clientX : (touch.x !== undefined ? touch.x : touch.screenX);
        const y = touch.clientY !== undefined ? touch.clientY : (touch.y !== undefined ? touch.y : touch.screenY);
        
        if (this.currentScene && this.currentScene.onTouchEnd) {
          this.currentScene.onTouchEnd(x, y);
        }
      }
      
      this.touches = [];
    };

    // 使用微信小游戏的全局触摸事件
    if (wx && wx.onTouchStart) {
      wx.onTouchStart(this.touchStartCallback);
    }
    if (wx && wx.onTouchMove) {
      wx.onTouchMove(this.touchMoveCallback);
    }
    if (wx && wx.onTouchEnd) {
      wx.onTouchEnd(this.touchEndCallback);
    }
  }

  // 清理事件监听
  cleanupTouchEvents() {
    if (wx && wx.offTouchStart && this.touchStartCallback) {
      wx.offTouchStart(this.touchStartCallback);
    }
    if (wx && wx.offTouchMove && this.touchMoveCallback) {
      wx.offTouchMove(this.touchMoveCallback);
    }
    if (wx && wx.offTouchEnd && this.touchEndCallback) {
      wx.offTouchEnd(this.touchEndCallback);
    }
  }

  // 游戏循环
  gameLoop(currentTime) {
    if (!this.isRunning) return;

    // 计算 deltaTime
    if (this.lastTime === 0) {
      this.lastTime = currentTime;
    }
    this.deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // 清空画布
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 更新场景
    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update(this.deltaTime);
    }

    // 渲染场景
    if (this.currentScene && this.currentScene.render) {
      this.currentScene.render(this.ctx);
    }

    // 继续循环
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  // 启动游戏
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = 0;
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  // 停止游戏
  stop() {
    this.isRunning = false;
  }
}

module.exports = GameEngine;
