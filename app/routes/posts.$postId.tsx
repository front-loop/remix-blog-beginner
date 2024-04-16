import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import ReactMarkdown from 'react-markdown'
import { prisma } from '~/db.server'

export async function loader({ params }: LoaderFunctionArgs) {
  const postId = params.postId
  const post = await prisma.post.findUnique({
    where: { id: postId },
  })

  if (!post) throw new Response('找不到文章', { status: 404 })
  return json({ post })
}

export default function Post() {
  const { post } = useLoaderData<typeof loader>()

  return (
    <div className="col-[2]">
      <div className="prose dark:prose-invert">
        <h1>{post.title}</h1>
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
      <div className="mt-5 text-sm text-gray-500/80 hover:text-gray-600 hover:underline">
        <Link to="/">cd ..</Link>
      </div>
    </div>
  )
}
