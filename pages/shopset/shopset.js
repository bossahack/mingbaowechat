// pages/shopset/shopset.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  confirmJoin(e) {
    let that = this;
    var phone = e.detail.value.phone;
    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }
    var pwd = e.detail.value.pwd;
    if (!pwd) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }
    app.httpPost("shop/create", { UserName: phone }, function (result) {
      var dbInfo = wx.getStorageSync('userInfo');
      dbInfo.WxNum = wxnum;
      dbInfo.Type = 1;
      wx.setStorageSync('userInfo', dbInfo);
      that.data.userInfoDb.WxNum = wxnum;
      that.data.userInfoDb.Type = 1;
      that.setData({
        userInfoDb: that.data.userInfoDb
      });
    });
  },
})