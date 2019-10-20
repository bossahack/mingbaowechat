// pages/history/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [
      {
        Id: 1, ShopName: '牛肉板面', CreateTime: Date.now, Status: 1, Items: [
          { Name: '面', Qty: 2 }, { Name: '面', Qty: 2 },
        ]
      },
    ]
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
    console.log('onPullDownRefresh');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('onReachBottom');
    let that=this;
    that.data.orders.push({
      Id: 1, ShopName: '牛肉板面', CreateTime: Date.now, Status: 1, Items: [
        { Name: '面', Qty: 2 }, { Name: '面', Qty: 2 },
      ]
    });
    that.setData({
      orders:that.data.orders
    });
  }

})