duplicate yung chapter 3
sa package.json para sa fomality lagayan ng description
`Dockerize nodejs express backend with prisma as orm and postgres as database`

after that enter this command
npm install prisma @prisma/client pg
npx prisma init

sa loob ng schema.prima sa pinaka huli
model User {
id Int @id @default(autoincrement())
username String @unique
password String
todos Todo[]
}

model Todo {
id Int @id @default(autoincrement())
task String
completed Boolean @default(false)
userId Int
user User @relation(fields: [userId], references: [id])
}
