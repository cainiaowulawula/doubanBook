// miniprogram/pages/me/me.js
const db = wx.cloud.database()
Page({
  onGetUserInfo (e) {
    console.log(e)
    let userInfo = e.detail.userInfo
    wx.cloud.callFunction({
      name: 'login',
      complete: res=> {
        userInfo.openid = res.result.appid
        this.setData({
          userInfo
        })
        wx.setStorageSync('userInfo', userInfo)
      }
    })
  },
  goBackUserInfo () {
    this.setData({
      userInfo: {}
    })
    wx.removeStorage({
      key: 'userInfo',
      success(res) {
        console.log(res)
      }
    })
  },
  userDetails () {
    console.log(this.data.userInfo)
    wx.showModal({
      title: '个人信息',
      content: `昵称：${this.data.userInfo.nickName}\r\n国家：${this.data.userInfo.country}\r\n省份：${this.data.userInfo.province}\r\n城市：${this.data.userInfo.city}\r\n`,
    })
  },
  add(res) {
    console.log(111, res)
    this.setData({
      loadingHidden: false
    })
    wx.cloud.callFunction({
      name: 'getdouban',
      data: {
        res:res, 
        context:''
      },
      success:(result) => {
        console.log(result)
        db.collection('doubanbooks').add({
          // data 字段表示需新增的 JSON 数据
          data: result,
        }).then(res => {
          console.log(res)
          if (res._id) {
            this.setData({
              loadingHidden: true
            })
            wx.showModal({
              title: '添加成功',
              content: `《${result.result.title}》添加成功`,
            })
          }
        })
      }
    })
  },
  addbook () {
    wx.scanCode({
      success:res=> {
        console.log(res.result)
        this.add(res.result)
      }
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync('userInfo') || {},
    loadingHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})