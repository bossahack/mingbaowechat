// pages/shop/shop.js
const computedBehavior = require('miniprogram-computed')
const app = getApp();
Page({
  behaviors: [computedBehavior],
  data: {
    shopId:2,
    typeSelectedIndex:1,
    foodLabel:'A0',
    arriveIndex:0,
    carDetailShow:false,
    shop:{
      Id:1,
      Name:'',
      Address:'',
      Logo:''
    },
    types: [
    ],
    arrives: [
      { key: 15, value: '15分钟左右取' },
      { key: 30, value: '30分钟左右取' },
      { key: 60, value: '一小时左右取' },
      { key: 120, value: '2小时左右取' },
      { key: 240, value: '4小时左右取' },
    ],
    foods: [
    ],
    selectedFoods:[
      {id:1,qty:2}
    ],
  },
  computed:{
    getSelectedFoods(data) {
      return 2;
      var item = data.selectedFoods.find(c => c.id == foodId);
      return data.selectedFoods.find(c => c.id == foodId);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id=options.id;
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

  typeTap(e){
    var id = e.target.dataset.typeid;
    this.setData({
      foodLabel:"A"+id*2
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
  addFood(e){
    var foodid = e.currentTarget.dataset.id;
    var item=this.data.selectedFoods.find(c=>c.id==foodid);
    if(item==null){
      this.data.selectedFoods.push({id:foodid,qty:1});
    }else{
      item.qty+=1;
    }
    this.setData({
      selectedFoods:this.data.selectedFoods
    });
  }
})