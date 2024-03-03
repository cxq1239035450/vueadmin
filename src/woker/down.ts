export default self

self.onmessage = async(event) => {
  self.postMessage({
    type:'down',
    value:'start'
  });
  const list = event.data
  for (let i = 0; i < list.length; i++) {
    const res= await downFile(list[i])
    // console.log(res.response);
  }
  self.postMessage({
    type:'down',
    value:'over'
  });
};


const downFile = (urls:string)=>{
  return new Promise((res,rej)=>{
    const xhr =  new XMLHttpRequest()
      xhr.open('GET', urls, true)
      xhr.responseType = 'blob'
      xhr.onload = () => {
        if (xhr.status === 200) {
          res(xhr)
        } else {
          rej(xhr)
        }
      }
      xhr.onprogress = event => {
        self.postMessage({
          type:'progress',
          loaded: event.loaded,
          total: event.total,
        })
      }
      xhr.onerror = () => {
        rej(xhr)
      }
      xhr.send()
  })

}
// const downFile = (urls:string):Promise<XMLHttpRequest>=>{
  // return new Promise((res,rej)=>{
  //   const xhr =  new XMLHttpRequest()
  //   xhr.open('GET', urls, true)
  //   xhr.responseType = 'blob'
  //   // xhr.setRequestHeader('Authorization', 'Basic a2VybWl0Omtlcm1pdA==');
  //   xhr.onload = () => {
  //     if (xhr.status === 200) {

  //     }
  //   }
  //   xhr.onprogress = event => {

  //   }
  //   xhr.onerror = () => {

  //   }

  //   xhr.send()
  //   return xhr
  // })
// }

