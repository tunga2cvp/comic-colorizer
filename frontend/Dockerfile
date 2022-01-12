FROM node:latest
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]

# docker run --rm \
#-p 3001:3000 \
#-e CHOKIDAR_USEPOLLING=true \
#comvis-frontend:1.0.0
