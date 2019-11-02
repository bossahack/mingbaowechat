// pages/order/order.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: null,
    arrives: app.globalData.arrives,

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
      result.Orders[0].arriveName = app.globalData.arrives.find(c => c.key == result.Orders[0].ArriveTimeType).value;
      result.Orders[0].statusName = app.globalData.orderStatus.find(c => c.key == result.Orders[0].Status).value;
      that.setData({
        order: result
      });
    });
  },
  cancelOrder(){
    let that=this;
    app.httpPost("userorder/Cancel?orderId=" + that.data.orderId,null,function(result){
      wx.showToast({
        title: '取消成功',
        icon: 'success'
      });
      that.data.order.Orders[0].Status = 30;
      that.data.order.Orders[0].statusName = app.globalData.orderStatus.find(c => c.key == 30).value;
      that.setData({
        order: that.data.order
      })
    });
  },
  copyOrder(){
    var that = this;
    app.httpPost("userorder/CopyBookOrder?orderId=" + that.data.orderId, null, function (result) {
      wx.showToast({
        title: '下单成功',
        icon: 'success'
      });
      that.loadTodayOrder();
    });
  }

})