// miniprogram/pages/datails/datails.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getData: [],
    unfoldMore: '展开更多...',
    contentHidden: 'hidden',
    lineClamp: '5',
    menuType: true,
    menu: '展开更多...',
  },

  onClickMenu () {
    if (this.data.menuType) {
      this.setData({
        menuType: false,
        menu: '收起'
      })
    } else {
      this.setData({
        menuType: true,
        menu: '展开更多...'
      })
    }
  },

  onClickUnfoldMore () {
    if (this.data.contentHidden === 'hidden') {
      this.setData({
        contentHidden: 'static',
        lineClamp: '0',
        unfoldMore: '收起'
      })
    } else {
      this.setData({
        contentHidden: 'hidden',
        lineClamp: '5',
        unfoldMore: '展开更多...'
      })
    }
  },

  getDataList: function (id) {
    db.collection('doubanbooks').where({
      _id: id
    }).get().then(res => {
      this.setData({
        getData: res.data[0]
      })
      console.log(this.data.getData)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataList(options.id)
  }
})