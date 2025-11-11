FROM node:20-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache git netcat-openbsd

# Copy package files
COPY package.json ./

RUN npm install

# Copy the rest
COPY . .

# Start app
CMD ["npm", "start"]
