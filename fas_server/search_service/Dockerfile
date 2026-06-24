FROM node:20-alpine
RUN apk add --no-cache curl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8004
CMD ["npm", "run", "start"]