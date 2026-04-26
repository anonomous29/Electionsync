FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


# ... (your builder stage stays the same) ...

FROM nginx:alpine
# 1. Copy your built files
COPY --from=builder /app/dist /usr/share/nginx/html

# 2. Copy the template to the special 'templates' folder
# Nginx's docker image will automatically run 'envsubst' on files in this folder
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# 3. Explicitly tell Cloud Run which port we are using
ENV PORT 8080
EXPOSE 8080

# 4. No need to change the CMD; the default nginx entrypoint 
# handles the template substitution automatically!