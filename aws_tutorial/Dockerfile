FROM node:18-alpine
WORKDIR /frontend
COPY ./package*.json ./
RUN npm install --verbose
EXPOSE 3000
COPY . .
CMD ["npm","start"]