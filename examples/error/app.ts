import axios from '../../src/index'

axios({
  method: 'post',
  url: '/base/post22',
  data: {
    a: 2
  }
}).then((res) => {
  console.log(res)
})

setTimeout(() => {
    axios({
        method: 'post',
        url: '/base/post22',
        data: {
          a: 2
        }
      }).then((res) => {
        console.log(res)
      })
}, 5000)