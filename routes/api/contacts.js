const express = require("express");

const router = express.Router();

const Joi = require("joi");

const contacts = require("../../models/contacts");

const { HttpError } = require("../../helpers");

router.get("/", async (req, res, next) => {
  try {
    const allContacts = await contacts.listContacts();
    res.json(allContacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const oneContact = await contacts.getContactById(contactId);
    if (!oneContact) {
      throw HttpError(404, "Not found");
    }
    res.json(oneContact);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const addSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(404, error.message);
    }
    const newContact = await contacts.addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deleteContact = await contacts.removeContact(contactId);
    if (!deleteContact) {
      throw HttpError(404, "Not found");
    }
    res.json({
      Message: "Delete success",
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const addSchema = Joi.object({
      name: Joi.string().default(req.body.name),
      email: Joi.string().default(req.body.email),
      phone: Joi.string().default(req.body.phone),
    });
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(404, error.message);
    }
    const { contactId } = req.params;
    const updateContact = await contacts.updateContact(contactId, req.body);
    if (!updateContact) {
      throw HttpError(404, "Not found");
    }
    res.json(updateContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
