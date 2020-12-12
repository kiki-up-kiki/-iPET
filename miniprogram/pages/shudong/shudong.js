Page({
  data: {

    value: '',
    lan: '',
    toView: 'msg-10',
    chat_list: []
  },
  onLoad: function () {
    var that=this;
    wx.getStorage({
      key: "OpenId",
      success(res) {
        //console.log(res.data)
        const db = wx.cloud.database()
        db.collection('shudong').where({
          _openid: res.data // 填入当前用户 openid
        }).get().then(res => {
          console.log(res.data);
          that.setData({
            chat_list:res.data.map(item=>({
              label:0,
              text:item.txt
            }))
          })
        })
      }
    })
  },
  input1: function (e) {
    this.setData({
      value: e.detail.value
    })
  },
  tap1: function () {
    var that = this;
    let txt = this.data.value;
    if (txt === "") return;
    const db = wx.cloud.database()
    db.collection("shudong").add({
      data: {
        txt: txt
      },
      success: function (res) {
        console.log(res)
      }
    })


    let old_arr = this.data.chat_list
    old_arr.push({
      label: 0,
      text: txt
    });
    that.setData({
      chat_list: old_arr,
      toView: 'msg-' + (old_arr.length - 1),
      'value': ""
    })

    console.log(txt);
  }
})