FROM node:18-alpine3.16

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

ENV PORT=3001

EXPOSE 3001

CMD ["npm", "start"]

# docker build -t webverse-api:1.0.0 .

# docker run -p 3002:3001 -e PORT=3001 -e DATABASE_URL=file:./dev.db -d --name=app webverse-api:1.0.0