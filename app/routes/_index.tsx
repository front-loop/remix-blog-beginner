import { Button, Pagination } from '@nextui-org/react'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Link, useLoaderData, useSearchParams } from '@remix-run/react'
import { Plus } from 'lucide-react'
import { prisma } from '~/db.server'

const PAGE_SIZE = 2

export async function loader({ request }: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams
  const page = parseInt(searchParams.get('page') || '1')

  const [posts, count] = await prisma.$transaction([
    prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.post.count(),
  ])

  if (!posts) {
    return json({ posts: [], pageCount: 0 })
  }

  return json({ posts, pageCount: Math.ceil(count / PAGE_SIZE) })
}

export default function Index() {
  const { posts, pageCount } = useLoaderData<typeof loader>()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1')

  return (
    <div className="col-[2]">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Remix Blog</h1>
        <Button color="primary" isIconOnly>
          <Link to="/posts/new">
            <Plus className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <div key={post.id}>
            <Link to={`/posts/${post.id}`} className="text-xl">
              {post.title}
            </Link>
            <div className="font-mono text-sm text-gray-500/80">{post.createdAt}</div>
          </div>
        ))}
      </div>
      {pageCount > 1 && (
        <Pagination
          className="mt-5 font-mono"
          page={page}
          total={pageCount}
          onChange={(newPage) => {
            const newSearchParams = new URLSearchParams(searchParams)
            if (newPage === 1) {
              newSearchParams.delete('page')
            } else {
              newSearchParams.set('page', String(newPage))
            }
            setSearchParams(newSearchParams)
          }}
        />
      )}
    </div>
  )
}
