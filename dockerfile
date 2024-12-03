# Use a Node.js base image for building the Expo project
FROM node:lts AS builder

# Set the working directory for the build
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Run the Expo export command to generate static files
RUN npx expo export --output-dir dist --platform web

# Use the Nginx image for serving the static files
FROM nginx:alpine

# Set the working directory to Nginx's static file directory
WORKDIR /usr/share/nginx/html

# Remove the default Nginx content
RUN rm -rf ./*

# Copy the generated static files from the builder stage
COPY --from=builder /app/dist .

# Copy a custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the web server
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]