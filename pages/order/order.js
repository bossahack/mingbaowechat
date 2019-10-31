// pages/order/order.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.orderId = options.id;
    this.loadDetail(this.data.orderId);
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
  loadDetail(id){
    let that = this;
    app.httpGet("UserOrder/GetOrderDetail?id="+id, function (result) {
      if (result == null || result.Orders == null || result.Orders.length == 0) {
        return;
      }
      that.setData({
        order: result
      });
    });
  }
})