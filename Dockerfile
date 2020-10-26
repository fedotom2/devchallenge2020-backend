FROM node:12-alpine
WORKDIR /app
COPY . /app
COPY package.json /app/package.json
RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm install --only=prod
EXPOSE 8000 
USER node
CMD ["npm", "start"]