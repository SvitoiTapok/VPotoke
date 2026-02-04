FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ../backend/src .
EXPOSE 3000
CMD ["npm", "start"]