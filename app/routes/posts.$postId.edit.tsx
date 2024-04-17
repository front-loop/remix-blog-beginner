import { Button, Input, Textarea } from '@nextui-org/react'
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, useLoaderData, useNavigate, useNavigation } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { prisma } from '~/db.server'

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.postId, 'Post ID is missing')
  const post = await prisma.post.findUnique({
    where: { id: params.postId },
  })

  if (!post) return new Response('Not Found', { status: 404 })
  return json({ post })
}

export async function action({ params, request }: ActionFunctionArgs) {
  invariant(params.postId, 'Missing contactId param')
  const formData = await request.formData()

  const slug = formData.get('slug') as string
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  await prisma.post.update({
    where: {
      id: params.postId,
    },
    data: {
      id: slug,
      title,
      content,
    },
  })

  return redirect(`/posts/${slug}`)
}

export default function EditPost() {
  const navigation = useNavigation()
  const navigate = useNavigate()
  const { post } = useLoaderData<typeof loader>()

  return (
    <div className="col-[2]">
      <Form method="post">
        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-xl font-bold">Update Post</h1>
          <Input name="slug" label="slug" variant="bordered" defaultValue={post.id} />
          <Input name="title" label="title" variant="bordered" defaultValue={post.title} />
          <Textarea name="content" label="content" variant="bordered" defaultValue={post.content} />
          <div className="flex gap-3">
            <Button type="submit" variant="bordered" isLoading={navigation.state === 'submitting'} className="flex-[2]">
              Update
            </Button>
            <Button variant="bordered" className="flex-1" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}
