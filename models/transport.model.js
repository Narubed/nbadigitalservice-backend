const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const transportSchema = new mongoose.Schema({
	transport_name: { type: String, required: true },
	transport_image: { type: String, required: true },
});

transportSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "2h",
	});
	return token;
};

const Transport = mongoose.model("transport", transportSchema);

const validate = (data) => {
	const schema = Joi.object({
		transport_name: Joi.string().required().label("First Name"),
		transport_image: Joi.string().required().label("Last Name"),
	});
	return schema.validate(data);
};

module.exports = { Transport, validate };
