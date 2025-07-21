import { Router } from 'express';
import { createContactController, deleteContactController, getContactsByIdController, getContactsController, patchContactController, putContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';


const router = Router();

router.get("/", ctrlWrapper(getContactsController));

router.get("/:contactId", ctrlWrapper(getContactsByIdController));

router.post("/", ctrlWrapper(createContactController)); 

router.delete("/:contactId", ctrlWrapper(deleteContactController));

router.put("/:contactId", ctrlWrapper(putContactController)); 

router.patch("/:contactId", ctrlWrapper(patchContactController)); 

export default router;