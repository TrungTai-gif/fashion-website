FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci
RUN npm install -g nodemon

# Copy source code
COPY . .

# Expose port
EXPOSE 8003

# Start the application
CMD ["nodemon", "src/server.js"]
