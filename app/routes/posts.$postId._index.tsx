import { Button } from '@nextui-org/react'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Form, Link, useLoaderData, useNavigation } from '@remix-run/react'
import { Edit, Trash2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import invariant from 'tiny-invariant'
import { prisma } from '~/db.server'

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.postId, 'Post ID is missing')
  const post = await prisma.post.findUnique({
    where: { id: params.postId },
  })

  if (!post) throw new Response('Not Found', { status: 404 })
  return json({ post })
}

export default function Post() {
  const { post } = useLoaderData<typeof loader>()
  const navigation = useNavigation()

  return (
    <div className="col-[2]">
      <div className="prose dark:prose-invert">
        <h1>{post.title}</h1>
        <div className="not-prose flex gap-3">
          <Button color="primary" variant="bordered" size="sm" isIconOnly>
            <Link to={`/posts/${post.id}/edit`}>
              <Edit className="size-4" />
            </Link>
          </Button>
          <Form method="post" action={`/posts/${post.id}/delete`}>
            <Button
              type="submit"
              color="danger"
              variant="bordered"
              size="sm"
              isIconOnly
              isLoading={navigation.state === 'submitting'}
            >
              <Trash2 className="size-4" />
            </Button>
          </Form>
        </div>
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
      <div className="mt-5 text-sm text-gray-500/80 hover:text-gray-600 hover:underline">
        <Link to="/">cd ..</Link>
      </div>
    </div>
  )
}
