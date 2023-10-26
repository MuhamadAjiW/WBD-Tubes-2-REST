FROM node:latest
WORKDIR /app

COPY package.json ./
RUN yarn

COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma

RUN yarn global add prisma && \
    prisma generate

CMD [ "npm", "run", "dev" ]

EXPOSE 8011