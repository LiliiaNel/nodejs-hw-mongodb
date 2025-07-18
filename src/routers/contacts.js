import { Router } from 'express';
import { createContactController, deleteContactController, getContactsByIdController, getContactsController, patchContactController, upsertContactController } from '../controllers/contacts';
import { ctrlWrapper } from '../utils/ctrlWrapper';


const router = Router();

export default router;

router.get("/contacts", ctrlWrapper(getContactsByIdController));

router.get("/contacts/:contactId", ctrlWrapper(getContactsController));

router.post("/contacts", ctrlWrapper(createContactController)); 

router.delete("/contacts/:contactId", ctrlWrapper(deleteContactController));

router.put("/contacts/:contactId", ctrlWrapper(upsertContactController)); 

router.patch("/contacts/:contactId", ctrlWrapper(patchContactController)); 