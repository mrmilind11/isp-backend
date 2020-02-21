const mongoose = require('mongoose');

const contactNumRegex = new RegExp("^[0-9() -]*$");
const emailRegex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");

const ISPSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId(),
    name: { type: String, required: true, maxlength: 250 },
    lowest_price: { type: Number, required: true },
    rating: { type: Number, required: true, min: 0, max: 5, validate: /^\d$/, default: 0 },
    max_speed: { type: String, required: true, maxlength: 50 },
    description: { type: String, maxlength: 1500 },
    contact_number: { type: String, required: true, maxlength: 15, validate: contactNumRegex },
    email: { type: String, required: true, validate: emailRegex },
    image: { type: String, maxlength: 1000 },
    url: { type: String, maxlength: 1000 }
})

const ISPModel = mongoose.model('isp', ispSchema, 'isp');

module.exports.ISPSchema = ISPSchema;
module.exports.ISPModel = ISPModel;