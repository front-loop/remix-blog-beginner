import { Button, Input, Textarea } from '@nextui-org/react'
import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useNavigation } from '@remix-run/react'
import { prisma } from '~/db.server'

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const slug = formData.get('slug') as string
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  if (!slug || !title || !content) {
    return json({
      success: false,
      errors: {
        slug: !slug ? 'slug is required' : '',
        title: !title ? 'title is required' : '',
        content: !content ? 'content is required' : '',
      },
    })
  }

  await prisma.post.create({
    data: {
      id: slug,
      title,
      content,
    },
  })

  return redirect('/')
}

export default function NewPost() {
  const actionData = useActionData<typeof action>()
  const errors = actionData?.errors
  const navigation = useNavigation()

  return (
    <div className="col-[2]">
      <Form method="post">
        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-xl font-bold">New Post</h1>
          <Input name="slug" label="slug" variant="bordered" isInvalid={!!errors?.slug} errorMessage={errors?.slug} />
          <Input
            name="title"
            label="title"
            variant="bordered"
            isInvalid={!!errors?.title}
            errorMessage={errors?.title}
          />
          <Textarea
            name="content"
            label="content"
            variant="bordered"
            isInvalid={!!errors?.content}
            errorMessage={errors?.content}
          />
          <div className="flex gap-3">
            <Button type="submit" variant="bordered" isLoading={navigation.state === 'submitting'} className="flex-[2]">
              Submit
            </Button>
            <Link to="/">
              <Button variant="bordered" className="flex-1">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </Form>
    </div>
  )
}
