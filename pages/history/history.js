// pages/history/history.js
const app = getApp();
var pageIndex= 0;
var pageSize= 10;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orders: [
    ],
    noMore:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadOrders();
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that=this;
    that.data.orders.length=0;
    pageIndex=0;
    that.setData({
      noMore:false
    });
    that.loadOrders();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that=this;
    pageIndex++;
    that.loadOrders();
  },
  loadOrders() {
    let that = this;
    if(that.data.noMore)
      return;
    app.httpGet("UserOrder/GetPages?index=" + pageIndex +"&size="+pageSize, function (result) {
      if(result==null||result.Orders==null||result.Orders.length==0){
        return;
      }
      if(result.Orders.length<10){
        that.setData({
          noMore:true
        })
      } else {
        that.setData({
          noMore: false
        })
      }
      result.Orders.forEach((order, index) => {
        let orderNew = {};
        orderNew.id=order.Id;
        orderNew.createTime = order.CreateDate; 
        orderNew.status =order.Status;

        orderNew.shopName=result.Shops.find(c=>c.Id==order.ShopId).Name;
        orderNew.Items = result.OrderItems.filter(c => c.OrderId == order.Id);    
        that.data.orders.push(orderNew);
      });
     
      that.setData({
        orders: that.data.orders
      });
    });
  }

})