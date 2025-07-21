import cors from "cors"; 
import express from 'express';
import pinoHttp from 'pino-http';
// import pino from 'pino';
import contactsRouter from './routers/contacts.js'
import { getEnvVariable } from "./utils/getEnvVariable.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";


export default function setupServer () {
const app = express();
const logger = pinoHttp({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        singleLine: true,
      },
    },
  });

app.use(logger);

app.use(logger);

app.use(cors());
app.use(express.json());
app.use("/contacts", contactsRouter); 
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = getEnvVariable("PORT") || 3000;

app.listen(PORT, (error) => {
  if (error) {
   throw error;
  }
  console.log(`Server is running on port ${PORT}`);
});

};


