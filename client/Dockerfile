# Build stage
FROM node:20-slim as build

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the port to make the app accessible
EXPOSE 5173

# Command to start the app
CMD ["npm", "run", "dev", "--", "--host"]

