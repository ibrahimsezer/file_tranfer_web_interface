#!/bin/bash
# Exit on error
set -e

# Install dependencies and build
npm install

# Install client dependencies and build
cd client
npm install
npm run build

# Install server dependencies
cd ../server
npm install

# Back to root
cd .. 