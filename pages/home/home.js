// pages/home/home.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    lastedOrders: []
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
    this.loadLastedOrder();
    this.loadShops();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  loadTodayOrder(){
    let that=this;
    app.httpGet("UserOrder/GetOrderToday",function(result){
      if (result == null || result.Orders == null || result.Orders.length==0){
        return;
      }
      console.log(result);
      that.data.orders.length=0;
      result.Orders.forEach((order, index) => {
        let shop = result.Shops.find(c => c.Id == order.ShopId);
        order.shopName=shop.Name;
        order.shopAddress=shop.Address;
        let items = result.OrderItems.filter(c=>c.OrderId==order.Id);
        if(items.length==1){
          let tmp = items[0];
          order.foodNameShow = tmp.FoodName + "(￥" + tmp.FoodPrice + ")";
          order.totalPrice = tmp.FoodPrice * tmp.Qty;
        }else{
          order.foodNameShow = items.reduce((a, b) => 
            a.FoodName + "(￥" + a.FoodPrice + ")  "+
          b.FoodName + "(￥" + b.FoodPrice + ")  "
          );
          order.totalPrice = items.reduce((a, b) => a.FoodPrice * a.Qty + b.FoodPrice * b.Qty);
        }
        that.data.orders.push(order);
      });

      that.setData({
        orders: that.data.orders
      });
    });
  },
  loadLastedOrder(){
    let that = this;
    app.httpGet("UserOrder/GetLastedOrders", function (result) {
      if (result == null || result.Orders == null || result.Orders.length == 0) {
        return;
      }
      that.data.lastedOrders.length = 0;
      result.Orders.forEach((order, index) => {
        var orderNew={};
        orderNew.id=order.Id;        
        let items = result.OrderItems.filter(c => c.OrderId == order.Id);
        if (items.length == 1) {
          let tmp = items[0];
          orderNew.foodNameShow = tmp.FoodName + "(￥" + tmp.FoodPrice + ")";
        } else {
          orderNew.foodNameShow = items.reduce((a, b) =>
            a.FoodName + "(￥" + a.FoodPrice + ")  " +
            b.FoodName + "(￥" + b.FoodPrice + ")  "
          );
        }
        that.data.lastedOrders.push(orderNew);
      });

      that.setData({
        lastedOrders: that.data.lastedOrders
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
  loadShops(){
    let that=this;
    app.httpGet("shop/GetUserShops", function (result) {
      if (result == null ||result.length == 0) {
        return;
      }
      that.setData({
        shops:result
      });
    });
  },
  copyOrder(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    app.httpPost("UserOrder/CopyBookOrder?orderId="+id, null,function (result) {
      wx.showToast({
        title: '下单成功',
        icon: 'success'
      });
     that.loadTodayOrder();
    });
  }
})