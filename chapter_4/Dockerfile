# use an official node.js runtime as a parent image
FROM node:22-alpine

# set the working dir in the container
WORKDIR /app

# copy the package and the package-lock files to the container
COPY package*.json .

# install the dependencies
RUN npm install 

# copy the rest of the application code
COPY . .

# expose the port that the app runs on
EXPOSE 8000

# define the command to run your application
CMD ["node", "./src/server.js"]