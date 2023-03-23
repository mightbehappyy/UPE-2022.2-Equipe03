# Use the official Node.js v14 image as the base image
FROM node:14

# Create and set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies specified in the package.json file
RUN npm install

# Copy the entire site directory to the working directory
COPY site/ .

# Copy the entire server directory to the working directory
COPY server/ .

# Expose port 3000
EXPOSE 3000

# Start the application by running the npm start command
CMD ["npm", "start"]
