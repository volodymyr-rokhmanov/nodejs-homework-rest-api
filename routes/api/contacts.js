const express = require("express");

const router = express.Router();

// const Joi = require("joi");

const { isValidId, validateBody } = require("../../middlewares");

const ctrl = require("../../controllers/contacts");

const { schemas } = require("../../models/contact");

router.get("/", ctrl.listContacts);

router.get("/:contactId", isValidId, ctrl.getById);

router.post("/", validateBody(schemas.addSchema), ctrl.addContact);

router.delete("/:contactId", isValidId, ctrl.removeContact);

router.put(
  "/:contactId",
  isValidId,
  validateBody(schemas.addSchema),
  ctrl.updateContact
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(schemas.addFavoriteSchema),
  ctrl.updateFavorite
);

module.exports = router;
