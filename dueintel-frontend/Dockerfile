FROM node:18-slim

WORKDIR /app

# Copy package configurations and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files and build static assets and compiled Express server
COPY . .
RUN npm run build

# Expose port 3000 (Vite / Express server default)
EXPOSE 3000

# Set node environment to production
ENV NODE_ENV=production

CMD ["npm", "start"]
