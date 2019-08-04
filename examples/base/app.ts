import axios, {AxiosError} from '../../src/index'
import { AxiosTransformer } from '../../src/types'

const instance = axios.create({
  transformRequest: [(function (data) {
    console.log(data, 'data')
    data.b = 3
    return data
  }), ...(axios.defaults.transformRequest as AxiosTransformer[])]
})

// instance({
//   url: '/base/post',
//   data: {
//     a: 2
//   },
//   method: 'post'
// }).then((res) => {
//   console.log(res, 'res')
// })