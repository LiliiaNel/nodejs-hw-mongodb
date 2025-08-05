import { Router } from 'express';
import { createContactController, deleteContactController, getContactsByIdController, getContactsController, patchContactController, putContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import isValidID from '../middlewares/isValidID.js';
import validateBody from '../middlewares/validateBody.js';
import {createContactSchema, updateContactSchema} from '../validation/contacts.js'
import { authenticate } from '../middlewares/authenticate.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/index.js';

const router = Router();

router.use(authenticate);
router.get("/", checkRoles(ROLES.TEACHER), ctrlWrapper(getContactsController));

router.get("/:contactId", checkRoles(ROLES.TEACHER, ROLES.PARENT), isValidID, ctrlWrapper(getContactsByIdController));

router.post("/", checkRoles(ROLES.TEACHER), validateBody(createContactSchema), ctrlWrapper(createContactController)); 

router.delete("/:contactId", checkRoles(ROLES.TEACHER), isValidID, ctrlWrapper(deleteContactController));

router.put("/:contactId", checkRoles(ROLES.TEACHER), isValidID, validateBody(createContactSchema), ctrlWrapper(putContactController)); 

router.patch("/:contactId", checkRoles(ROLES.TEACHER, ROLES.PARENT), isValidID, validateBody(updateContactSchema), ctrlWrapper(patchContactController)); 

export default router;