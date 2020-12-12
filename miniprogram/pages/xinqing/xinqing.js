Page({
  data: {
    value: '',
    visiable: true,
    score: '',
    result: '',
    dict: {},
    visiable2: false
  },
  input1: function (e) {
    this.setData({
      value: e.detail.value
    })
  },

  tap1: function () {
    const db = wx.cloud.database()
    this.add_item_by_database(db,'mood',this.data.value);
  },
  onLoad: function () {
    var that = this;
    let cur_time = this.getDate();
    const db = wx.cloud.database();
    db.collection('mood').where({
      date: cur_time
    }).get().then(res => {
      if (res.data.length > 0) {
        this.setData({
          visiable: false
        })
      }
    })
    db.collection('word').get({
      success: function (res) {
        let arr = res.data;
        let obj = {};
        for (let x of arr) {
          obj[x.value] = x.text;
        }
        that.setData({
          dict: obj
        })
      }
    })
  },
  getDate: function () {
    var myDate = new Date();
    return myDate.getFullYear() + '-' + myDate.getMonth() + '-' + myDate.getDay();
  },
  search1: function () {
    this.setData({
      visiable2: true
    })
    var that = this;
    const db = wx.cloud.database();
    db.collection("mood").get({
      success: function (res) {
        let arr = res.data.slice(-7);
        let sum = 0;
        for (let x of arr) sum += parseInt(x.value);
        let new_score = sum / arr.length
        console.log(sum / arr.length)
        that.setData({
          score: new_score
        });
        if (new_score <= 30) {
          that.setData({
            result: that.data.dict[3]
          })
        };
        if (new_score <= 75 && new_score > 30) {
          that.setData({
            result: that.data.dict[1]
          })
        };
        if (new_score > 75) {
          that.setData({
            result: that.data.dict[2]
          })
        };
      }
    })
  },
  add_item_by_database: function (db, db_name, value) {
    let cur_time = this.getDate();
    db.collection(db_name).get().then(res => {
      let x = res.data.length;
      if (x > 7) {
        let del_id = res.data[0]._id;
        console.log(del_id)
        db.collection(db_name).doc(del_id).remove({
          success: function (res) {
            console.log(res.data);

          }
        })
      }


      db.collection(db_name).add({
        data: {
          value: value,
          date: cur_time
        },
        success: function () {
          console.log('add');
        }
      })



    })
  }
})