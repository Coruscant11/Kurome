FROM node:17-alpine

WORKDIR /trafalread
COPY . .
RUN mkdir bin

RUN npm install --production
RUN node deploy-commands.js
CMD [ "node", "main.js" ]