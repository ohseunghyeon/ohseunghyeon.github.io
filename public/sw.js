// gatsby-plugin-offline이 등록한 서비스 워커를 정리하는 묘비.
//
// 등록된 SW는 서버에서 파일이 사라져도 스스로 사라지지 않는다. 그냥
// 제거하면 기존 방문자는 캐시된 2021년 사이트를 계속 보게 된다.
// 같은 경로에 자기 자신을 등록 해제하는 SW를 배포해야 한다.
//
// 기존 방문자가 모두 정리될 때까지 이 파일을 삭제하지 말 것.
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map(k => caches.delete(k)))
      await self.registration.unregister()

      const clients = await self.clients.matchAll({ type: 'window' })
      for (const client of clients) client.navigate(client.url)
    })()
  )
})
