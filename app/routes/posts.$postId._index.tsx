import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Link, useLoaderData, useNavigation, useSubmit } from '@remix-run/react'
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { post } = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  const submit = useSubmit()

  return (
    <div className="col-[2]">
      <div className="prose dark:prose-invert">
        <h1>{post.title}</h1>
        <div className="not-prose flex gap-2">
          <Link to={`/posts/${post.id}/edit`}>
            <Button variant="bordered" size="sm" isIconOnly>
              <Edit className="size-4" />
            </Button>
          </Link>
          <Button
            type="submit"
            variant="bordered"
            size="sm"
            isIconOnly
            isLoading={navigation.state === 'submitting'}
            onPress={onOpen}
          >
            <Trash2 className="size-4" />
          </Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm" backdrop="blur">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Delete</ModalHeader>
                  <ModalBody>
                    <p>Are you sure to delete this post?</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="danger"
                      onPress={() => {
                        const formData = new FormData()
                        formData.set('action', 'delete')
                        submit(formData, {
                          method: 'POST',
                          action: `/posts/${post.id}/delete`,
                        })
                      }}
                    >
                      Confirm
                    </Button>
                    <Button onPress={onClose}>Cancel</Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
      <div className="mt-5 text-sm text-gray-500/80 hover:text-gray-600 hover:underline">
        <Link to="/">cd ..</Link>
      </div>
    </div>
  )
}
