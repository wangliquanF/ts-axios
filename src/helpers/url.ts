import { isDate, isPlainObject } from './util'

// 封装一个 适用于我们的url参数 字符串转换
function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any): string {
  // 判断是否有 params 参数， 如果没有就直接返回url
  if (!params) {
    return url
  }

  // 设置 拼接url 的参数数字 [foo=1, ba=2]
  const parts: string[] = []

  Object.keys(params).forEach(key => {
    // 获取 params[key] 的值
    let val = params[key]

    // 判断是否为null 或者 undefined ， 如果是 那么就不添加到url上
    if (val === null || val === undefined) {
      // 这里return 的意思就是 不再执行下面的语句了，直接执行下一个循环
      return
    }

    // 这里需要把获取的 val 设置为一个 array 类型， 后面好解析
    let values: any[] = []
    // 首先需要判断当前 val 是否为数组
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }

    // 解析 values 里面的参数
    values.forEach(val => {
      // 判断参数是否为 Date 时间对象， 如果是 那就执行 时间对象的 toISOString 获取 字符串时间
      if (isDate(val)) {
        val = val.toISOString()
        // 判断参数是否为 对象类型， 如果是对象类型 就给转成字符串对象
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
      // 把过滤好的参数， 添加到 parts 数组
      // key val 参数都先执行了 encode， 这个函数的作用就是把字符串转换格式， 保证不会乱码
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  // 把parts数组, 转成 a=2&b=3
  const serializedParams = parts.join('&')

  // 拼接url参数
  if (serializedParams) {
    let askMarkIndex = url.indexOf('?')
    let markIndex = url.indexOf('#')
    // 判断 url 参数是否有 '#' ， 如果有就给去了
    if (markIndex !== -1) {
      let askData = ''
      // 并且需要再判断一下是否有?  标记， 如果有那么就保留
      if (askMarkIndex !== -1 && askMarkIndex > markIndex) {
        askData = url.slice(askMarkIndex)
      }
      url = url.slice(0, markIndex)
      url += askData
    }

    // 拼接url参数
    url += (askMarkIndex !== -1 ? '&' : '?') + serializedParams
  }

  return url
}
