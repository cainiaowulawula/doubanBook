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
    id: '',
    show: false,
    inputValue: ''
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
  handlerClickPraise: function (e) {
    let _name = e.currentTarget.dataset.id
    let newDatas = []
    this.data.getData.result.userEvaluateList.map(item => {
      if (item.author === _name) {
        if (item.type === '有用') {
          item.number = parseInt(item.number) + 1
          item.type = "无用"
        } else {
          item.number = parseInt(item.number) - 1
          item.type = "有用"
        }
      }
      newDatas.push(item)
    })
    db.collection('doubanbooks').doc(this.data.id).update({
      data: {
        ['result.userEvaluateList']: newDatas,
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }
    })
    this.setData({
      ['getData.result.userEvaluateList']: newDatas
    })
    console.log(newDatas)
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

  getInputValue: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  dateFtt (fmt, date) { //author: meizz 
    let ret;
    let opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString()          // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
    };
    return fmt;
  },

  onpublish: function () {
    var crtTime = new Date()
    let newDatas = []
    let dataList = {
      author: wx.getStorageSync('userInfo').nickName,
      'data': this.dateFtt("YYYY-mm-dd HH:MM:SS", crtTime),
      evaluate: '',
      evaluateStore: this.data.inputValue,
      number: 0,
      type: '有用'
    }
    newDatas = this.data.getData
    newDatas.result.userEvaluateList.push(dataList)
    console.log(newDatas, this.data.id)
    db.collection('doubanbooks').doc(this.data.id).update({
      data: {
        ['result.userEvaluateList']: newDatas,
      }
    }).then(res => {
      console.log(res)
    }).catch( err => {
      console.log(err)
    }
    )
    // this.setData({
    //   ['getData.result.userEvaluateList']: newDatas
    // })
  },

  getDataList: function (id) {
    db.collection('doubanbooks').where({
      _id: id
    }).get().then(res => {
      this.setData({
        getData: res.data[0],
        id: id
      })
      console.log(this.data.getData)
    })
  },

  showPopup () {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataList(options.id)
  }
})