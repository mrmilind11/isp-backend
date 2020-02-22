const mongoose = require('mongoose');
const Joi = require('joi');
const contactNumRegex = new RegExp("^[0-9() -]*$");
const emailRegex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");

const ISPSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, maxlength: 250 },
    lowest_price: { type: Number, required: true, index: true },
    rating: { type: Number, required: true, min: 0, max: 5, validate: /^\d$/, default: 0, index: true },
    max_speed: { type: String, required: true, maxlength: 50 },
    description: { type: String, maxlength: 1500 },
    contact_number: { type: String, required: true, maxlength: 15, validate: contactNumRegex },
    email: { type: String, required: true, validate: emailRegex },
    image: { type: String, maxlength: 1000, required: true },
    url: { type: String, maxlength: 1000, required: true }
})

const ISPModel = mongoose.model('isp', ISPSchema, 'isp');

const validateAddISP = function (data) {
    const schema = Joi.object({
        name: Joi.string().required().max(10),
        lowest_price: Joi.number().required(),
        rating: Joi.number().max(5).min(0),
        max_speed: Joi.string().max(50).required(true),
        description: Joi.string().max(1500),
        contact_number: Joi.string().required().max(15).regex(contactNumRegex),
        email: Joi.string().required(true).regex(emailRegex),
        image: Joi.string().max(1000).required(true),
        url: Joi.string().max(1000).required(true)
    })
    return schema.validate(data);
}

module.exports.ISPModel = ISPModel;
module.exports.validateAddISP = validateAddISP;