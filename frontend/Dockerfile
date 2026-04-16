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
# Copy custom nginx config if we want, or rely on root nginx proxy. 
# We will use the root nginx proxy for routing, but this frontend container
# needs to serve the static files, so default nginx here is fine.
# We will actually create a single reverse proxy that talks to this backend on port 80.
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
