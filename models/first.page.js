const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
require("dotenv").config();

const FirstPageSchema = new mongoose.Schema({
  bgImage: { type: String, required: false, default: "" },
  mainImage: { type: String, required: false, default: "" },
  mainImage_width: { type: String, required: false, default: "" },
  button1: { type: String, required: false, default: "" },
  button1_width: { type: String, required: false, default: "" },
  button1_link: { type: String, required: false, default: "" },
  button2: { type: String, required: false, default: "" },
  button2_width: { type: String, required: false, default: "" },
});

const FirstPage = mongoose.model("first-page", FirstPageSchema);

const validate = (data) => {
  const schema = Joi.object({
    bgImage: Joi.string().default(""),
    mainImage: Joi.string().default(""),
    mainImage_width: Joi.string().default(""),
    button1: Joi.string().default(""),
    button1_width: Joi.string().default(""),
    button1_link: Joi.string().default(""),
    button2: Joi.string().default(""),
    button2_width: Joi.string().default(""),
  });
  return schema.validate(data);
};

module.exports = { FirstPage, validate };
