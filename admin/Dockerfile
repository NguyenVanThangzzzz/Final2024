# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/build ./build
RUN npm install -g serve

# Use PORT from environment variable with fallback to 5173
ENV PORT=5173
EXPOSE 5173

CMD ["sh", "-c", "serve -s build -l ${PORT:-5173}"] 