FROM node:22.23.4-alpine3.24@sha256:ce8d97f7cfc7c5386421eb932df20a29df99b1a7f469f6157d5c9956702ffadc

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the app
RUN node ace build

# Copy built app to production directory
WORKDIR /app/build

# Install production dependencies
RUN npm ci --omit=dev

# Expose port
EXPOSE 3000/tcp

# Start the app with explicit host binding to 0.0.0.0
CMD ["node", "bin/server.js", "--host=0.0.0.0", "--port=3000"]
