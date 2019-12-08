// 云函数入口文件
const axios = require('axios')
const cloud = require('wx-server-sdk')
const doubanbook = require('doubanbook')
const cheerio = require('cheerio')

cloud.init()

async function getDouban(isbn) {
  const url = "https://search.douban.com/book/subject_search?search_text=" + isbn
  let searchInfo = await axios.get(url);
  let reg = /window\.__DATA__ = "(.*)"/
  if (reg.test(searchInfo.data)) {
    let searchResult = doubanbook(RegExp.$1)[0]
    console.log(searchResult)
    return searchResult
  }
}

async function searchDouban (isbn) {
  let _getDouban = await getDouban(isbn)
  console.log(_getDouban.title, _getDouban.abstract)
  let detailsPage = await axios.get(_getDouban.url)
  // 使用cheerio这个库，这个库是专门用来解析HTML文档用的
}

console.log(searchDouban('9787010009148'))

// 云函数入口函数
exports.main = async (event, context) => {
  const {isbn} = event;
  return getDouban(isbn)
}