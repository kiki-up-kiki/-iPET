Page({
  data:{canIUse: wx.canIUse('button.open-type.getUserInfo')},
  onLoad: function() {
        // 查看是否授权
        var that=this
        wx.getSetting({
          success (res){
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function(res) {
                  console.log(res.userInfo);
                  that.setData({
                    canIUse:0
                  })
                }
              })
              wx.cloud.callFunction({
                name:'getid',
                complete:res=>{
                  var openid = res.result.openid
                  console.log('openid--',openid)
                  wx.setStorage({
                    key:"OpenId",
                    data:openid
                  })
                }
              })
            }
          }
        })
      },
      bindGetUserInfo (e) {
        console.log(e)
      }
})