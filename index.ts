import Fastify from "./src/app";

import {config} from "dotenv";

config({quiet: true});

const port = Number(process.env.PORT) || 8000;

Fastify.listen({port}, (err, address) => {

    if(err){

        Fastify.log.error(err);

        process.exit(1);

    }

    Fastify.log.info(`Server Is Listening On ${address}`);

})