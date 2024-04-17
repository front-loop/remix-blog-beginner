import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  console.log('Seeding database ...')

  await prisma.user.deleteMany()
  await prisma.post.deleteMany()

  await prisma.user.create({
    data: {
      password: 'pwd',
    },
  })

  const posts = [
    {
      id: '1',
      title: 'Markdown Features',
      content:
        'This post demonstrates **bold** text, *italic* text, and a simple list:\n\n- Item 1\n- Item 2\n- Item 3\n\nHere is a `code` snippet.',
    },
    {
      id: '2',
      title: 'Using Lists in Markdown',
      content:
        'Lists help organize information. Here’s an ordered list:\n\n1. First item\n2. Second item\n3. Third item',
    },
    {
      id: '3',
      title: 'Code Blocks',
      content:
        'Code blocks are essential for tutorials. Here’s a block:\n\n```javascript\nconsole.log("Hello, Markdown!");\n```',
    },
    {
      id: '4',
      title: 'Combining Elements',
      content:
        'Combining **bold**, *italic*, and `code`:\n\n- Learn **bold** formatting\n- Use *italic* for emphasis\n- Write `code` frequently',
    },
  ]

  for (const post of posts) {
    await prisma.post.create({
      data: post,
    })
  }

  console.log(`Database has been seeded 🌱`)
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
