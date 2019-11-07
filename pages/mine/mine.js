// pages/mine/mine.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfoDb:{
      WXName:'aa'
    },
    showjoin:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  getUserInfo: function (e) {
    var that = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.request({
            url: app.globalData.apiurl + 'user/UpdateWXInfo',
            method: 'post',
            data: {
              code: res.code,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
              rawData: e.detail.rawData,
              signature: e.detail.signature
            },
            success: function (result) {
              if (result.statusCode == 200) {
                var token = result.data.Token;
                wx.setStorageSync('token', token);
                wx.setStorageSync('userInfo', result.data);
                that.initInfo();
              } else {
                wx.showToast({
                  title: '登录失败',
                  icon: 'none'
                })
              }
            },
            fail:function(err){
              console.log(err);
            }
          })
        }
      }
    })

  },

  initInfo:function(){
    let that = this;
    var dbInfo = wx.getStorageSync('userInfo');
    if (dbInfo == null || !dbInfo.WXName) {
      that.setData({
        hasUserInfo: false
      });
    } else {
      that.setData({
        hasUserInfo: true,
        userInfoDb: dbInfo
      });
    }
  },
  showJoin() {
    let that = this;
    that.setData({
      showjoin: !that.data.showjoin
    });
  },
  confirmJoin(e){
    let that = this;
    var wxnum = e.detail.value.wxnum;
    if (!wxnum) {
      wx.showToast({
        title: '请输入联系方式',
      });
      return;
    }
    app.httpPost("user/JoinUs",  { WxNum:wxnum},function(result){
      var dbInfo = wx.getStorageSync('userInfo');
      dbInfo.WxNum=wxnum;
      wx.setStorageSync('userInfo', dbInfo);
      that.data.userInfoDb.WxNum=wxnum;
      that.setData({
        userInfoDb:that.data.userInfoDb
      });
    });
  }
})