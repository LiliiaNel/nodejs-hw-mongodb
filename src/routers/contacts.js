import { Router } from 'express';
import { createContactController, deleteContactController, getContactsByIdController, getContactsController, patchContactController, putContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import validateBody from '../middlewares/validateBody.js';
import {createContactSchema, updateContactSchema} from '../validation/contacts.js'

const router = Router();

router.get("/", ctrlWrapper(getContactsController));

router.get("/:contactId", ctrlWrapper(getContactsByIdController));

router.post("/", validateBody(createContactSchema), ctrlWrapper(createContactController)); 

router.delete("/:contactId", ctrlWrapper(deleteContactController));

router.put("/:contactId", validateBody(createContactSchema), ctrlWrapper(putContactController)); 

router.patch("/:contactId", validateBody(updateContactSchema), ctrlWrapper(patchContactController)); 

export default router;