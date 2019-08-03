import axios, {AxiosError} from '../../src/index'

interface ResponseData<T> {
  code: number
  data: T
  msg?: string
}

interface User {
  name: string,
  age: number
}

function get<T>(url: string, config?: any) {
  return axios<ResponseData<T>>(url, config || {})
  .then((res) => {
    return res.data
  })
}

async function test () {
  const user = await get<User>('/simple/get')
  console.log(user.msg)
}

test()