const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const advertSchema = new mongoose.Schema({
	advert_image: { type: String, required: true },
});

advertSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "2h",
	});
	return token;
};

const Advert = mongoose.model("advert", advertSchema);

const validate = (data) => {
	const schema = Joi.object({
		advert_image: Joi.string().required().label("Last Name"),
	});
	return schema.validate(data);
};

module.exports = { Advert, validate };
