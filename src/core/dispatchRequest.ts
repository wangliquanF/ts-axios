// 请求配置接口
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types/index'
// 请求
import xhr from './xhr'
// 处理url格式
import { buildURL } from '../helpers/url'
// 处理headers格式
import { flattenHeaders } from '../helpers/headers'
// 转换
import transfrom from './transform'

// axios 请求函数
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  // 先处理config配置参数
  processConfig(config)
  // 发送请求
  return xhr(config).then((res: AxiosResponse) => {
    // 这里请求成功后 再做一层转换
    transformResponseData(res)
    return res
  })
}

// 处理confing配置
function processConfig(config: AxiosRequestConfig): void {
  // 处理url
  config.url = transformURL(config)
  // 处理 data
  config.data = transfrom(config.data, config.headers, config.transformRequest)
  // 再处理config配置合并后的headers参数
  config.headers = flattenHeaders(config.headers, config.method!)
}

// 转换url格式
function transformURL(config: AxiosRequestConfig): string {
  // 使用 buildURL 处理
  const { url, params } = config
  return buildURL(url!, params)
}

// 转换服务端响应的data数据格式
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transfrom(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
