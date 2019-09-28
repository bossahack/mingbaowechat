Page({
  data: {
    showDialog: false,
    setting:{
      Name:'',
      Address:'',
      Phone:'',
      Wechat:'',
      Recommender :''
    },
    currentType:'',
    currentTypeName:'',
    setVal:'aa'
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  toogleDialog: function (event) {
    let that=this;
    let type =event.currentTarget.dataset.type;
    let typeName='';
    switch (type) {
      case 'Name':
        typeName="店名称";
        break;
      case 'Address':
        typeName = "店地址";
        break;
      case 'Phone':
        typeName = "手机号";
        break;
      case 'Wechat':
        typeName = "微信";
        break;
      case 'Recommender':
        typeName = "推荐人";
        break;
      default:
        break;
    }
    that.setData({
      showDialog: !that.data.showDialog,
      currentType:type,
      currentTypeName:typeName,
      setVal:null
    })
  },
  closeDialog(){
    let that=this;
    that.setData({
      showDialog: false
    })
  },
  getinput(e){
    let that = this;
    that.setData({
      setVal: e.detail.value
    })
  },
  confirm(){
    let that = this;
    var obj={};
    switch (that.data.currentType) {
      case 'Name':
        obj = { 'setting.Name': that.data.setVal}
        break;
      case 'Address':
        obj = { 'setting.Address': that.data.setVal }
        break;
      case 'Phone':
        obj = { 'setting.Phone': that.data.setVal }
        break;
      case 'Wechat':
        obj = { 'setting.Wechat': that.data.setVal }
        break;
      case 'Recommender':
        obj = { 'setting.Recommender': that.data.setVal }
        break;
      default:
        break;
    }
    obj.showDialog=false;
    that.setData(obj)
    console.log(this.setVal);
  }
})