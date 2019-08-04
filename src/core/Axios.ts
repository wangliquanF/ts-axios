import {
  AxiosRequestConfig,
  AxiosPromise,
  AxiosResponse,
  Method,
  ResolvedFn,
  RejectedFn
} from '../types/index'
import dispatchRequest from './dispatchRequest'
import InterceptorManager from './InterceptorManager'
import mergeConfig from './mergeConfig'

// 定义拦截器定义接口
interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}

export default class Axios {
  // 拦截器参数定义
  interceptors: Interceptors
  // 请求默认配置
  defaults: AxiosRequestConfig

  constructor(itinConfig: AxiosRequestConfig) {
    // 定义默认配置
    this.defaults = itinConfig

    // 使用例子
    // axios.interceptors.request.use(resolved, rejected)
    // axios.interceptors.response.use(resolved, rejected)
    this.interceptors = {
      // request 请求拦截器 使用方法
      request: new InterceptorManager<AxiosRequestConfig>(),
      // response 响应拦截器 使用方法
      response: new InterceptorManager<AxiosResponse>()
    }
  }

  // 定义混合方法
  request(url: any, config?: any): AxiosPromise {
    // 这里可能会有两种形式来使用
    // 第一种
    // axios(url, {})
    // 第二种
    // axios({})
    // 所以呢  (url: any, config?: any) 我们需要先把他们的类型指定为 any
    // 然后再判断数据转换
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }

    // config 参数配置合并，默认配置与自定义配置合并
    config = mergeConfig(this.defaults, config)

    // 开始执行拦截器
    // chain 数组的第一个项 里面包含了下面的代码
    // resolved：dispatchRequest  这一段代码的 就是执行请求的方法
    // 比如当前是 chain = [1]
    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]

    // 我在项目上定义了两个请求拦截器, 那么就获取到 两个数组项
    // 分别是 2 3
    // chain.unshift(2) => chain [2,1]
    // chain.unshift(3) => chain [3, 2, 1]
    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })

    // 然后我在项目上定义了一个响应拦截器
    // 分别是 4
    // chain.push(4) => chain [3, 2, 1, 4]
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })

    // 先定义一个 Promise, 设置 resolve 返回的数据
    let promise = Promise.resolve(config)

    // 现在的chain => [3, 2, 1, 4], chain 数组里面的 第三项（1）就是请求方法
    while (chain.length) {
      // 一开始先陆续执行 3 2 也就是请求拦截器
      // promise.then(resolved, rejected)  // resolved 执行拦截器的成功函数 传一个 config 数据
      // 然后执行到 1 的时候 是执行了 dispatchRequest 这个请求函数 // 在 dispatchRequest 请求函数里面会重定义 config 数据， 改成请求成功的返回数据
      // 然后陆续执行 4 响应拦截器， 响应拦截器的函数参数会是 （1 发送请求成功的返回数据）
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    // 上面执行完 （请求拦截器 => 发送请求 => 响应拦截器 ） 然后会返回 promise, 然后可以再继续链式调用
    return promise
    // axios().then()
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData(url, 'get', config)
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData(url, 'delete', config)
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData(url, 'head', config)
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData(url, 'options', config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData(url, 'post', data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData(url, 'put', data, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData(url, 'patch', data, config)
  }

  // 复用方法， 没有data参数的数据请求
  _requestMethodWithoutData(
    url: string,
    method: Method,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        url,
        method
      })
    )
  }

  // 复用方法， 有data参数的数据请求
  _requestMethodWithData(
    url: string,
    method: Method,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        url,
        method,
        data
      })
    )
  }
}
