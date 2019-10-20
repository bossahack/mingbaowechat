//app.js
App({
  onLaunch: function () {
    if (!wx.getStorageSync('token'))
      this.login();
    
  },
  globalData: {
    apiurl: 'http://192.168.124.8/',
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
              } else {
                wx.showToast({
                  title: '登录失败',
                  icon: 'none'
                })
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
  HttpPost: function (url, data, success) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
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
    if (response.statusCode == 500) {
      wx.showToast({
        title: response.data.ExceptionMessage,
        icon: 'none'
      })
      return;
    }
    callback(response.data);
  },
})