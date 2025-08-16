import { Router } from 'express';
import { createContactController, deleteContactController, getContactsByIdController, getContactsController, patchContactController, putContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import isValidID from '../middlewares/isValidID.js';
import validateBody from '../middlewares/validateBody.js';
import {createContactSchema, updateContactSchema} from '../validation/contacts.js'
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.use(authenticate);
router.get("/", ctrlWrapper(getContactsController));

router.get("/:contactId", isValidID, ctrlWrapper(getContactsByIdController));

router.post("/", upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(createContactController)); 

router.delete("/:contactId", isValidID, ctrlWrapper(deleteContactController));

router.put("/:contactId", upload.single('photo'), isValidID, validateBody(createContactSchema), ctrlWrapper(putContactController)); 

router.patch("/:contactId", upload.single('photo'), isValidID, validateBody(updateContactSchema), ctrlWrapper(patchContactController)); 

export default router;