FROM node:18.16.0-alpine

WORKDIR /app

COPY package.json tsconfig.json yarn.lock .

RUN yarn

COPY . .

RUN yarn build

CMD ["yarn", "start:prod"]