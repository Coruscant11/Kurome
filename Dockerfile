FROM node:17-alpine

WORKDIR /kurome
COPY . .
RUN mkdir bin

RUN npm install --production
RUN node deploy-commands.js
ENTRYPOINT node main.js
