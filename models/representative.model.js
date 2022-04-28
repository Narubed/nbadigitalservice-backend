const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const representativeSchema = new mongoose.Schema({
	region_name: { type: String, required: true },
	level_name : { type: String, required: true },
	province_name: { type: String, required: true },
	representative_name: { type: String, required: true },
	representative_image: { type: String, required: true },
});
representativeSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "2h",
	});
	return token;
};

const Representative = mongoose.model("representative", representativeSchema);

const validate = (data) => {
	const schema = Joi.object({
		region_name: Joi.string().required().label("region"),
		level_name: Joi.string().required().label("level name"),
		province_name: Joi.string().required().label("province"),
		representative_name: Joi.string().required().label("name"),
		// representative_image: Joi.string().required().label("representative imagee"),
	});
	return schema.validate(data);
};

module.exports = { Representative, validate };
