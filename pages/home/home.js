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
    if(options!=null&options.scene!=null){
      if(options.scene.startsWith("id")){
        scene = decodeURIComponent(options.scene);
        var id = scene.replace("id", "");
        collectShop(id);
      }
    }
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
  },
  scancode(){
    let that=this;
    wx.scanCode({
      success(res) {
        console.log(res.path);
        if (res.path.startsWith(qrCodePath)){
          var id=res.path.replace(str,"");
          collectShop(id);
        }
      },
      fail(err) {
        console.log(err)
      }, 
      complete() {
      }
    });
  },
  collectShop(id){
    app.httpPost("shop/CollectShop?shopid=" + id, null, function (result) {
      that.loadShops();
      wx.showToast({
        title: '关注成功',
        icon: 'success'
      });
    });
  }
})