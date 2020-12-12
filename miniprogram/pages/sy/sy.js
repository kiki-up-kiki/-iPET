// miniprogram/pages/sy/sy.js
Page({
  data: {
    id:"",
  },
input1:function(e){
var value=e.detail.value
this.setData({
  id:value
})

}, 
name:function(){
    var id = this.data.id
      wx.navigateTo({
        url: '../index/index?id=' + id,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
  },
   
})
 
