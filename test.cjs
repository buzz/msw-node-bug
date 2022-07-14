const { setupServer } = require('msw/node')
const { rest } = require('msw')

;(async () => {
  console.log('START')

  const nodeFetch = await import('node-fetch')
  const fetch = nodeFetch.default
  const { Headers, Request, Response } = nodeFetch

  if (!globalThis.fetch) {
    globalThis.fetch = fetch
    globalThis.Headers = Headers
    globalThis.Request = Request
    globalThis.Response = Response
  }

  const server = setupServer(
    rest.post('http://localhost:3000/user/login', (req, res, ctx) =>
      res(ctx.json({ result: 'ok' }))
    )
  )

  server.listen()

  const response = await fetch('http://localhost:3000/user/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user: 'foo@bla.com', password: 's3cr3t' }),
  })

  if (response.ok) {
    console.log('Parsing response...')
    const body = await response.json()
    console.log(body)
  }

  server.close()
  console.log('END')
})()
