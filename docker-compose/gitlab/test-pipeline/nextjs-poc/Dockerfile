# Step 1: Build the app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Ensure Next.js uses SWC by removing Babel config from the image
RUN rm -f babel.config.js .babelrc || true
RUN npm run build

# Step 2: Run the app
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3333
CMD ["npm", "start"]
