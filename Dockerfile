FROM node:7.5

MAINTAINER Lechuck Roh <lechuckroh@gmail.com>

RUN mkdir -p /app

WORKDIR /app

ADD . /app

RUN npm install

ENV NODE_ENV=development

EXPOSE 9990

CMD ["npm", "start"]
