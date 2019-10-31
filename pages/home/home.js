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
      if (result == null || result.Orders == null || result.Orders.length==0){
        return;
      }
      that.data.orders.length=0;
      result.Orders.forEach((order, index) => {
        let shop = result.Shops.find(c => c.Id == order.ShopId);
        order.shopName=shop.Name;
        order.shopAddress=shop.Address;
        let items = result.OrderItems.filter(c=>c.OrderId==order.Id);
        order.foodNameShow=items.reduce((a,b)=>{return a.FoodName+"(￥"+a.FoodPrice+")  ";});
        order.totalPrice=items.reduce((a,b)=>{return a.FoodPrice+b.FoodPrice;});
        that.data.orders.push(order);
      });

      that.setData({
        orders: that.data.orders
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