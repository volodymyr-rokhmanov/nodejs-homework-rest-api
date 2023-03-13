const express = require("express");

const router = express.Router();

const Joi = require("joi");

// const contacts = require("../../models/contacts");

const Contact = require("../../models/contact");

const { HttpError } = require("../../helpers");

const { isValidId } = require("../../middlewares");

router.get("/", async (req, res, next) => {
  try {
    const allContacts = await Contact.find();
    res.json(allContacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", isValidId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const oneContact = await Contact.findById(contactId);
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
      favorite: Joi.boolean().required(),
    });
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(404, error.message);
    }
    const newContact = await Contact.create(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", isValidId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deleteContact = await Contact.findByIdAndRemove(contactId);
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

router.put("/:contactId", isValidId, async (req, res, next) => {
  try {
    const addSchema = Joi.object({
      name: Joi.string().default(req.body.name),
      email: Joi.string().default(req.body.email),
      phone: Joi.string().default(req.body.phone),
      favorite: Joi.boolean().default(req.body.favorite),
    });
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(404, error.message);
    }
    const { contactId } = req.params;
    const updateContact = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!updateContact) {
      throw HttpError(404, "Not found");
    }
    res.json(updateContact);
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", isValidId, async (req, res, next) => {
  try {
    const addSchema = Joi.object({
      favorite: Joi.boolean().required(),
    });
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(404, error.message);
    }
    const { contactId } = req.params;
    const updateContact = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!updateContact) {
      throw HttpError(404, "Not found");
    }
    res.json(updateContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
