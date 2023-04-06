const fs = require("fs").promises;
const path = require("path");
const { v4 } = require("uuid");

const contactsPath = path.join(__dirname, "./db/contacts.json");

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(contacts);
  } catch (error) {
    console.error(error.message);
  }
};

const getContactById = async (id) => {
  try {
    const contactId = String(id);
    const contacts = await listContacts();
   const contact = contacts.find(item => item.id === contactId);
    if (!contact) {
      return null;
    }
    return contact;
  } catch (error) {
    console.error(error.message);
  }
};

const removeContact = async(id) => {
  try {
    const contacts = await listContacts();
    const deletedContact = contacts.findIndex(item => item.id === id);
if(deletedContact === -1) {
    return null;
}
   const [removeContact] = contacts.splice(deletedContact,1);
   const updatedContactsList = JSON.stringify(
    [...contacts],
    null,
    "\t"
  );

  await fs.writeFile(contactsPath, updatedContactsList);
  return removeContact;
  } catch (error) {
    console.error(error.message);
  }
};

const addContact = async (name, email, phone) => {
  try {
    const contacts = await listContacts();
    const newContact = { id: v4(), name, email, phone };
    if (contacts.some((el) => el.name === name || el.phone === phone)) {
      console.log("You already have this contact.");
      return;
    } else {
      const updatedContactsList = JSON.stringify(
        [...contacts, newContact],
        null,
        "\t"
      );

      await fs.writeFile(contactsPath, updatedContactsList);

      return newContact;
    }
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
