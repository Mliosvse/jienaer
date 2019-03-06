// 转换时间戳
export const format = (now, fmt = 'yyyy-MM-dd') => {
  if (typeof now === 'string') {
    now = now.replace(/-/g, '/')
  }
  now = new Date(now)
  const o = {
    'M+': now.getMonth() + 1, // 月份
    'd+': now.getDate(), // 日
    'h+': now.getHours(), // 小时
    'm+': now.getMinutes(), // 分
    's+': now.getSeconds(), // 秒
    'q+': Math.floor((now.getMonth() + 3) / 3), // 季度
    'S': now.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (now.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, String(o[k]).padStart(RegExp.$1.length, 0))
    }
  }
  return fmt
}

// 判断手机系统，1为android，2为ios
export const getOsFrom = (callback) => {
  let u = navigator.userAgent
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
  let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
  if (isAndroid) { // 返回1是android
    return 'a'
  }
  if (isiOS) { // 返回2是ios
    return 'i'
  }
  return 0
}

// 获取当前页面的URL 对其带的参数进行处理
export const getUrlPara = (para) => {
  let paraArr = location.search.substring(1).split('&')
  for (let i = 0; i < paraArr.length; i++) {
    if (para === paraArr[i].split('=')[0]) {
      return window.decodeURIComponent(paraArr[i].split('=')[1])
    }
  }
  return ''
}

export const iosBlur = () => {
  console.log(456679);
  window.scrollTo(0,0);
}