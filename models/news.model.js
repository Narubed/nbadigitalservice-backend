const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const newsSchema = new mongoose.Schema({
	news_title: { type: String, required: true },
	// news_subtitle: { type: String, required: true },
	news_image: { type: String, required: true },
	news_editor: { type: String, required: true },
	news_date: { type: String, required: true },
});
newsSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "2h",
	});
	return token;
};

const News = mongoose.model("news", newsSchema);

const validate = (data) => {
	const schema = Joi.object({
		news_title: Joi.string().required().label("news_title"),
		// news_subtitle: Joi.string().required().label("news_title"),
		// news_image: Joi.string().required().label("news_image"),
		news_editor: Joi.string().required().label("news_editor"),
		news_date: Joi.string().required().label("news_date"),
	});
	return schema.validate(data);
};

module.exports = { News, validate };
