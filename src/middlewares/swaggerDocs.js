import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';
import { SWAGGER_DOCUMENT_PATH } from '../constants/index.js';

export const swaggerDocs = () => {
  try {

    if (!fs.existsSync(SWAGGER_DOCUMENT_PATH)) {
      throw new Error(`Swagger document not found at ${SWAGGER_DOCUMENT_PATH}`);
    }

    const raw = fs.readFileSync(SWAGGER_DOCUMENT_PATH, 'utf-8');
    const swaggerDoc = JSON.parse(raw);

    return [swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch (err) {

    return [
      (req, res, next) =>
        next(createHttpError(500, `Can't load swagger docs: ${err.message}`)),
    ];
  }
};
