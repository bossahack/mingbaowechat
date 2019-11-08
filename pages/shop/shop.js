// pages/shop/shop.js
const computedBehavior = require('miniprogram-computed')
const app = getApp();
Component({
  behaviors: [computedBehavior],
  data: {
    shopId:2,
    typeSelectedIndex:0,
    foodLabel:'A0',
    arriveIndex:0,
    note:'',
    carDetailShow:false,
    shop:{
      Id:1,
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
  },
  computed:{
    totalPrice(data) {
      var items= data.selectedFoods.length;//.filter(c => c.Id>0);
      console.log(items);
      return items;
    }
  },
methods:{
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
    let that=this;
    if(that.data.selectedFoods==null||that.data.selectedFoods.length<=0){
      return;
    }
    var bParam = { ShopId: that.data.shopId, ArriveTimeType: that.data.arrives[that.data.arriveIndex].key, Note: that.data.note, Items: []};
    that.data.selectedFoods.forEach((item,index)=>{
      bParam.Items.push({FoodId:item.id,Qty:item.qty});
    });
    app.httpPost("userorder/BookOrder",bParam,function(){
      let that=this;

      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.setData({
        refershToday: true
      });
      
      wx.showModal({
        title: '下单成功',
        content: '下单成功，记得去拿哦',
        success(res) {
          that.setData({
            selectedFoods:[]
          });
        }
      })

    });
  }
}
})