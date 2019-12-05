// pages/shopset/shopset.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasShop:true,
    loginInfo:{
      Phone:null,
      Pwd:null,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLoginInfo();
    this.getDownLoadUrl();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  confirmJoin(e) {
    let that = this;
    var phone = e.detail.value.phone;
    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }
    if (!RegExp("^[1][3,4,5,7,8][0-9]{9}\$").test(phone)){
      wx.showToast({
        title: '手机号格式不正确，请检查',
        icon: 'none'
      });
      return;
    }
    var pwd = e.detail.value.pwd;
    if (!pwd) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }
    app.httpPost("shop/create", { Phone: phone,Pwd:pwd }, function (result) {
      that.setData({
        loginInfo: {Phone:phone,Pwd:pwd},
        hasShop: true
      });
      wx.showToast({
        title: '开通成功！您可通过此账号密码到app端登录',
        icon: 'success',
        duration:3000
      });
    });
  },
  submitPwd(e){
    let that=this;
    var pwd = e.detail.value.pwd;
    if (!pwd) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }
    app.httpPost('user/UpdateLoginPwd?pwd=' + pwd,null,function(res){
      wx.showToast({
        title: '密码修改成功',
        icon: 'success'
      });
    });
  },
  getLoginInfo(){
    let that=this;
    app.httpGet('user/GetLoginInfo',function(result){
      that.setData({
        loginInfo:result,
        hasShop:!!result.Phone
      });
    });
  },
  getDownLoadUrl() {
    let that = this;
    app.httpGet("dict/get?flag=downUrl", function (res) {
      that.setData({
        downUrl: res
      });
    });
  }
})