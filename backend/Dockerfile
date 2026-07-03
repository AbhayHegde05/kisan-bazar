FROM node:20-alpine

WORKDIR /app

# Install production deps first (better layer caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY . .

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
  && chown -R appuser:appgroup /app
USER appuser

# SnapDeploy: app should listen on PORT env var
EXPOSE 5000

CMD ["node", "index.js"]

