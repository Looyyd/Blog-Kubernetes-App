# Use Node.js 14 as the base image
FROM node:14

# Create a directory for the app
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Run the command to start the app
CMD [ "npm", "start" ]
