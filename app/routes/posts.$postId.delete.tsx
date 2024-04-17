import { ActionFunctionArgs, redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { prisma } from '~/db.server'

export async function action({ params }: ActionFunctionArgs) {
  invariant(params.postId, 'Post ID is missing')

  await prisma.post.delete({
    where: { id: params.postId },
  })

  return redirect('/')
}
