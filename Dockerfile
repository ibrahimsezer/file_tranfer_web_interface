# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY . .

# Install root dependencies
RUN npm install

# Install and build client
RUN cd client && npm install && npm run build

# Install server dependencies
RUN cd server && npm install

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built client files and server files
COPY --from=build /app/client/dist ./client/dist
COPY --from=build /app/server ./server
COPY --from=build /app/package.json ./package.json

# Set environment variables
ENV NODE_ENV=production
ENV PORT=10000

# Expose port
EXPOSE 10000

# Start server
CMD ["npm", "start"] 