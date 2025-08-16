import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import { getEnvVariable } from './getEnvVariable.js';

export const saveFileToUploadDir = async (file) => {
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename),
  );
  console.log('file object:', file);
console.log('from:', path.join(TEMP_UPLOAD_DIR, file.filename));
console.log('to:', path.join(UPLOAD_DIR, file.filename));


  return `${getEnvVariable('APP_DOMAIN')}/uploads/${file.filename}`;
};