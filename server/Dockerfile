FROM node:alpine

# # Create app directory
RUN mkdir -p /server

# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json /server
COPY tsconfig.json /server
WORKDIR /server
RUN npm install
COPY /src /server/src
CMD [ "npm", "run", "dev" ]



# FROM node:12 AS build
# RUN mkdir -p /server
# COPY package.json /server
# COPY package-lock.json /server
# COPY tsconfig.json /server
# WORKDIR /server
# RUN npm install
# RUN npm install typescript -g
# COPY src /server/src
# RUN tsc 

# FROM node:12
# RUN mkdir -p /server
# COPY --from=build /server/package.json /server
# COPY --from=build /server/package-lock.json /server
# COPY --from=build /server/dist /server/dist
# WORKDIR /server
# CMD [ "node", "dist/app.js" ]






