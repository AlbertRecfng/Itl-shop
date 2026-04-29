export default defineEventHandler((event) => {
  const path = event.path.replace(/^\/api/, '')
  return proxyRequest(event, `https://api.retail.itl.digital${path}`)
})
