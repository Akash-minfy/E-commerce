# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve stage with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config to handle React Router SPA fallbacks
COPY nginx.conf /etc/nginx/conf.d/default.conf
# We will actually create a single reverse proxy that talks to this backend on port 80.
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
