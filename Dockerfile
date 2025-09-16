# Use Node.js LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock first for caching
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the project
COPY . .

# Build the Next.js app
RUN yarn build

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["yarn", "start", "-p", "3000"]
