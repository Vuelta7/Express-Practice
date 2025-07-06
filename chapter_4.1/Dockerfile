FROM node:22-alpine

WORKDIR /app

COPY package*json .

COPY prisma ./prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

RUN npm install

COPY . .

EXPOSE 5003

CMD ["node", "./src/server.js"]
