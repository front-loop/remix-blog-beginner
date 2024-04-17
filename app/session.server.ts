import { createCookieSessionStorage } from '@remix-run/node'

export const userSessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
    secure: true,
    secrets: [process.env.SESSION_SECRET as string],
  },
})

export const auth = async (request: Request) => {
  const session = await userSessionStorage.getSession(request.headers.get('Cookie'))
  return session.get('user')
}
