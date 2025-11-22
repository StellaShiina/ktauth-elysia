import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'

export const auth = new Elysia({ prefix: '/api/v1/auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: 'cono-subarashi-sekai'
    })
  )
  .post('/login', async ({ status, jwt, cookie: { auth }, body: { password } }) => {
    if (Bun.env.PASSWD === undefined) {
      return status(500)
    }

    if (password !== Bun.env.PASSWD) {
      return status(401)
    }

    const value = await jwt.sign({ user: 'password-auth-user' })

    auth.set({
      value,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return status(200)
  }, {
    body: t.Object({
      password: t.String()
    })
  })
  .get('/validate', async ({ status, jwt, cookie: { auth } }) => {

    const validate = await jwt.verify(auth.value)

    if (!validate) {
      return status(401)
    }

    return status(200)
  }, {
    cookie: t.Object({
      auth: t.String()
    })
  })