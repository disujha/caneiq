# Multi-stage build for CaneIQ platform
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production

COPY frontend/ ./
RUN npm run build

# Backend stage
FROM node:18-alpine AS backend

WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/src ./src
COPY backend/package.json ./

# Edge simulation stage
FROM node:18-alpine AS edge-simulation

WORKDIR /app/edge-simulation
COPY edge-simulation/package*.json ./
RUN npm ci --only=production

COPY edge-simulation/index.js ./

# AI Module stage
FROM python:3.9-slim AS ai-module

WORKDIR /app/ai-module
COPY ai-module/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ai-module/main.py ./

# Final production image
FROM node:18-alpine AS production

WORKDIR /app

# Install necessary tools
RUN apk add --no-cache python3 py3-pip

# Copy all services
COPY --from=backend /app/src ./backend/src
COPY --from=backend /app/package.json ./backend/
COPY --from=edge-simulation /app/edge-simulation ./edge-simulation
COPY --from=ai-module /app/ai-module ./ai-module

# Copy frontend build
COPY --from=frontend-builder /app/frontend/out ./frontend/out

# Install PM2 for process management
RUN npm install -g pm2

# Create ecosystem file for PM2
COPY ecosystem.config.js ./

# Expose ports
EXPOSE 3000 3001 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start all services
CMD ["pm2", "start", "ecosystem.config.js", "--no-daemon"]
