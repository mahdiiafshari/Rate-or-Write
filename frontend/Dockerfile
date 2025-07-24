# frontend/Dockerfile
FROM node:18

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the React project
COPY . .

# Build the React app
RUN npm run build

# Serve the app with a lightweight server
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]