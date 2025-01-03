#!/bin/bash
# Exit on error
set -e

# Install dependencies for server
npm install

# Install dependencies for client
cd client
npm install

# Build client
npm run build

# Move back to root
cd .. 