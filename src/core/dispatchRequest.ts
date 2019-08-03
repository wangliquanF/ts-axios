// 请求配置接口
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index'
// 请求
import xhr from './xhr'
// 处理url格式
import { buildURL } from '../helpers/url'
// 处理data格式
import { transformRequest, transformResponse } from '../helpers/data'
// 处理headers格式
import { processHeaders } from '../helpers/headers'

// axios 请求函数
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  // 先处理config配置参数
  processConfig(config)
  // 发送请求
  return xhr(config).then((res: AxiosResponse) => {
    // 这里请求成功后 再做一层转换
    // 判断用户没有传入 responseType 参数，那么默认就给服务端响应的数据转换成 对象形式
    if (!config.responseType) {
      return transformResponseData(res)
    }
    return res
  })
}

// 处理confing配置
function processConfig(config: AxiosRequestConfig): void {
  // 处理url
  config.url = transformURL(config)
  // 处理headers
  config.headers = transformHeaders(config)
  // 处理 data
  config.data = transformRequestData(config)
}

// 转换url格式
function transformURL(config: AxiosRequestConfig): string {
  // 使用 buildURL 处理
  const { url, params } = config
  return buildURL(url!, params)
}

// 转换data格式
function transformRequestData(config: AxiosRequestConfig): any {
  const { data } = config
  return transformRequest(data)
}

// 转换headers格式
function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

// 转换服务端响应的data数据格式
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data)
  return res
}
