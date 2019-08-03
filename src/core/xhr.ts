import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { url, data = null, method = 'get', headers, responseType, timeout } = config
    // 获取 http 请求
    const request = new XMLHttpRequest()

    // 设置响应类型
    if (responseType) {
      request.responseType = responseType
    }

    // 设置超时时间
    if (timeout) {
      request.timeout = timeout
    }

    // 开始配置参数
    // method.toUpperCase() 改为 大写字母 (get => GET)
    request.open(method.toUpperCase(), url!, true)

    // 设置 请求阶段响应函数
    request.onreadystatechange = function() {
      // 响应为 4 表示请求响应成功
      if (request.readyState === 4) {
        // 获取响应头部
        // request.getAllResponseHeaders() 获取的是一串字符串
        // parseHeaders 然后解析成 对象形式
        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        // 获取响应数据
        const responseData = responseType !== 'text' ? request.response : request.responseText
        // 设置 返回数据
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request: request
        }
        // 返回
        handleResponse(response)
      }
    }

    // 设置请求失败的触发
    request.onerror = function() {
      reject(createError('网络错误', config, null, request))
    }

    // 设置请求超时触发
    request.ontimeout = function() {
      reject(
        createError(`当前接口${url} 请求超时, 设置的超时时间 ${timeout} ms`, config, null, request)
      )
    }

    // 设置请求headers
    Object.keys(headers).forEach(name => {
      // 判断 如果data为null，表示就不用设置头部的 Content-Type 参数
      // 保持浏览器头部默认的 Content-Type 即可
      if (data === null && name === 'Content-Type') {
        delete headers[name]
      } else {
        // 设置头部参数
        request.setRequestHeader(name, headers[name])
      }
    })

    // 开始请求， 传入请求参数
    request.send(data)

    // 处理响应的事件
    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `当前url ${url} 响应状态statusCode为 ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
