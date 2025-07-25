FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install (no dependencies but still needed)
COPY package*.json ./
RUN npm install

# Copy the script
COPY . .

# Mountable media volume
VOLUME /app/media

# Command to run
CMD ["node", "cleanEmptyFolders.js"]
