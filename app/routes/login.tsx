import { Button, Input } from '@nextui-org/react'
import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { ArrowRight } from 'lucide-react'
import { prisma } from '~/db.server'
import { userSessionStorage } from '~/session.server'

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const password = formData.get('password') as string

  const user = await prisma.user.findUnique({ where: { password } })

  if (!user) {
    return json({
      success: false,
      errors: {
        password: 'Invalid password',
      },
    })
  }

  const session = await userSessionStorage.getSession(request.headers.get('Cookie'))
  session.set('user', '1')
  return redirect('/', {
    headers: {
      'Set-Cookie': await userSessionStorage.commitSession(session),
    },
  })
}

export default function Login() {
  return (
    <div className="col-[2]">
      <Form method="POST">
        <div className="flex gap-2">
          <Input type="password" name="password" variant="bordered" autoFocus />
          <Button type="submit" variant="bordered" isIconOnly>
            <ArrowRight />
          </Button>
        </div>
      </Form>
    </div>
  )
}
