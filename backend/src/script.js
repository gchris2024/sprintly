// import { prisma } from '../lib/prismaClient.ts'

// async function main() {
//   // Create a new user with a todo
//   const user = await prisma.user.create({
//     data: {
//       username: 'bob',
//       password: 'hashed-password',
//       todos: {
//         create: {
//           task: 'Finish Prisma setup',
//         },
//       },
//     },
//     include: {
//       todos: true,
//       reflections: true,
//     },
//   })

//   console.log('Created user:', user)

//   // Fetch all users with their todos and reflections
//   const allUsers = await prisma.user.findMany({
//     include: {
//       todos: true,
//       reflections: true,
//     },
//   })

//   console.log('All users:', JSON.stringify(allUsers, null, 2))
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })
