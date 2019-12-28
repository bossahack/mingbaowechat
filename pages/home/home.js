// pages/home/home.js
const app = getApp();
const qrCodePath ="pages/love?scene=id";
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
    let that=this;
    if(options!=null&options.scene!=null){
      if(options.scene.startsWith("id")){
        var timeInterval=setInterval(function(){
          var token = wx.getStorageSync("token");
          if(!token)
            return;
          var scene = decodeURIComponent(options.scene);
          var id = scene.replace("id", "");
          that.collectShop(id);
          clearInterval(timeInterval);
        },200);
        
      }
      if(options.scene.startsWith("user")){
        var timeInterval = setInterval(function () {
          var token = wx.getStorageSync("token");
          if (!token)
            return;
          var scene = decodeURIComponent(options.scene);
          var id = scene.replace("user", "");
          that.recommend(id);
          clearInterval(timeInterval);
        }, 200);
      }
    }
  },

  onPullDownRefresh: function () {
    let that = this;
    that.loadTodayOrder();
    that.loadShops();
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
    if (this.data.refershToday){
      this.loadTodayOrder();
      this.setData({
        refershToday:false
      });
    }
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
        order.items = result.OrderItems.filter(c=>c.OrderId==order.Id);        
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
        orderNew.items = result.OrderItems.filter(c => c.OrderId == order.Id);       
        that.data.lastedOrders.push(orderNew);
      });

      that.setData({
        lastedOrders: that.data.lastedOrders
      });
    });
  },
  toShop: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
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

      wx.stopPullDownRefresh();
    });
  },
  copyOrder(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认吗？',
      content: '确认再来一份吗？',
      success(res) {
        if(!res.confirm)
           return;
        app.httpPost("UserOrder/CopyBookOrder?orderId=" + id, null, function (result) {
          wx.showToast({
            title: '下单成功',
            icon: 'success'
          });
          that.loadTodayOrder();
        });
      }
    })
  },
  scancode(){
    let that=this;
    wx.scanCode({
      success(res) {
        console.log(res.path);
        if (res.path.startsWith(qrCodePath)){
          var id = decodeURIComponent(res.path).replace(qrCodePath,"");
          that.collectShop(id);
        }
      },
      fail(err) {
        console.log(err)
      }, 
      complete() {
      }
    });
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
  }
})