import { isPlainObject } from './util'

// 把请求和返回的data参数 做一层转换 对象（{a: 1, b: 2}） => 对象字符串 （'{a: 1, b: 2}'）
export function transformRequest(data: any): any {
  // 我们需要把 object类型的数据 转换成 object字符串类型
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  // 如果不是对象类型， 那么就直接返回1
  return data
}

// 把响应的数据转换成对象形式
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch {
      // do nothing
    }
  }
  return data
}
