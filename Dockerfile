FROM node:latest
WORKDIR /app

COPY package.json ./
RUN yarn

COPY tsconfig.json ./
COPY src ./src

CMD [ "npm", "run", "dev" ]

EXPOSE 8010