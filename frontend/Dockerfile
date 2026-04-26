FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


# ... (builder stage stays the same) ...

FROM nginx:alpine

# 1. Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# 2. Copy your built frontend files
COPY --from=builder /app/dist /usr/share/nginx/html

# 3. Create a clean, direct config file instead of a template
# This avoids any issues with environment variable substitution
RUN echo "server { \
    listen 8080; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

# 4. Set environment variables for Cloud Run
ENV PORT 8080
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
