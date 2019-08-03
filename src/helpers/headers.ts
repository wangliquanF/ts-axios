import { isPlainObject, normalizeName } from './util'

// 做请求头部的参数判断
export function processHeaders(headers: any, data: any): any {
  // 需要转换key 大小写问题
  headers = normalizeName(headers, 'Content-Type')
  // 如果
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}

// 解析服务端响应的头部 headers 数据 ，服务端响应的头部是一串字符串，我们需要解析成对象形式
export function parseHeaders(headers: string): Object {
  // 创建一个空对象
  let parsed = Object.create(null)
  // 判断 headers 是否有没有， 如果没有 那么直接返回空对象
  if (!headers) {
    return parsed
  }
  // 解析逻辑
  let arr: string[] = headers.trim().split(/[\r\n]+/)
  arr.forEach(function(line) {
    // 这里使用数组解构
    let [key, val]: string[] = line.split(': ')
    // 转换key格式, 去除空格 转成小写
    key = key.trim().toLowerCase()
    // 如果没有key 就直接return 执行下一个循环
    if (!key) return
    // 如果有 val，那么去除 空格
    if (val) {
      val = val.trim()
    }
    parsed[key] = val
  })
  // 返回 解析好的 header
  return parsed
}
