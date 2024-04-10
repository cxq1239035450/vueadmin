const files = import.meta.glob('./**.ts')
const modules: any = {}

// Object.keys(files).forEach(key => {
//   if (key === './index.ts') return
//   const path = key.replace(/(\.\/|\.ts)/g, '')
//   const [namespace, imported] = path.split('/')
//   if (!modules[namespace]) {
//     modules[namespace] = {
//       namespaced: true,
//     }
//   }
//   modules[namespace][imported] = files[key]?.default
// })
