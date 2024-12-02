# Build stage
FROM node:18-alpine as builder
WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /
COPY --from=builder /build ./build
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]
