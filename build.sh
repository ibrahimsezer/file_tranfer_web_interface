#!/bin/bash
# Exit on error
set -e

# Install dependencies and build
npm install

# Install client dependencies and build (including dev dependencies)
cd client
npm install --production=false
npm run build

# Install server dependencies
cd ../server
npm install

# Back to root
cd .. 