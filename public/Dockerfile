# Step 1: Build the React app
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine

# Copy React build files to Nginx html folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose frontend port
EXPOSE 3000

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
