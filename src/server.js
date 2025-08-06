import cors from "cors"; 
import express from 'express';
import pinoHttp from 'pino-http';
import cookieParser from 'cookie-parser';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { getEnvVariable } from "./utils/getEnvVariable.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { authenticate } from "./middlewares/authenticate.js";


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
app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/contacts", authenticate, contactsRouter); 
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


