# Multi-stage Docker build for production deployment
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build:production

# Production stage with nginx
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy security headers configuration
COPY public/_headers /usr/share/nginx/html/_headers

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Install curl for health checks
RUN apk add --no-cache curl

# Expose port
EXPOSE 80

# Labels for metadata
LABEL maintainer="tropical-ai-chef-team"
LABEL version="1.0"
LABEL description="Tropical AI Chef - Production Ready"

# Start nginx
CMD ["nginx", "-g", "daemon off;"]