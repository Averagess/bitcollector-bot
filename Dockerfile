FROM node:18

WORKDIR /usr/src/bot

COPY . .

RUN yarn

RUN yarn build

CMD [ "yarn", "start" ]