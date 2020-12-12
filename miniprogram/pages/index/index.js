//index.js
const app = getApp()

Page({
  data: {
    denglu:true,
    sign: true,
    id: "",
    date1: '0',
    health: 80,
    feeling: 70,
    growth: 0,
    now: "开心~~~",
    bind: 0,
    pict: "../../images/yuan.jpg",
  },
  one: function () {
    var that = this;
   
      that.setData({
        health: that.data.health + 1,
        pict: "../../images/bao.jpg",
      })
      setTimeout(function () {
        that.setData({
          pict: "../../images/yuan.jpg"
        })
      }, 2000)
    
  },

  two: function () {
    var that = this;
      that.setData({
        health: that.data.health - 1,
        growth: that.data.growth + 1,
        pict: "../../images/shui.gif",
      })
      setTimeout(function () {
        that.setData({
          pict: "../../images/yuan.jpg"
        })
      }, 2000)
    

  },
  three: function () {
    var that = this;
    
      that.setData({
        feeling: that.data.feeling - 1,
        pict: "../../images/guai.jpg",
      })
    
    if (this.data.growth < 100) {
      that.setData({
        growth: that.data.growth + 1,
      })
    }
    setTimeout(function () {
      that.setData({
        pict: "../../images/yuan.jpg"
      })
    }, 2000)

  },
  four: function () {
    var that = this;
    
      that.setData({
        feeling: that.data.feeling + 1,
        pict: "../../images/happy.jpg",
      })
      setTimeout(function () {
        that.setData({
          pict: "../../images/yuan.jpg"
        })
      }, 2000)
    

  },
  five: function () {
    var that = this;
    if (this.data.health < 50) {
      that.setData({
        health: 100,
        pict: "../../images/yao.jpg",
      })
      setTimeout(function () {
        that.setData({
          pict: "../../images/yuan.jpg"
        })
      }, 2000)
    }

  },
  into: function () {
    this.data.bind++;
    if (this.data.bind % 2 == 1)
      this.setData({
        intomodal: true
      })
    else
      this.setData({
        intomodal: false
      })
  },
  changeYL: function () {
    this.setData({
      showModal: true
    })
  },
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },

  

  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  company: function () {
    this.setData({
      date1: parseInt(this.data.date1)  + 1,
      sign: false
    });
    const db = wx.cloud.database()
    let cur_time = this.getDate();
    this.add_item_by_database(db,'company',{value: this.data.date1,date: cur_time})
  },
  onLoad: function (e) {
    var id = e.id
    console.log(e)
        this.setData({
          id: id
        })
    if (this.data.health < 20) {
      this.setData({
        now: "生病"
      })
    };
    if (this.data.health >= 20) {
      this.setData({
        now: "开心~~~"
      })
    };
    var that = this;
    const db=wx.cloud.database();
    db.collection("company").get({
      success: function (res) {
        res=res.data.slice(-1)
        that.setData({
          date1: res[0].value
        })
      }
    })
    db.collection("health").get({
      success: function (res) {
        let len=res.data.length;
        let t=(len<1)?100:res.data[len-1].value;
        that.setData({
          health: t
        })
      }
    })
    db.collection("feeling").get({
      success: function (res) {
        let len=res.data.length;
        let t=(len<1)?100:res.data[len-1].value;
        that.setData({
          feeling: t
        })
      }
    })
    db.collection("growth").get({
      success: function (res) {
        let len=res.data.length;
        let t=(len<1)?0:res.data[len-1].value;
        that.setData({
          growth: t
        })
      }
    })

    var that = this;
    let cur_time = this.getDate();
    db.collection('company').where({
      date: cur_time
    }).get().then(res => {
      if (res.data.length > 0) {
        this.setData({
          sign: false
        })
      }
    })
  },
  getDate: function () {
    var myDate = new Date();
    return myDate.getFullYear() + '-' + myDate.getMonth() + '-' + myDate.getDay();
  },
  save: function () {
    let that=this;
    if (that.data.health < 20) {
      that.setData({
        now: "生病"
      })
    };
    if (that.data.health >= 20) {
      that.setData({
        now: "开心~~~"
      })
    };
    const db = wx.cloud.database()
    this.add_item_by_database(db, 'health', {value:that.data.health})
    this.add_item_by_database(db, 'growth', {value:that.data.growth})
    this.add_item_by_database(db, 'feeling',{value:that.data.feeling})
  },
  add_item_by_database: function (db, db_name, obj) {
    db.collection(db_name).get().then(res => {
      let x = res.data.length;
      if(x>7) {
        let del_id = res.data[0]._id;
        console.log(del_id)
        db.collection(db_name).doc(del_id).remove({
          success: function(res) {
            console.log(res.data);
            
          }
        })
      }


        db.collection(db_name).add({
        data: obj,
        success:function(){
          console.log('add');
        }
      })
      
      

    })
  }
})