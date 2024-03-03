
// export const woker = new Worker('./down.ts')

export const createDisposableWorker = (scriptCode:any) => {
  const URL = window.URL || window.webkitURL
  console.log(scriptCode);

  const blob = new Blob([scriptCode], { type: 'application/javascript' }) // eslint-disable-line
  const objectURL = URL.createObjectURL(blob)
  const worker = new Worker(objectURL) as Worker & { post: (message: string) => void }// eslint-disable-line

  worker.post = (message:string):Promise<any> =>{
     return new Promise((resolve, reject) => {
      worker.onmessage = event => {
        URL.revokeObjectURL(objectURL)
        resolve(event.data)
      }
      worker.onerror = e => {
        console.error(`Error: Line ${e.lineno} in ${e.filename}: ${e.message}`)
        reject(e)
      }
      worker.postMessage({ message })
    })
  }
  return worker
}
