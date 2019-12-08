// pages/love.js
const app = getApp();
var bus = app.globalData.bus;
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
    var timeInterval = setInterval(function () {
      var token = wx.getStorageSync("token");
      if (token == null)
        return;
      clearInterval(timeInterval);
      wx.switchTab({
        url: 'home/home',
      });
    }, 200);
    
    // bus.on("loginSuccess", (result) => {
    //   wx.switchTab({
    //     url: 'home/home',
    //   });
    // });
    let that=this;
    if (options != null & options.scene != null) {
      if (options.scene.startsWith("id")) {
        // var timeInterval = setInterval(function () {
          var token = wx.getStorageSync("token");
          if (token == null)
            return;
          var scene = decodeURIComponent(options.scene);
          var id = scene.replace("id", "");
          that.collectShop(id);
          clearInterval(timeInterval);
        // }, 200);

      }
      if (options.scene.startsWith("user")) {
        // var timeInterval = setInterval(function () {
          var token = wx.getStorageSync("token");
          if (token == null)
            return;
          scene = decodeURIComponent(options.scene);
          var id = scene.replace("user", "");
          that.recommend(id);
          clearInterval(timeInterval);
        // }, 200);
      }
    }
  },
  collectShop(id) {
    let that=this;
    app.httpPost("shop/CollectShop?shopid=" + id, null, function (result) {
      that.loadShops();
      wx.showToast({
        title: '关注成功',
        icon: 'success'
      });
    });
  },
  recommend(userId) {
    app.httpPost("user/Recommend?userId=" + userId, null, function (result) {
    });
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

  }
})