// pages/spread/spread.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myUsers:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyShop();
    this.getShopOrder();
    this.getIncome();
    this.getMyUsers();
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  getMyShop(){
    let that=this;
    app.httpGet("spread/GetMyShop",function(res){
      that.setData({
        shops:res
      });
    })
  },
  getShopOrder(){
    let that = this;
    app.httpGet("spread/GetMyShopOrder", function (res) {
      that.setData({
        shopOrders: res
      });
    })
  },
  getIncome() {
    let that = this;
    app.httpGet("user/GetIncome", function (res) {
      that.setData({
        income: res
      });
    })
  },
  getMyUsers(){
    let that = this;
    app.httpGet("spread/GetMyRecommenders", function (res) {
      that.setData({
        myUsers: res
      });
    })
  }

})