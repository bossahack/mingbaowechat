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
      that.setData({
        order: result
      });
    });
  },
  cancelOrder(){
    let that=this;
    wx.showModal({
      title: '确定吗',
      content: '确定要取消订单吗',
      success(res){
        if(!res.confirm)
          return;
        app.httpPost("userorder/Cancel?orderId=" + that.data.orderId, null, function (result) {
          wx.showToast({
            title: '取消成功',
            icon: 'success'
          });
          that.data.order.Orders[0].Status = 30;
          that.data.order.Orders[0].statusName = app.globalData.orderStatus.find(c => c.key == 30).value;
          that.setData({
            order: that.data.order
          });
          var pages=getCurrentPages();
          var prevPage = pages[pages.length - 2];  //上一个页面
          prevPage.setData({
            refershToday: true
          });
        });
      }
    })

    
  },
  copyOrder(){
    var that = this;
    wx.showModal({
      title: '确认吗？',
      content: '确认再来一份吗？',
      success(res) {
        if (!res.confirm)
          return;

        app.httpPost("userorder/CopyBookOrder?orderId=" + that.data.orderId, null, function (result) {
          wx.showToast({
            title: '下单成功',
            icon: 'success'
          });
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];  //上一个页面
          prevPage.setData({
            refershToday: true
          });
        });        
      }
    })
    
  }

})