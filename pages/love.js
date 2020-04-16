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
      if (!token)
        return;
      clearInterval(timeInterval);
      wx.switchTab({
        url: 'home/home',
      });
    }, 300);
    

    //扫码进入
    let that=this;
    if (options != null & options.scene != null) {
      clearInterval(timeInterval);
      if (options.scene.startsWith("id")) {//扫店铺码
        var timeInterval1 = setInterval(function () {
          var token = wx.getStorageSync("token");
          if (!token)
            return;
          clearInterval(timeInterval1);
          var scene = decodeURIComponent(options.scene);
          var id = scene.replace("id", "");
          that.collectShop(id);
          that.recommendByShop(id);
          wx.switchTab({
            url: 'home/home',
          });
        }, 200);

      }
      if (options.scene.startsWith("user")) {//扫用户码进入
        var timeInterval2 = setInterval(function () {
          var token = wx.getStorageSync("token");
          if (!token)
            return;
          clearInterval(timeInterval2);
          var scene = decodeURIComponent(options.scene);
          var id = scene.replace("user", "");
          that.recommend(id);
          wx.switchTab({
            url: 'home/home',
          });
        }, 200);
      }
    }
  },
  collectShop(id) {
    let that=this;
    app.httpPost("shop/CollectShop?shopid=" + id, null, function (result) {
    });
  },
  recommend(userId) {
    app.httpPost("user/Recommend?userId=" + userId, null, function (result) {
    });
  },
  recommendByShop(shopId) {
    app.httpPost("user/RecommendByShop?shopId=" + shopId, null, function (result) {
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