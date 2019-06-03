/* eslint-disable */
export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}
// 获取时间段，补全每个节点
export function formatDateRange (startTime, endTime, type) {
  let date1 = startTime
  let date2 = endTime
  let d1 = new Date(date1.replace(/-/g, '/'))
  let d2 = new Date(date2.replace(/-/g, '/'))
  let d = d1
  let arr = []
  if (type === 'day') {
    while (d <= d2) {
      arr.push(
        [
          d.getFullYear(),
          ('0' + (d.getMonth() + 1)).slice(-2),
          ('0' + d.getDate()).slice(-2)
        ].join('-')
      )
      d.setDate(d.getDate() + 1)
    }
  }
  if (type === 'hour') {
    while (d <= d2) {
      arr.push(
        [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-') + ' ' + [('0' + d.getHours()).slice(-2), ('0' + d.getMinutes()).slice(-2)].join(':'))
      d.setHours(d.getHours() + 1)
    }
  }
  // 15分钟
  if (type === 'fifteenMinute') {
    while (d <= d2) {
      arr.push([d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-') + ' ' + [('0' + d.getHours()).slice(-2), ('0' + d.getMinutes()).slice(-2)].join(':'))
      d.setMinutes(d.getMinutes() + 15)
    }
  }
  return arr
}
