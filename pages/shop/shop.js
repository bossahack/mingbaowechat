// pages/shop/shop.js
const computedBehavior = require('miniprogram-computed')
const app = getApp();
Component({
  behaviors: [computedBehavior],
  data: {
    imgDomain:app.globalData.imgDomain,
    shopId:1,
    typeSelectedIndex:0,
    foodLabel:'A0',
    arriveIndex:0,
    note:'',
    carDetailShow:false,
    shop:{
      Id:0,
      Name:'',
      Address:'',
      Logo:''
    },
    arrives:app.globalData.arrives,
    types: [
    ],
    foods: [
    ],
    selectedFoods:[
    ],
    isTrueInput:false,
    showGetUserInfo:false,
    showBindPhone:false,
    phone:null,
    code:'',
    phoneDisable:false,
    countdown:0,
  },
  computed:{
    totalPrice(data) {
      var items= data.selectedFoods.length;//.filter(c => c.Id>0);
      console.log(items);
      return items;
    }
  },
methods:{
  onLoad: function (options) {
    let that=this;
    var dbInfo = wx.getStorageSync('userInfo');
    if (dbInfo == null || !dbInfo.WXName) {
      that.setData({
        showGetUserInfo:true
      });
    }

    this.data.shopId=options.id;
    this.loadType();
    this.loadProduct();
    this.loadShop();
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
    wx.stopPullDownRefresh();
  },

  typeTap(e){
    var id = e.target.dataset.typeid;
    this.setData({
      foodLabel:"A"+id+":0",
      typeSelectedIndex: e.target.dataset.index
    });
  },

  arriveChange(e){
    this.setData({
      arriveIndex: e.detail.value
    })
  },
  toggleDetail(){
    let that=this;
    this.setData({
      carDetailShow: !that.data.carDetailShow
    });
  },
  loadType(){
    let that=this;
    app.httpGet("food/GetTypes_U?id=" + this.data.shopId, function (result) {
      result.sort(function (x, y) {return x.Level - y.Level });
      that.setData({
        types:result
      });
      that.sortProduct()
    });
  },
  loadProduct(){
    let that = this;
    app.httpGet("food/GetList_U?shopid=" + this.data.shopId, function (result) {
      that.setData({
        foods: result
      });
      that.sortProduct()
    });
  },
  loadShop(){
    let that = this;
    app.httpGet("shop/GetInfo_U?id=" + this.data.shopId, function (result) {
      if(!result.Logo){
        result.Logo='logo.png';
      }
      that.setData({
        shop: result
      });
    });
  },
  sortProduct(){
    let that=this;
    if (that.data.types != null && that.data.types.length>0
      && that.data.foods != null && that.data.foods.length>0){
      that.data.foods.sort(function(x,y){
        if(x.Type==y.Type){
          return x.Level-y.Level;
        }
        var xLevel = that.data.types.find(c=>c.Id==x.Type);
        var yLevel = that.data.types.find(c => c.Id == y.Type);
        return xLevel.Level - yLevel.Level;
      });
      that.setData({
        foods:that.data.foods
      });
    }
  },
  plusFood(e){
    var foodid = e.currentTarget.dataset.id;
    //改变foods
    var food = this.data.foods.find(c => c.Id == foodid);
    if (food.qty === undefined) {
      food.qty = 1;
    } else {
      food.qty += 1;
    }

    var item=this.data.selectedFoods.find(c=>c.id==foodid);
    if(item==null){
      this.data.selectedFoods.push({ id: foodid, qty: 1, name: food.Name, price: food.Price});
    }else{
      item.qty+=1;
    }
    this.setData({
      selectedFoods:this.data.selectedFoods,
      foods:this.data.foods
    });
  },
  minusFood(e) {
    var foodid = e.currentTarget.dataset.id;
    var item = this.data.selectedFoods.find(c => c.id == foodid);
    item.qty -= 1;
    if(item.qty===0){
      this.data.selectedFoods.splice(this.data.selectedFoods.indexOf(item),1);
    }
    //改变foods
    var food = this.data.foods.find(c => c.Id == foodid);
    food.qty -= 1;
    this.setData({
      selectedFoods: this.data.selectedFoods,
      foods: this.data.foods
    });
  },
  inputNote(e){
    this.setData({note:e.detail.value});
  },
  ok(){
    let that = this; 
    var dbInfo = wx.getStorageSync('userInfo');
    if (dbInfo == null || !dbInfo.WXName) {
      that.setData({
        showGetUserInfo: true
      });
      return;
    }
    if (dbInfo == null || !dbInfo.WxPhone) {
      that.setData({
        showBindPhone: true
      });
      return;
    }
    if(that.data.selectedFoods==null||that.data.selectedFoods.length<=0){
      return;
    }

    wx.showModal({
      title: '确认吗？',
      content: '确认下单吗？',
      success(res) {
        if (!res.confirm)
          return;
        var bParam = { ShopId: that.data.shopId, ArriveTimeType: that.data.arrives[that.data.arriveIndex].key, Note: that.data.note, Items: [] };
        that.data.selectedFoods.forEach((item, index) => {
          bParam.Items.push({ FoodId: item.id, Qty: item.qty });
        });
        app.httpPost("userorder/BookOrder", bParam, function (res) {
          if (res) {
            var ids = res.split(',');
            var foodName = "";
            that.data.foods.forEach((food, index) => {
              if (ids.indexOf(food.Id.toString()) > -1) {
                food.Status = 1;
                foodName += food.Name + ",";
              }
            });
            that.data.selectedFoods.forEach((food,index)=>{
              if (ids.indexOf(food.id.toString()) > -1) {
                food.Status = 1;
              }
            });
            that.setData({
              foods: that.data.foods,
              selectedFoods:that.data.selectedFoods
            });
            wx.showModal({
              title: '失败啦！',
              content: foodName + "卖完啦，请重新选购",
            })
            return;
          }
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];  //上一个页面
          prevPage.setData({
            refershToday: true
          });
          that.data.foods.forEach((food, index) => {
            food.qty = 0;
          });
          that.setData({
            selectedFoods: [],
            foods: that.data.foods
          });

          wx.showModal({
            title: '下单成功',
            content: '下单成功，记得取哦',
          })

        });
      }
    })
   
  },
  toggleInput(){
    let that = this;
    this.setData({
      isTrueInput: true
    });
  },
  inputConfirm(){
    let that = this;
    this.setData({
      isTrueInput: false
    });
  },
  inputblue(){
    let that = this;
    this.setData({
      isTrueInput: false
    });
  },
  getUserInfo: function (e) {
    var that = this;
    if (!e.detail.userInfo){
      that.setData({
        showGetUserInfo: false
      });
      return;
    }
    app.httpPost("user/UpdateWXInfo", e.detail.userInfo, function (result) {
      wx.setStorageSync('userInfo', result);
      that.setData({
        showGetUserInfo: false
      });
    });
  },
  cancelGetUserInfo(){
    var that = this;
    that.setData({
      showGetUserInfo: false
    });
  },
  phoneChange(e){
    this.setData({
      phone: e.detail.value
    });
  },
  codeChange(e){
    this.setData({
      code: e.detail.value
    });
  },
  sendCode(e){
    let that = this;
    var phone = that.data.phone;
    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }
    if (!RegExp("^[1][2,3,4,5,6,7,8,9][0-9]{9}$").test(phone)){
      wx.showToast({
        title: '手机号格式不正确，请检查',
        icon: 'none'
      });
      return;
    }
    if(that.data.countdown>0){
      return;
    }
    that.setData({
      countdown:60
    });
    let countdownInterval=setInterval(() => {
      that.setData({
        countdown:that.data.countdown-1
      });
      if(that.data.countdown<=0){
        clearInterval(countdownInterval);
      }
    }, 1000);
    app.httpPost("user/SendCode?phone="+phone,null, function (result) {
     wx.showToast({
       title: '短信已发送，请在10分钟内完成验证',
     })
    });
  },
  bindPhone(e){
    let that = this;
    var code = that.data.code;
    if (!code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      });
      return;
    }
    if(code.length!=4){
      wx.showToast({
        title: '请输入4位验证码',
        icon: 'none'
      });
      return;
    }

    app.httpPost("user/UpdatePhone?code="+code, null,function (result) {
      wx.setStorageSync('userInfo', result);
      that.setData({
        showBindPhone: false
      });
     });
  }
}
})