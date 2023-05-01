FROM node:16.14.0
RUN apt-get update && apt-get install -y vim wait-for-it
RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app
WORKDIR /usr/src/app
COPY package.json ./
USER node
COPY --chown=node:node . .
RUN npm i
