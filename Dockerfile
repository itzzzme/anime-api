FROM node:20 AS builder

WORKDIR /usr/app

COPY package*.json ./
RUN npm install
COPY . .

FROM node:20

WORKDIR /usr/app

COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/package*.json ./
COPY --from=builder /usr/app/api ./api
COPY --from=builder /usr/app/src ./src
# COPY --from=builder /usr/app/ormconfig.js ./


EXPOSE 3000
CMD [ "npm", "start" ]
