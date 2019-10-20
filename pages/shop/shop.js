// pages/shop/shop.js
const app = getApp();
Page({
  data: {
    shopId:0,
    typeSelectedIndex:1,
    foodLabel:'A0',
    arriveIndex:0,
    carDetailShow:false,
    shop:{
      Id:1,
      Name:'安徽板面',
      Address:'住邦2000',
      Logo:'http://pz8m2vj7z.bkt.clouddn.com/11571138257973.jpg'
    },
    types: [
      { Id: 1, Name: '特色' },
      { Id: 2, Name: '炒菜' },
      { Id: 3, Name: '主食' },
    ],
    arrives: [
      { key: 1, value: '15分钟左右取' },
      { key: 2, value: '30分钟左右取' },
      { key: 3, value: '一小时左右取' },
      { key: 4, value: '2小时左右取' },
      { key: 4, value: '4小时左右取' },
    ],
    foods: [
      { Id: 1, Type: 2, Name: '米饭', Price: 122.33, Img: 'http://pz8m2vj7z.bkt.clouddn.com/11571138257973.jpg', Status: 0 },
      { Id: 2, Type: 1, Name: '水果', Price: 222.33, Img: 'http://pz8m2vj7z.bkt.clouddn.com/11571138257973.jpg', Status: 0 },
      { Id: 3, Type: 1, Name: '蔬菜', Price: 322.33, Img: 'http://pz8m2vj7z.bkt.clouddn.com/11571138257973.jpg', Status: 0 },
      { Id: 4, Type: 1, Name: '蔬菜', Price: 322.33, Img: 'http://pz8m2vj7z.bkt.clouddn.com/11571138257973.jpg', Status: 0 },
      { Id: 5, Type: 1, Name: '蔬菜', Price: 322.33, Img: 'http://pz8m2vj7z.bkt.clouddn.com/11571138257973.jpg', Status: 0 },
      { Id: 6, Type: 1, Name: '蔬菜', Price: 322.33, Img: 'http://pz8m2vj7z.bkt.clouddn.com/11571138257973.jpg', Status: 0 },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id=options.id;
    this.loadType();
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
    app.httpGet("food/GetShopTypes?id="+this.data.shopId,function(result){
      console.log(result);
    });
  },
  loadProduct(){

  }
})