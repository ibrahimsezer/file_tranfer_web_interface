# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY . .

# Install dependencies and build
RUN npm install
RUN npm run build

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