Page({
  data:{
    news_list:[
    ]
  },

  onLoad:function(){
    var that=this;
    wx.request({
      url: 'https://api.tianapi.com/txapi/ncov/index?key=773eeba684c6419ec1261f60adb9205d',
      success(res){
        console.log(res)
        if(res.data.code!==200) return;
        let newsList=res.data.newslist[0].news;
        console.log(newsList)
        that.setData({
          news_list:newsList 
        })
      }
    })
  }


})