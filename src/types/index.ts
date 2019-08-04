export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

// 表示服务端响应的data值， 为什么类型的
type HTTPResponseType = '' | 'arraybuffer' | 'blob' | 'document' | 'json' | 'text'

// 定义的使用axios请求使用的配置
export interface AxiosRequestConfig {
  // 请求的url
  url?: string
  // Method 指定 传入的字符串格式
  method?: Method
  // post... 请求的参数
  data?: any
  // get... 请求的参数转换url
  params?: any
  // 请求头部
  headers?: any
  // 表示服务端响应的data值， 为什么类型的
  responseType?: HTTPResponseType
  // 超时时间
  timeout?: number

  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]

  // 有可能会有额外的参数传入
  [propName: string]: any
}

// 定义的请求成功返回的接口
export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

// 这里表示的就是 AxiosPromise 这个接口继承的  Promise类型 Promise类型里面只能有  AxiosResponse接口里面的参数
// 定义的请求接口返回的接口
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

// 定义的请求失败接口
export interface AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
}

// 添加混合方法接口
export interface Axios {
  // 拦截器接口
  interceptors: {
    request: AxiosInstanceptorMangger<AxiosRequestConfig>
    response: AxiosInstanceptorMangger<AxiosResponse>
  }

  // 默认配置
  defaults: AxiosRequestConfig

  // 这些就是定义 Axios方法， 也是 混合函数的方法
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 这里定义的是 函数调用的接口
export interface AxiosInstance extends Axios {
  <T = any>(confg: AxiosRequestConfig): AxiosPromise<T>

  <T = any>(url: string, confg?: AxiosRequestConfig): AxiosPromise<T>
}
// 如
// axios({
//   method:'xxx',
//   url: 'xxxx'
// })
// axios(url, {
//   method:'xxx',
// })

// 添加静态属性方法
export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance
}

export interface AxiosInstanceptorMangger<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number

  eject(id: number): void
}

export interface ResolvedFn<T> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

export interface AxiosTransformer {
  (data: any, headers?: any): any
}
