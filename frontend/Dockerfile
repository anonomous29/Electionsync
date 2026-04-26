# Stage 1: Build
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine
# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy build files from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Create a custom config that listens on 8080 and handles React/Vite routing
RUN echo 'server { \
    listen 8080; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose the port for documentation
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]