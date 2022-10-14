import express from "express";
import config from './config.json';
import router from "./controllers/router";


const server = express();
server.use(router);

server.listen(config.PORT, () => {
    console.log(`server is listening on port ${config.PORT}`);
})
