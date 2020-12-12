Page({
  data: {
    value:'',
    lan:'',
    toView:'msg-10',
   
    chat_list:[
    ]
  },
  onLoad:function(){
    wx.getUserInfo({
      success: function(res) {
        var raw = res.rawData;
  console.log(raw)
     
      },fail:function(res){
        console.log(res)
      }
    })
  },
  input1:function(e){
    this.setData({
      value:e.detail.value
    })
  },
  
 tap1:function(){
  var that=this;
   let txt=this.data.value;
   if(txt==="") return;
   let old_arr=this.data.chat_list
   old_arr.push({label:0,text:txt});
   that.setData({
     chat_list:old_arr,
    toView:'msg-' + (old_arr.length - 1),
    'value':""
   })
    console.log(txt);
    wx.request({
      url: 'https://openapi.tuling123.com/openapi/api/v2',
      method:'POST',
      data:{
        "perception":{
          "inputText":{
            'text':txt
          }
        },
        "userInfo":{
          "apiKey":"你自己的",
          "userId": "你自己的"
        }
      },
      success({data}){
        let re=data.results[0].values.text;
        console.log(data.results[0].values.text);
        let old_arr=that.data.chat_list;
        old_arr.push({label:1,text:re})
        that.setData({
        lan:data.results[0].values.text,
        chat_list:old_arr,
        toView:'msg-' + (old_arr.length - 1),
        })
      }
    })
  }
})
