# Use the Node.js 18 Alpine image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /compiler

# Install necessary packages including Python, GCC, and other build tools
# This allows Docker to cache this layer when package files don't change.
RUN apk update && apk add --no-cache \
    g++ \
    gcc \
    make \
    python3 \
    py3-pip \
    openjdk17-jdk

# Create a symlink for python
RUN ln -sf python3 /usr/bin/python

# Copy only the package.json and package-lock.json files and install dependencies.
COPY package*.json ./
RUN npm install

# Copy the rest of the application code.
# This layer will only be rebuilt if application code changes.
COPY . .

EXPOSE 5001

# Specify the command to run when the container starts
CMD [ "node", "compiler.js" ]