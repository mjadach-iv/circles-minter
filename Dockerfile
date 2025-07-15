# Use official Node.js LTS image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the app
COPY src/index.js ./
COPY src/metrix.js ./
COPY src/missingPrivateKey.js ./
COPY .env ./

# Set environment variable for production
ENV NODE_ENV=production

# Command to run the script
CMD ["node", "index.js"]
