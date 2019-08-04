export const toString = Object.prototype.toString

// 判断是否为 date 类型数据 如果是返回 true 否则 false
// val is Date 这里是调言为 Date 类型
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// // 判断是否为 object 类型数据 如果是返回 true 否则 false
// export function isObject (val: any): val is Object {
//     return val !== null && typeof val === 'object'
// }

// 判断是否为 普通object 类型数据， 如果是返回 true 否则 false
// 这里说的普通object 指的就是 {a: 1, b: 2}
// 因为上一个判断object 函数，只是判断他是否为 object
// 但是很多类型 都是原循链 都是基于object的 ，比如 function 这些
// 所以我们现在的这个判断 object 就是只判断 真正的{a: 1, b: 2}类型
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

// 转换大小写
export function normalizeName(nameData: any, normalizedName: string): any {
  // 判断是否有值, 如果没有值 那么就直接返回 什么也不做
  if (!nameData) {
    return
  }

  // Object.keys(nameData) 得到nameData 的所有 key 并组成数组形式
  // 然后循环判断
  Object.keys(nameData).forEach(keyName => {
    // nameData 里面是否已经有 我们想要转换的 normalizedName（正常化name）
    // 如果有那么就不进入当前的判断语句里面执行 （name === Name） 不匹配
    // 如果没有， 那么就再次判断
    // 如果 nameData的key 转成全部大写 和 normalizedName 转成大写 是否相同 (NAME === NAME) 正确匹配
    // 如果相同那么就进入if语句里面 执行代码， 并且删除被转换的 key 参数
    if (keyName !== normalizedName && keyName.toUpperCase() === normalizedName.toUpperCase()) {
      // normalizedName => Name
      // keyName => name
      // nameData[Name] = nameData[name]
      nameData[normalizedName] = nameData[keyName]
      // 并且删除 nameData[name] 参数值
      delete nameData[keyName]
    }
  })

  // 返回已转换好的参数 keyName
  return nameData
}

// 拷贝
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

// deepMerge(...objs: any[]) 这里是把调用时传入的参数 转换成一个数组
// deepMerge({a: 2}, {b: 3}) => [{a:2}, {b:3}]
// deepMerge({a: 1}) => [{a: 1}]
// 深度拷贝 递归
export function deepMerge(...objs: any[]): any {
  let result = Object.create(null)
  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })

  return result
}
