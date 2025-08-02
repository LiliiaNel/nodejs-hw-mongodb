import { Router } from 'express';
import { createContactController, deleteContactController, getContactsByIdController, getContactsController, patchContactController, putContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import isValidID from '../middlewares/isValidID.js';
import validateBody from '../middlewares/validateBody.js';
import {createContactSchema, updateContactSchema} from '../validation/contacts.js'

const router = Router();

router.get("/", ctrlWrapper(getContactsController));

router.get("/:contactId", isValidID, ctrlWrapper(getContactsByIdController));

router.post("/", validateBody(createContactSchema), ctrlWrapper(createContactController)); 

router.delete("/:contactId", isValidID, ctrlWrapper(deleteContactController));

router.put("/:contactId", isValidID, validateBody(createContactSchema), ctrlWrapper(putContactController)); 

router.patch("/:contactId", isValidID, validateBody(updateContactSchema), ctrlWrapper(patchContactController)); 

export default router;