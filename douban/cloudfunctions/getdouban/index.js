// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const doubanbook = require('doubanbook')
const cheerio = require('cheerio')

cloud.init()

async function getDouban(isbn) {
  const url = "https://search.douban.com/book/subject_search?search_text=" + isbn
  let searchInfo = await axios.get(url);
  let reg = /window\.__DATA__ = "(.*)"/
  if (reg.test(searchInfo.data)) {
    let searchResult = doubanbook(RegExp.$1)[0]
    // console.log(searchResult)
    return searchResult
  }
}

async function searchDouban (isbn) {
  let _getDouban = await getDouban(isbn)
  let detailsPage = await axios.get(_getDouban.url)
  // 使用cheerio这个库，这个库是专门用来解析HTML文档用的
  const $ = cheerio.load(detailsPage.data)
  const info = $('#info').text().split('\n').map(v => v.trim()).filter(v => v)
  //  
  const content = $('#link-report').text().split('\n').map(v => v.trim()).filter(v => v)
  // 获取目录结构
  let url_no = _getDouban.url.split('/')
  let noOmit = 'dir_' + url_no[url_no.length - 2] + '_short'
  let no = 'dir_' + url_no[url_no.length - 2] + '_full'
  const shortOmit = $('#' + noOmit).text().split('\n').map(v => v.trim()).filter(v => v)
  const short = $('#' + no).text().split('\n').map(v => v.trim()).filter(v => v)
  // 获取常用标签
  const tagList = []
  $('#db-tags-section a.tag').each((i, v)=>{
    tagList.push({
      title: $(v).text()
    })
  })
  // 喜欢读此书的人也喜欢的电子书
  const e_bookList = []
  $('#rec-ebook-section dl').each((i, v)=>{
    let _v = $(v).text().split('\n').map(v => v.trim()).filter(v => v)
    e_bookList.push({
      title: _v[0],
      money: _v[1]
    })
  })
  $('#rec-ebook-section img').each((i, v) => {
    e_bookList[i].src = $(v).attr("src")
  })
  // 喜欢读此书的人也喜欢的书
  const bookList = []
  $('#db-rec-section dl').each((i, v) => {
    let _v = $(v).text().split('\n').map(v => v.trim()).filter(v => v)
    console.log(_v)
    if (_v.length > 0) {
      bookList.push({
        title: _v[0]
      })
    }
  })
  $('#db-rec-section img').each((i, v) => {
    bookList[i].src = $(v).attr("src")
  })
  // 短评
  const userEvaluateList = []
  $('#comment-list-wrapper ul li').each((i, v)=> {
    let a = $(v).text().split('\n').map(v => v.trim()).filter(v => v)
    userEvaluateList.push({
      number: a[0],
      type: a[1],
      author: a[2],
      data: a[3],
      evaluateStore: a[4],
      evaluate: a[5] !== undefined ? a[5] : '',
    })
  })
  let author = info[1]
  let press = info[2]
  let page = info[5]
  let froms = info[8]
  let date = info[4]
  let money = info[6]
  const ret = {
    create_time: new Date().getTime(),
    author,
    title: _getDouban.title,
    image: _getDouban.cover_url,
    url: _getDouban.url,
    money,
    press,
    page,
    froms,
    date,
    content,
    shortOmit,
    short,
    tagList,
    e_bookList,
    bookList,
    userEvaluateList
  }
  console.log(ret)
  return ret
}

console.log(searchDouban('9787010009148'))

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event.res)
  const isbn = event.res
  return searchDouban(isbn)
}