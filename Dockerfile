FROM node:16-bullseye

COPY package*.json ./

RUN apt-get -y update
RUN apt-get install -y ffmpeg
RUN npm install

WORKDIR /app

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
