FROM node:22-alpine

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
EXPOSE 3333

# Start the app with explicit host binding to 0.0.0.0
CMD ["node", "bin/server.js", "--host=0.0.0.0", "--port=3333"]
