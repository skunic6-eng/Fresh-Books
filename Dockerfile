FROM public.ecr.aws/nginx/nginx:alpine-slim

# Copy everything from the current directory to the Nginx html directory
# We rely on .dockerignore to exclude unnecessary files
COPY --link . /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
