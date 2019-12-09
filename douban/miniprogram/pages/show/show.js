// miniprogram/pages/show/show.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getDataList: [],
    page: 0
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom () {
    console.log('触底了')
    wx.showLoading()
    this.setData({
      page: this.data.page + 1
    }, () => {
      this.getList()
    })
  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    console.log('下拉刷新')
    this.getList(true)
  },

  getList (init) {
    // init 判断是不是第一次，如果是就直接渲染
    if (init) {
      this.setData({
        page: 0
      })
    }
    const PAGE = 4
    const offset = this.data.page * PAGE
    let ret = db.collection('doubanbooks').orderBy('result.create_time', 'desc')
    if (this.data.page > 0) {
      ret = ret.skip(offset)
    }
    ret = ret.limit(PAGE).get().then(res => {
      if (init) {
        this.setData({
          getDataList: res.data
        })
      }
      else {
        this.setData({
          getDataList: [...this.data.getDataList, ...res.data]
        })
      }
      wx.hideLoading()
        console.log(res, this.data.getDataList)
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(true)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})