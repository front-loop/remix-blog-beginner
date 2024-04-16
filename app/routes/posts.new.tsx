import { Button, Input, Textarea } from '@nextui-org/react'
import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, useActionData, useNavigation } from '@remix-run/react'
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
        slug: !slug ? '必须填写 slug' : '',
        title: !title ? '必须填写标题' : '',
        content: !content ? '必须填写内容' : '',
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
          <h1 className="text-xl">发布文章</h1>
          <Input name="slug" label="slug" isInvalid={!!errors?.slug} errorMessage={errors?.slug} />
          <Input name="title" label="文章标题" isInvalid={!!errors?.title} errorMessage={errors?.title} />
          <Textarea name="content" label="文章内容" isInvalid={!!errors?.content} errorMessage={errors?.content} />
          <Button type="submit" color="primary" isLoading={navigation.state === 'submitting'}>
            发布
          </Button>
        </div>
      </Form>
    </div>
  )
}
