import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../helpers/util'

let strats = Object.create(null)

// 判断自定义是否有值， 如果自定义有值 那么就返回自定义的值， 否则返回默认值
function defaultStart(defaultVal: any, customizeVal: any): any {
  return typeof customizeVal !== 'undefined' ? customizeVal : defaultVal
}
// 判断自定义是否有值, 如果有值那就直接返回自定义的值
function formVal2Start(defaultVal: any, customizeVal: any): any {
  if (typeof customizeVal !== 'undefined') {
    return customizeVal
  }
}

// config 的 headers 参数深度拷贝
function deepMergeStrat(defaultVal: any, customizeVal: any): any {
  if (isPlainObject(customizeVal)) {
    return deepMerge(defaultVal, customizeVal)
  } else if (typeof customizeVal !== 'undefined') {
    return customizeVal
  } else if (isPlainObject(defaultVal)) {
    return deepMerge(defaultVal)
  } else if (typeof defaultVal !== 'undefined') {
    return defaultVal
  }
}

const stratKeysDeepMerge = ['headers']
stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

// 这里加一个逻辑， 意思就是如果自定义配置了 ['url', 'params', 'data'] 其中的参数， 那么就使用 formVal2Start 函数 返回自定义配置的值
const stratKeysFromVal2 = ['url', 'params', 'data']
stratKeysFromVal2.forEach(key => {
  strats[key] = formVal2Start
})

// aixos 定义默认配置  defaultConfig
// 使用者 自定义的配置 customizeConfig
export default function mergeConfig(
  defaultConfig: AxiosRequestConfig,
  customizeConfig: AxiosRequestConfig
): AxiosRequestConfig {
  // 如果没有自定义配置 那么就创建一个空对象
  if (!customizeConfig) {
    customizeConfig = {}
  }

  // defaultConfig 比如默认配置为下
  // {
  //     method:"get",
  //     timeout:0,
  //     headers:{
  //         common:{"Accept":"application/json, text/plain, */*"},
  //         delete:{},
  //         get:{},
  //         post:{"Content-Type":"application/x-www-form-urlencoded"}
  //     }
  // }
  // customizeConfig 自定义配置如下
  // {
  //     method:"post",
  //     url: 'xxxx',
  //     data: {'a':2}
  //     timeout:5550,
  //     headers:{
  //         "Content-Type": "application/x-www-form-urlencoded"
  //     }
  // }

  // 创建一个空对象
  const config = Object.create(null)

  // 先遍历自定义配置
  for (let key in customizeConfig) {
    // 合并有的配置
    mergeField(key)
  }

  for (let key in defaultConfig) {
    if (!customizeConfig[key]) {
      mergeField(key)
    }
  }

  // 合并配置
  function mergeField(key: string): void {
    // 这里判断 strats[key]（['url', 'params', 'data']） 是否有值 ， strats[key] 会得到 formVal2Start 这个函数
    // formVal2Start 是先合并 自定义参数， 如果没有当前key不匹配这个数组['url', 'params', 'data']的项，
    // 那么就使用 defaultStart 这个函数， 这个函数先匹配 自定义是否有值 如果自定义有值 那么就合并自定义的值， 不然就合并默认配置的值
    const strat = strats[key] || defaultStart
    config[key] = strat(defaultConfig[key], customizeConfig![key])
  }

  return config
}
