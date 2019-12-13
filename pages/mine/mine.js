// pages/mine/mine.js
const app = getApp();
var bus = app.globalData.bus;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfoDb:{},
    showjoin:false,
    qrCode:null,
    intro: null,
    introShow:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initInfo();
    bus.on("loginSuccess", (result) => {
      this.initInfo();
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  getUserInfo: function (e) {
    var that = this;
    if (!e.detail.userInfo)
      return;
    app.httpPost("user/UpdateWXInfo", e.detail.userInfo, function (result) {
      wx.setStorageSync('userInfo', result);
      that.initInfo();
    });
  },

  initInfo:function(){
    let that = this;
    var dbInfo = wx.getStorageSync('userInfo');
    if (dbInfo == null || !dbInfo.WXName) {
      that.setData({
        hasUserInfo: false
      });
    } else {
      that.setData({
        hasUserInfo: true,
        userInfoDb: dbInfo
      });
    }
    var qrcode = wx.getStorageSync("qrCodeStr");
    if(!!qrcode){
      that.setData({
        qrCode: qrcode
      })
    }
  },
  showJoin() {
    let that = this;
    if (!that.data.userInfoDb.WXName){
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    that.setData({
      showjoin: !that.data.showjoin
    });
  },
  confirmJoin(e){
    let that = this;
    var wxnum = e.detail.value.wxnum;
    if (!wxnum) {
      wx.showToast({
        title: '请输入联系方式',
        icon: 'none'
      });
      return;
    }
    app.httpPost("user/JoinUs",  { WxNum:wxnum},function(result){
      var dbInfo = wx.getStorageSync('userInfo');
      dbInfo.WxNum=wxnum;
      dbInfo.Type=1;
      wx.setStorageSync('userInfo', dbInfo);
      that.data.userInfoDb.WxNum=wxnum;
      that.data.userInfoDb.Type=1;
      that.setData({
        userInfoDb:that.data.userInfoDb
      });
    });
  },
  showQrcode(){
    this.setData({
      qrShow: !this.data.qrShow
    });
    this.getQrcode();
  },
  showEdit(){
    this.setData({
      editShow:!this.data.editShow
    });
  },
  getQrcode(){
    let that = this; 
    var qrcode = wx.getStorageSync("qrCodeStr");
    if (!!qrcode) {
      that.setData({
        qrCode: qrcode
      });
      return;
    }
    app.httpGet('user/GetUserQrCode',function(result){
      var str = 'data:image/png;base64,' + result;
      wx.setStorageSync('qrCodeStr', str)
      that.setData({
        qrCode: str
      })
    });
  },
  getIntro(){
    let that=this;
    app.httpGet("dict/get?flag=userIntro",function(res){
      that.setData({
        intro:res
      });
    });
  },
  showIntro(){
    let that=this;
    if(!that.data.intro){
      that.getIntro();
    }
    this.setData({
      introShow:!that.data.introShow
    });
  },
  toShopSet(){
    wx.navigateTo({
      url: '../shopset/shopset'
    })
  }
})