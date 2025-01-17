const { Schema, model } = require("mongoose");

const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

// const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// const emailRegexp = /.+@.+\..+/i;

const emailRegexp = /@/;

const subscriptionList = ["starter", "pro", "business"];

const userSchema = new Schema(
  {
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    subscription: {
      type: String,
      enum: subscriptionList,
      default: "starter",
    },
    token: {
      type: String,
      default: "",
    },
    avatarUrl: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verification: {
      type: String,
      default: "",
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string()
    .valid(...subscriptionList)
    .required(),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const subscriptionSchema = Joi.object({
  subscription: Joi.string().required(),
});

const schemas = {
  registerSchema,
  emailSchema,
  loginSchema,
  subscriptionSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
