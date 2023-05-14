FROM node:18.16.0-alpine

WORKDIR /app

COPY package.json tsconfig.json yarn.lock .

RUN yarn

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]