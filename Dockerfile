FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static site into Nginx default html directory
COPY index.html style.css script.js /usr/share/nginx/html/

EXPOSE 80

# Nginx default CMD is fine for serving static content
