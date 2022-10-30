# FROM node:12 AS build
# RUN mkdir -p /flightsMaker
# COPY package.json /flightsMaker
# COPY package-lock.json /flightsMaker
# COPY tsconfig.json /flightsMaker
# WORKDIR /flightsMaker
# RUN npm install
# RUN npm install typescript -g
# COPY src /flightsMaker/src
# RUN tsc 

# FROM node:12
# RUN mkdir -p /flightsMaker
# COPY --from=build /flightsMaker/package.json /flightsMaker
# COPY --from=build /flightsMaker/package-lock.json  /flightsMaker
# COPY --from=build /flightsMaker/dist /flightsMaker/dist
# WORKDIR /flightsMaker
# CMD [ "node", "dist/index.js" ]






FROM node:alpine
RUN mkdir -p /flightsMaker
COPY package*.json /flightsMaker
COPY tsconfig.json /flightsMaker
WORKDIR /flightsMaker
RUN npm install
COPY /src /flightsMaker/src
CMD [ "npm", "run", "dev" ]