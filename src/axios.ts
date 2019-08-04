import { AxiosStatic, AxiosRequestConfig } from './types/index'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'

// 创建工厂类型
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  // 先new一个 Axios 实例
  const context = new Axios(config)
  // 然后给这个 instance 变量， 赋值一个函数
  // Axios.prototype.request.bind(context) 后面的bind(context) 什么意思呢
  // 因为一个函数 里面的 this 指向的是 window ， 所以如果我们没有把 this 指向 Axios 类， 那直接 instance.get() 是会报错的
  // 因为 instance.get() 这样就相当于 window.get() ， 因为我们在window.get 没有定义， 所以就会有问题
  // 所以我们现在要 .bind(context) 把函数里的this指向 Axios 类
  // 然后我们 instance.get() 就相当于 Axios.get()
  const instance = Axios.prototype.request.bind(context)
  // 然后再这个instance函数 添加一些方法
  extend(instance, context)
  // 把 instance 赋值为一个函数， 并且再赋值一些方法， 就直接返回
  // 这里为什么要 instance as AxiosInstance ， 因为我们在上面定义了 函数的返回值是 AxiosInstance 接口
  // 但是我们直接 返回 instance , 是报错的， 因为 typescript 不确定 instance 符合 AxiosInstance 接口
  // 所以我们只能加上一个断言 说他是一个符合 AxiosInstance 接口的
  return instance as AxiosStatic
}

// 执行 createInstance 工厂函数， 返回 混合函数
const axios = createInstance(defaults)

// 创建静态方法
axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config || {}))
}

export default axios
