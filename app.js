//app.js
var eventBus = require('utils/eventbus.js')
App({
  onLaunch: function () {
    if (!wx.getStorageSync('token'))
      this.login();
    
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                console.log('success====', res)
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    }
  },
  globalData: {
    // apiurl: 'http://localhost:1935/',
    apiurl: 'https://shashadi.com/',
    arrives: [
      { key: 15, value: '15分钟左右取' },
      { key: 30, value: '30分钟左右取' },
      { key: 60, value: '一小时左右取' },
      { key: 120, value: '2小时左右取' },
      { key: 240, value: '4小时左右取' },
    ],
    orderStatus: [
      { key: 0, value: '初始' },
      { key: 10, value: '已接单' },
      { key: 20, value: '已完成' },
      { key: 30, value: '已取消' },
      { key: 40, value: '异常单' },
    ],
    bus: eventBus.eventBus,
    imgDomain:'http://ct.shashadi.com/'
  },
  login: function () {
    var that = this;
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: that.globalData.apiurl + 'user/Login',
            method: 'post',
            data: {
              code: res.code,
            },
            success: function (result) {
              if (result.statusCode==200) {
                var token = result.data.Token;
                wx.setStorageSync('token', token);
                wx.setStorageSync('userInfo', result.data);
                that.globalData.bus.emit("loginSuccess");
              } else {
                wx.showToast({
                  title: '登录失败',
                  icon: 'none'
                });
              }
            },
            fail: function (result) {
              wx.showToast({
                title: '服务器飞了,请稍后',
                icon: 'none'
              })
            }
          })
        }
      }, fail: res => {
        wx.showToast({
          title: '请检查网络',
          icon: 'none'
        });
      }
    })
  },
  httpPost: function (url, data, success) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask:true
    });
    wx.request({
      url: this.globalData.apiurl + url,
      method: 'post',
      data: data,
      dataType: 'json',
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function (result) {
        wx.hideLoading();
        that.dealResponse(result, success);
      }, fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '请检查网络',
          icon: 'none'
        });
      }
    })
  },
  httpGet: function (url, success) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: this.globalData.apiurl + url,
      method: 'get',
      dataType: 'json',
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: function (result) {
        wx.hideLoading();
        that.dealResponse(result, success);
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '请检查网络',
          icon: 'none'
        });
      }
    })
  },
  dealResponse: function (response, callback) {
    var that = this;
    if (response.statusCode == 403) {
      wx.showToast({
        title: '登陆失效，请重试',
        icon: 'none'
      });
      that.login();
      return;
    }
    if(response.statusCode==401){
      wx.showToast({
        title: '登陆失效，请重试',
        icon: 'none'
      });
      wx.removeStorageSync("token");
      that.login();
      return;
    }
    if (response.statusCode == 500) {
      wx.showToast({
        title: response.data,
        icon: 'none'
      })
      return;
    }
    callback(response.data);
  },
})