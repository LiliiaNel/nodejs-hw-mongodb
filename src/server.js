import cors from "cors"; 
import express from 'express';
import pinoHttp from 'pino-http';
import { getEnvVariable } from "./utils/getEnvVariable.js";
import { getAllContacts, getContactById } from "./services/contacts.js";


export default function setupServer () {
const app = express();
const logger = pinoHttp();
app.use(logger);

app.use(cors());
app.get("/contacts", async (req, res)=>{
  const contacts = await getAllContacts();
  console.log("kjhdkfghkjh");
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
});

app.get("/contacts/:contactId", async (req, res)=>{
  const contactId = req.params.contactId;
  const contact = await getContactById(contactId);
  if (contact === null) {
    return res
      .status(404)
      .json({ status: 404, message: 'Contact not found', data: null });
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
});

app.use((req, res) => {
  res.status(404).json({ status: 404, message: 'Not found' });
});

const PORT = getEnvVariable("PORT") || 3000;

app.listen(PORT, (error) => {
  if (error) {
   throw error;
  }
  console.log(`Server is running on port ${PORT}`);
});

};


