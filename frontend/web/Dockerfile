# Stage 1 : build the React app
FROM node:24-alpine AS build
WORKDIR /app

# Copy package files and install dependencies first for caching 
COPY package*.json ./
RUN npm install 

# Copye the rest of the source code and build the Vite project 
COPY . .
RUN npm run build

# Stage 2 : Serve the static files with Nginx 
FROM nginx:alpine AS final

# Copy the build output (Vite uses 'dist' by default) to Nginx's web root 
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Start Nginx in the foreground 
CMD ["nginx","-g","daemon off;"]
