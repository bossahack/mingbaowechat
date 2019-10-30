// pages/home/home.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[]
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
    this.loadTodayOrder();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  loadTodayOrder(){
    let that=this;
    app.httpGet("UserOrder/GetOrderToday",function(result){
      that.setData({
        orders:result
      });
    });
  },
  toShop: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../shop/shop?id=' + id
    })
  },

})