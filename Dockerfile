FROM node:12-alpine

RUN mkdir -p /opt && mkdir -p /opt/utils

ADD . /opt/utils

WORKDIR /opt/utils

RUN npm install && npm run client:build

CMD ["node", "./server/index.js"]
