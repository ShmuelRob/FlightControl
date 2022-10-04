import express from "express";
import config from './config'
import router from "./router";

const server = express();
server.use(router)

server.listen(config.PORT, () => {
    console.log(`server is listening on port ${config.PORT}`);
})