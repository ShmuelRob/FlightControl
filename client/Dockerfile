
# works for development - try to use a smaller image for production + in prod mode
# COPY package-lock.json /client
FROM node:12 as build
RUN mkdir -p /client
COPY package*.json /client
COPY tsconfig.json /client
WORKDIR /client
RUN npm install

FROM node:12
RUN mkdir -p /client
COPY package.json /client
COPY package-lock.json /client
COPY tsconfig.json /client
COPY --from=build /client/node_modules /client/node_modules
COPY /public /client/public
COPY /src /client/src
WORKDIR /client
CMD ["npm", "start"]





# it works on gr 

# FROM node:alpine
# RUN mkdir -p /client
# COPY . /client
# WORKDIR /client
# RUN npm install
# EXPOSE 3000
# CMD ["npm", "start"]


# FROM node:12
# WORKDIR /client
# COPY package*.json ./
# COPY tsconfig.json ./
# RUN npm install
# RUN npm install typescript -g
# COPY public ./public
# COPY src ./src
# CMD [ "npm", "start" ]


# FROM node:12 AS build
# WORKDIR /client
# COPY package.json  ./
# COPY package-lock.json  ./
# COPY tsconfig.json  ./
# RUN npm install
# COPY public ./public
# COPY src ./src
# RUN npm run build

# FROM nginx:alpine
# WORKDIR /usr/share/nginx/html
# RUN rm -rf ./*
# COPY --from=build /client/build .
# ENTRYPOINT ["nginx", "-g", "daemon off;"]



# FROM node:alpine
# RUN mkdir -p /client
# COPY . /client
# WORKDIR /client
# RUN npm install
# CMD ["npm", "start"]

# FROM node:alpine
# WORKDIR /app
# COPY package.json ./
# COPY package-lock.json ./
# COPY ./ ./
# RUN npm i
# EXPOSE 3000
# CMD ["npm", "start"]



# FROM node:alpine
# COPY package.json ./
# RUN npm i
# COPY . ./
# WORKDIR /
# # EXPOSE 3000`
# CMD ["npm", "start"]



# FROM node:alpine
# RUN mkdir /client
# COPY package.json /client
# WORKDIR /client
# RUN npm i
# RUN npm run build
# COPY ./build ./client
# RUN npm i -g serve
# COPY ./ ./client
# CMD [ "cd /client && npx serve -s ./build -l 3000" ]
# CMD [ "npx serve -s ./build -l 3000" ]


# COPY ./package.json ./builder
# RUN ./builder npm i
# COPY . /builder
# WORKDIR /builder
# RUN npm run build

# FROM build AS release
# WORKDIR /
# COPY ./builder/build ./client
# RUN npm i -g serve
# COPY ./build ./client
# CMD [ "npx", "serve", "-s", "client", '-l', "3000" ]